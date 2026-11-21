export const tutorProblems = [
  {
    id: 'prob_linear_1',
    title: 'Phương trình bậc nhất một ẩn',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    statement: 'Giải phương trình: 2x + 5 = 15',
    latex: '2x + 5 = 15',
    initialMessages: [
      {
        id: 'm1',
        sender: 'ai',
        time: '10:24',
        text: 'Đây là một phương trình bậc nhất. Theo bạn, chúng ta nên làm gì đầu tiên để tìm x?'
      },
      {
        id: 'm2',
        sender: 'student',
        time: '10:25',
        text: 'Chia cả hai vế cho 2?'
      },
      {
        id: 'm3',
        sender: 'ai',
        time: '10:25',
        text: 'Ý tưởng của bạn khá hợp lý! 💡\nTuy nhiên, trước khi chia cho 2, chúng ta có cần xử lý số 5 ở phía bên trái không?'
      }
    ],
    hintSteps: [
      {
        level: 0,
        badgeColor: 'emerald',
        title: 'Câu hỏi định hướng',
        content: 'Bạn nên làm gì với số 5?',
        detail: 'Để cô lập cụm chứa ẩn 2x ở vế trái, hãy quan sát hằng số +5 đang đi kèm với 2x.'
      },
      {
        level: 1,
        badgeColor: 'blue',
        title: 'Gợi ý khái niệm',
        content: 'Hãy nghĩ về phép toán ngược với phép cộng.',
        detail: 'Quy tắc chuyển vế: Khi chuyển một hạng tử từ vế này sang vế kia của phương trình, ta phải đổi dấu hạng tử đó.'
      },
      {
        level: 2,
        badgeColor: 'amber',
        title: 'Gợi ý cụ thể hơn',
        content: 'Hãy thử trừ 5 ở cả hai vế.',
        detail: 'Thực hiện: 2x + 5 - 5 = 15 - 5.'
      },
      {
        level: 3,
        badgeColor: 'orange',
        title: 'Bước trung gian',
        content: 'Sau khi trừ 5, ta được 2x = 10. Tiếp theo làm gì?',
        detail: 'Lúc này hệ số của x là 2. Hãy chia cả hai vế của phương trình cho 2.'
      },
      {
        level: 4,
        badgeColor: 'rose',
        title: 'Lời giải đầy đủ',
        content: 'x = 5',
        detail: 'Trình bày hoàn chỉnh: 2x + 5 = 15 ⇔ 2x = 15 - 5 ⇔ 2x = 10 ⇔ x = 10 : 2 ⇔ x = 5. Vậy nghiệm của phương trình là x = 5.'
      }
    ],
    quickResponses: {
      hint: 'Hãy nhìn vào vế trái `2x + 5`. Trước khi chia cho 2, bạn hãy thử làm mất số `+ 5` bằng cách trừ cả hai vế cho 5 nhé! Khi lấy `15 - 5`, vế phải sẽ bằng bao nhiêu?',
      concept: '**Khái niệm cốt lõi (Quy tắc giải phương trình bậc nhất ax + b = c):**\n1. Dùng phép cộng/trừ (chuyển vế đổi dấu) để đưa các hạng tử tự do về một vế: `ax = c - b`.\n2. Dùng phép chia cho hệ số `a` (với `a ≠ 0`) để tìm ẩn: `x = (c - b) / a`.',
      example: '**Ví dụ tương tự:** Giải phương trình `3x + 4 = 19`.\n- Bước 1: Trừ 4 ở cả hai vế → `3x = 19 - 4 = 15`.\n- Bước 2: Chia cả hai vế cho 3 → `x = 15 / 3 = 5`.\nBây giờ bạn áp dụng tương tự cho `2x + 5 = 15` nhé!',
      confused: 'Đừng lo lắng, mình đi thật chậm nhé! 🌟\nHãy tưởng tượng `2x` là 2 chiếc hộp giống nhau, cộng thêm `5` viên bi thì bằng `15` viên bi. Nếu bạn bớt đi `5` viên bi ở cả hai bên, thì 2 chiếc hộp `2x` sẽ tương ứng với bao nhiêu viên bi?'
    }
  },
  {
    id: 'prob_ineq_1',
    title: 'Bất phương trình bậc nhất',
    category: 'Đại số',
    difficulty: 'Trung bình',
    statement: 'Giải bất phương trình sau: 3x - 5 < 10',
    latex: '3x - 5 < 10',
    initialMessages: [
      {
        id: 'm201',
        sender: 'ai',
        time: '14:10',
        text: 'Chào Minh! Với bất phương trình 3x - 5 < 10, bước đầu tiên để cô lập cụm 3x ở vế trái là gì nhỉ?'
      }
    ],
    hintSteps: [
      {
        level: 0,
        badgeColor: 'emerald',
        title: 'Câu hỏi định hướng',
        content: 'Làm sao để triệt tiêu -5 ở vế trái?',
        detail: 'Quan sát phép trừ 5 ở vế trái bất phương trình.'
      },
      {
        level: 1,
        badgeColor: 'blue',
        title: 'Gợi ý khái niệm',
        content: 'Cộng cả hai vế với cùng một số không làm đổi chiều bất phương trình.',
        detail: 'Nếu a < b thì a + c < b + c.'
      },
      {
        level: 2,
        badgeColor: 'amber',
        title: 'Gợi ý cụ thể hơn',
        content: 'Hãy cộng 5 vào cả hai vế của bất phương trình.',
        detail: '3x - 5 + 5 < 10 + 5'
      },
      {
        level: 3,
        badgeColor: 'orange',
        title: 'Bước trung gian',
        content: 'Ta được 3x < 15. Hãy chia cả hai vế cho 3 (số dương).',
        detail: 'Vì 3 > 0 nên chiều bất phương trình giữ nguyên.'
      },
      {
        level: 4,
        badgeColor: 'rose',
        title: 'Lời giải đầy đủ',
        content: 'x < 5',
        detail: '3x - 5 < 10 ⇔ 3x < 15 ⇔ x < 5. Tập nghiệm S = (-∞; 5).'
      }
    ],
    quickResponses: {
      hint: 'Để làm mất `- 5` ở vế trái của `3x - 5 < 10`, bạn hãy cộng `5` vào cả hai vế nhé. Khi đó `10 + 5` bằng bao nhiêu?',
      concept: '**Lưu ý quan trọng về Bất phương trình:**\n- Khi cộng hoặc trừ hai vế với cùng một số: chiều BPT **giữ nguyên**.\n- Khi nhân hoặc chia hai vế cho số **dương**: chiều BPT **giữ nguyên**.\n- Khi nhân hoặc chia hai vế cho số **âm**: phải **đổi chiều** BPT!',
      example: '**Ví dụ tương tự:** Giải `2x - 3 < 7`.\n- Cộng 3 hai vế: `2x < 10`.\n- Chia hai vế cho 2 (dương): `x < 5`.',
      confused: 'Mình tách từng bước nhỏ nhé: ở vế trái đang có `3x - 5`. Muốn mất `- 5` thì ta làm phép tính ngược lại là `+ 5`. Vậy vế phải `10 + 5` sẽ ra kết quả bao nhiêu?'
    }
  },
  {
    id: 'prob_quad_1',
    title: 'Phương trình bậc hai một ẩn',
    category: 'Đại số',
    difficulty: 'Trung bình',
    statement: 'Giải phương trình bậc hai: x² - 5x + 6 = 0',
    latex: 'x^2 - 5x + 6 = 0',
    initialMessages: [
      {
        id: 'm301',
        sender: 'ai',
        time: '15:00',
        text: 'Đây là phương trình bậc hai dạng chuẩn ax² + bx + c = 0. Bạn có thể xác định các hệ số a, b, c hoặc tìm hai số có tổng bằng 5 và tích bằng 6 không?'
      }
    ],
    hintSteps: [
      {
        level: 0,
        badgeColor: 'emerald',
        title: 'Câu hỏi định hướng',
        content: 'Hệ số a, b, c của phương trình là bao nhiêu?',
        detail: 'So sánh x² - 5x + 6 = 0 với ax² + bx + c = 0.'
      },
      {
        level: 1,
        badgeColor: 'blue',
        title: 'Gợi ý khái niệm',
        content: 'Sử dụng công thức biệt thức Δ = b² - 4ac hoặc phân tích thành nhân tử.',
        detail: 'Với a = 1, b = -5, c = 6.'
      },
      {
        level: 2,
        badgeColor: 'amber',
        title: 'Gợi ý cụ thể hơn',
        content: 'Tính Δ = (-5)² - 4.1.6.',
        detail: 'Δ = 25 - 24 = 1 > 0.'
      },
      {
        level: 3,
        badgeColor: 'orange',
        title: 'Bước trung gian',
        content: 'Δ = 1 > 0 nên phương trình có 2 nghiệm phân biệt: x = (-b ± √Δ) / (2a).',
        detail: 'Thay b = -5, √Δ = 1, a = 1 vào công thức.'
      },
      {
        level: 4,
        badgeColor: 'rose',
        title: 'Lời giải đầy đủ',
        content: 'x₁ = 2; x₂ = 3',
        detail: 'Ta có (x - 2)(x - 3) = 0 ⇔ x = 2 hoặc x = 3. Tập nghiệm S = {2; 3}.'
      }
    ],
    quickResponses: {
      hint: 'Hãy xác định hệ số: `a = 1`, `b = -5`, `c = 6`. Bây giờ bạn thử tính `Δ = b² - 4ac = (-5)² - 4·1·6` xem bằng bao nhiêu nhé!',
      concept: '**Công thức nghiệm phương trình bậc hai ax² + bx + c = 0 (a ≠ 0):**\nTính biệt thức `Δ = b² - 4ac`:\n- Nếu `Δ < 0`: Phương trình vô nghiệm.\n- Nếu `Δ = 0`: Nghiệm kép `x = -b / (2a)`.\n- Nếu `Δ > 0`: Hai nghiệm phân biệt `x₁,₂ = (-b ± √Δ) / (2a)`.',
      example: '**Ví dụ tương tự:** `x² - 4x + 3 = 0`.\nTa có `Δ = (-4)² - 4·1·3 = 16 - 12 = 4 > 0`.\nSuy ra `x₁ = (4 - 2)/2 = 1` và `x₂ = (4 + 2)/2 = 3`.',
      confused: 'Cách nhanh hơn nữa nhé: bạn hãy tìm 2 số tự nhiên nào mà khi **cộng lại bằng 5** và khi **nhân với nhau bằng 6**? Đó chính là hai nghiệm của phương trình đấy!'
    }
  }
];
