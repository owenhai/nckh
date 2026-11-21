import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Lock,
  Flag,
  Target,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ProgressBar } from '../components/common/CommonComponents';

export function LearningPathPage({
  learningPath,
  onToggleWeek,
  onToggleTask,
  onNavigate,
  onSelectPracticeTopic,
  showToast
}) {
  const [selectedTopicId, setSelectedTopicId] = useState('lp_topic_2');

  // Flatten all topics to find the active one
  const allTopics = learningPath.weeks.flatMap((w) => w.topics);
  const currentTopic =
    allTopics.find((t) => t.id === selectedTopicId) || allTopics[1] || allTopics[0];

  // Compute topic completion percentage
  const completedTasksCount = currentTopic.tasks.filter((tk) => tk.completed).length;
  const topicPercent =
    currentTopic.tasks.length > 0
      ? Math.round((completedTasksCount / currentTopic.tasks.length) * 100)
      : 0;

  // Overall learning path completion
  const totalTasksAll = allTopics.reduce((acc, t) => acc + t.tasks.length, 0);
  const doneTasksAll = allTopics.reduce(
    (acc, t) => acc + t.tasks.filter((tk) => tk.completed).length,
    0
  );
  const completedTopicsCount = Math.max(
    6,
    allTopics.filter((t) => t.tasks.every((tk) => tk.completed)).length + 5
  );
  const overallPercent = Math.max(25, Math.round((doneTasksAll / Math.max(1, totalTasksAll)) * 100));

  return (
    <div className="space-y-6">
      {/* Top Header with Overall Progress matching Screen 5 (Hoàn thành 6/24 chủ đề • 25%) */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Lộ trình học cá nhân hóa
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Học đúng trọng tâm, tiến bộ từng ngày.
          </p>
        </div>

        <div className="w-full sm:w-72 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600 dark:text-slate-300">
              Hoàn thành {completedTopicsCount}/{learningPath.totalModules} chủ đề
            </span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{overallPercent}%</span>
          </div>
          <ProgressBar value={overallPercent} color="blue" height="h-2.5" />
        </div>
      </div>

      {/* 3-Column Layout matching Screen 5: Left Week Tree | Center Topic Tasks | Right Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 3 cols: Weeks Accordion */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-4 shadow-xs space-y-3">
          {learningPath.weeks.map((week) => (
            <div
              key={week.id}
              className="border-b last:border-b-0 border-slate-100 dark:border-slate-700/70 pb-3 last:pb-0"
            >
              <button
                type="button"
                onClick={() => onToggleWeek(week.id)}
                className="w-full flex items-center justify-between text-left py-1.5 px-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-white">
                    {week.weekNumber}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {week.title}
                  </div>
                </div>
                {week.expanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {week.expanded && (
                <div className="mt-2 pl-2 space-y-1.5 border-l-2 border-blue-100 dark:border-slate-700 ml-2">
                  {week.topics.map((topic) => {
                    const isSelected = topic.id === currentTopic.id;
                    const allDone = topic.tasks.every((tk) => tk.completed);
                    const someDone = topic.tasks.some((tk) => tk.completed);

                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => setSelectedTopicId(topic.id)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold shadow-2xs'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/40'
                        }`}
                      >
                        {allDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : someDone || topic.status === 'in_progress' ? (
                          <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          </div>
                        ) : topic.status === 'locked' ? (
                          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <span className="truncate">{topic.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Center 6 cols: Active Topic Card with Mountain Flag Banner & Interactive Tasks */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xs">
          {/* Top Illustration Banner matching Screen 5 */}
          <div className="h-36 bg-gradient-to-r from-sky-100 via-blue-50 to-indigo-100 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700 flex flex-col items-center justify-center relative p-4">
            <svg viewBox="0 0 260 100" className="w-56 h-24">
              <polygon points="40,95 110,28 175,95" fill="#93c5fd" />
              <polygon points="105,95 160,42 220,95" fill="#60a5fa" />
              <polygon points="110,28 92,55 128,55" fill="#eff6ff" />
              <line x1="110" y1="8" x2="110" y2="28" stroke="#1e293b" strokeWidth="2.5" />
              <polygon points="110,8 134,15 110,22" fill="#f43f5e" />
            </svg>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentTopic.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {currentTopic.description}
              </p>
            </div>

            {/* Topic Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  Tiến độ chủ đề ({completedTasksCount}/{currentTopic.tasks.length} nhiệm vụ)
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {topicPercent}%
                </span>
              </div>
              <ProgressBar value={topicPercent} color="emerald" height="h-2.5" />
            </div>

            {/* Task Checklist */}
            <div className="space-y-2.5">
              {currentTopic.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    onToggleTask(currentTopic.id, task.id);
                    showToast(
                      `Đã cập nhật trạng thái nhiệm vụ: "${task.title}"`,
                      'info'
                    );
                  }}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    task.completed
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/70'
                      : 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        task.completed
                          ? 'text-slate-700 dark:text-slate-200'
                          : 'text-slate-800 dark:text-white font-semibold'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">{task.duration}</span>
                </div>
              ))}
            </div>

            {/* Primary CTA Button: Tiếp tục học */}
            <button
              type="button"
              onClick={() => {
                const linked = currentTopic.tasks.find((t) => t.linkedTopicId);
                if (linked && linked.linkedTopicId) {
                  onSelectPracticeTopic(linked.linkedTopicId);
                }
                onNavigate('practice');
              }}
              className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Tiếp tục học</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 3 cols: Mục tiêu của bạn + Quote Sprout Card */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Target className="w-4 h-4" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                Mục tiêu của bạn
              </h3>
            </div>
            <ul className="space-y-2.5">
              {currentTopic.goals.map((goal, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-b from-blue-50/80 to-emerald-50/50 dark:from-slate-800 dark:to-slate-800 border border-blue-100 dark:border-slate-700 rounded-2xl p-5 text-center space-y-3">
            <p className="text-xs italic text-slate-600 dark:text-slate-300 leading-relaxed">
              “Học từng bước nhỏ, để tiến xa hơn mỗi ngày.”
            </p>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
