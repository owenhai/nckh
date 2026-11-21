- **Chạy toàn bộ kiểm thử 3 tầng & in bảng số liệu NCKH:**
  ```powershell
  cd "D:\Project _Lab_Doc\nckh\socratic-guardrail"
  python run_all_tests.py
  ```
- **Khởi động đồng thời cả Test + Backend (cổng 8000) + Web Demo (cổng 5173) chỉ với 1 lệnh:**
  ```powershell
  & "D:\Project _Lab_Doc\nckh\chay_test_tat_ca.bat"
  ```
- **Không api key --> theo kịch bản dựng sẵn 
Nếu bạn hỏi câu tự do ngoài lề hoặc nhập bài toán mới tinh thì nó chỉ trả lời các câu gợi ý chung chung theo bậc 0 → 3 thôi.**


 ```powershell
  cd "D:\Project _Lab_Doc\nckh\socratic-guardrail"
  $env:OPENAI_API_KEY="DÁN_KEY_LÚC_NÃY_CỦA_BẠN_VÀO_ĐÂY"
  $env:QWEN_API_BASE="https://api.trustedrouter.com/v1"
  $env:QWEN_MODEL_NAME="trustedrouter/cheap"
  python api_server.py
  ```

còn không thì gắn vô api_server.py
