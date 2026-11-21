"""
CHẠY TOÀN BỘ BÀI KIỂM THỬ 3 TẦNG + ĐÁNH GIÁ BENCHMARK KHOA HỌC (NCKH 2026-2027)
Chạy bằng lệnh: `python run_all_tests.py`
"""

import sys
from test_layer1 import run_tests as run_layer1_tests
from test_layer2 import run_layer2_tests
from test_layer3_and_pipeline import run_layer3_and_harness_tests
from evaluate_nckh_benchmark import run_nckh_benchmark

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


def main() -> None:
    print("\n🚀 BẮT ĐẦU CHẠY TỔNG HỢP CẢ 3 TẦNG SOCRATIC GUARDRAIL HARNESS & BENCHMARK NCKH...\n")
    run_layer1_tests()
    print("\n")
    run_layer2_tests()
    print("\n")
    run_layer3_and_harness_tests()
    print("\n")
    run_nckh_benchmark()
    print("\n✅ HOÀN TẤT: TẤT CẢ CÁC TẦNG & BỘ BENCHMARK THỰC NGHIỆM NCKH ĐỀU PASS 100%!\n")


if __name__ == "__main__":
    main()
