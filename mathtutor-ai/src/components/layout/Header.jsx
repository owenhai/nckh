import React, { useState } from 'react';
import { Search, Bell, Menu, Sparkles, UserCheck, Sun, Moon } from 'lucide-react';
import { StudentAvatar } from '../common/CommonComponents';

export function Header({
  profile,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onOpenMobileMenu,
  onToggleRole,
  onToggleTheme,
  onNavigate
}) {
  const [showNotif, setShowNotif] = useState(false);

  const notifications = [
    { id: 'n1', title: 'Nhắc nhở chuỗi 7 ngày học', desc: 'Hoàn thành thêm 1 bài tập Bất phương trình hôm nay để lên chuỗi 8 ngày!', time: '15 phút trước', unread: true },
    { id: 'n2', title: 'Gợi ý từ AI Tutor', desc: 'Bạn đã nắm vững Phương trình bậc nhất (82%). Hãy thử sức với Phương trình bậc hai nhé!', time: '2 giờ trước', unread: false },
    { id: 'n3', title: 'Đề thi thử Giữa kỳ I mới', desc: 'Thư viện học liệu vừa cập nhật Đề thi giữa kỳ Toán 10 có lời giải chi tiết.', time: 'Hôm qua', unread: false }
  ];

  return (
    <header className="h-16 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xs border-b border-slate-200/80 dark:border-slate-700 px-4 lg:px-7 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile hamburger & Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit(searchQuery);
          }}
          className="relative flex-1 max-w-md"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm bài học, chủ đề, hoặc nhập một câu hỏi..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 transition-all"
          />
        </form>
      </div>

      {/* Right controls: Role switcher, Theme toggle, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Problem Input button */}
        <button
          type="button"
          onClick={() => onNavigate('problem-input')}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Nhập bài toán</span>
        </button>

        {/* Demo Mode Switcher: Student vs Teacher */}
        <button
          type="button"
          onClick={onToggleRole}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            profile.role === 'teacher'
              ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
          }`}
          title="Chuyển đổi chế độ Học sinh / Giáo viên để kiểm thử"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            Chế độ: {profile.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
          </span>
        </button>

        {/* Dark / Light Mode */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="p-2 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title={profile.settings.theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
          aria-label="Đổi giao diện Sáng/Tối"
        >
          {profile.settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Thông báo"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-800 dark:text-white">Thông báo học tập</span>
                <button
                  type="button"
                  onClick={() => setShowNotif(false)}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  Đóng
                </button>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-xs ${
                      n.unread ? 'bg-blue-50/60 dark:bg-blue-950/40' : 'bg-slate-50 dark:bg-slate-700/40'
                    }`}
                  >
                    <div className="font-semibold text-slate-800 dark:text-slate-100">{n.title}</div>
                    <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{n.desc}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar -> Settings */}
        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title="Hồ sơ cá nhân & Cài đặt"
        >
          <StudentAvatar size={32} customAvatar={profile.customAvatar} name={profile.name} />
          <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-200">
            {profile.name}
          </span>
        </button>
      </div>
    </header>
  );
}
