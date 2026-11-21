@echo off
chcp 65001 >nul
echo ============================================================================
echo   KHOI DONG HE THONG SOCRATIC GUARDRAIL HARNESS (3 TANG) + MATHTUTOR-AI
echo ============================================================================
echo.
echo [1/3] Dang chay kiem thu tu dong 3 tang Socratic Guardrail...
cd /d "D:\Project _Lab_Doc\nckh\socratic-guardrail"
python run_all_tests.py

echo.
echo [2/3] Dang bat Socratic Guardrail Backend Server tai http://localhost:8000 ...
start "Socratic Guardrail Backend (Port 8000)" cmd /k "cd /d ""D:\Project _Lab_Doc\nckh\socratic-guardrail"" && python api_server.py"

echo.
echo [3/3] Dang bat Giao dien Web MathTutor-AI tai http://localhost:5173 ...
cd /d "D:\Project _Lab_Doc\nckh\mathtutor-ai"
npm run dev
