export const initialLearningPath = {
  totalModules: 24,
  completedModulesBase: 6,
  weeks: [
    {
      id: 'week_1',
      weekNumber: 'Tuần 1',
      title: 'Nền tảng đại số',
      expanded: true,
      topics: [
        {
          id: 'lp_topic_1',
          title: 'Số và biểu thức',
          status: 'completed',
          description: 'Ôn tập các phép biến đổi căn thức bậc hai, hằng đẳng thức đáng nhớ và rút gọn biểu thức đại số.',
          goals: [
            'Thuộc lòng 7 hằng đẳng thức đáng nhớ',
            'Thực hiện thành thạo trục căn thức ở mẫu',
            'Rút gọn biểu thức chứa chữ và tìm điều kiện xác định'
          ],
          tasks: [
            { id: 't1_1', title: 'Bài giảng lý thuyết: Hằng đẳng thức & Căn thức', type: 'theory', completed: true, duration: '15 phút' },
            { id: 't1_2', title: 'Ví dụ minh họa: Rút gọn biểu thức P(x)', type: 'example', completed: true, duration: '10 phút' },
            { id: 't1_3', title: 'Luyện tập cơ bản: 10 câu trắc nghiệm căn thức', type: 'practice', completed: true, duration: '15 phút', linkedTopicId: 'topic_sohoc' },
            { id: 't1_4', title: 'Bài kiểm tra ngắn Tuần 1.1', type: 'quiz', completed: true, duration: '10 phút', linkedTopicId: 'topic_sohoc' }
          ]
        },
        {
          id: 'lp_topic_2',
          title: 'Phương trình bậc nhất',
          status: 'in_progress',
          description: 'Trong chủ đề này, bạn sẽ học cách giải và vận dụng phương trình bậc nhất một ẩn.',
          goals: [
            'Nắm vững phương pháp giải phương trình bậc nhất',
            'Nhận biết các dạng bài thường gặp',
            'Vận dụng vào bài toán thực tế'
          ],
          tasks: [
            { id: 't2_1', title: 'Bài giảng lý thuyết', type: 'theory', completed: true, duration: '12 phút' },
            { id: 't2_2', title: 'Ví dụ minh họa', type: 'example', completed: true, duration: '10 phút' },
            { id: 't2_3', title: 'Luyện tập cơ bản', type: 'practice', completed: true, duration: '15 phút', linkedTopicId: 'topic_ptb1' },
            { id: 't2_4', title: 'Luyện tập nâng cao', type: 'practice_adv', completed: false, duration: '20 phút', linkedTopicId: 'topic_ptb1' },
            { id: 't2_5', title: 'Bài kiểm tra', type: 'quiz', completed: false, duration: '15 phút', linkedTopicId: 'topic_ptb1' }
          ]
        },
        {
          id: 'lp_topic_3',
          title: 'Bất phương trình',
          status: 'upcoming',
          description: 'Hiểu bản chất thứ tự trên tập số thực, quy tắc chuyển vế và quy tắc nhân chia hai vế bất phương trình.',
          goals: [
            'Giải thành thạo bất phương trình bậc nhất một ẩn',
            'Không mắc lỗi quên đổi chiều khi chia cho số âm',
            'Biểu diễn đúng tập nghiệm trên trục số'
          ],
          tasks: [
            { id: 't3_1', title: 'Bài giảng lý thuyết: Bất đẳng thức & Bất phương trình', type: 'theory', completed: false, duration: '15 phút' },
            { id: 't3_2', title: 'Ví dụ minh họa: Các bẫy đổi chiều thường gặp', type: 'example', completed: false, duration: '12 phút' },
            { id: 't3_3', title: 'Luyện tập cơ bản', type: 'practice', completed: false, duration: '15 phút', linkedTopicId: 'topic_bpt' },
            { id: 't3_4', title: 'Bài kiểm tra chủ đề Bất phương trình', type: 'quiz', completed: false, duration: '15 phút', linkedTopicId: 'topic_bpt' }
          ]
        },
        {
          id: 'lp_topic_4',
          title: 'Hệ phương trình',
          status: 'locked',
          description: 'Giải hệ phương trình bậc nhất hai ẩn bằng phương pháp thế, cộng đại số và giải bài toán bằng cách lập hệ.',
          goals: [
            'Vận dụng linh hoạt phương pháp thế và cộng đại số',
            'Biện luận nghiệm của hệ phương trình cơ bản',
            'Giải bài toán chuyển động, năng suất bằng hệ phương trình'
          ],
          tasks: [
            { id: 't4_1', title: 'Bài giảng lý thuyết: Hệ hai phương trình bậc nhất hai ẩn', type: 'theory', completed: false, duration: '18 phút' },
            { id: 't4_2', title: 'Ví dụ minh họa: Phương pháp thế & cộng đại số', type: 'example', completed: false, duration: '15 phút' },
            { id: 't4_3', title: 'Luyện tập tổng hợp Hệ phương trình', type: 'practice', completed: false, duration: '20 phút', linkedTopicId: 'topic_hpt' }
          ]
        }
      ]
    },
    {
      id: 'week_2',
      weekNumber: 'Tuần 2',
      title: 'Hàm số và đồ thị',
      expanded: false,
      topics: [
        {
          id: 'lp_topic_5',
          title: 'Hàm số bậc nhất y = ax + b',
          status: 'upcoming',
          description: 'Khảo sát sự biến thiên, vẽ đồ thị đường thẳng và xác định giao điểm hai đường thẳng.',
          goals: [
            'Xác định tập xác định và chiều biến thiên của hàm số',
            'Vẽ chính xác đồ thị hàm số bậc nhất trên mặt phẳng Oxy'
          ],
          tasks: [
            { id: 't5_1', title: 'Bài giảng lý thuyết: Hàm số & Đồ thị', type: 'theory', completed: false, duration: '15 phút' },
            { id: 't5_2', title: 'Ví dụ minh họa: Tìm giao điểm hai đường thẳng', type: 'example', completed: false, duration: '12 phút' },
            { id: 't5_3', title: 'Luyện tập đồ thị hàm số', type: 'practice', completed: false, duration: '15 phút', linkedTopicId: 'topic_ptb2' }
          ]
        },
        {
          id: 'lp_topic_6',
          title: 'Hàm số bậc hai & Parabol',
          status: 'locked',
          description: 'Đỉnh parabol, trục đối xứng, bảng biến thiên và định lý Vi-ét cho phương trình bậc hai.',
          goals: [
            'Tìm tọa độ đỉnh I(-b/2a; -Δ/4a) và trục đối xứng',
            'Áp dụng hệ thức Vi-ét tính tổng và tích hai nghiệm'
          ],
          tasks: [
            { id: 't6_1', title: 'Bài giảng lý thuyết: Hàm số bậc hai y = ax² + bx + c', type: 'theory', completed: false, duration: '20 phút' },
            { id: 't6_2', title: 'Luyện tập khảo sát Parabol', type: 'practice', completed: false, duration: '20 phút', linkedTopicId: 'topic_ptb2' }
          ]
        }
      ]
    },
    {
      id: 'week_3',
      weekNumber: 'Tuần 3',
      title: 'Hình học phẳng',
      expanded: false,
      topics: [
        {
          id: 'lp_topic_7',
          title: 'Hệ thức lượng trong tam giác',
          status: 'upcoming',
          description: 'Định lý Cosin, định lý Sin và các công thức tính diện tích tam giác (Heron, bán kính R, r).',
          goals: [
            'Áp dụng định lý Cosin và Sin để giải tam giác',
            'Lựa chọn công thức diện tích phù hợp với giả thiết'
          ],
          tasks: [
            { id: 't7_1', title: 'Bài giảng lý thuyết: Định lý Cosin & Sin', type: 'theory', completed: false, duration: '15 phút' },
            { id: 't7_2', title: 'Luyện tập Giải tam giác', type: 'practice', completed: false, duration: '20 phút', linkedTopicId: 'topic_hhp' }
          ]
        }
      ]
    },
    {
      id: 'week_4',
      weekNumber: 'Tuần 4',
      title: 'Hình học không gian',
      expanded: false,
      topics: [
        {
          id: 'lp_topic_8',
          title: 'Quan hệ song song & Thể tích khối chóp',
          status: 'locked',
          description: 'Đường thẳng song song mặt phẳng, giao tuyến hai mặt phẳng và tính thể tích hình chóp.',
          goals: [
            'Vẽ hình không gian đúng quy tắc nét liền - nét đứt',
            'Tìm giao tuyến của hai mặt phẳng trong hình chóp'
          ],
          tasks: [
            { id: 't8_1', title: 'Bài giảng lý thuyết: Đại cương Hình học không gian', type: 'theory', completed: false, duration: '20 phút' },
            { id: 't8_2', title: 'Luyện tập Hình không gian', type: 'practice', completed: false, duration: '25 phút', linkedTopicId: 'topic_hhkg' }
          ]
        }
      ]
    }
  ]
};
