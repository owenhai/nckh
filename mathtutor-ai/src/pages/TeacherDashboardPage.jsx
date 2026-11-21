import React, { useState } from 'react';
import {
  Users,
  Search,
  AlertTriangle,
  Download,
  Eye,
  X,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { teacherClassesData } from '../data/teacherData';
import { ProgressBar } from '../components/common/CommonComponents';

const TEACHER_TABS = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'students', label: 'Học sinh' },
  { id: 'topics', label: 'Chủ đề' },
  { id: 'reports', label: 'Báo cáo' }
];

export function TeacherDashboardPage({ topics, showToast }) {
  const [selectedClass, setSelectedClass] = useState('10A');
  const [activeTab, setActiveTab] = useState('overview');
  const [studentSearch, setStudentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const classInfo = teacherClassesData[selectedClass] || teacherClassesData['10A'];

  const filteredStudents = classInfo.students.filter((stu) => {
    if (statusFilter !== 'Tất cả' && stu.status !== statusFilter) return false;
    if (
      studentSearch.trim() &&
      !stu.name.toLowerCase().includes(studentSearch.trim().toLowerCase()) &&
      !stu.email.toLowerCase().includes(studentSearch.trim().toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar: Title + Tabs + Class Selector matching Screen 7 */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Bảng điều khiển lớp học
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Theo dõi mức độ thành thạo, phát hiện sớm lỗi sai và học sinh cần hỗ trợ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="class-select" className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Chọn lớp:
            </label>
            <select
              id="class-select"
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedStudent(null);
              }}
              className="text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="10A">Lớp 10A</option>
              <option value="10B">Lớp 10B</option>
              <option value="11A">Lớp 11A</option>
            </select>
          </div>
        </div>

        {/* 4 Teacher Sub-tabs matching Screen 7 */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-700/70 pt-3">
          {TEACHER_TABS.map((t) => (
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

      {/* 4 Top KPI Cards matching Screen 7 (42 Học sinh | 74% Mức độ thành thạo TB | 86% Chủ đề mạnh nhất | 52% Chủ đề yếu nhất) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-4 shadow-xs">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {classInfo.totalStudents}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Học sinh ({classInfo.className})
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-4 shadow-xs">
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {classInfo.avgMastery}%
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Mức độ thành thạo trung bình
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-4 shadow-xs">
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {classInfo.strongestRate}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Chủ đề mạnh nhất: <strong className="text-slate-800 dark:text-white">{classInfo.strongestTopic}</strong>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-4 shadow-xs">
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
            {classInfo.weakestRate}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Chủ đề yếu nhất: <strong className="text-slate-800 dark:text-white">{classInfo.weakestTopic}</strong>
          </div>
        </div>
      </div>

      {/* Tab Content 1: Tổng quan (Matches Screen 7 3-column lower section) */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Col 1 (4 cols): Tiến độ của lớp LineChart */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white">Tiến độ của lớp</h2>
            <div className="relative h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={classInfo.progressSeries} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val) => [`${val}%`, 'Thành thạo TB']}
                    contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mastery"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#2563eb' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Col 2 (4 cols): Phân bố mức độ thành thạo Donut Chart */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white">
              Phân bố mức độ thành thạo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
              <div className="sm:col-span-7 relative h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={classInfo.masteryDistribution}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={64}
                      paddingAngle={3}
                    >
                      {classInfo.masteryDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => [`${val} học sinh`, 'Số lượng']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-extrabold text-slate-800 dark:text-white">
                    {classInfo.totalStudents}
                  </span>
                  <span className="text-[10px] text-slate-400">Học sinh</span>
                </div>
              </div>

              <div className="sm:col-span-5 space-y-2">
                {classInfo.masteryDistribution.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-slate-600 dark:text-slate-300">{d.name}</span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white">({d.count})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Col 3 (4 cols): Những lỗi sai phổ biến */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white">
              Những lỗi sai phổ biến
            </h2>
            <div className="space-y-2.5">
              {classInfo.commonMistakes.map((err) => (
                <div
                  key={err.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between gap-2"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <AlertTriangle
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        err.severity === 'high' ? 'text-rose-500' : 'text-amber-500'
                      }`}
                    />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
                      {err.title}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
                    {err.count} học sinh
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Student List Section (Always visible in 'students' tab or below overview) */}
      {(activeTab === 'overview' || activeTab === 'students') && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-white">
                Danh sách học sinh ({filteredStudents.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chọn một học sinh để xem hồ sơ học tập chi tiết
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Tìm tên học sinh..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Lọc trạng thái học sinh"
                className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-200"
              >
                <option value="Tất cả">Mọi trạng thái</option>
                <option value="Xuất sắc">Xuất sắc</option>
                <option value="Đạt mục tiêu">Đạt mục tiêu</option>
                <option value="Cần hỗ trợ">Cần hỗ trợ</option>
              </select>
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Không tìm thấy học sinh nào khớp với điều kiện lọc.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-[11px] uppercase text-slate-400">
                    <th className="py-2.5 px-3">Học sinh</th>
                    <th className="py-2.5 px-3">Thành thạo</th>
                    <th className="py-2.5 px-3">Số bài đã làm</th>
                    <th className="py-2.5 px-3">Chủ đề cần lưu ý</th>
                    <th className="py-2.5 px-3">Trạng thái</th>
                    <th className="py-2.5 px-3 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
                  {filteredStudents.map((stu) => (
                    <tr key={stu.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800 dark:text-white">{stu.name}</div>
                        <div className="text-[11px] text-slate-400">{stu.email}</div>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800 dark:text-white">
                        {stu.mastery}%
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        {stu.completed} bài ({stu.accuracy}% đúng)
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        {stu.weakTopic}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            stu.status === 'Cần hỗ trợ'
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : stu.status === 'Xuất sắc'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {stu.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedStudent(stu)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 font-semibold hover:bg-blue-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Hồ sơ</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Chủ đề */}
      {activeTab === 'topics' && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-white">
            Thống kê mức độ nắm vững theo chủ đề ({classInfo.className})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-700 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{t.title}</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{t.mastery}%</span>
                </div>
                <ProgressBar
                  value={t.mastery}
                  color={t.mastery >= 70 ? 'emerald' : t.mastery >= 55 ? 'blue' : 'rose'}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 4: Báo cáo */}
      {activeTab === 'reports' && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-white">
                Báo cáo tổng hợp định kỳ — {classInfo.className}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tổng hợp dữ liệu tương tác với AI Tutor và kết quả luyện tập của học sinh
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                showToast(`Đã chuẩn bị bản xem trước báo cáo ${classInfo.className} (Demo).`, 'success')
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>Tải báo cáo CSV (Demo)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Tỉ lệ sử dụng gợi ý Socratic
              </div>
              <div className="text-2xl font-extrabold text-blue-600">84%</div>
              <p className="text-[11px] text-slate-500">
                Học sinh tự giải được bài toán sau khi xem gợi ý cấp độ 1–2 mà không cần mở đáp án cuối.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Thời lượng tự học trung bình
              </div>
              <div className="text-2xl font-extrabold text-emerald-600">2.3 giờ/tuần</div>
              <p className="text-[11px] text-slate-500">
                Tăng 18% so với tháng trước nhờ lộ trình cá nhân hóa từng tuần.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Đề xuất giảng dạy trên lớp
              </div>
              <div className="text-sm font-bold text-rose-600">{classInfo.weakestTopic}</div>
              <p className="text-[11px] text-slate-500">
                Cần dành 15 phút đầu giờ ôn lại quy tắc nhân/chia hai vế bất phương trình với số âm.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-blue-600">
                  Hồ sơ học tập học sinh ({classInfo.className})
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedStudent.name}
                </h3>
                <p className="text-xs text-slate-400">{selectedStudent.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <div className="text-lg font-bold text-blue-600">{selectedStudent.mastery}%</div>
                <div className="text-[11px] text-slate-500">Thành thạo</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <div className="text-lg font-bold text-emerald-600">{selectedStudent.accuracy}%</div>
                <div className="text-[11px] text-slate-500">Tỉ lệ đúng</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <div className="text-lg font-bold text-amber-500">{selectedStudent.streak} ngày</div>
                <div className="text-[11px] text-slate-500">Chuỗi học</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs space-y-1">
              <div className="font-bold text-slate-800 dark:text-white">
                Nhận xét từ hệ thống MathTutor AI:
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Học sinh đã hoàn thành {selectedStudent.completed} bài tập (hoạt động gần nhất: {selectedStudent.lastActive}). Chuyên đề cần củng cố thêm: <strong>{selectedStudent.weakTopic}</strong>.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  showToast(`Đã gửi phiếu bài tập bổ trợ cho ${selectedStudent.name} (Demo).`, 'success');
                  setSelectedStudent(null);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Giao bài bổ trợ (Demo)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
