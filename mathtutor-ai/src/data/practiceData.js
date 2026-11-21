export const practiceQuestions = [
  {
    id: 'q_bpt_1',
    topicId: 'topic_bpt',
    topicTitle: 'Bất phương trình',
    category: 'Đại số',
    difficulty: 'Trung bình',
    recommended: true,
    question: 'Giải bất phương trình sau: 3x - 5 < 10',
    formula: '3x - 5 < 10',
    options: [
      { id: 'A', text: 'x < 5' },
      { id: 'B', text: 'x > 5' },
      { id: 'C', text: 'x < 15/3' },
      { id: 'D', text: 'x < 5/3' }
    ],
    correctOption: 'A',
    hint: 'Chuyển -5 sang vế phải và đổi dấu thành +5, sau đó chia cả hai vế cho 3.',
    explanation: 'Ta có: 3x - 5 < 10 ⇔ 3x < 10 + 5 ⇔ 3x < 15. Chia cả hai vế cho 3 (số dương nên giữ nguyên chiều bất phương trình), ta được x < 5.'
  },
  {
    id: 'q_bpt_2',
    topicId: 'topic_bpt',
    topicTitle: 'Bất phương trình',
    category: 'Đại số',
    difficulty: 'Trung bình',
    recommended: true,
    question: 'Tập nghiệm của bất phương trình -2x + 6 ≥ 0 là:',
    formula: '-2x + 6 ≥ 0',
    options: [
      { id: 'A', text: 'x ≥ 3' },
      { id: 'B', text: 'x ≤ 3' },
      { id: 'C', text: 'x ≤ -3' },
      { id: 'D', text: 'x ≥ -3' }
    ],
    correctOption: 'B',
    hint: 'Chú ý: Khi chia cả hai vế của bất phương trình cho số âm (-2), ta phải đổi chiều bất phương trình!',
    explanation: '-2x + 6 ≥ 0 ⇔ -2x ≥ -6. Chia hai vế cho -2 < 0 (đổi chiều ≥ thành ≤): x ≤ (-6)/(-2) ⇔ x ≤ 3.'
  },
  {
    id: 'q_ptb1_1',
    topicId: 'topic_ptb1',
    topicTitle: 'Phương trình bậc nhất',
    category: 'Đại số',
    difficulty: 'Trung bình',
    recommended: true,
    question: 'Tìm nghiệm của phương trình: 2x + 5 = 15',
    formula: '2x + 5 = 15',
    options: [
      { id: 'A', text: 'x = 10' },
      { id: 'B', text: 'x = 5' },
      { id: 'C', text: 'x = 7.5' },
      { id: 'D', text: 'x = -5' }
    ],
    correctOption: 'B',
    hint: 'Trừ cả hai vế cho 5 trước, sau đó chia cho 2.',
    explanation: '2x + 5 = 15 ⇔ 2x = 15 - 5 ⇔ 2x = 10 ⇔ x = 5.'
  },
  {
    id: 'q_ptb1_2',
    topicId: 'topic_ptb1',
    topicTitle: 'Phương trình bậc nhất',
    category: 'Đại số',
    difficulty: 'Dễ',
    recommended: false,
    question: 'Nghiệm của phương trình 4(x - 2) = 12 là:',
    formula: '4(x - 2) = 12',
    options: [
      { id: 'A', text: 'x = 3' },
      { id: 'B', text: 'x = 5' },
      { id: 'C', text: 'x = 4' },
      { id: 'D', text: 'x = 1' }
    ],
    correctOption: 'B',
    hint: 'Chia hai vế cho 4 để tìm (x - 2), rồi cộng thêm 2.',
    explanation: '4(x - 2) = 12 ⇔ x - 2 = 3 ⇔ x = 5.'
  },
  {
    id: 'q_hpt_1',
    topicId: 'topic_hpt',
    topicTitle: 'Hệ phương trình',
    category: 'Đại số',
    difficulty: 'Khó',
    recommended: false,
    question: 'Hệ phương trình { x + y = 7 ; x - y = 1 } có nghiệm (x; y) là:',
    formula: '{ x + y = 7 ; x - y = 1 }',
    options: [
      { id: 'A', text: '(4; 3)' },
      { id: 'B', text: '(3; 4)' },
      { id: 'C', text: '(5; 2)' },
      { id: 'D', text: '(2; 5)' }
    ],
    correctOption: 'A',
    hint: 'Cộng từng vế của hai phương trình để khử ẩn y.',
    explanation: 'Cộng hai phương trình: (x + y) + (x - y) = 7 + 1 ⇔ 2x = 8 ⇔ x = 4. Thay x = 4 vào x + y = 7 được y = 3. Vậy nghiệm là (4; 3).'
  },
  {
    id: 'q_ptb2_1',
    topicId: 'topic_ptb2',
    topicTitle: 'Hàm số bậc hai',
    category: 'Đại số',
    difficulty: 'Trung bình',
    recommended: true,
    question: 'Tọa độ đỉnh I của parabol y = x² - 4x + 3 là:',
    formula: 'y = x² - 4x + 3',
    options: [
      { id: 'A', text: 'I(2; -1)' },
      { id: 'B', text: 'I(-2; 15)' },
      { id: 'C', text: 'I(4; 3)' },
      { id: 'D', text: 'I(1; 0)' }
    ],
    correctOption: 'A',
    hint: 'Hoành độ đỉnh parabol được tính bằng công thức x_I = -b / (2a).',
    explanation: 'Ta có a = 1, b = -4, c = 3. Hoành độ đỉnh x_I = -(-4)/(2·1) = 2. Tung độ đỉnh y_I = 2² - 4·2 + 3 = -1. Vậy đỉnh I(2; -1).'
  },
  {
    id: 'q_hhp_1',
    topicId: 'topic_hhp',
    topicTitle: 'Hình học phẳng',
    category: 'Hình học',
    difficulty: 'Dễ',
    recommended: false,
    question: 'Cho tam giác ABC vuông tại A có AB = 3cm, AC = 4cm. Độ dài cạnh huyền BC là:',
    formula: 'BC = √(AB² + AC²)',
    options: [
      { id: 'A', text: '5 cm' },
      { id: 'B', text: '7 cm' },
      { id: 'C', text: '6 cm' },
      { id: 'D', text: '25 cm' }
    ],
    correctOption: 'A',
    hint: 'Áp dụng định lý Pythagore trong tam giác vuông ABC.',
    explanation: 'Theo định lý Pythagore: BC² = AB² + AC² = 3² + 4² = 9 + 16 = 25 ⇒ BC = 5 cm.'
  },
  {
    id: 'q_hhkg_1',
    topicId: 'topic_hhkg',
    topicTitle: 'Hình học không gian',
    category: 'Hình học',
    difficulty: 'Khó',
    recommended: true,
    question: 'Hình chóp tứ giác đều S.ABCD có diện tích đáy B = 12 cm² và chiều cao h = 5 cm. Thể tích khối chóp là:',
    formula: 'V = (1/3) · B · h',
    options: [
      { id: 'A', text: '60 cm³' },
      { id: 'B', text: '20 cm³' },
      { id: 'C', text: '30 cm³' },
      { id: 'D', text: '15 cm³' }
    ],
    correctOption: 'B',
    hint: 'Công thức thể tích khối chóp: V = 1/3 × Diện tích đáy × Chiều cao.',
    explanation: 'Thể tích khối chóp là V = (1/3) · B · h = (1/3) · 12 · 5 = 20 cm³.'
  },
  {
    id: 'q_sohoc_1',
    topicId: 'topic_sohoc',
    topicTitle: 'Số học & Biểu thức',
    category: 'Số học',
    difficulty: 'Dễ',
    recommended: false,
    question: 'Giá trị rút gọn của biểu thức P = √(49) - √(16) + √(9) là:',
    formula: 'P = √49 - √16 + √9',
    options: [
      { id: 'A', text: '6' },
      { id: 'B', text: '8' },
      { id: 'C', text: '4' },
      { id: 'D', text: '10' }
    ],
    correctOption: 'A',
    hint: 'Tính căn bậc hai số học của từng số: √49 = 7, √16 = 4, √9 = 3.',
    explanation: 'Ta có P = 7 - 4 + 3 = 6.'
  },
  {
    id: 'q_tk_1',
    topicId: 'topic_thongke',
    topicTitle: 'Thống kê & Xác suất',
    category: 'Thống kê',
    difficulty: 'Trung bình',
    recommended: false,
    question: 'Điểm kiểm tra Toán của 5 học sinh là: 7, 8, 9, 6, 10. Điểm trung bình cộng là:',
    formula: 'x̄ = (7 + 8 + 9 + 6 + 10) / 5',
    options: [
      { id: 'A', text: '7.5' },
      { id: 'B', text: '8.0' },
      { id: 'C', text: '8.5' },
      { id: 'D', text: '7.8' }
    ],
    correctOption: 'B',
    hint: 'Cộng tổng 5 điểm số rồi chia cho 5.',
    explanation: 'Tổng điểm là 7 + 8 + 9 + 6 + 10 = 40. Điểm trung bình cộng x̄ = 40 / 5 = 8.0.'
  }
];
