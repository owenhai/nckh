/**
 * BỘ KHUNG 3 TẦNG SOCRATIC GUARDRAIL HARNESS (TÍCH HỢP TRỰC TIẾP TRONG FRONTEND)
 * Đề tài NCKH 2026-2027 (Thành viên M5): Socratic Guardrail Harness - Ngăn chặn LLM đưa ra đáp án trực tiếp.
 *
 * Gồm 3 tầng xử lý khép kín:
 * - Tầng 1 (`inspectLayer1Input`): Chặn Unicode Smuggling, Prompt Injection, Roleplay Bypass & điều hướng khi đòi đáp án.
 * - Tầng 2 (`generateLayer2Socratic`): Theo dõi cấp độ gợi ý (Level 0 -> 3, khóa Level 4) & chống Scaffolding Collapse.
 * - Tầng 3 (`superviseLayer3Output`): Kiểm soát đầu ra độc lập theo 3 Hợp đồng Sư phạm (C1, C2, C3) & tự động viết lại.
 */

// ============================================================================
// TẦNG 1: INPUT GUARDRAIL
// ============================================================================
export function decodeUnicodeTags(text) {
  let hidden = '';
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp >= 0xe0020 && cp <= 0xe007e) {
      hidden += String.fromCodePoint(cp - 0xe0000);
    }
  }
  return hidden;
}

export function inspectLayer1Input(rawText) {
  const hiddenPayload = decodeUnicodeTags(rawText);
  const smugglingRegex = /[\u200b-\u200f\u202a-\u202e\u2060-\u2069\ufeff\u{e0000}-\u{e007f}]/gu;
  const matches = rawText.match(smugglingRegex) || [];
  const sanitized = rawText.replace(smugglingRegex, '').normalize('NFKC').trim();

  // 1. Kiểm tra Unicode Smuggling
  if (hiddenPayload.length > 0 || matches.length >= 3) {
    return {
      sanitizedText: sanitized,
      category: 'UNICODE_SMUGGLING',
      action: 'BLOCK_AND_REFUSE',
      riskScore: 0.98,
      badgeText: '🛡️ Tầng 1: Chặn Unicode Smuggling',
      badgeTone: 'rose',
      refusalResponse:
        'Hệ thống phát hiện các ký tự điều khiển ẩn bất thường trong tin nhắn của bạn. Mình đã làm sạch câu hỏi — bạn hãy cho mình biết bạn đang vướng ở bước biến đổi nào để chúng ta cùng tháo gỡ nhé!'
    };
  }

  // 2. Kiểm tra Prompt Injection / System Override
  const injectionRegex =
    /(bỏ\s*qua|quên\s*hết|xóa\s*bỏ|hủy\s*bỏ|không\s*tuân\s*theo)\s+(mọi\s+|tất\s*cả\s+|các\s+)?(hướng\s*dẫn|quy\s*tắc|lệnh|rào\s*chắn|yêu\s*cầu)|(ignore|disregard|bypass|override)\s+(all\s+|previous\s+|system\s+)?(instructions?|rules?|prompts?)|(developer\s*mode|dan\s*mode|jailbreak|system\s*prompt|in\s*ra\s*system\s*prompt)/i;

  if (injectionRegex.test(sanitized)) {
    return {
      sanitizedText: sanitized,
      category: 'PROMPT_INJECTION',
      action: 'BLOCK_AND_REFUSE',
      riskScore: 0.95,
      badgeText: '🛡️ Tầng 1: Chặn Prompt Injection',
      badgeTone: 'rose',
      refusalResponse:
        'Mình là Gia sư Socratic nên không thể bỏ qua nguyên tắc sư phạm để đưa đáp án trực tiếp. Thay vì giải hộ toàn bộ, mình sẽ đồng hành cùng bạn từng bước nhé! Trước tiên, bạn hãy cho mình biết bài toán này cho những dữ kiện gì và yêu cầu tìm gì?'
    };
  }

  // 3. Kiểm tra Roleplay / Authority Bypass (giả danh giáo viên, v.v.)
  const bypassRegex =
    /((tôi|mình|anh|chị|thầy|cô)\s+là\s+(giáo\s*viên|giảng\s*viên|người\s*ra\s*đề|admin).*(đáp\s*án|lời\s*giải|chấm\s*bài|đối\s*chiếu))|((đóng\s*vai|giả\s*vờ\s*là|act\s*as)\s+(một\s+)?(máy\s*tính|cỗ\s*máy\s*giải\s*toán|solver|calculator))/i;

  if (bypassRegex.test(sanitized)) {
    return {
      sanitizedText: sanitized,
      category: 'ROLEPLAY_BYPASS',
      action: 'BLOCK_AND_REFUSE',
      riskScore: 0.9,
      badgeText: '🛡️ Tầng 1: Chặn Roleplay Bypass',
      badgeTone: 'rose',
      refusalResponse:
        'Dù trong ngữ cảnh đối chiếu đáp án hay kiểm tra nhanh, chế độ Gia sư Socratic vẫn được khóa để bảo vệ quy trình tư duy từng bước. Nếu bạn đã có hướng giải hoặc kết quả nháp, hãy nhập cách làm đó vào đây — mình sẽ xác nhận ngay xem bước đó đúng hay chưa nhé!'
    };
  }

  // 4. Kiểm tra đòi đáp án trực tiếp (Direct Answer Demand)
  const directDemandRegex =
    /(đừng\s*hỏi\s*(nữa|ngược\s*lại)|không\s*cần\s*gợi\s*ý|đừng\s*vòng\s*vo)|((cho|đưa|viết|nói)\s*(luôn|ngay)?\s*(đáp\s*án|kết\s*quả\s*cuối|lời\s*giải\s*chi\s*tiết))|(giải\s*(hộ|giúp|chi\s*tiết|trọn\s*vẹn|từ\s*a\s*đến\s*z|luôn)\s*(cho\s*em|cho\s*mình|đi))/i;

  if (directDemandRegex.test(sanitized)) {
    return {
      sanitizedText: sanitized,
      category: 'DIRECT_ANSWER_DEMAND',
      action: 'ALLOW_WITH_STEERING',
      riskScore: 0.65,
      badgeText: '⚠️ Tầng 1: Khóa Socratic (Từ chối giải hộ)',
      badgeTone: 'amber',
      steeringNote:
        '[CẢNH BÁO TẦNG 1 - SOCRATIC LOCK]: Người học đang đòi đáp án trực tiếp. Không giải hộ, chỉ đặt câu hỏi gợi mở bước 1.'
    };
  }

  return {
    sanitizedText: sanitized,
    category: 'SAFE_LEARNING',
    action: 'ALLOW',
    riskScore: 0.05,
    badgeText: '✅ Tầng 1: Hợp lệ',
    badgeTone: 'emerald'
  };
}

// ============================================================================
// TẦNG 2: SOCRATIC GENERATOR & CHỐNG SCAFFOLDING COLLAPSE
// ============================================================================
export function isConfusionSignal(text) {
  const lowered = text.toLowerCase();
  const signals = [
    'không biết',
    'chưa hiểu',
    'bí rồi',
    'khó quá',
    'gợi ý',
    'làm sao tiếp',
    'em chịu',
    'bối rối',
    'không ra',
    'sai ở đâu'
  ];
  return signals.some((s) => lowered.includes(s));
}

export function generateLayer2Socratic(sanitizedText, activeProblem, layer1Result, history = [], quickType = null) {
  const normalized = sanitizedText.toLowerCase();

  // Đếm số lần người học bị bí trong lịch sử để tính cấp độ gợi ý (Level 0 -> 3, khóa trần ở 3)
  const priorStuckCount = history.filter(
    (m) => m.sender === 'student' && isConfusionSignal(m.text || '')
  ).length;
  const activeHintLevel = Math.min(priorStuckCount, 3);

  // Nếu bấm nút Quick Prompt (Gợi ý / Khái niệm / Ví dụ / Bối rối)
  if (quickType && activeProblem.quickResponses && activeProblem.quickResponses[quickType]) {
    return {
      rawReply: activeProblem.quickResponses[quickType],
      hintLevel: activeHintLevel,
      studentSolved: false
    };
  }

  // Nếu Tầng 1 phát hiện đòi đáp án trực tiếp -> Phản hồi điều hướng Socratic
  if (layer1Result.action === 'ALLOW_WITH_STEERING') {
    return {
      rawReply: `Mình hiểu bạn muốn có kết quả nhanh, nhưng tự tìm ra đáp án sẽ giúp bạn nhớ lâu hơn nhiều! 💡 Với đề bài "${activeProblem.statement}", bạn hãy quan sát vế trái xem hằng số nào đang đi kèm với cụm chứa ẩn số?`,
      hintLevel: activeHintLevel,
      studentSolved: false
    };
  }

  // Mô phỏng kịch bản Tầng 2 lỡ làm lộ đáp án theo ĐÚNG bài toán đang chọn để kiểm thử Tầng 3 cắt gọt & viết lại
  if (normalized.includes('test tầng 3') || normalized.includes('ép lộ nghiệm')) {
    if (activeProblem.id === 'prob_ineq_1' || activeProblem.statement.includes('3x - 5 < 10')) {
      return {
        rawReply:
          'Bạn cộng 5 vào cả hai vế để được 3x < 10 + 5 = 15. Chia hai vế cho 3 ta được x < 5. Vậy nghiệm của bất phương trình là x < 5.',
        hintLevel: activeHintLevel,
        studentSolved: false
      };
    }
    if (activeProblem.id === 'prob_quad_1' || activeProblem.statement.includes('x^2 - 5x + 6')) {
      return {
        rawReply:
          'Ta tính biệt thức Δ = (-5)² - 4·1·6 = 25 - 24 = 1 > 0. Vậy nghiệm của phương trình là x = 2 và x = 3.',
        hintLevel: activeHintLevel,
        studentSolved: false
      };
    }
    return {
      rawReply:
        'Bạn chuyển 5 sang vế phải và đổi dấu thành 15 - 5 = 10. Chia cho 2 thì ta được x = 5. Vậy nghiệm của phương trình là x = 5.',
      hintLevel: activeHintLevel,
      studentSolved: false
    };
  }

  // Kiểm tra theo từng bài toán trong `mathtutor-ai`
  if (activeProblem.id === 'prob_linear_1' || activeProblem.statement.includes('2x + 5 = 15')) {
    if (/\bx\s*=\s*5\b/.test(normalized) || normalized === '5') {
      return {
        rawReply:
          'Xuất sắc! 🏆 Đáp án `x = 5` hoàn toàn chính xác. Kiểm tra lại: `2(5) + 5 = 10 + 5 = 15` (Đúng). Bạn đã nắm rất vững quy tắc chuyển vế và chia hệ số rồi đấy!',
        hintLevel: 4,
        studentSolved: true
      };
    }
    if (normalized.includes('trừ 5') || normalized.includes('- 5') || normalized.includes('15 - 5') || normalized.includes('chuyển 5')) {
      return {
        rawReply:
          'Chính xác! 🎉 Khi lấy cả hai vế trừ đi 5 (hoặc chuyển +5 sang vế phải thành -5), ta được phương trình trung gian: `2x = 10`. Bước tiếp theo để tìm `x` là gì nhỉ?',
        hintLevel: Math.max(activeHintLevel, 2),
        studentSolved: false
      };
    }
    if (normalized.includes('2x = 10') || normalized.includes('2x=10') || normalized === '10') {
      return {
        rawReply:
          'Đúng rồi! Bạn đã rút gọn được `2x = 10`. Bây giờ chỉ còn một bước cuối cùng: làm thế nào để tìm được `x`?',
        hintLevel: 3,
        studentSolved: false
      };
    }
    if (normalized.includes('chia')) {
      return {
        rawReply:
          'Gợi ý nhỏ: Nếu chia cho 2 ngay lúc đầu thì ta phải chia cả `5` cho `2` (`5/2 = 2.5`) sẽ hơi lẻ. Bạn thử xử lý số `+ 5` bằng phép trừ ở cả hai vế trước thì vế phải còn bao nhiêu?',
        hintLevel: Math.max(activeHintLevel, 1),
        studentSolved: false
      };
    }
  }

  if (activeProblem.id === 'prob_ineq_1' || activeProblem.statement.includes('3x - 5 < 10')) {
    if (normalized.includes('x < 5') || normalized.includes('x<5')) {
      return {
        rawReply:
          'Hoàn toàn chính xác! 🎯 Vì 3 > 0 nên chiều bất phương trình giữ nguyên, ta có nghiệm `x < 5`. Bạn làm tốt lắm!',
        hintLevel: 4,
        studentSolved: true
      };
    }
    if (normalized.includes('cộng 5') || normalized.includes('+ 5') || normalized.includes('3x < 15') || normalized.includes('3x<15')) {
      return {
        rawReply:
          'Tuyệt vời! 👍 Khi cộng 5 vào cả hai vế, ta được `3x < 15`. Tiếp theo, khi chia hai vế cho `3` (một số dương), chiều của bất phương trình có đổi không và kết quả là gì?',
        hintLevel: Math.max(activeHintLevel, 2),
        studentSolved: false
      };
    }
  }

  if (activeProblem.id === 'prob_quad_1' || activeProblem.statement.includes('x^2 - 5x + 6')) {
    if ((normalized.includes('2') && normalized.includes('3')) || normalized.includes('x=2') || normalized.includes('x = 2')) {
      return {
        rawReply:
          'Quá chuẩn! 🌟 Hai nghiệm của phương trình chính là `x₁ = 2` và `x₂ = 3` (vì `2 + 3 = 5` và `2 · 3 = 6`). Bạn đã hoàn thành bài toán!',
        hintLevel: 4,
        studentSolved: true
      };
    }
    if (normalized.includes('delta') || normalized.includes('biệt thức') || normalized.includes('25 - 24') || normalized === '1') {
      return {
        rawReply:
          'Rất tốt! 💡 Biệt thức `Δ = (-5)² - 4·1·6 = 25 - 24 = 1 > 0`. Vậy phương trình có 2 nghiệm phân biệt được tính theo công thức `x = (-b ± √Δ) / (2a)`. Bạn tính ra hai nghiệm bằng bao nhiêu?',
        hintLevel: Math.max(activeHintLevel, 2),
        studentSolved: false
      };
    }
  }

  // Phản hồi theo 4 nấc HintLevel (Chống Scaffolding Collapse: không bao giờ vượt quá Level 3 khi học sinh chưa giải ra)
  const stepPrompts = [
    `Đây là bước khởi đầu cho bài "${activeProblem.statement}". Theo bạn, ẩn số cần tìm ở đây là gì và hằng số nào đang đi kèm với nó?`,
    'Gợi ý khái niệm (Level 1): Hãy nhớ lại **quy tắc chuyển vế đổi dấu** (hoặc dùng phép toán ngược). Bạn sẽ dùng phép tính cộng hay trừ để làm gọn vế trái?',
    'Gợi ý cụ thể (Level 2): Bạn hãy thử chuyển hằng số tự do ở vế trái sang vế phải (nhớ đổi dấu) rồi tính xem vế phải bằng bao nhiêu?',
    'Bước trung gian (Level 3 - Khóa chống Scaffolding Collapse): Sau khi rút gọn hằng số ở hai vế, bạn chỉ cần chia cả hai vế cho hệ số đi kèm với `x`. Kết quả phép chia đó của bạn là bao nhiêu?'
  ];

  return {
    rawReply: stepPrompts[activeHintLevel] || stepPrompts[0],
    hintLevel: activeHintLevel,
    studentSolved: false
  };
}

// ============================================================================
// TẦNG 3: CONTRACT-BASED OUTPUT SUPERVISOR (ĐỘC LẬP VĂN BẢN NGƯỜI DÙNG)
// ============================================================================
export function superviseLayer3Output(candidateResponse, activeProblem, hintLevel = 0, studentSolved = false) {
  if (studentSolved || hintLevel === 4) {
    return {
      finalResponse: candidateResponse,
      rewritten: false,
      violations: [],
      badgeText: '🏆 Đã hoàn thành bài toán (Mở khóa Level 4)'
    };
  }

  const violations = [];
  const leakRegex = /(vậy\s+nghiệm.*là|\bx\s*=\s*5\b|\bx\s*<\s*5\b|\bx\s*=\s*2\b|\bx\s*=\s*3\b|đáp\s*số\s*[:=])/i;
  const multiStepRegex = /(⇔.*⇔.*⇔|=>.*=>.*=>)/i;

  if (leakRegex.test(candidateResponse)) {
    violations.push('C1_ANSWER_LEAKAGE');
  }
  if (multiStepRegex.test(candidateResponse)) {
    violations.push('C2_FULL_SOLUTION_DUMP');
  }
  if (!candidateResponse.includes('?')) {
    violations.push('C3_MISSING_QUESTION');
  }

  if (violations.length === 0) {
    return {
      finalResponse: candidateResponse,
      rewritten: false,
      violations: [],
      badgeText: `🔒 Tầng 2 (Level ${hintLevel}) • Tầng 3: Đạt chuẩn Socratic (C1–C3)`
    };
  }

  // Nếu phát hiện rò rỉ đáp án (C1 hoặc C2) -> Cắt bỏ câu lộ nghiệm và viết lại thành câu hỏi Socratic
  if (violations.includes('C1_ANSWER_LEAKAGE') || violations.includes('C2_FULL_SOLUTION_DUMP')) {
    const sentences = candidateResponse.split(/(?<=[.?!])\s+/);
    const safeSentences = sentences.filter((s) => !leakRegex.test(s) && !multiStepRegex.test(s));
    const prefix = safeSentences.length > 0 ? safeSentences[0] : `Chúng ta hãy đi từng bước cho bài "${activeProblem.statement}" nhé!`;
    const rewrittenText = `${prefix} Đến bước này, nếu bạn tự thực hiện phép tính tiếp theo cho cả hai vế thì kết quả trung gian sẽ là bao nhiêu?`;

    return {
      finalResponse: rewrittenText,
      rewritten: true,
      violations,
      badgeText: `🛡️ Tầng 3: Đã chặn lộ đáp án (${violations.join(', ')}) & Viết lại Socratic`
    };
  }

  // Nếu chỉ thiếu câu hỏi gợi mở (C3)
  return {
    finalResponse: `${candidateResponse.trim()} Theo bạn, bước tiếp theo chúng ta nên thực hiện phép tính nào?`,
    rewritten: true,
    violations,
    badgeText: '🛡️ Tầng 3: Đã bổ sung câu hỏi gợi mở (C3)'
  };
}

// ============================================================================
// HÀM TỔNG HỢP CHẠY ĐỦ 3 TẦNG (DÙNG TRỰC TIẾP TRONG `TutorPage.jsx`)
// ============================================================================
export function runSocraticGuardrailHarness(inputText, activeProblem, history = [], quickType = null) {
  // 1. Chạy Tầng 1
  const l1 = inspectLayer1Input(inputText);
  if (l1.action === 'BLOCK_AND_REFUSE') {
    return {
      reply: l1.refusalResponse,
      hintLevel: 0,
      blockedAtLayer1: true,
      rewrittenAtLayer3: false,
      guardrailBadge: l1.badgeText,
      guardrailTone: l1.badgeTone
    };
  }

  // 2. Chạy Tầng 2
  const l2 = generateLayer2Socratic(l1.sanitizedText, activeProblem, l1, history, quickType);

  // 3. Chạy Tầng 3
  const l3 = superviseLayer3Output(l2.rawReply, activeProblem, l2.hintLevel, l2.studentSolved);

  let badge = l3.badgeText;
  let tone = l3.rewritten ? 'amber' : 'emerald';
  if (l1.action === 'ALLOW_WITH_STEERING') {
    badge = `${l1.badgeText} → Level ${l2.hintLevel}`;
    tone = 'amber';
  }

  return {
    reply: l3.finalResponse,
    hintLevel: l2.hintLevel,
    blockedAtLayer1: false,
    rewrittenAtLayer3: l3.rewritten,
    guardrailBadge: badge,
    guardrailTone: tone
  };
}

export function evaluateSocraticInput(inputText, activeProblem, history = [], quickType = null) {
  return runSocraticGuardrailHarness(inputText, activeProblem, history, quickType).reply;
}
