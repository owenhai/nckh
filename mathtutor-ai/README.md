# MathTutor AI — Nền tảng gia sư Toán thông minh hỗ trợ học tập cá nhân hóa

Dự án nghiên cứu khoa học xây dựng giao diện Frontend cho hệ thống gia sư AI môn Toán theo phương pháp **Socratic Tutoring** (Hỏi đáp định hướng từng bước, không đưa ngay đáp án).

## Công nghệ sử dụng
- **React 18** (JavaScript) + **Vite**
- **React Router DOM v6** (Điều hướng 9 màn hình)
- **CSS3 thuần + CSS Variables** (Hệ thống Design System đồng bộ, hỗ trợ Sáng/Tối & Responsive)
- **Lucide React** (Bộ icon chuẩn EdTech)
- **Recharts** (Biểu đồ thống kê trực quan)
- **KaTeX / Custom Math Formatter** (Hiển thị công thức toán học)
- **LocalStorage** (Lưu trữ tiến độ học tập, lịch sử chat, mục tiêu và cài đặt)

## Danh sách 9 màn hình chính
1. **Trang chủ (`/`)**: Lời chào cá nhân hóa, 3 thẻ chức năng chính (Giải bài cùng AI, Luyện tập, Lộ trình học), vòng tròn mức độ thành thạo 72%, thống kê bài làm và chủ đề cần tập trung.
2. **AI Tutor (`/tutor`)**: Giao diện giải bài tương tác 3 khu vực (Đề bài toán, Hội thoại Socratic cùng AI, Panel Gợi ý theo 5 cấp độ từ 0 đến 4), các nút gợi ý nhanh và chọn bài toán mẫu.
3. **Nhập bài toán (`/problem-input`)**: Hỗ trợ 5 phương thức nhập (Gõ văn bản, Tải ảnh kèm xem trước & kiểm tra dung lượng, Vẽ tay trên Canvas HTML5, Tải PDF, Giọng nói demo).
4. **Luyện tập (`/practice`)**: Phân loại theo 6 tab chuyên đề, lọc độ khó, tìm kiếm, làm bài trắc nghiệm trực tiếp có giải thích chi tiết và thống kê kết quả luyện tập.
5. **Lộ trình học (`/learning-path`)**: Lộ trình cá nhân hóa theo 4 tuần, đóng/mở từng tuần, chọn chủ đề, đánh dấu hoàn thành nhiệm vụ (Lý thuyết, Ví dụ, Luyện tập, Kiểm tra) và cập nhật tiến độ tự động.
6. **Tiến độ học tập (`/progress`)**: Bộ lọc khoảng thời gian (7 ngày, 30 ngày, Học kỳ), biểu đồ thời gian học Recharts, mức độ thành thạo theo chủ đề và thông điệp động viên.
7. **Bảng giáo viên (`/teacher`)**: Chuyển đổi lớp học (10A, 10B, 11A), 4 tab quản lý (Tổng quan, Học sinh, Chủ đề, Báo cáo), biểu đồ tiến độ lớp, phân bố mức độ thành thạo và danh sách lỗi sai phổ biến.
8. **Thư viện học liệu (`/library`)**: Tìm kiếm, lọc theo 5 danh mục (Tất cả, Bài giảng, Ví dụ, Đề thi, Tài liệu tham khảo), lưu yêu thích và xem chi tiết nội dung học liệu.
9. **Cài đặt & Hồ sơ cá nhân (`/settings`)**: 4 tab (Thông tin, Mục tiêu học tập, Cài đặt, Thông báo), chỉnh sửa hồ sơ, tải ảnh đại diện cục bộ, đổi giao diện Sáng/Tối và khôi phục mặc định.

## Hướng dẫn cài đặt và chạy dự án
```bash
npm install
npm run dev
```
Sau đó mở trình duyệt tại `http://localhost:5173`.
