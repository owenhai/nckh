import React, { useState } from 'react';
import {
  BookOpenCheck,
  Search,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Calculator,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { DifficultyDotBadge } from '../components/common/CommonComponents';

const PRACTICE_TABS = ['Tất cả', 'Đề xuất cho bạn', 'Đại số', 'Hình học', 'Số học', 'Thống kê'];

export function PracticePage({
  profile,
  topics,
  questions,
  selectedTopicFilter,
  onSelectTopicFilter,
  onRecordPracticeAnswer,
  onSendProblemToTutor,
  onNavigate,
  showToast
}) {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [difficultyFilter, setDifficultyFilter] = useState('Tất cả');
  const [searchText, setSearchText] = useState('');
  const [activeQuestionId, setActiveQuestionId] = useState('q_bpt_1');
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Filter topics list on the left
  const filteredTopics = topics.filter((t) => {
    if (activeCategory === 'Đề xuất cho bạn' && !t.recommended) return false;
    if (
      activeCategory !== 'Tất cả' &&
      activeCategory !== 'Đề xuất cho bạn' &&
      t.category !== activeCategory
    ) {
      return false;
    }
    if (difficultyFilter !== 'Tất cả' && t.difficulty !== difficultyFilter) {
      return false;
    }
    if (searchText.trim() && !t.title.toLowerCase().includes(searchText.trim().toLowerCase())) {
      return false;
    }
    return true;
  });

  // Questions pool for the active quiz card on the right
  const topicQuestions = selectedTopicFilter
    ? questions.filter((q) => q.topicId === selectedTopicFilter)
    : questions;

  const currentQuestion =
    topicQuestions.find((q) => q.id === activeQuestionId) ||
    topicQuestions[0] ||
    questions[0];

  const handleStartTopic = (topic) => {
    onSelectTopicFilter(topic.id);
    const firstQ = questions.find((q) => q.topicId === topic.id);
    if (firstQ) {
      setActiveQuestionId(firstQ.id);
    }
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowHint(false);
    showToast(`Đang mở bài tập chủ đề: ${topic.title}`, 'info');
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) {
      showToast('Vui lòng chọn một đáp án A, B, C hoặc D trước khi kiểm tra!', 'error');
      return;
    }
    if (isSubmitted) return;
    const isCorrect = selectedOption === currentQuestion.correctOption;
    setIsSubmitted(true);
    onRecordPracticeAnswer(currentQuestion.topicId, isCorrect);
    if (isCorrect) {
      showToast('Chính xác! Điểm thành thạo và số bài đúng đã được cập nhật.', 'success');
    } else {
      showToast('Chưa chính xác. Hãy xem lời giải thích chi tiết bên dưới nhé!', 'info');
    }
  };

  const handleNextQuestion = () => {
    const idx = topicQuestions.findIndex((q) => q.id === currentQuestion.id);
    const nextQ = topicQuestions[(idx + 1) % topicQuestions.length];
    setActiveQuestionId(nextQ.id);
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowHint(false);
  };

  const accuracyPercent =
    profile.completedExercises > 0
      ? Math.round((profile.correctExercises / profile.completedExercises) * 100)
      : 85;

  return (
    <div className="space-y-5">
      {/* Header Banner matching Screen 4 */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <BookOpenCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Luyện tập</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bài tập được cá nhân hóa theo năng lực của bạn.
              </p>
            </div>
          </div>

          {/* Search & Difficulty Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Tìm chủ đề..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              aria-label="Lọc theo độ khó"
              className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-200"
            >
              <option value="Tất cả">Mọi cấp độ</option>
              <option value="Dễ">Cấp độ: Dễ</option>
              <option value="Trung bình">Cấp độ: Trung bình</option>
              <option value="Khó">Cấp độ: Khó</option>
            </select>
          </div>
        </div>

        {/* 6 Category Tabs matching Screen 4 */}
        <div className="flex flex-wrap gap-2 pt-1">
          {PRACTICE_TABS.map((tab) => {
            const active = activeCategory === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveCategory(tab);
                  onSelectTopicFilter(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Layout matching Screen 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 6 cols: Topic Cards List */}
        <div className="lg:col-span-6 space-y-3">
          {filteredTopics.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center space-y-2">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Không tìm thấy chủ đề phù hợp
              </p>
              <p className="text-xs text-slate-400">
                Hãy thử đổi bộ lọc độ khó hoặc từ khóa tìm kiếm.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('Tất cả');
                  setDifficultyFilter('Tất cả');
                  setSearchText('');
                }}
                className="mt-2 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const isSelected = selectedTopicFilter === topic.id;
              return (
                <div
                  key={topic.id}
                  className={`bg-white dark:bg-slate-800 border rounded-2xl p-4 shadow-xs transition-all flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/15'
                      : 'border-slate-200/80 dark:border-slate-700 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate">
                        {topic.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {topic.exerciseCount} bài
                        </span>
                        <span className="text-slate-300">•</span>
                        <DifficultyDotBadge difficulty={topic.difficulty} />
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                          Thành thạo: {topic.mastery}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartTopic(topic)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shrink-0 shadow-xs transition-colors"
                  >
                    Làm bài
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Right 6 cols: Bài tập đề xuất cho bạn (Interactive Quiz) + Thống kê luyện tập */}
        <div className="lg:col-span-6 space-y-5">
          {/* Top Card: Bài tập đề xuất cho bạn */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Bài tập đề xuất cho bạn
                </span>
                <h2 className="text-base font-bold text-slate-800 dark:text-white mt-0.5">
                  Chủ đề: {currentQuestion.topicTitle}
                </h2>
              </div>
              <DifficultyDotBadge difficulty={currentQuestion.difficulty} />
            </div>

            {/* Problem box matching Screen 4: Giải bất phương trình sau: 3x - 5 < 10 */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-700 space-y-1.5">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentQuestion.question}
              </p>
              <div className="text-xl font-bold text-slate-900 dark:text-white math-expr">
                {currentQuestion.formula}
              </div>
            </div>

            {/* Multiple choice options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQuestion.options.map((opt) => {
                const isPicked = selectedOption === opt.id;
                const isRight = isSubmitted && opt.id === currentQuestion.correctOption;
                const isWrongPick = isSubmitted && isPicked && opt.id !== currentQuestion.correctOption;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isSubmitted}
                    onClick={() => setSelectedOption(opt.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      isRight
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                        : isWrongPick
                        ? 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-800 dark:text-rose-200'
                        : isPicked
                        ? 'bg-blue-50 dark:bg-blue-950 border-blue-600 text-blue-700 dark:text-blue-300'
                        : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <span>
                      <strong className="mr-1.5">{opt.id}.</strong> {opt.text}
                    </span>
                    {isRight && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    {isWrongPick && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Gợi ý Socratic:</strong> {currentQuestion.hint}
                </div>
              </div>
            )}

            {/* Explanation Box after submission */}
            {isSubmitted && (
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-200 space-y-1">
                <div className="font-bold text-blue-700 dark:text-blue-300">
                  Lời giải chi tiết:
                </div>
                <p className="leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Action Buttons matching Screen 4 */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handleCheckAnswer}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Làm bài (Kiểm tra đáp án)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Câu tiếp theo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
              >
                {showHint ? 'Ẩn gợi ý' : 'Xem gợi ý'}
              </button>

              <button
                type="button"
                onClick={() => {
                  onSendProblemToTutor(currentQuestion.question);
                  onNavigate('tutor');
                }}
                className="ml-auto text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hỏi AI Tutor bài này</span>
              </button>
            </div>
          </div>

          {/* Bottom Card: Thống kê luyện tập matching Screen 4 (85% Tỉ lệ đúng | 24 Bài đã làm tuần này | +12% Tiến bộ so với tuần trước) */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Thống kê luyện tập
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('progress')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Xem chi tiết</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {accuracyPercent}%
                </div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mt-1">
                  Tỉ lệ đúng
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900">
                <div className="text-2xl font-bold text-slate-800 dark:text-white">
                  {profile.weeklyExercisesCount}
                </div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mt-1">
                  Bài đã làm tuần này
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  +{profile.weeklyProgressDelta}%
                </div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mt-1">
                  Tiến bộ so với tuần trước
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
