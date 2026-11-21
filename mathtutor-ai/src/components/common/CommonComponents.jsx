import React from 'react';
import { CheckCircle2, AlertCircle, Info, X, HelpCircle } from 'lucide-react';

export function SubjectBadge({ label, variant = 'blue', size = 'sm' }) {
  const styles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    amber: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    rose: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    slate: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  };

  const sizeClass = size === 'xs' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5';

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full border ${styles[variant] || styles.blue} ${sizeClass}`}>
      {label}
    </span>
  );
}

export function DifficultyDotBadge({ difficulty }) {
  const map = {
    'Dễ': { dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/50' },
    'Trung bình': { dot: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/50' },
    'Khó': { dot: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/50' }
  };
  const style = map[difficulty] || map['Trung bình'];

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {difficulty}
    </span>
  );
}

export function ProgressBar({ value = 0, color = 'blue', height = 'h-2', showLabel = false }) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const colorMap = {
    blue: 'bg-blue-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-100 dark:bg-slate-700/70 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${colorMap[color] || colorMap.blue} ${height} rounded-full transition-all duration-500`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-right text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
          {clamped}%
        </div>
      )}
    </div>
  );
}

export function CircularProgress({ percentage = 72, size = 132, strokeWidth = 11, color = '#10b981', subLabel = 'Mức độ thành thạo', bottomLabel = 'Toán học' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 transform">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-100 dark:text-slate-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-slate-800 dark:text-white">{percentage}%</span>
        </div>
      </div>
      {subLabel && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{subLabel}</p>}
      {bottomLabel && <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{bottomLabel}</p>}
    </div>
  );
}

export function ToastNotification({ toast, onClose }) {
  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl px-4 py-3 max-w-md animate-bounce-short">
      {iconMap[toast.type] || iconMap.info}
      <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{toast.message}</div>
      <button
        type="button"
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
        aria-label="Đóng thông báo"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ConfirmDialog({ open, title, message, confirmText = 'Xác nhận', cancelText = 'Hủy', onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2.5 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function StudentAvatar({ size = 36, customAvatar = null, name = 'Minh' }) {
  if (customAvatar) {
    return (
      <img
        src={customAvatar}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover border-2 border-blue-200 dark:border-blue-800 shrink-0"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-blue-100 dark:bg-blue-900/70 border border-blue-200 dark:border-blue-700 flex items-center justify-center overflow-hidden shrink-0"
      title={name}
    >
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <circle cx="32" cy="32" r="32" fill="#dbeafe" />
        <circle cx="32" cy="24" r="11" fill="#fde68a" />
        <path d="M21 22c0-7 5-12 11-12s11 5 11 12c-3-2-7-3-11-3s-8 1-11 3z" fill="#1e293b" />
        <path d="M14 58c3-11 10-16 18-16s15 5 18 16" fill="#2563eb" />
      </svg>
    </div>
  );
}
