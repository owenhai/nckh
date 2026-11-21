export const teacherClassesData = {
  '10A': {
    className: 'Lớp 10A',
    totalStudents: 42,
    avgMastery: 74,
    strongestTopic: 'Đại số',
    strongestRate: 86,
    weakestTopic: 'Bất phương trình',
    weakestRate: 52,
    progressSeries: [
      { week: 'Tuần 1', mastery: 58, target: 60 },
      { week: 'Tuần 2', mastery: 62, target: 64 },
      { week: 'Tuần 3', mastery: 61, target: 66 },
      { week: 'Tuần 4', mastery: 67, target: 68 },
      { week: 'Tuần 5', mastery: 70, target: 70 },
      { week: 'Tuần 6', mastery: 74, target: 72 }
    ],
    masteryDistribution: [
      { name: 'Giỏi', count: 8, color: '#3b82f6' },
      { name: 'Khá', count: 18, color: '#10b981' },
      { name: 'Trung bình', count: 12, color: '#f59e0b' },
      { name: 'Yếu', count: 4, color: '#f43f5e' }
    ],
    commonMistakes: [
      { id: 'err_1', title: 'Đổi chiều bất phương trình khi chia cho số âm', count: 14, severity: 'high', topic: 'Bất phương trình' },
      { id: 'err_2', title: 'Tính toán với phân số và quy đồng mẫu thức', count: 12, severity: 'medium', topic: 'Số và biểu thức' },
      { id: 'err_3', title: 'Hiểu sai khái niệm tập xác định của hàm số', count: 9, severity: 'medium', topic: 'Hàm số bậc hai' },
      { id: 'err_4', title: 'Vẽ hình không chính xác (nét đứt/nét liền)', count: 8, severity: 'low', topic: 'Hình học không gian' }
    ],
    students: [
      { id: 's1', name: 'Nguyễn Quang Minh', email: 'minh@example.com', mastery: 72, completed: 120, accuracy: 85, streak: 7, status: 'Đạt mục tiêu', weakTopic: 'Phương trình bậc hai', lastActive: 'Hôm nay' },
      { id: 's2', name: 'Trần Khánh Linh', email: 'linh.tk@example.com', mastery: 91, completed: 145, accuracy: 94, streak: 14, status: 'Xuất sắc', weakTopic: 'Không có', lastActive: 'Hôm nay' },
      { id: 's3', name: 'Lê Hoàng Nam', email: 'nam.lh@example.com', mastery: 46, completed: 52, accuracy: 51, streak: 1, status: 'Cần hỗ trợ', weakTopic: 'Bất phương trình', lastActive: '3 ngày trước' },
      { id: 's4', name: 'Phạm Thu Hà', email: 'ha.pt@example.com', mastery: 78, completed: 110, accuracy: 82, streak: 5, status: 'Đạt mục tiêu', weakTopic: 'Hình học không gian', lastActive: 'Hôm qua' },
      { id: 's5', name: 'Võ Đức Anh', email: 'anh.vd@example.com', mastery: 42, completed: 40, accuracy: 48, streak: 0, status: 'Cần hỗ trợ', weakTopic: 'Bất phương trình', lastActive: '5 ngày trước' },
      { id: 's6', name: 'Đặng Ngọc Ánh', email: 'anh.dn@example.com', mastery: 88, completed: 138, accuracy: 90, streak: 11, status: 'Xuất sắc', weakTopic: 'Xác suất', lastActive: 'Hôm nay' },
      { id: 's7', name: 'Hoàng Gia Bảo', email: 'bao.hg@example.com', mastery: 51, completed: 64, accuracy: 55, streak: 2, status: 'Cần hỗ trợ', weakTopic: 'Hệ phương trình', lastActive: '2 ngày trước' },
      { id: 's8', name: 'Bùi Phương Thảo', email: 'thao.bp@example.com', mastery: 69, completed: 95, accuracy: 74, streak: 4, status: 'Đạt mục tiêu', weakTopic: 'Thống kê', lastActive: 'Hôm nay' }
    ]
  },
  '10B': {
    className: 'Lớp 10B',
    totalStudents: 38,
    avgMastery: 68,
    strongestTopic: 'Số học',
    strongestRate: 82,
    weakestTopic: 'Hình học không gian',
    weakestRate: 48,
    progressSeries: [
      { week: 'Tuần 1', mastery: 52, target: 60 },
      { week: 'Tuần 2', mastery: 55, target: 62 },
      { week: 'Tuần 3', mastery: 59, target: 64 },
      { week: 'Tuần 4', mastery: 63, target: 66 },
      { week: 'Tuần 5', mastery: 65, target: 68 },
      { week: 'Tuần 6', mastery: 68, target: 70 }
    ],
    masteryDistribution: [
      { name: 'Giỏi', count: 5, color: '#3b82f6' },
      { name: 'Khá', count: 15, color: '#10b981' },
      { name: 'Trung bình', count: 12, color: '#f59e0b' },
      { name: 'Yếu', count: 6, color: '#f43f5e' }
    ],
    commonMistakes: [
      { id: 'err_b1', title: 'Xác định sai giao tuyến hai mặt phẳng', count: 16, severity: 'high', topic: 'Hình học không gian' },
      { id: 'err_b2', title: 'Quên điều kiện xác định khi giải phương trình chứa ẩn ở mẫu', count: 13, severity: 'high', topic: 'Phương trình bậc nhất' },
      { id: 'err_b3', title: 'Nhầm dấu hệ số b khi tính tọa độ đỉnh Parabol', count: 10, severity: 'medium', topic: 'Hàm số bậc hai' }
    ],
    students: [
      { id: 's101', name: 'Nguyễn Minh Khôi', email: 'khoi.nm@example.com', mastery: 84, completed: 128, accuracy: 88, streak: 9, status: 'Xuất sắc', weakTopic: 'Xác suất', lastActive: 'Hôm nay' },
      { id: 's102', name: 'Trịnh Bảo Trâm', email: 'tram.tb@example.com', mastery: 45, completed: 48, accuracy: 50, streak: 1, status: 'Cần hỗ trợ', weakTopic: 'Hình học không gian', lastActive: '4 ngày trước' },
      { id: 's103', name: 'Lý Tuấn Kiệt', email: 'kiet.lt@example.com', mastery: 71, completed: 98, accuracy: 76, streak: 6, status: 'Đạt mục tiêu', weakTopic: 'Bất phương trình', lastActive: 'Hôm nay' },
      { id: 's104', name: 'Phan Thanh Trúc', email: 'truc.pt@example.com', mastery: 49, completed: 55, accuracy: 52, streak: 0, status: 'Cần hỗ trợ', weakTopic: 'Hàm số bậc hai', lastActive: '3 ngày trước' }
    ]
  },
  '11A': {
    className: 'Lớp 11A',
    totalStudents: 40,
    avgMastery: 79,
    strongestTopic: 'Lượng giác & Đại số',
    strongestRate: 89,
    weakestTopic: 'Xác suất cổ điển',
    weakestRate: 58,
    progressSeries: [
      { week: 'Tuần 1', mastery: 66, target: 65 },
      { week: 'Tuần 2', mastery: 70, target: 68 },
      { week: 'Tuần 3', mastery: 73, target: 70 },
      { week: 'Tuần 4', mastery: 75, target: 73 },
      { week: 'Tuần 5', mastery: 77, target: 75 },
      { week: 'Tuần 6', mastery: 79, target: 78 }
    ],
    masteryDistribution: [
      { name: 'Giỏi', count: 12, color: '#3b82f6' },
      { name: 'Khá', count: 19, color: '#10b981' },
      { name: 'Trung bình', count: 7, color: '#f59e0b' },
      { name: 'Yếu', count: 2, color: '#f43f5e' }
    ],
    commonMistakes: [
      { id: 'err_c1', title: 'Nhầm lẫn giữa Tổ hợp C(n,k) và Chỉnh hợp A(n,k)', count: 11, severity: 'high', topic: 'Xác suất' },
      { id: 'err_c2', title: 'Bỏ sót chu kỳ k2π khi giải phương trình lượng giác', count: 9, severity: 'medium', topic: 'Đại số' }
    ],
    students: [
      { id: 's201', name: 'Đỗ Hoàng Phúc', email: 'phuc.dh@example.com', mastery: 93, completed: 160, accuracy: 95, streak: 18, status: 'Xuất sắc', weakTopic: 'Không có', lastActive: 'Hôm nay' },
      { id: 's202', name: 'Ngô Mai Phương', email: 'phuong.nm@example.com', mastery: 76, completed: 115, accuracy: 81, streak: 8, status: 'Đạt mục tiêu', weakTopic: 'Xác suất', lastActive: 'Hôm nay' },
      { id: 's203', name: 'Vũ Quốc Huy', email: 'huy.vq@example.com', mastery: 47, completed: 51, accuracy: 49, streak: 1, status: 'Cần hỗ trợ', weakTopic: 'Xác suất', lastActive: '4 ngày trước' }
    ]
  }
};
