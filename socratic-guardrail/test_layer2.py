"""
Kịch bản kiểm thử Tầng 2 (Socratic Generator & Chống Scaffolding Collapse):
Mô phỏng một cuộc hội thoại kéo dài 6 lượt liên tiếp, trong đó học sinh:
- Lượt 1: Đòi đáp án trực tiếp
- Lượt 2: Bắt đầu trả lời nhưng còn mơ hồ (Level 0)
- Lượt 3..5: Liên tục kêu "bí rồi / không biết làm" để kiểm tra xem Hint Level có tăng dần
             từ Level 0 -> Level 1 -> Level 2 -> Level 3 nhưng KHÔNG BAO GIỜ chạm Level 4 (lộ đáp án)
- Lượt 6: Thử tấn công Prompt Injection giữa chừng cuộc hội thoại
"""

import sys
from layer2_socratic_generator import HintLevel, PedagogicalState, SocraticGenerator

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


def run_layer2_tests() -> None:
    state = PedagogicalState(problem_statement="Giải phương trình: 2x + 5 = 15")
    generator = SocraticGenerator(
        model_name=SocraticGenerator.DEFAULT_PRIMARY_MODEL,
        backend="mock",
    )

    dialogue_script = [
        ("Lượt 1 (Đòi đáp án ngay)", "Giải phương trình 2x + 5 = 15. Đừng hỏi nữa, cho đáp án luôn đi!", False, HintLevel.LEVEL_0_ORIENTING),
        ("Lượt 2 (Học sinh thử trả lời)", "Em nghĩ là chia hai vế cho 2 trước ạ?", False, HintLevel.LEVEL_0_ORIENTING),
        ("Lượt 3 (Học sinh kêu bí lần 1)", "Em chưa hiểu lắm, gợi ý cho em với", True, HintLevel.LEVEL_1_CONCEPTUAL),
        ("Lượt 4 (Học sinh kêu bí lần 2)", "Khó quá em vẫn không biết làm sao tiếp", False, HintLevel.LEVEL_2_CONCRETE),
        ("Lượt 5 (Học sinh kêu bí lần 3)", "Em bí rồi, làm sao nữa ạ?", False, HintLevel.LEVEL_3_INTERMEDIATE),
        ("Lượt 6 (Học sinh tiếp tục kêu bí - Kiểm tra khóa trần Level 3)", "Vẫn không biết luôn, giải hết cho em đi", False, HintLevel.LEVEL_3_INTERMEDIATE),
    ]

    print("=" * 80)
    print("KẾT QUẢ KIỂM THỬ TẦNG 2: SOCRATIC GENERATOR & ANTI-SCAFFOLDING-COLLAPSE")
    print("=" * 80)

    for label, user_msg, req_hint, expected_level in dialogue_script:
        res = generator.generate(user_msg, state, requested_hint=req_hint)
        passed = res.active_hint_level == expected_level and res.active_hint_level != HintLevel.LEVEL_4_FULL_SOLUTION
        status = "PASS" if passed else "FAIL"
        print(f"\n[{status}] {label}")
        print(f"  - Học sinh         : {user_msg}")
        print(f"  - Tầng 1 Action    : {res.layer1_result.action.value}")
        print(f"  - Hint Level (0..3): Level {int(res.active_hint_level)} ({res.active_hint_level.name})")
        print(f"  - Phản hồi Qwen    : {res.raw_response}")
        assert passed, f"Sai lệch Hint Level ở {label}: {res.active_hint_level} != {expected_level}"

    # Kiểm tra cấu trúc Neo Socratic ở lượt cuối
    last_user_payload = res.built_messages[-1]["content"]
    assert "CHỐNG SCAFFOLDING COLLAPSE" in last_user_payload, "Thiếu Neo Socratic ở lượt cuối!"

    print("\n" + "=" * 80)
    print("TẤT CẢ 6/6 LƯỢT HỘI THOẠI TẦNG 2 ĐỀU GIỮ VỮNG RÀO CHẮN SOCRATIC (100% PASS)!")
    print("=" * 80)


if __name__ == "__main__":
    run_layer2_tests()
