import React, { useState } from 'react';
import {
  TrendingUp,
  Flame,
  Trophy,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { CircularProgress, ProgressBar } from '../components/common/CommonComponents';
import { progressByPeriod } from '../data/analyticsData';

export function StudentProgressPage({ profile, topics, onNavigate, onSelectPracticeTopic }) {
  const [period, setPeriod] = useState('7d');
  const currentData = progressByPeriod[period] || progressByPeriod['7d'];
  const focusTopics = topics.filter((t) => t.focusNeeded);

  return (
    <div className="space-y-6">
      {/* Top Header with Time Period Filter matching Screen 6 */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Tiến độ học tập</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hành trình của bạn đang đi đúng hướng! 🚀
            </p>
          </div>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          aria-label="Chọn khoảng thời gian"
          className="text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="7d">7 ngày qua</option>
          <option value="30d">30 ngày qua</option>
          <option value="semester">Học kỳ này</option>
        </select>
      </div>

      {/* Top 3 Summary Cards matching Screen 6 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Mức độ thành thạo (72% Gauge) */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs flex flex-col items-center justify-between text-center">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-2">
            Mức độ thành thạo
          </h2>
          <CircularProgress
            percentage={period === '7d' ? profile.overallMastery : currentData.mastery}
            size={128}
            strokeWidth={11}
            color="#10b981"
            subLabel=""
            bottomLabel="Toán học"
          />
          <span className="mt-2 inline-block text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
            {currentData.masteryDelta}
          </span>
        </div>

        {/* Card 2: Thời gian học (BarChart Recharts + 2.5 giờ Trung bình/ngày) */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white">Thời gian học</h2>
            <span className="text-[11px] text-slate-400">{currentData.label}</span>
          </div>

          <div className="relative h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData.studyChart} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => [`${value} giờ`, 'Thời gian học']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="hours" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center mt-2">
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {currentData.avgHours}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {currentData.avgSubtext}
            </div>
          </div>
        </div>

        {/* Card 3: Chuỗi ngày học (Flame + 7 ngày liên tiếp) */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs flex flex-col items-center justify-between text-center">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">Chuỗi ngày học</h2>
          <div className="my-2 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/70 flex items-center justify-center text-amber-500 mb-2">
              <Flame className="w-10 h-10 fill-amber-400 text-orange-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {currentData.streakDays}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              ngày liên tiếp
            </div>
          </div>
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full">
            Hãy duy trì nhé!
          </span>
        </div>
      </div>

      {/* Middle 2 Columns: Thành thạo theo chủ đề & Chủ đề cần cải thiện */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 cols: Thành thạo theo chủ đề */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-white">
            Thành thạo theo chủ đề
          </h2>
          <div className="space-y-3.5">
            {currentData.categoryMastery.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {item.name}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-white">{item.value}%</span>
                </div>
                <ProgressBar value={item.value} color="blue" height="h-2.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 cols: Chủ đề cần cải thiện */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-white">
            Chủ đề cần cải thiện
          </h2>
          <div className="space-y-3.5">
            {focusTopics.map((topic) => (
              <div
                key={topic.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-700 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame
                      className={`w-4 h-4 ${
                        topic.mastery < 50 ? 'text-rose-500' : 'text-amber-500'
                      }`}
                    />
                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
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
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPracticeTopic(topic.id);
                      onNavigate('practice');
                    }}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Luyện tập cải thiện</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Trophy Encouragement Banner matching Screen 6 */}
      <div className="bg-gradient-to-r from-amber-50/90 via-blue-50/70 to-emerald-50/80 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 border border-amber-200/80 dark:border-slate-700 rounded-2xl p-5 flex items-center justify-center gap-4 text-center sm:text-left shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-500 shrink-0">
          <Trophy className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            {currentData.encouragementTitle}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            {currentData.encouragementSubtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
