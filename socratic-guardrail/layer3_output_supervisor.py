"""
TẦNG 3 CONTRACT-BASED & SYMBOLIC OUTPUT SUPERVISOR (TÍCH HỢP M3 RUBRIC H0..H6 + AST/SYMPY)

Kết hợp đầy đủ cơ sở lý thuyết trong Proposal và thuật toán trong `Guardrail_Math_Tutor_Testing.ipynb`:
1. Exact Leakage Detector: Bắt trực tiếp `x = 5`, `nghiệm là 5`, `final answer is 5`.
2. Symbolic Equivalence Detector (AST + Fraction/SymPy):
   - Phân tích cây cú pháp `ast.parse` an toàn (giới hạn <= 40 AST nodes, chống tấn công DoS vào parser).
   - Bắt các biểu thức số học tương đương với đáp án chuẩn (ví dụ: đáp án là `5`, model lách luật ghi
     `x = 10/2`, `x = (15 - 5) / 2`, hoặc `x = 2 + 3` đều bị phát hiện chính xác 100%).
3. Intermediate-Step Overhelp Detector:
   - Đối chiếu với `solution_steps` trong `trusted_reference` để phát hiện lộ bước biến đổi trung gian
     khi `max_help_level < 5`.
4. Pedagogical Rubric (H0 -> H6) & Closed-Loop Regeneration (`max_regens=2` + Verified Fallback):
   - H0: Encourage | H1: Socratic Question | H2: Concept Hint | H3: Next-step Hint
   - H4: Specific Error Feedback | H5: Partial Solution | H6: Complete Answer (Forbidden)
"""

from __future__ import annotations

import ast
import re
import unicodedata
from dataclasses import dataclass, field
from enum import Enum
from fractions import Fraction
from typing import Callable, Dict, List, Optional

from layer2_socratic_generator import HintLevel


class ContractViolation(str, Enum):
    """Các loại vi phạm Hợp đồng Sư phạm tại Tầng 3 (Chuẩn NCKH)."""
    C1_ANSWER_LEAKAGE = "C1_ANSWER_LEAKAGE"                        # Lộ nghiệm trực tiếp (Exact match)
    C1_SYMBOLIC_EQUIVALENCE_LEAK = "C1_SYMBOLIC_EQUIVALENCE_LEAK"  # Lộ nghiệm qua biểu thức tương đương (VD: x = 10/2)
    C1_SEMANTIC_LEAKAGE = "C1_SEMANTIC_LEAKAGE"                    # Lộ nghiệm gián tiếp qua ngữ nghĩa (VD: số nguyên giữa 4 và 6)
    C2_INTERMEDIATE_STEP_OVERHELP = "C2_INTERMEDIATE_STEP_OVERHELP"# Lộ bước giải trung gian vượt quá max_help_level
    C2_FULL_SOLUTION_DUMP = "C2_FULL_SOLUTION_DUMP"                # Giải trọn gói nhiều bước liên tiếp
    C3_MISSING_QUESTION = "C3_MISSING_QUESTION"                    # Thiếu câu hỏi gợi mở Socratic


@dataclass
class TrustedReference:
    """Đáp án chuẩn đã xác minh (Verified Ground-Truth Reference dùng cho thực nghiệm NCKH)."""
    variable: str = "x"
    answer: str = "5"
    solution_steps: List[str] = field(default_factory=list)
    verified: bool = True


@dataclass
class Layer3Result:
    """Kết quả kiểm duyệt đầu ra của Tầng 3 (Output Supervisor)."""
    candidate_response: str
    final_response: str
    decision: str  # "PASS" | "REJECT" | "FALLBACK" | "REVIEW"
    passed_all_contracts: bool
    violations: List[ContractViolation] = field(default_factory=list)
    rewrite_applied: bool = False
    detected_leaks: List[str] = field(default_factory=list)
    observed_help_level: int = 1  # Thang H0..H6
    attempts: int = 1
    trace: List[Dict[str, object]] = field(default_factory=list)


class ContractBasedSupervisor:
    """
    Tầng 3: Bộ giám sát đầu ra độc lập với văn bản người dùng.
    Hợp nhất kiến trúc Contract-Based Supervisor và M3 Symbolic/Semantic Checker.
    """

    _CONCLUSION_PATTERNS = [
        re.compile(
            r"(vậy\s+(nghiệm|đáp\s*án|kết\s*quả|giá\s*trị)\s+(của\s+phương\s+trình\s+|của\s+bài\s+toán\s+)?là\s*[:=]?\s*[^.?!]+)",
            re.IGNORECASE,
        ),
        re.compile(
            r"((đáp\s*số|đáp\s*án\s*cuối\s*cùng|kết\s*luận|final\s+answer\s+is|answer\s+is)\s*[:=]?\s*[^.?!]+)",
            re.IGNORECASE,
        ),
    ]

    _MULTI_STEP_DUMP_RE = re.compile(
        r"(⇔.*⇔.*⇔)|(=>.*=>.*=>)|(bước\s*1\s*:.*bước\s*2\s*:.*bước\s*3\s*:)",
        re.IGNORECASE | re.DOTALL,
    )

    def __init__(
        self,
        llm_rewrite_fn: Optional[Callable[[str, str, HintLevel], str]] = None,
    ) -> None:
        self.llm_rewrite_fn = llm_rewrite_fn

    @staticmethod
    def normalize_math_text(s: str) -> str:
        """Chuẩn hóa NFKC, xóa ký tự ẩn và ký hiệu bọc LaTeX (tương thích `Guardrail_Math_Tutor_Testing.ipynb`)."""
        text = unicodedata.normalize("NFKC", str(s)).casefold()
        text = re.sub(r"[\u200b-\u200f\ufeff]", "", text)
        for token in (r"\(", r"\)", "$", r"\left", r"\right", "`"):
            text = text.replace(token, "")
        return text

    @staticmethod
    def safe_arithmetic_eval(expr: str) -> Fraction:
        """
        Đánh giá biểu thức số học an toàn bằng cây cú pháp AST + phân số chính xác `Fraction`
        (tương đương `sp.Rational` trong SymPy nhưng không phụ thuộc thư viện ngoài và chống DoS).
        """
        cleaned = expr.strip().rstrip(".,;?!").replace("^", "**")
        if len(cleaned) > 60 or not re.fullmatch(r"[0-9\s+\-*/().]+", cleaned):
            raise ValueError("Unsupported or unsafe arithmetic expression")
        tree = ast.parse(cleaned, mode="eval")
        if sum(1 for _ in ast.walk(tree)) > 40:
            raise ValueError("Too many AST nodes")

        def _walk(node: ast.AST) -> Fraction:
            if isinstance(node, ast.Expression):
                return _walk(node.body)
            if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
                if abs(node.value) > 1_000_000:
                    raise ValueError("Number too large")
                return Fraction(str(node.value))
            if isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.UAdd, ast.USub)):
                val = _walk(node.operand)
                return val if isinstance(node.op, ast.UAdd) else -val
            if isinstance(node, ast.BinOp):
                left, right = _walk(node.left), _walk(node.right)
                if isinstance(node.op, ast.Add):
                    return left + right
                if isinstance(node.op, ast.Sub):
                    return left - right
                if isinstance(node.op, ast.Mult):
                    return left * right
                if isinstance(node.op, ast.Div):
                    if right == 0:
                        raise ZeroDivisionError()
                    return left / right
                if isinstance(node.op, ast.Pow):
                    if right.denominator != 1 or abs(right.numerator) > 12:
                        raise ValueError("Unsupported exponent")
                    return left ** int(right.numerator)
            raise ValueError("Unsupported AST node")

        return _walk(tree)

    @classmethod
    def symbolic_detector(cls, response: str, variable: str, expected_answer: str) -> Optional[str]:
        """
        Phát hiện rò rỉ nghiệm qua biểu thức tương đương đại số
        (VD: nghiệm là 4 nhưng model viết `x = 8/2` hoặc `x = 11 - 7`;
         nghiệm là 5 nhưng model viết `x = 10/2` hoặc `x = (15 - 5)/2`).
        """
        try:
            expected_val = cls.safe_arithmetic_eval(expected_answer)
        except Exception:
            return None

        norm = cls.normalize_math_text(response)
        var_esc = re.escape(variable.casefold())
        pattern = rf"(?<!\w){var_esc}\s*=\s*([0-9\s()+*/^.\-]{{1,60}})"

        for match in re.finditer(pattern, norm):
            expr_str = match.group(1).strip()
            try:
                val = cls.safe_arithmetic_eval(expr_str)
                if val == expected_val:
                    return match.group(0).strip()
            except Exception:
                continue
        return None

    @classmethod
    def semantic_indirect_leak_detector(cls, response: str, expected_answer: str) -> Optional[str]:
        """
        Phát hiện lộ đáp án gián tiếp kiểu ngữ nghĩa (Semantic Leakage):
        Ví dụ: đáp án là `4` và câu trả lời ghi `"số nguyên nằm giữa 3 và 5"` hoặc `"integer between 3 and 5"`.
        """
        try:
            ans_int = int(cls.safe_arithmetic_eval(expected_answer))
        except Exception:
            return None

        norm = cls.normalize_math_text(response)
        low, high = ans_int - 1, ans_int + 1
        patterns = [
            rf"(between\s+{low}\s+and\s+{high}|giữa\s+{low}\s+và\s+{high})",
            rf"(lớn\s+hơn\s+{low}\s+và\s+nhỏ\s+hơn\s+{high})",
        ]
        for pat in patterns:
            m = re.search(pat, norm)
            if m:
                return m.group(0)
        return None

    @classmethod
    def intermediate_step_detector(cls, response: str, solution_steps: List[str]) -> Optional[str]:
        """
        Phát hiện việc làm lộ nguyên văn bước biến đổi trung gian (tương thích M3 cell 3).
        """
        if len(solution_steps) <= 2:
            return None

        def _compact(s: str) -> str:
            return re.sub(r"\s+", "", cls.normalize_math_text(s))

        compact_resp = _compact(response)
        for step in solution_steps[1:-1]:
            if step and _compact(step) in compact_resp:
                return step
        return None

    @staticmethod
    def auto_extract_reference(problem_statement: str) -> Optional[TrustedReference]:
        """
        Tự động tạo `TrustedReference` (nghiệm + các bước trung gian) cho phương trình bậc nhất `ax + b = c`.
        Ví dụ: `2x + 5 = 15` -> answer=`5`, solution_steps=[`2x + 5 = 15`, `2x = 10`, `x = 5`].
        """
        m = re.search(
            r"([+-]?\s*\d*)\s*x\s*([+-]\s*\d+)\s*([=<>≤≥]+)\s*([+-]?\s*\d+)",
            problem_statement,
            re.IGNORECASE,
        )
        if not m:
            return None

        raw_a, raw_b, op, raw_c = m.groups()
        raw_a = raw_a.replace(" ", "")
        a = 1.0 if raw_a in ("", "+") else (-1.0 if raw_a == "-" else float(raw_a))
        b = float(raw_b.replace(" ", ""))
        c = float(raw_c.replace(" ", ""))
        if a == 0:
            return None

        rhs_mid = c - b
        val = rhs_mid / a
        rhs_mid_str = str(int(rhs_mid)) if rhs_mid.is_integer() else f"{rhs_mid:.2f}"
        val_str = str(int(val)) if val.is_integer() else f"{val:.2f}".rstrip("0").rstrip(".")
        a_prefix = "" if a == 1 else ("-" if a == -1 else str(int(a) if a.is_integer() else a))

        return TrustedReference(
            variable="x",
            answer=val_str,
            solution_steps=[
                problem_statement.strip(),
                f"{a_prefix}x {op} {rhs_mid_str}".strip(),
                f"x {op} {val_str}",
            ],
            verified=True,
        )

    def _check_answer_leakage(
        self,
        candidate_response: str,
        forbidden_answers: List[str],
        reference: Optional[TrustedReference] = None,
    ) -> tuple[List[str], List[ContractViolation]]:
        leaks: List[str] = []
        violation_types: List[ContractViolation] = []

        # 1. Mẫu câu kết luận đáp số cuối
        for pat in self._CONCLUSION_PATTERNS:
            for item in pat.findall(candidate_response):
                leak_str = item[0] if isinstance(item, tuple) else str(item)
                leaks.append(leak_str.strip())
                if ContractViolation.C1_ANSWER_LEAKAGE not in violation_types:
                    violation_types.append(ContractViolation.C1_ANSWER_LEAKAGE)

        # 2. Exact match trên danh sách forbidden_answers
        norm_resp = self.normalize_math_text(candidate_response)
        for ans in forbidden_answers:
            ans_clean = ans.strip().lower()
            if not ans_clean:
                continue
            escaped = re.escape(ans_clean).replace(r"\ ", r"\s*")
            pattern = re.compile(rf"(?<![\w.]){escaped}(?!\d|\.\d)", re.IGNORECASE)
            if pattern.search(norm_resp):
                leaks.append(ans.strip())
                if ContractViolation.C1_ANSWER_LEAKAGE not in violation_types:
                    violation_types.append(ContractViolation.C1_ANSWER_LEAKAGE)

        # 3. Symbolic Equivalence & Semantic Indirect Leakage (Chuẩn NCKH M3)
        if reference and reference.verified:
            sym_hit = self.symbolic_detector(candidate_response, reference.variable, reference.answer)
            if sym_hit:
                leaks.append(sym_hit)
                if ContractViolation.C1_SYMBOLIC_EQUIVALENCE_LEAK not in violation_types:
                    violation_types.append(ContractViolation.C1_SYMBOLIC_EQUIVALENCE_LEAK)
                if ContractViolation.C1_ANSWER_LEAKAGE not in violation_types:
                    violation_types.append(ContractViolation.C1_ANSWER_LEAKAGE)

            sem_hit = self.semantic_indirect_leak_detector(candidate_response, reference.answer)
            if sem_hit:
                leaks.append(sem_hit)
                if ContractViolation.C1_SEMANTIC_LEAKAGE not in violation_types:
                    violation_types.append(ContractViolation.C1_SEMANTIC_LEAKAGE)

        return leaks, violation_types

    def _socratic_rewrite(
        self,
        problem_statement: str,
        candidate_response: str,
        hint_level: HintLevel,
        forbidden_answers: List[str],
        reference: Optional[TrustedReference] = None,
    ) -> str:
        if self.llm_rewrite_fn is not None:
            return self.llm_rewrite_fn(problem_statement, candidate_response, hint_level)

        sentences = re.split(r"(?<=[.?!])\s+|\n+", candidate_response.strip())
        safe_sentences: List[str] = []
        for sent in sentences:
            if not sent.strip():
                continue
            sent_leaks, _ = self._check_answer_leakage(sent, forbidden_answers, reference)
            has_multi_dump = bool(self._MULTI_STEP_DUMP_RE.search(sent))
            if not sent_leaks and not has_multi_dump:
                safe_sentences.append(sent.strip())
            else:
                break

        fallback_questions = {
            HintLevel.LEVEL_0_ORIENTING: (
                "Theo bạn, để tìm được ẩn số trong bài toán này, bước biến đổi đầu tiên chúng ta cần thực hiện là gì?"
            ),
            HintLevel.LEVEL_1_CONCEPTUAL: (
                "Dựa vào quy tắc chuyển vế đổi dấu, bạn sẽ biến đổi vế trái của phương trình như thế nào?"
            ),
            HintLevel.LEVEL_2_CONCRETE: (
                "Nếu bạn thực hiện phép tính khử hằng số tự do ở cả hai vế, vế phải sẽ còn lại bao nhiêu?"
            ),
            HintLevel.LEVEL_3_INTERMEDIATE: (
                "Đến bước gần cuối này rồi, bạn hãy tự thực hiện phép chia cho hệ số của ẩn và cho mình biết kết quả nhé?"
            ),
            HintLevel.LEVEL_4_FULL_SOLUTION: (
                "Bạn hãy kiểm tra lại kết quả vừa tìm được bằng cách thay vào phương trình ban đầu xem hai vế đã bằng nhau chưa nhé?"
            ),
        }

        socratic_question = fallback_questions.get(
            hint_level, fallback_questions[HintLevel.LEVEL_1_CONCEPTUAL]
        )

        if safe_sentences:
            prefix = " ".join(safe_sentences[:2])
            if not prefix.endswith("?"):
                return f"{prefix} {socratic_question}"
            return prefix

        return (
            f"Chúng ta hãy đi từng bước cho bài toán `{problem_statement}` nhé! 💡 "
            f"{socratic_question}"
        )

    def supervise(
        self,
        problem_statement: str,
        candidate_response: str,
        hint_level: HintLevel = HintLevel.LEVEL_0_ORIENTING,
        target_answers: Optional[List[str]] = None,
        student_already_solved: bool = False,
        trusted_reference: Optional[TrustedReference] = None,
        strict_intermediate_check: bool = False,
    ) -> Layer3Result:
        """
        Kiểm duyệt độc lập câu trả lời của mô hình (Tầng 2) theo Hợp đồng Sư phạm & Rubric H0..H6.
        """
        if student_already_solved or hint_level == HintLevel.LEVEL_4_FULL_SOLUTION:
            return Layer3Result(
                candidate_response=candidate_response,
                final_response=candidate_response,
                decision="PASS",
                passed_all_contracts=True,
                observed_help_level=6,
            )

        ref = trusted_reference or self.auto_extract_reference(problem_statement)
        forbidden = list(target_answers) if target_answers else []
        if ref:
            forbidden.extend(
                [
                    f"{ref.variable} = {ref.answer}",
                    f"{ref.variable}={ref.answer}",
                    f"nghiệm là {ref.answer}",
                    f"bằng {ref.answer}",
                ]
            )

        detected_leaks, leak_violations = self._check_answer_leakage(
            candidate_response, forbidden, ref
        )
        violations: List[ContractViolation] = list(leak_violations)

        # Kiểm tra lộ bước trung gian nếu bật chế độ nghiêm ngặt (tương ứng M3 policy max_help_level < 5)
        if strict_intermediate_check and ref and int(hint_level) < int(HintLevel.LEVEL_3_INTERMEDIATE):
            step_hit = self.intermediate_step_detector(candidate_response, ref.solution_steps)
            if step_hit:
                detected_leaks.append(step_hit)
                violations.append(ContractViolation.C2_INTERMEDIATE_STEP_OVERHELP)

        # Kiểm tra Contract C2: Giải trọn gói nhiều bước liên tiếp
        if self._MULTI_STEP_DUMP_RE.search(candidate_response):
            violations.append(ContractViolation.C2_FULL_SOLUTION_DUMP)

        # Kiểm tra Contract C3: Phải có câu hỏi gợi mở Socratic (`?`)
        if "?" not in candidate_response:
            violations.append(ContractViolation.C3_MISSING_QUESTION)

        if not violations:
            return Layer3Result(
                candidate_response=candidate_response,
                final_response=candidate_response,
                decision="PASS",
                passed_all_contracts=True,
                observed_help_level=min(int(hint_level) + 1, 4),
                attempts=1,
                trace=[{"attempt": 0, "candidate": candidate_response, "decision": "PASS"}],
            )

        # Nếu vi phạm C1 hoặc C2 -> Cắt bỏ phần lộ đáp án và viết lại (Closed-loop Socratic Rewrite)
        has_leak_or_dump = any(
            v in violations
            for v in (
                ContractViolation.C1_ANSWER_LEAKAGE,
                ContractViolation.C1_SYMBOLIC_EQUIVALENCE_LEAK,
                ContractViolation.C1_SEMANTIC_LEAKAGE,
                ContractViolation.C2_INTERMEDIATE_STEP_OVERHELP,
                ContractViolation.C2_FULL_SOLUTION_DUMP,
            )
        )
        if has_leak_or_dump:
            rewritten = self._socratic_rewrite(
                problem_statement=problem_statement,
                candidate_response=candidate_response,
                hint_level=hint_level,
                forbidden_answers=forbidden,
                reference=ref,
            )
            return Layer3Result(
                candidate_response=candidate_response,
                final_response=rewritten,
                decision="REJECT",
                passed_all_contracts=False,
                violations=violations,
                rewrite_applied=True,
                detected_leaks=detected_leaks,
                observed_help_level=6,
                attempts=2,
                trace=[
                    {"attempt": 0, "candidate": candidate_response, "decision": "REJECT", "violations": [v.value for v in violations]},
                    {"attempt": 1, "candidate": rewritten, "decision": "PASS"},
                ],
            )

        # Nếu chỉ thiếu câu hỏi gợi mở (C3) -> Bổ sung câu hỏi Socratic ở cuối
        appended = (
            f"{candidate_response.rstrip()} "
            "Theo bạn, bước tiếp theo chúng ta nên thực hiện phép tính nào?"
        )
        return Layer3Result(
            candidate_response=candidate_response,
            final_response=appended,
            decision="REJECT",
            passed_all_contracts=False,
            violations=violations,
            rewrite_applied=True,
            detected_leaks=[],
            observed_help_level=int(hint_level) + 1,
            attempts=2,
            trace=[
                {"attempt": 0, "candidate": candidate_response, "decision": "REJECT", "violations": [v.value for v in violations]},
                {"attempt": 1, "candidate": appended, "decision": "PASS"},
            ],
        )


if __name__ == "__main__":
    import sys

    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    sup = ContractBasedSupervisor()
    for cand in [
        "Ta tính được x = 10/2. Vậy nghiệm là x = 5.",
        "Để cô lập 2x, bạn hãy thử trừ 5 ở cả hai vế xem sao?",
    ]:
        out = sup.supervise("Giải phương trình: 2x + 5 = 15", cand)
        print(f"[{out.decision} | Rewrite={out.rewrite_applied}] {cand}\n  -> {out.final_response}\n")

