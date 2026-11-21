import React from 'react';
import {
  Bot,
  BookOpenCheck,
  Route,
  Flame,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  Upload
} from 'lucide-react';
import { CircularProgress, ProgressBar } from '../components/common/CommonComponents';

export function HomePage({ profile, topics, onNavigate, onSelectPracticeTopic }) {
  const focusTopics = topics.filter((t) => t.focusNeeded);

  return (
    <div className="space-y-6">
      {/* Top Hero Banner with Greeting, 3 Action Cards, and Student Study Illustration */}
      <div className="bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/40 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
          <div className="xl:col-span-8 space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Không gian học tập cá nhân hóa</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Xin chào, {profile.name}!
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">
                Hôm nay là một ngày tuyệt vời để học toán! 🚀
              </p>
            </div>

            {/* 3 Primary Action Cards matching Reference Screen 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: Giải bài cùng AI */}
              <div className="bg-white dark:bg-slate-900/80 border border-blue-100 dark:border-slate-700 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                    <Bot className="w-6 h-6" />
                  </div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-white">Giải bài cùng AI</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Nhận hướng dẫn từng bước, không chỉ là đáp án trực tiếp.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('tutor')}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    Bắt đầu
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('problem-input')}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    title="Tải ảnh / Nhập bài toán mới"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card 2: Luyện tập */}
              <div className="bg-white dark:bg-slate-900/80 border border-emerald-100 dark:border-slate-700 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                    <BookOpenCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-white">Luyện tập</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Bài tập cá nhân hóa theo năng lực.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('practice')}
                  className="mt-4 w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Làm bài tập
                </button>
              </div>

              {/* Card 3: Lộ trình học */}
              <div className="bg-white dark:bg-slate-900/80 border border-amber-100 dark:border-slate-700 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                    <Route className="w-6 h-6" />
                  </div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-white">Lộ trình học</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Học đúng trọng tâm, tiến bộ mỗi ngày.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('learning-path')}
                  className="mt-4 w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Xem lộ trình
                </button>
              </div>
            </div>
          </div>

          {/* Right Illustration matching Screen 1 */}
          <div className="xl:col-span-4 flex justify-center">
            <div className="relative w-full max-w-xs bg-gradient-to-b from-blue-100/70 to-blue-50/40 dark:from-slate-700/50 dark:to-slate-800/50 rounded-2xl p-5 border border-blue-200/60 dark:border-slate-700 flex flex-col items-center text-center">
              <div className="bg-white dark:bg-slate-800 px-3.5 py-1.5 rounded-2xl shadow-xs border border-blue-100 dark:border-slate-600 text-xs font-bold text-blue-700 dark:text-blue-300 mb-3">
                “Bạn có thể tự làm được!” ✨
              </div>
              <svg viewBox="0 0 220 150" className="w-48 h-36">
                {/* Desk */}
                <rect x="20" y="115" width="180" height="10" rx="5" fill="#93c5fd" />
                {/* Books */}
                <rect x="35" y="95" width="42" height="20" rx="3" fill="#3b82f6" />
                <rect x="38" y="99" width="36" height="4" fill="#eff6ff" />
                <rect x="38" y="106" width="36" height="4" fill="#eff6ff" />
                {/* Student character */}
                <circle cx="125" cy="52" r="20" fill="#fde68a" />
                <path d="M105 48c0-13 9-22 20-22s20 9 20 22c-6-4-13-6-20-6s-14 2-20 6z" fill="#1e293b" />
                <path d="M92 115c4-22 16-34 33-34s29 12 33 34z" fill="#2563eb" />
                {/* Notebook & Pencil */}
                <rect x="95" y="103" width="55" height="12" rx="2" fill="#ffffff" stroke="#60a5fa" strokeWidth="2" />
                <line x1="150" y1="88" x2="135" y2="105" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Phương pháp Socratic gợi mở tư duy độc lập
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Tiến độ tổng quan & Chủ đề cần tập trung */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Tiến độ tổng quan */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Tiến độ tổng quan</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cập nhật theo thời gian thực khi bạn giải bài và luyện tập
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('progress')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Phân tích chi tiết</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              {/* Circular Gauge 72% */}
              <div className="sm:col-span-5 flex justify-center py-2">
                <CircularProgress
                  percentage={profile.overallMastery}
                  size={140}
                  strokeWidth={12}
                  color="#10b981"
                  subLabel="Mức độ thành thạo"
                  bottomLabel="Toán học"
                />
              </div>

              {/* 4 Stat Metrics: 120 Bài đã làm, 85 Bài đúng, 2 giờ Thời gian học, 7 Chuỗi ngày học */}
              <div className="sm:col-span-7 grid grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/70">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Bài đã làm</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">
                    {profile.completedExercises}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/70">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Bài đúng</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">
                    {profile.correctExercises}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/70">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Thời gian học</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">
                    {profile.studyTimeHours} giờ
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/70">
                  <div className="flex items-center gap-2 text-amber-500 mb-1">
                    <Flame className="w-4 h-4" />
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Chuỗi ngày học</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">
                    {profile.streakDays}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 text-center">
            <p className="text-xs italic text-slate-500 dark:text-slate-400">
              {profile.quote} — <span className="font-semibold not-italic text-slate-700 dark:text-slate-300">MathTutor AI</span>
            </p>
          </div>
        </div>

        {/* Right 5 cols: Chủ đề cần tập trung */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Chủ đề cần tập trung</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Được đề xuất dựa trên kết quả làm bài gần đây
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('practice')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Tất cả chủ đề
              </button>
            </div>

            <div className="space-y-4">
              {focusTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Flame
                        className={`w-4 h-4 ${
                          topic.mastery < 50 ? 'text-rose-500' : 'text-amber-500'
                        }`}
                      />
                      <span className="text-sm font-semibold text-slate-800 dark:text-white">
                        {topic.shortTitle || topic.title}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {topic.mastery}%
                    </span>
                  </div>
                  <ProgressBar
                    value={topic.mastery}
                    color={topic.mastery < 50 ? 'rose' : 'amber'}
                    height="h-2"
                  />
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Chuyên đề: {topic.category} • {topic.exerciseCount} bài tập
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPracticeTopic(topic.id);
                        onNavigate('practice');
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Ôn ngay</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts Footer */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onNavigate('problem-input')}
              className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-medium hover:bg-blue-100"
            >
              + Nhập đề toán bằng Ảnh/PDF
            </button>
            <button
              type="button"
              onClick={() => onNavigate('library')}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-200"
            >
              Tra cứu công thức Toán 10
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
