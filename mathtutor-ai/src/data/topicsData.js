export const initialTopics = [
  {
    id: 'topic_ptb1',
    title: 'Phương trình bậc nhất',
    category: 'Đại số',
    difficulty: 'Trung bình',
    exerciseCount: 10,
    completedCount: 8,
    mastery: 82,
    recommended: true,
    focusNeeded: false,
    color: 'blue',
    description: 'Biến đổi tương đương, quy tắc chuyển vế và giải phương trình bậc nhất một ẩn ax + b = 0.'
  },
  {
    id: 'topic_bpt',
    title: 'Bất phương trình',
    category: 'Đại số',
    difficulty: 'Trung bình',
    exerciseCount: 8,
    completedCount: 5,
    mastery: 56,
    recommended: true,
    focusNeeded: true,
    color: 'amber',
    description: 'Bất phương trình bậc nhất một ẩn, quy tắc nhân/chia với số âm và biểu diễn tập nghiệm trên trục số.'
  },
  {
    id: 'topic_hpt',
    title: 'Hệ phương trình',
    category: 'Đại số',
    difficulty: 'Khó',
    exerciseCount: 12,
    completedCount: 6,
    mastery: 64,
    recommended: false,
    focusNeeded: false,
    color: 'rose',
    description: 'Giải hệ hai phương trình bậc nhất hai ẩn bằng phương pháp thế và phương pháp cộng đại số.'
  },
  {
    id: 'topic_ptb2',
    title: 'Hàm số & Phương trình bậc hai',
    shortTitle: 'Phương trình bậc hai',
    category: 'Đại số',
    difficulty: 'Trung bình',
    exerciseCount: 10,
    completedCount: 4,
    mastery: 40,
    recommended: true,
    focusNeeded: true,
    color: 'rose',
    description: 'Công thức nghiệm biệt thức Delta, định lý Vi-ét và khảo sát đồ thị parabol y = ax² + bx + c.'
  },
  {
    id: 'topic_hhp',
    title: 'Hình học phẳng',
    category: 'Hình học',
    difficulty: 'Dễ',
    exerciseCount: 15,
    completedCount: 12,
    mastery: 78,
    recommended: false,
    focusNeeded: false,
    color: 'emerald',
    description: 'Hệ thức lượng trong tam giác, định lý Cosin, định lý Sin và các công thức tính diện tích tam giác.'
  },
  {
    id: 'topic_hhkg',
    title: 'Hình học không gian',
    category: 'Hình học',
    difficulty: 'Khó',
    exerciseCount: 10,
    completedCount: 6,
    mastery: 62,
    recommended: true,
    focusNeeded: true,
    color: 'amber',
    description: 'Quan hệ song song, vuông góc trong không gian và thể tích khối đa diện.'
  },
  {
    id: 'topic_sohoc',
    title: 'Số học & Biểu thức',
    category: 'Số học',
    difficulty: 'Dễ',
    exerciseCount: 14,
    completedCount: 12,
    mastery: 85,
    recommended: false,
    focusNeeded: false,
    color: 'emerald',
    description: 'Ước chung, bội chung, căn bậc hai, rút gọn biểu thức chứa căn và trị tuyệt đối.'
  },
  {
    id: 'topic_thongke',
    title: 'Thống kê & Xác suất',
    category: 'Thống kê',
    difficulty: 'Trung bình',
    exerciseCount: 12,
    completedCount: 7,
    mastery: 60,
    recommended: false,
    focusNeeded: false,
    color: 'blue',
    description: 'Số trung bình cộng, trung vị, mốt, phương sai, độ lệch chuẩn và xác suất cổ điển.'
  }
];

export const categoryMasterySummary = [
  { category: 'Đại số', mastery: 78, color: '#3b82f6' },
  { category: 'Hình học', mastery: 68, color: '#3b82f6' },
  { category: 'Số học', mastery: 85, color: '#3b82f6' },
  { category: 'Thống kê', mastery: 60, color: '#3b82f6' },
  { category: 'Xác suất', mastery: 52, color: '#3b82f6' }
];
