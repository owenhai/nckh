export const initialLibraryItems = [
  {
    id: 'lib_1',
    title: 'Phương trình bậc nhất',
    subtitle: 'Bài giảng • PDF',
    category: 'Bài giảng',
    format: 'PDF',
    topic: 'Đại số',
    pages: '14 trang',
    color: 'blue',
    bookmarked: true,
    description: 'Tài liệu hệ thống toàn bộ lý thuyết, quy tắc chuyển vế, biện luận phương trình ax + b = 0 và 20 bài tập vận dụng có hướng dẫn giải từng bước.',
    sections: [
      '1. Định nghĩa phương trình bậc nhất một ẩn ax + b = 0 (a ≠ 0)',
      '2. Hai quy tắc biến đổi tương đương: Quy tắc chuyển vế & Quy tắc nhân/chia',
      '3. Các dạng toán thường gặp: Phương trình đưa về bậc nhất, phương trình chứa tham số m',
      '4. Bài tập tự luyện kèm gợi ý Socratic'
    ],
    sampleFormula: 'ax + b = 0 ⇔ x = -b / a (với a ≠ 0)'
  },
  {
    id: 'lib_2',
    title: 'Bất phương trình',
    subtitle: 'Bài giảng • Video',
    category: 'Bài giảng',
    format: 'Video',
    topic: 'Đại số',
    pages: '24 phút',
    color: 'emerald',
    bookmarked: false,
    description: 'Video bài giảng trực quan giúp học sinh hiểu rõ vì sao phải đổi chiều bất phương trình khi nhân hoặc chia với số âm, kèm minh họa trên trục số.',
    sections: [
      '1. Liên hệ giữa thứ tự và phép cộng, phép nhân',
      '2. Minh họa trực quan trên trục số thực',
      '3. Phân tích 5 lỗi sai kinh điển của học sinh lớp 10 khi giải bất phương trình',
      '4. Tổng kết sơ đồ tư duy giải bất phương trình bậc nhất'
    ],
    sampleFormula: 'a < b và c < 0 ⇒ a · c > b · c'
  },
  {
    id: 'lib_3',
    title: 'Hình học phẳng',
    subtitle: 'Tài liệu • PDF',
    category: 'Tài liệu tham khảo',
    format: 'PDF',
    topic: 'Hình học',
    pages: '22 trang',
    color: 'rose',
    bookmarked: false,
    description: 'Chuyên đề hệ thức lượng trong tam giác vuông và tam giác thường: Định lý Pythagore, Định lý Cosin, Định lý Sin và 5 công thức tính diện tích tam giác.',
    sections: [
      '1. Hệ thức lượng trong tam giác vuông',
      '2. Định lý Cosin: a² = b² + c² - 2bc·cosA',
      '3. Định lý Sin: a/sinA = b/sinB = c/sinC = 2R',
      '4. Công thức Heron tính diện tích tam giác khi biết 3 cạnh'
    ],
    sampleFormula: 'S = √[p(p - a)(p - b)(p - c)]'
  },
  {
    id: 'lib_4',
    title: 'Tổng ôn Toán 10',
    subtitle: 'Tài liệu • PDF',
    category: 'Tài liệu tham khảo',
    format: 'PDF',
    topic: 'Tổng hợp',
    pages: '45 trang',
    color: 'amber',
    bookmarked: true,
    description: 'Cẩm nang tổng ôn kiến thức Toán 10 học kỳ I & II gồm Đại số, Hàm số, Thống kê - Xác suất và Hình học, thiết kế theo cấu trúc chương trình GDPT mới.',
    sections: [
      'Phần I: Mệnh đề, Tập hợp và Bất phương trình',
      'Phần II: Hàm số bậc hai và Đồ thị Parabol',
      'Phần III: Hệ thức lượng trong tam giác & Vectơ',
      'Phần IV: Thống kê mô tả và Xác suất cổ điển'
    ],
    sampleFormula: 'x_I = -b / (2a) ; Δ = b² - 4ac'
  },
  {
    id: 'lib_5',
    title: 'Đề thi giữa kỳ',
    subtitle: 'Đề thi • PDF',
    category: 'Đề thi',
    format: 'PDF',
    topic: 'Tổng hợp',
    pages: '90 phút • 35 câu',
    color: 'rose',
    bookmarked: false,
    description: 'Bộ 5 đề thi thử Giữa học kỳ I môn Toán lớp 10 có ma trận đặc tả, đáp án chi tiết và lời giải phân tích từng bước.',
    sections: [
      'Phần 1: Trắc nghiệm nhiều phương án lựa chọn (12 câu - 3.0 điểm)',
      'Phần 2: Trắc nghiệm Đúng/Sai (4 câu - 4.0 điểm)',
      'Phần 3: Trắc nghiệm trả lời ngắn & Tự luận (3.0 điểm)',
      'Hướng dẫn chấm và phân tích lỗi sai thường gặp'
    ],
    sampleFormula: 'Thời gian làm bài: 90 phút (Không kể thời gian phát đề)'
  },
  {
    id: 'lib_6',
    title: 'Công thức toán học',
    subtitle: 'Tài liệu • PDF',
    category: 'Ví dụ',
    format: 'PDF',
    topic: 'Đại số',
    pages: '8 trang',
    color: 'blue',
    bookmarked: true,
    description: 'Bảng tra cứu nhanh công thức Đại số, Hình học, Lượng giác và Thống kê kèm ví dụ mẫu minh họa ngay bên cạnh mỗi công thức.',
    sections: [
      '1. Bảng 7 hằng đẳng thức đáng nhớ & Ví dụ áp dụng',
      '2. Công thức nghiệm phương trình bậc hai và Hệ thức Vi-ét',
      '3. Bảng giá trị lượng giác các góc đặc biệt',
      '4. Các số đặc trưng đo xu thế trung tâm và mức độ phân tán'
    ],
    sampleFormula: 'x₁ + x₂ = -b/a ; x₁ · x₂ = c/a'
  }
];
