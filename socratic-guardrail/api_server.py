"""
TẦNG 5: SOCRATIC GUARDRAIL API SERVER (KẾT NỐI TRỰC TIẾP VỚI FRONTEND `mathtutor-ai` CỔNG 8000)
Đề tài NCKH 2026-2027: Socratic Guardrail Harness - Ngăn chặn LLM đưa ra đáp án trực tiếp.

Hỗ trợ đồng thời:
1. `POST http://localhost:8000/api/tutor/chat` (Khớp 100% với payload của `TutorPage.jsx` trong `mathtutor-ai`)
2. `POST http://localhost:8000/api/socratic/chat` (API chi tiết cho kiểm thử 3 tầng)
3. `GET  http://localhost:8000/api/health`
"""

from __future__ import annotations

import json
import os
import sys
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from typing import Any, Dict, List

from layer2_socratic_generator import (
    ConversationTurn,
    HintLevel,
    PedagogicalState,
    SocraticGenerator,
)
from socratic_harness import SocraticGuardrailHarness

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

DEFAULT_API_KEY = "" # dán key vào đây
DEFAULT_API_BASE = "https://openrouter.ai/api/v1"
DEFAULT_MODEL_NAME = "qwen/qwen-2.5-72b-instruct"

ACTIVE_API_KEY = (
    DEFAULT_API_KEY.strip()
    or os.environ.get("DASHSCOPE_API_KEY")
    or os.environ.get("OPENAI_API_KEY")
    or ""
)
BACKEND_MODE = "qwen_api" if ACTIVE_API_KEY else "mock"
MODEL_NAME = os.environ.get("QWEN_MODEL_NAME", DEFAULT_MODEL_NAME)

harness = SocraticGuardrailHarness(
    layer2=SocraticGenerator(
        model_name=MODEL_NAME,
        backend=BACKEND_MODE,
        api_key=ACTIVE_API_KEY,
        api_base=os.environ.get("QWEN_API_BASE", DEFAULT_API_BASE),
    )
)


def process_chat_payload(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Xử lý chung cho cả `/api/tutor/chat` (từ `TutorPage.jsx`) và `/api/socratic/chat`.
    Lưu ý: `TutorPage.jsx` gửi `hint_level: unlockedHintLevel` mặc định bằng 3 ở mọi lượt.
    Do đó server tự tính `HintLevel` thực tế dựa trên số lần người học bị bí trong `history`
    để đảm bảo cấp độ gợi ý tăng tự nhiên từ Level 0 -> Level 1 -> Level 2 -> Level 3.
    """
    problem_statement = data.get("problem_statement", "Giải phương trình: 2x + 5 = 15")
    user_message = data.get("student_message") or data.get("user_message") or ""

    raw_history: List[Dict[str, Any]] = data.get("history", [])
    converted_history: List[ConversationTurn] = []
    history_slice = raw_history[:-1] if (
        raw_history and raw_history[-1].get("text") == user_message
    ) else raw_history

    prior_stuck_count = 0
    for item in history_slice:
        role = item.get("role")
        if not role:
            sender = item.get("sender", "user")
            role = "assistant" if sender == "ai" else "user"
        content = item.get("content") or item.get("text") or ""
        if content:
            converted_history.append(ConversationTurn(role=role, content=content))
            if role == "user" and PedagogicalState.is_confusion_signal(content):
                prior_stuck_count += 1

    # Nếu gọi từ `/api/socratic/chat` có truyền `current_hint_level` tường minh thì ưu tiên,
    # còn nếu gọi từ `TutorPage.jsx` (luôn gửi `hint_level=3` cố định) thì tính theo `prior_stuck_count`.
    if "current_hint_level" in data:
        initial_level = HintLevel(max(0, min(int(data["current_hint_level"]), 3)))
    else:
        initial_level = HintLevel(min(prior_stuck_count, 3))

    state = PedagogicalState(
        problem_statement=problem_statement,
        current_hint_level=initial_level,
        turn_count=len([t for t in converted_history if t.role == "user"]),
        stuck_turns=prior_stuck_count,
        history=converted_history,
    )

    target_answers = data.get("target_answers")
    out = harness.chat_turn(
        user_input=user_message,
        state=state,
        target_answers=target_answers,
        requested_hint=bool(data.get("requested_hint", False)),
    )

    result_payload = {
        "reply": out.final_response,
        "hint_level": int(out.hint_level),
        "hint_level_name": out.hint_level.name,
        "turn_count": out.turn_count,
        "blocked_at_layer1": out.blocked_at_layer1,
        "rewritten_at_layer3": out.rewritten_at_layer3,
        "guardrail_meta": {
            "layer1_category": out.layer1.category.value,
            "layer1_action": out.layer1.action.value,
            "layer1_risk_score": out.layer1.risk_score,
            "layer1_matched_rules": out.layer1.matched_rules,
            "layer3_violations": [v.value for v in out.layer3.violations] if out.layer3 else [],
            "layer3_detected_leaks": out.layer3.detected_leaks if out.layer3 else [],
        },
    }

    # Tự động ghi log thời gian thực của từng lượt chat vào `logs/m3_results.jsonl`
    try:
        log_dir = Path(__file__).parent / "logs"
        log_dir.mkdir(parents=True, exist_ok=True)
        log_entry = {
            "ts": time.strftime("%Y-%m-%d %H:%M:%S"),
            "stage": "live_demo_turn",
            "model": MODEL_NAME,
            "backend": BACKEND_MODE,
            "problem": problem_statement,
            "user_input": user_message,
            "candidate_response": out.layer2.raw_response if out.layer2 else "",
            "final_response": out.final_response,
            "hint_level": int(out.hint_level),
            "blocked_at_layer1": out.blocked_at_layer1,
            "rewritten_at_layer3": out.rewritten_at_layer3,
            "guardrail_meta": result_payload["guardrail_meta"],
        }
        with (log_dir / "m3_results.jsonl").open("a", encoding="utf-8") as log_file:
            log_file.write(json.dumps(log_entry, ensure_ascii=False) + "\n")
    except Exception as log_err:
        print(f"[Logging Warning] Không thể ghi log: {log_err}")

    return result_payload


class SocraticHTTPHandler(BaseHTTPRequestHandler):
    def _send_json(self, status_code: int, payload: Dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self._send_json(200, {"status": "ok"})

    def do_GET(self) -> None:
        if self.path.startswith("/api/health") or self.path == "/":
            self._send_json(
                200,
                {
                    "status": "ok",
                    "service": "Socratic Guardrail Harness (3-Layer)",
                    "model": MODEL_NAME,
                    "backend": BACKEND_MODE,
                },
            )
        else:
            self._send_json(404, {"error": "Not found"})

    def do_POST(self) -> None:
        if self.path.startswith("/api/tutor/chat") or self.path.startswith("/api/socratic/chat"):
            length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"
            try:
                data = json.loads(raw_body)
                result = process_chat_payload(data)
                print(
                    f"[3-Layer Guardrail] Input='{data.get('student_message') or data.get('user_message')}' "
                    f"-> L1={result['guardrail_meta']['layer1_category']} "
                    f"| L2=Level_{result['hint_level']} "
                    f"| L3_Rewritten={result['rewritten_at_layer3']}"
                )
                self._send_json(200, result)
            except Exception as exc:
                self._send_json(500, {"error": str(exc)})
        else:
            self._send_json(404, {"error": "Endpoint not found"})


def run_server(port: int = 8000) -> None:
    server = HTTPServer(("0.0.0.0", port), SocraticHTTPHandler)
    print("=" * 75)
    print(f"🚀 SOCRATIC GUARDRAIL HARNESS SERVER ĐANG CHẠY TẠI: http://localhost:{port}")
    print(f"   - Endpoint cho Web `mathtutor-ai`: POST http://localhost:{port}/api/tutor/chat")
    print(f"   - Model mục tiêu                 : {MODEL_NAME} (mode: {BACKEND_MODE})")
    print("=" * 75)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nĐã dừng Socratic Guardrail Server.")
        server.server_close()


if __name__ == "__main__":
    run_server(8000)
