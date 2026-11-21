import React from 'react';
import {
  Home,
  Bot,
  FilePlus2,
  BookOpenCheck,
  Route,
  TrendingUp,
  Users,
  Library,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'home', path: '/', label: 'Trang chủ', icon: Home },
  { id: 'tutor', path: '/tutor', label: 'AI Tutor', icon: Bot },
  { id: 'problem-input', path: '/problem-input', label: 'Nhập bài toán', icon: FilePlus2 },
  { id: 'practice', path: '/practice', label: 'Luyện tập', icon: BookOpenCheck },
  { id: 'learning-path', path: '/learning-path', label: 'Lộ trình học', icon: Route },
  { id: 'progress', path: '/progress', label: 'Tiến độ học tập', icon: TrendingUp },
  { id: 'teacher', path: '/teacher', label: 'Bảng giáo viên', icon: Users },
  { id: 'library', path: '/library', label: 'Thư viện', icon: Library }
];

export function Sidebar({
  activePage,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  onOpenHelpModal
}) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 bg-white dark:bg-slate-800 border-r border-slate-200/80 dark:border-slate-700 flex flex-col transition-all duration-200 ${
          collapsed ? 'w-20' : 'w-60'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Logo */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700/70">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div>
                <span className="font-bold text-base tracking-tight text-slate-800 dark:text-white">
                  MathTutor <span className="text-blue-600 dark:text-blue-400">AI</span>
                </span>
                <span className="block text-[10px] text-slate-400 dark:text-slate-400 -mt-0.5">
                  Socratic EdTech
                </span>
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
            title={collapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const IconComponent = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Settings & Support */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-700/70 space-y-1">
          <button
            type="button"
            onClick={() => {
              onNavigate('settings');
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activePage === 'settings'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
            title={collapsed ? 'Cài đặt' : undefined}
          >
            <Settings className={`w-4 h-4 shrink-0 ${activePage === 'settings' ? 'text-blue-600' : 'text-slate-400'}`} />
            {!collapsed && <span>Cài đặt</span>}
          </button>

          <button
            type="button"
            onClick={onOpenHelpModal}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
            title={collapsed ? 'Hỗ trợ' : undefined}
          >
            <HelpCircle className="w-4 h-4 shrink-0 text-slate-400" />
            {!collapsed && <span>Hỗ trợ</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
