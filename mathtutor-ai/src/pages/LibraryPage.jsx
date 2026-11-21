import React, { useState } from 'react';
import {
  Library,
  Search,
  FileText,
  Video,
  Star,
  BookOpen,
  X,
  Sparkles
} from 'lucide-react';

const LIBRARY_TABS = ['Tất cả', 'Bài giảng', 'Ví dụ', 'Đề thi', 'Tài liệu tham khảo'];

export function LibraryPage({ items, onToggleBookmark, onSendProblemToTutor, onNavigate, showToast }) {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);

  const filteredItems = items.filter((item) => {
    if (activeTab !== 'Tất cả' && item.category !== activeTab) return false;
    if (onlyBookmarked && !item.bookmarked) return false;
    if (
      searchQuery.trim() &&
      !item.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) &&
      !item.topic.toLowerCase().includes(searchQuery.trim().toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const iconStyles = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400',
    rose: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950 dark:text-rose-400',
    amber: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950 dark:text-amber-400'
  };

  return (
    <div className="space-y-6">
      {/* Header + Search + Category Tabs matching Screen 8 */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Thư viện học liệu
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tài liệu, bài giảng và đề thi được chọn lọc.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              onlyBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
            <span>Đã lưu yêu thích</span>
          </button>
        </div>

        {/* Search Input matching Screen 8 */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tài liệu..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* 5 Tabs matching Screen 8 */}
        <div className="flex flex-wrap gap-2">
          {LIBRARY_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 3x2 Resource Cards Grid matching Screen 8 */}
      {filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center space-y-2">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Chưa tìm thấy học liệu phù hợp
          </p>
          <p className="text-xs text-slate-400">
            Thử đổi từ khóa tìm kiếm hoặc tắt bộ lọc yêu thích.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${
                      iconStyles[item.color] || iconStyles.blue
                    }`}
                  >
                    {item.format === 'Video' ? (
                      <Video className="w-6 h-6" />
                    ) : (
                      <FileText className="w-6 h-6" />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onToggleBookmark(item.id);
                      showToast(
                        item.bookmarked
                          ? `Đã bỏ lưu "${item.title}"`
                          : `Đã lưu "${item.title}" vào mục yêu thích!`,
                        'info'
                      );
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500"
                    title="Lưu yêu thích"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        item.bookmarked ? 'fill-amber-400 text-amber-500' : ''
                      }`}
                    />
                  </button>
                </div>

                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-3.5">
                  {item.title}
                </h2>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.subtitle} • {item.pages}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  Chuyên đề: {item.topic}
                </span>
                <button
                  type="button"
                  onClick={() => setViewingItem(item)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-300 text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Xem tài liệu</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Viewer Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {viewingItem.subtitle} • {viewingItem.pages}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {viewingItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {viewingItem.description}
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="text-xs font-bold text-slate-800 dark:text-white">
                Nội dung chính trong tài liệu:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {viewingItem.sections.map((sec, i) => (
                  <li key={i}>{sec}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800">
              <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                Công thức / Trọng tâm tiêu biểu:
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white math-expr mt-0.5">
                {viewingItem.sampleFormula}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  onSendProblemToTutor(`Giải thích chuyên đề: ${viewingItem.title} (${viewingItem.sampleFormula})`);
                  setViewingItem(null);
                  onNavigate('tutor');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hỏi AI Tutor về tài liệu này</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
