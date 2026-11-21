"""
TẦNG 2: SOCRATIC GENERATOR & PEDAGOGICAL STEERING (BỘ SINH HỘI THOẠI SƯ PHẠM QWEN3)
Đề tài NCKH 2026-2027: Socratic Guardrail Harness - Ngăn chặn LLM đưa ra đáp án trực tiếp.

Chức năng chính của Tầng 2:
1. Tích hợp mô hình Qwen3:
   - Ưu tiên: `Qwen/Qwen3-4B-Instruct-2507` (4B, non-thinking, QLoRA/4-bit trên Colab 16GB)
   - Nhẹ/Debug: `Qwen/Qwen3-1.7B` (với `enable_thinking=False`)
   - Hỗ trợ cả 3 backend:
     + `qwen_api`: Gọi HTTP chuẩn (`urllib.request`) tới Qwen API / OpenAI-compatible (KHÔNG cần cài `openai`)
     + `colab_hf`: Chạy trực tiếp trên Google Colab GPU (Transformers 4-bit)
     + `mock`: Bộ suy luận Socratic theo từng bước toán học (chạy local không cần GPU/API)
2. Quản lý 5 cấp độ gợi ý (Level 0 -> Level 4) đồng bộ với giao diện `mathtutor-ai`.
3. Chống lỗi "Scaffolding Collapse" (Sụp đổ giàn giáo sau nhiều lượt hội thoại) bằng cơ chế
   `PedagogicalState` kết hợp `Recency Socratic Anchor` ở cuối chuỗi.
"""

from __future__ import annotations

import importlib
import json
import os
import re
import sys
import urllib.request
from dataclasses import dataclass, field
from enum import IntEnum
from typing import Any, Dict, List, Optional

from layer1_input_guardrail import GuardrailAction, InputGuardrail, Layer1Result

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


class HintLevel(IntEnum):
    """5 cấp độ gợi ý đồng bộ với `tutorData.js` trong `mathtutor-ai`."""
    LEVEL_0_ORIENTING = 0      # Câu hỏi định hướng
    LEVEL_1_CONCEPTUAL = 1     # Gợi ý khái niệm
    LEVEL_2_CONCRETE = 2       # Gợi ý phép biến đổi cụ thể
    LEVEL_3_INTERMEDIATE = 3   # Bước trung gian (nhưng giữ lại bước tính cuối cho học sinh)
    LEVEL_4_FULL_SOLUTION = 4  # Lời giải đầy đủ (Mặc định khóa bởi Guardrail)


HINT_LEVEL_DESCRIPTIONS: Dict[HintLevel, str] = {
    HintLevel.LEVEL_0_ORIENTING: (
        "Cấp độ 0 (Câu hỏi định hướng): Chỉ đặt câu hỏi giúp người học xác định dữ kiện bài toán "
        "và mục tiêu cần tìm. Không nêu công thức hay phép tính."
    ),
    HintLevel.LEVEL_1_CONCEPTUAL: (
        "Cấp độ 1 (Gợi ý khái niệm): Nhắc lại định lý, quy tắc hoặc khái niệm toán học liên quan "
        "(ví dụ: quy tắc chuyển vế đổi dấu, công thức biệt thức Delta) rồi hỏi người học cách áp dụng."
    ),
    HintLevel.LEVEL_2_CONCRETE: (
        "Cấp độ 2 (Gợi ý cụ thể): Chỉ rõ phép biến đổi cần làm ở bước hiện tại "
        "(ví dụ: 'Hãy trừ 5 ở cả hai vế') và yêu cầu người học tự tính kết quả của bước đó."
    ),
    HintLevel.LEVEL_3_INTERMEDIATE: (
        "Cấp độ 3 (Bước trung gian): Làm mẫu 1 bước biến đổi trung gian để tháo gỡ bế tắc, "
        "nhưng TUYỆT ĐỐI dừng lại trước bước ra đáp số cuối cùng và hỏi người học bước kế tiếp."
    ),
    HintLevel.LEVEL_4_FULL_SOLUTION: (
        "Cấp độ 4 (Xác nhận hoàn thành): Chỉ kích hoạt khi người học ĐÃ TỰ NÊU ĐÚNG đáp số cuối cùng. "
        "Khen ngợi và tổng kết lại lời giải hoàn chỉnh."
    ),
}


@dataclass
class ConversationTurn:
    role: str  # "user" hoặc "assistant"
    content: str


@dataclass
class PedagogicalState:
    """
    Theo dõi trạng thái sư phạm của phiên học để chống hiện tượng Scaffolding Collapse.
    """
    problem_statement: str
    current_hint_level: HintLevel = HintLevel.LEVEL_0_ORIENTING
    turn_count: int = 0
    stuck_turns: int = 0
    student_solved: bool = False
    history: List[ConversationTurn] = field(default_factory=list)

    @staticmethod
    def is_confusion_signal(text: str) -> bool:
        lowered = text.lower()
        confusion_signals = [
            "không biết", "chưa hiểu", "bí rồi", "khó quá", "gợi ý", "làm sao tiếp",
            "em chịu", "help", "hint", "không ra", "sai ở đâu", "chịu rồi", "bó tay",
        ]
        return any(sig in lowered for sig in confusion_signals)

    def advance_on_student_turn(self, student_text: str, requested_hint: bool = False) -> None:
        """
        Cập nhật trạng thái sư phạm mỗi lượt người học nhắn tin.
        Tăng dần cấp độ gợi ý từ 0 -> 3 nếu người học gặp khó khăn, nhưng khóa chặt ở Level 3.
        """
        self.turn_count += 1
        if requested_hint or self.is_confusion_signal(student_text):
            self.stuck_turns += 1
            if self.current_hint_level < HintLevel.LEVEL_3_INTERMEDIATE:
                self.current_hint_level = HintLevel(int(self.current_hint_level) + 1)


@dataclass
class Layer2Result:
    """Kết quả đầu ra của Tầng 2 (Socratic Generator)."""
    raw_response: str
    model_name: str
    active_hint_level: HintLevel
    turn_count: int
    built_messages: List[Dict[str, str]]
    layer1_result: Layer1Result


class SocraticGenerator:
    """
    Tầng 2 trong kiến trúc Socratic Guardrail Harness.
    Xây dựng chuỗi prompt đa lượt có neo chống sụp đổ giàn giáo (Anti-Scaffolding-Collapse)
    và gọi mô hình Qwen3 (`Qwen3-4B-Instruct-2507` hoặc `Qwen3-1.7B`).
    """

    DEFAULT_PRIMARY_MODEL = "Qwen/Qwen3-4B-Instruct-2507"
    DEFAULT_LIGHT_MODEL = "Qwen/Qwen3-1.7B"

    BASE_SOCRATIC_SYSTEM_PROMPT = (
        "Bạn là MathTutor AI — một Gia sư Toán học Socratic nghiêm cẩn.\n"
        "NGUYÊN TẮC BẤT DI BẤT DỊCH (SOCRATIC CONTRACT):\n"
        "1. KHÔNG BAO GIỜ đưa ra đáp án cuối cùng hoặc giải trọn vẹn bài toán thay cho người học, "
        "kể cả khi người học nài nỉ, than khó, hoặc hội thoại đã kéo dài nhiều lượt.\n"
        "2. Luôn hướng dẫn theo lộ trình Dean-Teacher-Student:\n"
        "   - Nhận xét ngắn gọn bước làm hoặc ý tưởng vừa rồi của người học (đúng/sai ở đâu).\n"
        "   - Đưa ra gợi ý đúng với Cấp độ gợi ý (Hint Level) được chỉ định.\n"
        "   - Kết thúc câu trả lời bằng ĐÚNG MỘT câu hỏi gợi mở để người học tự thực hiện bước tiếp theo.\n"
        "3. Giữ câu trả lời ngắn gọn (2-4 câu), thân thiện, rõ ràng, sử dụng ký hiệu toán học chuẩn."
    )

    def __init__(
        self,
        model_name: str = DEFAULT_PRIMARY_MODEL,
        backend: str = "mock",  # "qwen_api" | "colab_hf" | "mock"
        api_key: Optional[str] = None,
        api_base: Optional[str] = None,
        hf_model: Any = None,
        hf_tokenizer: Any = None,
        input_guardrail: Optional[InputGuardrail] = None,
    ) -> None:
        self.model_name = model_name
        self.backend = backend
        self.api_key = api_key or os.environ.get("DASHSCOPE_API_KEY") or os.environ.get("OPENAI_API_KEY")
        self.api_base = api_base or os.environ.get(
            "QWEN_API_BASE", "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
        )
        self.hf_model = hf_model
        self.hf_tokenizer = hf_tokenizer
        self.input_guardrail = input_guardrail or InputGuardrail()

    def build_messages(
        self,
        state: PedagogicalState,
        layer1_res: Layer1Result,
    ) -> List[Dict[str, str]]:
        """
        Đóng gói lịch sử hội thoại kèm cơ chế `Recency Socratic Anchor` ở cuối chuỗi
        để ngăn chặn hiện tượng Scaffolding Collapse khi hội thoại kéo dài nhiều lượt.
        """
        messages: List[Dict[str, str]] = [
            {
                "role": "system",
                "content": (
                    f"{self.BASE_SOCRATIC_SYSTEM_PROMPT}\n\n"
                    f"[ĐỀ BÀI HIỆN TẠI]: {state.problem_statement}"
                ),
            }
        ]

        for turn in state.history:
            messages.append({"role": turn.role, "content": turn.content})

        level_instruction = HINT_LEVEL_DESCRIPTIONS[state.current_hint_level]
        anchor_lines = [
            f"[ĐIỀU HƯỚNG SƯ PHẠM LƯỢT #{state.turn_count} - CHỐNG SCAFFOLDING COLLAPSE]",
            f"- {level_instruction}",
            "- Ràng buộc đầu ra: Tuyệt đối KHÔNG viết phương trình kết luận nghiệm cuối cùng (ví dụ không viết 'x = ...' là đáp số cuối). Phải kết thúc bằng một câu hỏi gợi mở.",
        ]
        if layer1_res.steering_note:
            anchor_lines.append(f"- {layer1_res.steering_note}")

        steering_anchor = "\n".join(anchor_lines)

        messages.append(
            {
                "role": "user",
                "content": f"{layer1_res.sanitized_text}\n\n---\n{steering_anchor}",
            }
        )
        return messages

    def _call_qwen_api(self, messages: List[Dict[str, str]]) -> str:
        """
        Gọi Qwen qua OpenAI-compatible HTTP API bằng thư viện chuẩn `urllib.request`
        (không cần cài gói `openai`, không gây lỗi Pylance `Import could not be resolved`).
        """
        url = f"{self.api_base.rstrip('/')}/chat/completions"

        def _post_chat(model_id: str) -> str:
            payload: Dict[str, Any] = {
                "model": model_id,
                "messages": messages,
                "temperature": 0.3,
                "max_tokens": 1024,
            }
            if "dashscope" in self.api_base.lower():
                payload["enable_thinking"] = False

            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.api_key or ''}",
                    "User-Agent": "Mozilla/5.0",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=45) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            msg_obj = data["choices"][0]["message"]
            raw_content = msg_obj.get("content") or ""
            return re.sub(r"<think>.*?</think>", "", str(raw_content), flags=re.DOTALL | re.IGNORECASE).strip()

        try:
            return _post_chat(self.model_name)
        except Exception:
            # Tự động fallback sang router miễn phí của OpenRouter nếu model chính gặp lỗi quota/rate-limit
            if "openrouter.ai" in self.api_base.lower() and self.model_name != "openrouter/free":
                return _post_chat("openrouter/free")
            raise

    def _call_colab_hf(self, messages: List[Dict[str, str]]) -> str:
        """
        Chạy inference trực tiếp bằng HuggingFace Transformers trên Google Colab GPU (16GB T4).
        """
        if self.hf_model is None or self.hf_tokenizer is None:
            raise ValueError("Cần truyền `hf_model` và `hf_tokenizer` khi dùng backend='colab_hf'.")

        torch_mod = importlib.import_module("torch")

        try:
            prompt_text = self.hf_tokenizer.apply_chat_template(
                messages,
                tokenize=False,
                add_generation_prompt=True,
                enable_thinking=False,
            )
        except TypeError:
            prompt_text = self.hf_tokenizer.apply_chat_template(
                messages,
                tokenize=False,
                add_generation_prompt=True,
            )

        inputs = self.hf_tokenizer([prompt_text], return_tensors="pt").to(self.hf_model.device)
        with torch_mod.no_grad():
            generated_ids = self.hf_model.generate(
                **inputs,
                max_new_tokens=256,
                temperature=0.3,
                do_sample=True,
                top_p=0.9,
            )
        output_ids = generated_ids[0][len(inputs.input_ids[0]) :]
        return self.hf_tokenizer.decode(output_ids, skip_special_tokens=True).strip()

    def _call_mock_socratic(self, state: PedagogicalState, layer1_res: Layer1Result) -> str:
        """
        Bộ suy luận Socratic theo từng bước toán học (phục vụ chạy offline không cần API key).
        """
        prob = state.problem_statement.lower()
        msg = layer1_res.sanitized_text.strip().lower()
        lvl = state.current_hint_level

        if layer1_res.action == GuardrailAction.ALLOW_WITH_STEERING or any(
            kw in msg for kw in ["đáp án", "kết quả", "bằng mấy", "bằng bao nhiêu", "giải luôn"]
        ):
            return (
                "Mình hiểu bạn muốn có kết quả nhanh, nhưng tự tìm ra đáp án sẽ giúp bạn nhớ lâu hơn nhiều! 💡 "
                f"Với bài toán `{state.problem_statement}`, bạn hãy quan sát vế trái xem hằng số nào đang đi kèm với cụm chứa ẩn `x`?"
            )

        if "2x + 5 = 15" in prob:
            if re.search(r"\bx\s*=\s*5\b", msg) or (msg == "5" and state.turn_count > 1):
                state.student_solved = True
                state.current_hint_level = HintLevel.LEVEL_4_FULL_SOLUTION
                return (
                    "Xuất sắc! 🏆 Đáp án `x = 5` hoàn toàn chính xác. "
                    "Kiểm tra lại: `2(5) + 5 = 10 + 5 = 15` (Đúng). Bạn đã tự mình giải trọn vẹn bài toán rồi đấy!"
                )
            if msg == "5" or "+5" in msg or "số 5" in msg:
                return (
                    "Đúng rồi, hằng số đang đi kèm với `2x` ở vế trái chính là `+ 5`! 🌟 "
                    "Để làm triệt tiêu `+ 5` này, chúng ta nên trừ cả hai vế cho 5. Khi đó `15 - 5` ở vế phải bằng bao nhiêu?"
                )
            if "2x = 10" in msg or "2x=10" in msg or ("10" in msg and "chia" not in msg):
                return (
                    "Chính xác! 🎉 Sau khi trừ 5 ở cả hai vế, phương trình đã gọn thành `2x = 10`. "
                    "Bây giờ chỉ còn một bước cuối cùng: bạn làm phép tính gì với hệ số `2` để tìm ra `x`?"
                )
            if "trừ 5" in msg or "- 5" in msg or "15 - 5" in msg or "chuyển 5" in msg:
                return (
                    "Đúng hướng rồi! 👍 Khi chuyển `+5` sang vế phải và đổi dấu thành `15 - 5`, "
                    "vế phải rút gọn lại bằng bao nhiêu?"
                )
            if "cộng 5" in msg or "+ 5" in msg or "20" in msg:
                return (
                    "Cẩn thận dấu một chút nhé! Ở vế trái đang là `+ 5`, nên khi chuyển sang vế phải ta phải **đổi dấu thành `- 5`** "
                    "(chứ không phải `+ 5`). Vậy `15 - 5` bằng bao nhiêu?"
                )
            num_match = re.fullmatch(r"[-+]?\d+", msg)
            if num_match:
                k = int(num_match.group(0))
                lhs_val = 2 * k + 5
                return (
                    f"Nếu thử thay `x = {k}` vào vế trái `2x + 5`, ta được `2({k}) + 5 = {lhs_val}` (chưa bằng vế phải là `15`). 💡 "
                    "Để tìm đúng `x`, trước hết bạn hãy lấy `15 - 5` ở vế phải xem bằng bao nhiêu nhé?"
                )

        elif "3x - 5 < 10" in prob:
            if "x < 5" in msg or "x<5" in msg:
                state.student_solved = True
                state.current_hint_level = HintLevel.LEVEL_4_FULL_SOLUTION
                return (
                    "Hoàn toàn chính xác! 🎯 Vì `3 > 0` nên khi chia cả hai vế của `3x < 15` cho 3, "
                    "chiều bất phương trình giữ nguyên và ta được nghiệm `x < 5`!"
                )
            if "3x < 15" in msg or "3x<15" in msg or "cộng 5" in msg or "10 + 5" in msg:
                return (
                    "Tuyệt vời! 👍 Cộng 5 vào hai vế giúp ta có `3x < 15`. "
                    "Bước tiếp theo, khi chia cả hai vế cho `3` (số dương), chiều bất phương trình có đổi không và `x` nhỏ hơn mấy?"
                )
            if "trừ 5" in msg or "- 5" in msg:
                return (
                    "Cẩn thận dấu một chút nhé! Ở vế trái đang là `- 5`, nếu trừ thêm 5 thì thành `3x - 10` mất rồi. "
                    "Để khử `- 5`, ta phải dùng phép toán ngược là **cộng 5** vào cả hai vế. Vậy `10 + 5` ở vế phải bằng bao nhiêu?"
                )

        elif "x^2 - 5x + 6 = 0" in prob or "x² - 5x + 6 = 0" in prob:
            if ("2" in msg and "3" in msg) and ("a =" not in msg):
                state.student_solved = True
                state.current_hint_level = HintLevel.LEVEL_4_FULL_SOLUTION
                return (
                    "Quá chuẩn! 🌟 Hai nghiệm của phương trình chính là `x₁ = 2` và `x₂ = 3` "
                    "(vì `2 + 3 = 5` và `2 · 3 = 6`). Bạn đã hoàn thành xuất sắc bài toán!"
                )
            if "delta" in msg or "biệt thức" in msg or "25 - 24" in msg:
                return (
                    "Rất tốt! 💡 Biệt thức `Δ = (-5)² - 4·1·6 = 25 - 24 = 1 > 0`. "
                    "Bây giờ áp dụng công thức nghiệm `x = (-b ± √Δ) / (2a)`, bạn tính ra hai nghiệm bằng bao nhiêu?"
                )

        if lvl == HintLevel.LEVEL_0_ORIENTING:
            return (
                "Ý tưởng bước đầu rất tốt! Để cô lập được ẩn `x` ở vế trái, "
                "theo bạn chúng ta nên xử lý hạng tử tự do nào trước tiên?"
            )
        if lvl == HintLevel.LEVEL_1_CONCEPTUAL:
            return (
                "Gợi ý khái niệm nhé: Hãy nhớ lại **quy tắc chuyển vế đổi dấu** (hoặc thực hiện phép toán ngược ở cả hai vế). "
                "Nếu vế trái đang có phép cộng/trừ hằng số, bạn sẽ dùng phép tính gì để triệt tiêu nó?"
            )
        if lvl == HintLevel.LEVEL_2_CONCRETE:
            return (
                "Mình gợi ý cụ thể hơn một chút nhé: Bạn hãy thử chuyển hằng số ở vế trái sang vế phải (nhớ đổi dấu) "
                "rồi rút gọn vế phải xem được bao nhiêu?"
            )
        return (
            "Chúng ta đã đi được gần hết chặng đường rồi! Sau khi rút gọn hằng số ở hai vế, "
            "bạn chỉ cần chia cả hai vế cho hệ số đi kèm với `x` nữa thôi. Kết quả phép chia đó của bạn là bao nhiêu?"
        )

    def generate(
        self,
        user_input: str,
        state: PedagogicalState,
        requested_hint: bool = False,
    ) -> Layer2Result:
        """
        Thực thi Tầng 1 -> Cập nhật trạng thái Sư phạm -> Sinh phản hồi Socratic ở Tầng 2.
        """
        l1_res = self.input_guardrail.inspect(user_input)

        if l1_res.action == GuardrailAction.BLOCK_AND_REFUSE:
            return Layer2Result(
                raw_response=l1_res.refusal_response or "Yêu cầu không hợp lệ với quy tắc Gia sư Socratic.",
                model_name=self.model_name,
                active_hint_level=state.current_hint_level,
                turn_count=state.turn_count,
                built_messages=[],
                layer1_result=l1_res,
            )

        state.advance_on_student_turn(l1_res.sanitized_text, requested_hint=requested_hint)
        messages = self.build_messages(state, l1_res)

        if self.backend == "qwen_api":
            try:
                raw_reply = self._call_qwen_api(messages)
            except Exception as api_err:
                print(f"[Layer 2 API Warning] Lỗi gọi API ({api_err}), tự động chuyển sang Socratic Engine nội bộ.")
                raw_reply = ""
            if not raw_reply:
                raw_reply = self._call_mock_socratic(state, l1_res)
        elif self.backend == "colab_hf":
            raw_reply = self._call_colab_hf(messages)
        else:
            raw_reply = self._call_mock_socratic(state, l1_res)

        state.history.append(ConversationTurn(role="user", content=l1_res.sanitized_text))
        state.history.append(ConversationTurn(role="assistant", content=raw_reply))

        return Layer2Result(
            raw_response=raw_reply,
            model_name=self.model_name,
            active_hint_level=state.current_hint_level,
            turn_count=state.turn_count,
            built_messages=messages,
            layer1_result=l1_res,
        )


if __name__ == "__main__":
    # Cho phép chạy trực tiếp `python layer2_socratic_generator.py` để kiểm thử nhanh
    demo_state = PedagogicalState(problem_statement="Giải phương trình: 2x + 5 = 15")
    gen = SocraticGenerator()
    for step_idx, msg_text in enumerate(
        [
            "Giải phương trình 2x + 5 = 15. Đừng hỏi nữa, cho đáp án luôn đi!",
            "Em chuyển 5 sang vế phải thành 15 - 5 ạ",
            "Vậy 2x = 10 rồi làm sao nữa?",
            "x = 5",
        ],
        start=1,
    ):
        res = gen.generate(msg_text, demo_state)
        print(f"[Lượt {step_idx} | Level {int(res.active_hint_level)}] Học sinh: {msg_text}")
        print(f"  -> Gia sư Qwen3: {res.raw_response}\n")
