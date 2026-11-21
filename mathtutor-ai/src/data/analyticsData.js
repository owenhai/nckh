export const progressByPeriod = {
  '7d': {
    label: '7 ngày qua',
    mastery: 72,
    masteryDelta: '+5% so với tuần trước',
    avgHours: '2.5 giờ',
    avgSubtext: 'Trung bình/ngày',
    streakDays: 7,
    encouragementTitle: 'Bạn đã tiến bộ 12% so với tháng trước!',
    encouragementSubtitle: 'Hãy tiếp tục giữ vững phong độ!',
    studyChart: [
      { day: 'T2', hours: 1.8, exercises: 14 },
      { day: 'T3', hours: 2.2, exercises: 18 },
      { day: 'T4', hours: 1.5, exercises: 12 },
      { day: 'T5', hours: 3.1, exercises: 25 },
      { day: 'T6', hours: 2.4, exercises: 19 },
      { day: 'T7', hours: 2.8, exercises: 22 },
      { day: 'CN', hours: 2.0, exercises: 16 }
    ],
    categoryMastery: [
      { name: 'Đại số', value: 78 },
      { name: 'Hình học', value: 68 },
      { name: 'Số học', value: 85 },
      { name: 'Thống kê', value: 60 },
      { name: 'Xác suất', value: 52 }
    ]
  },
  '30d': {
    label: '30 ngày qua',
    mastery: 70,
    masteryDelta: '+12% so với tháng trước',
    avgHours: '2.1 giờ',
    avgSubtext: 'Trung bình/ngày (30 ngày)',
    streakDays: 7,
    encouragementTitle: 'Hoàn thành 94 bài tập trong 30 ngày qua!',
    encouragementSubtitle: 'Chuyên đề Số học và Đại số của bạn tăng trưởng rất ổn định.',
    studyChart: [
      { day: 'Tuần 1', hours: 11.5, exercises: 20 },
      { day: 'Tuần 2', hours: 13.0, exercises: 24 },
      { day: 'Tuần 3', hours: 14.2, exercises: 26 },
      { day: 'Tuần 4', hours: 16.8, exercises: 32 }
    ],
    categoryMastery: [
      { name: 'Đại số', value: 75 },
      { name: 'Hình học', value: 64 },
      { name: 'Số học', value: 82 },
      { name: 'Thống kê', value: 58 },
      { name: 'Xác suất', value: 49 }
    ]
  },
  'semester': {
    label: 'Học kỳ này',
    mastery: 68,
    masteryDelta: '+18% từ đầu học kỳ',
    avgHours: '1.9 giờ',
    avgSubtext: 'Trung bình/ngày (Học kỳ I)',
    streakDays: 14,
    encouragementTitle: 'Top 15% học sinh chăm chỉ nhất Lớp 10A!',
    encouragementSubtitle: 'Tập trung thêm vào Phương trình bậc hai để bứt phá điểm 9+.',
    studyChart: [
      { day: 'Tháng 8', hours: 38, exercises: 65 },
      { day: 'Tháng 9', hours: 46, exercises: 88 },
      { day: 'Tháng 10', hours: 54, exercises: 112 }
    ],
    categoryMastery: [
      { name: 'Đại số', value: 74 },
      { name: 'Hình học', value: 65 },
      { name: 'Số học', value: 84 },
      { name: 'Thống kê', value: 56 },
      { name: 'Xác suất', value: 50 }
    ]
  }
};
