import React, { useState } from 'react';
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  Upload,
  RotateCcw,
  Save,
  Sun,
  Moon,
  Bell
} from 'lucide-react';
import { StudentAvatar, ConfirmDialog } from '../components/common/CommonComponents';

const SETTINGS_TABS = [
  { id: 'profile', label: 'Thông tin' },
  { id: 'goals', label: 'Mục tiêu học tập' },
  { id: 'preferences', label: 'Cài đặt' },
  { id: 'notifications', label: 'Thông báo' }
];

const ALL_INTEREST_TOPICS = ['Đại số', 'Hình học', 'Xác suất', 'Số học', 'Thống kê', 'Hàm số'];

export function SettingsPage({
  profile,
  onUpdateProfile,
  onResetAllDemoData,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    grade: profile.grade,
    email: profile.email
  });
  const [formError, setFormError] = useState('');
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.name.trim()) {
      setFormError('Tên hiển thị không được để trống.');
      return;
    }
    if (!formData.email.includes('@')) {
      setFormError('Địa chỉ email không hợp lệ.');
      return;
    }
    onUpdateProfile({
      ...profile,
      name: formData.name.trim(),
      grade: formData.grade.trim(),
      email: formData.email.trim()
    });
    setIsEditingProfile(false);
    showToast('Đã lưu thông tin hồ sơ cá nhân thành công!', 'success');
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn tệp hình ảnh hợp lệ.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onUpdateProfile({
        ...profile,
        customAvatar: reader.result
      });
      showToast('Đã cập nhật ảnh đại diện cá nhân!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const toggleGoalCheckbox = (key) => {
    onUpdateProfile({
      ...profile,
      goals: {
        ...profile.goals,
        [key]: !profile.goals[key]
      }
    });
    showToast('Đã cập nhật mục tiêu học tập!', 'info');
  };

  const toggleInterestTopic = (topicName) => {
    const exists = profile.goals.interestedTopics.includes(topicName);
    const nextTopics = exists
      ? profile.goals.interestedTopics.filter((t) => t !== topicName)
      : [...profile.goals.interestedTopics, topicName];

    onUpdateProfile({
      ...profile,
      goals: {
        ...profile.goals,
        interestedTopics: nextTopics
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header + 4 Tabs matching Screen 9 */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Hồ sơ cá nhân
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quản lý thông tin học sinh, mục tiêu học tập và tùy chọn giao diện
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục dữ liệu mặc định</span>
          </button>
        </div>

        {/* 4 Tabs matching Screen 9 */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-700/70 pt-3">
          {SETTINGS_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === t.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content matching Screen 9 (Left Profile Card + Right Goals & Level Card) */}
      {(activeTab === 'profile' || activeTab === 'goals') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 5 cols: Profile Information Card */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <StudentAvatar size={76} customAvatar={profile.customAvatar} name={profile.name} />
                <label
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer shadow-xs hover:bg-blue-700"
                  title="Tải ảnh đại diện mới"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {profile.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Học sinh {profile.grade.toLowerCase()}
                </p>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="mt-2 px-3.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  {isEditingProfile ? 'Hủy chỉnh sửa' : 'Chỉnh sửa'}
                </button>
              </div>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium">
                {formError}
              </div>
            )}

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Lớp học
                  </label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Email liên hệ
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu thay đổi</span>
                </button>
              </form>
            ) : (
              <div className="space-y-3.5 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <GraduationCap className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Lớp học: <strong>{profile.grade}</strong></span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Ngày tham gia: <strong>{profile.joinDate}</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Right 7 cols: Mục tiêu học tập + Cấp độ hiện tại + Chủ đề quan tâm matching Screen 9 */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
              {/* Left checklist: Mục tiêu học tập */}
              <div className="sm:col-span-7 space-y-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  Mục tiêu học tập
                </h3>
                <div className="space-y-2.5">
                  {[
                    { key: 'improveScore', label: 'Cải thiện điểm số' },
                    { key: 'midtermExam', label: 'Ôn thi giữa kỳ' },
                    { key: 'finalExam', label: 'Ôn thi cuối kỳ' },
                    { key: 'universityPrep', label: 'Chuẩn bị thi đại học' },
                    { key: 'other', label: 'Khác' }
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(profile.goals[item.key])}
                        onChange={() => toggleGoalCheckbox(item.key)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Right box: Cấp độ hiện tại & Mức độ ưu tiên */}
              <div className="sm:col-span-5 space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 space-y-2.5">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Cấp độ hiện tại
                  </div>
                  <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                    {profile.goals.currentLevel}
                  </div>
                  <select
                    value={profile.goals.currentLevel}
                    onChange={(e) => {
                      onUpdateProfile({
                        ...profile,
                        goals: { ...profile.goals, currentLevel: e.target.value }
                      });
                      showToast(`Đã đổi cấp độ hiện tại thành: ${e.target.value}`, 'success');
                    }}
                    aria-label="Thay đổi cấp độ hiện tại"
                    className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200"
                  >
                    <option value="Cơ bản">Cơ bản</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Khá - Giỏi">Khá - Giỏi</option>
                    <option value="Nâng cao (Chuyên)">Nâng cao (Chuyên)</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Mức độ ưu tiên ôn tập
                  </div>
                  <select
                    value={profile.goals.priorityLevel}
                    onChange={(e) =>
                      onUpdateProfile({
                        ...profile,
                        goals: { ...profile.goals, priorityLevel: e.target.value }
                      })
                    }
                    aria-label="Mức độ ưu tiên"
                    className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200"
                  >
                    <option value="Cao">Ưu tiên Cao (45 phút/ngày)</option>
                    <option value="Trung bình">Trung bình (30 phút/ngày)</option>
                    <option value="Linh hoạt">Linh hoạt (15 phút/ngày)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom: Chủ đề quan tâm pills matching Screen 9 */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2.5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                Chủ đề quan tâm
              </h3>
              <div className="flex flex-wrap gap-2">
                {ALL_INTEREST_TOPICS.map((topicName) => {
                  const selected = profile.goals.interestedTopics.includes(topicName);
                  return (
                    <button
                      key={topicName}
                      type="button"
                      onClick={() => toggleInterestTopic(topicName)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        selected
                          ? 'bg-blue-50 dark:bg-blue-950 border-blue-400 text-blue-700 dark:text-blue-300'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      {topicName}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Cài đặt giao diện */}
      {activeTab === 'preferences' && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs space-y-5 max-w-2xl">
          <h2 className="text-base font-bold text-slate-800 dark:text-white">
            Tùy chọn giao diện & Phương pháp gia sư
          </h2>

          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <div className="text-sm font-semibold text-slate-800 dark:text-white">
                Chế độ hiển thị (Sáng / Tối)
              </div>
              <p className="text-xs text-slate-500">
                Giảm mỏi mắt khi tự học toán vào buổi tối
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onUpdateProfile({
                  ...profile,
                  settings: {
                    ...profile.settings,
                    theme: profile.settings.theme === 'dark' ? 'light' : 'dark'
                  }
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white"
            >
              {profile.settings.theme === 'dark' ? (
                <>
                  <Moon className="w-4 h-4 text-blue-400" />
                  <span>Giao diện Tối</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Giao diện Sáng</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <div className="text-sm font-semibold text-slate-800 dark:text-white">
                Mức độ gợi mở Socratic của AI Tutor
              </div>
              <p className="text-xs text-slate-500">
                Điều chỉnh số bước hỏi đáp trước khi hiển thị lời giải đầy đủ
              </p>
            </div>
            <select
              value={profile.settings.socraticStrictness}
              onChange={(e) =>
                onUpdateProfile({
                  ...profile,
                  settings: { ...profile.settings, socraticStrictness: e.target.value }
                })
              }
              aria-label="Mức độ Socratic"
              className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-white"
            >
              <option value="standard">Tiêu chuẩn (5 cấp độ 0 → 4)</option>
              <option value="deep">Tư duy sâu (Ưu tiên câu hỏi gợi mở)</option>
              <option value="fast">Ôn tập nhanh (Mở sẵn bước trung gian)</option>
            </select>
          </div>
        </div>
      )}

      {/* Tab 4: Thông báo */}
      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs space-y-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-800 dark:text-white">
              Cài đặt thông báo học tập
            </h2>
          </div>

          {[
            { key: 'dailyReminder', label: 'Nhắc nhở duy trì chuỗi ngày học (Streak) lúc 19:30' },
            { key: 'weeklyReport', label: 'Báo cáo tiến độ và mức độ thành thạo hàng tuần' },
            { key: 'newAssignment', label: 'Thông báo khi giáo viên giao bài tập bổ trợ mới' },
            { key: 'tutorHintAlert', label: 'Gợi ý ôn tập lại các chủ đề có độ thành thạo dưới 60%' }
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-700 cursor-pointer"
            >
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                {item.label}
              </span>
              <input
                type="checkbox"
                checked={Boolean(profile.settings.notifications[item.key])}
                onChange={() => {
                  onUpdateProfile({
                    ...profile,
                    settings: {
                      ...profile.settings,
                      notifications: {
                        ...profile.settings.notifications,
                        [item.key]: !profile.settings.notifications[item.key]
                      }
                    }
                  });
                  showToast('Đã lưu tùy chọn thông báo!', 'info');
                }}
                className="w-4 h-4 rounded text-blue-600"
              />
            </label>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmResetOpen}
        title="Khôi phục dữ liệu mặc định?"
        message="Toàn bộ tiến độ luyện tập, lịch sử hội thoại AI Tutor và cài đặt cá nhân trên trình duyệt sẽ được đưa về trạng thái demo ban đầu."
        confirmText="Khôi phục ngay"
        cancelText="Hủy"
        onCancel={() => setConfirmResetOpen(false)}
        onConfirm={() => {
          setConfirmResetOpen(false);
          onResetAllDemoData();
        }}
      />
    </div>
  );
}
