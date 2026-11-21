import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

const PAGE_TO_PATH = {
  home: '/',
  tutor: '/tutor',
  'problem-input': '/problem-input',
  practice: '/practice',
  'learning-path': '/learning-path',
  progress: '/progress',
  teacher: '/teacher',
  library: '/library',
  settings: '/settings'
};

const PATH_TO_PAGE = Object.fromEntries(
  Object.entries(PAGE_TO_PATH).map(([k, v]) => [v, k])
);

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastNotification, ConfirmDialog } from './components/common/CommonComponents';

import { HomePage } from './pages/HomePage';
import { TutorPage } from './pages/TutorPage';
import { ProblemInputPage } from './pages/ProblemInputPage';
import { PracticePage } from './pages/PracticePage';
import { LearningPathPage } from './pages/LearningPathPage';
import { StudentProgressPage } from './pages/StudentProgressPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { LibraryPage } from './pages/LibraryPage';
import { SettingsPage } from './pages/SettingsPage';

import { useLocalStorage } from './hooks/useLocalStorage';
import { initialStudentProfile } from './data/userData';
import { initialTopics } from './data/topicsData';
import { tutorProblems } from './data/tutorData';
import { practiceQuestions } from './data/practiceData';
import { initialLearningPath } from './data/learningPathData';
import { initialLibraryItems } from './data/libraryData';

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = PATH_TO_PAGE[location.pathname] || 'home';
  const setActivePage = (pageId) => navigate(PAGE_TO_PATH[pageId] || '/');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  // Persistent Demo State
  const [profile, setProfile] = useLocalStorage('mt_profile_v1', initialStudentProfile);
  const [topics, setTopics] = useLocalStorage('mt_topics_v1', initialTopics);
  const [problems, setProblems] = useLocalStorage('mt_problems_v1', tutorProblems);
  const [activeProblemId, setActiveProblemId] = useLocalStorage('mt_active_prob_v1', 'prob_linear_1');
  const [conversations, setConversations] = useLocalStorage('mt_conversations_v1', {});
  const [learningPath, setLearningPath] = useLocalStorage('mt_learning_path_v1', initialLearningPath);
  const [libraryItems, setLibraryItems] = useLocalStorage('mt_library_v1', initialLibraryItems);
  const [selectedPracticeTopic, setSelectedPracticeTopic] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Apply dark mode class to root container
  const isDark = profile?.settings?.theme === 'dark';

  const handleToggleRole = () => {
    const nextRole = profile.role === 'teacher' ? 'student' : 'teacher';
    setProfile({ ...profile, role: nextRole });
    if (nextRole === 'teacher') {
      setActivePage('teacher');
      showToast('Đã chuyển sang chế độ Giáo viên (Bảng điều khiển lớp học).', 'info');
    } else {
      setActivePage('home');
      showToast('Đã chuyển sang chế độ Học sinh.', 'info');
    }
  };

  const handleToggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setProfile({
      ...profile,
      settings: { ...profile.settings, theme: nextTheme }
    });
  };

  const handleSearchSubmit = (q) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    if (trimmed.includes('=') || trimmed.includes('<') || trimmed.includes('>')) {
      handleAddCustomProblem(trimmed);
      setActivePage('tutor');
      return;
    }
    setActivePage('library');
    showToast(`Tìm kiếm học liệu cho từ khóa: "${trimmed}"`, 'info');
  };

  const handleAddCustomProblem = (formulaText) => {
    const newId = `prob_custom_${Date.now()}`;
    const newProb = {
      id: newId,
      title: 'Bài toán tự nhập',
      category: 'Đại số',
      difficulty: 'Tùy chỉnh',
      statement: formulaText.startsWith('Giải') ? formulaText : `Giải bài toán: ${formulaText}`,
      latex: formulaText,
      initialMessages: [
        {
          id: `m_${Date.now()}`,
          sender: 'ai',
          time: 'Bây giờ',
          text: `Mình đã nhận được đề bài "${formulaText}". Theo phương pháp Socratic, bước đầu tiên bạn dự định biến đổi vế trái như thế nào?`
        }
      ],
      hintSteps: [
        {
          level: 0,
          badgeColor: 'emerald',
          title: 'Câu hỏi định hướng',
          content: 'Xác định ẩn số chính và hằng số tự do trong biểu thức.',
          detail: 'Quan sát kỹ các phép toán đang gắn với ẩn x.'
        },
        {
          level: 1,
          badgeColor: 'blue',
          title: 'Gợi ý khái niệm',
          content: 'Áp dụng quy tắc chuyển vế đổi dấu hoặc phép toán ngược.',
          detail: 'Chuyển các hạng tử chứa ẩn về vế trái, hằng số về vế phải.'
        },
        {
          level: 2,
          badgeColor: 'amber',
          title: 'Gợi ý cụ thể hơn',
          content: 'Rút gọn từng vế của phương trình/bất phương trình.',
          detail: 'Thực hiện phép cộng trừ các hạng tử đồng dạng.'
        },
        {
          level: 3,
          badgeColor: 'orange',
          title: 'Bước trung gian',
          content: 'Chia cả hai vế cho hệ số của ẩn.',
          detail: 'Lưu ý điều kiện hệ số khác 0 (và đổi chiều nếu là bất phương trình chia cho số âm).'
        },
        {
          level: 4,
          badgeColor: 'rose',
          title: 'Kiểm tra & Kết luận',
          content: 'Thay nghiệm vừa tìm được vào đề bài để thử lại.',
          detail: 'Kết luận tập nghiệm S của bài toán.'
        }
      ],
      quickResponses: {
        hint: `Với bài toán "${formulaText}", bạn hãy thử cô lập cụm chứa ẩn số ở vế trái bằng cách chuyển các hằng số tự do sang vế phải nhé!`,
        concept: 'Nguyên tắc chung: Sử dụng các phép biến đổi tương đương (cộng/trừ cả hai vế với cùng một số, nhân/chia cả hai vế với một số khác 0).',
        example: 'Ví dụ tương tự: Giải 2x + 5 = 15 → Trừ 5 hai vế được 2x = 10 → Chia 2 hai vế được x = 5.',
        confused: 'Không sao cả! Bạn hãy cho mình biết trong biểu thức trên, số nào đang cộng hoặc trừ với cụm chứa x?'
      }
    };
    setProblems([newProb, ...problems]);
    setActiveProblemId(newId);
  };

  const handleUpdateConversation = (probId, nextMsgs) => {
    setConversations({
      ...conversations,
      [probId]: nextMsgs
    });
  };

  const handleResetConversation = (probId) => {
    const next = { ...conversations };
    delete next[probId];
    setConversations(next);
  };

  const handleRecordPracticeAnswer = (topicId, isCorrect) => {
    setProfile((prev) => ({
      ...prev,
      completedExercises: prev.completedExercises + 1,
      correctExercises: isCorrect ? prev.correctExercises + 1 : prev.correctExercises,
      weeklyExercisesCount: prev.weeklyExercisesCount + 1,
      overallMastery: isCorrect ? Math.min(100, prev.overallMastery + 1) : prev.overallMastery
    }));

    setTopics((prevTopics) =>
      prevTopics.map((t) => {
        if (t.id !== topicId) return t;
        const nextMastery = isCorrect ? Math.min(100, t.mastery + 4) : Math.max(20, t.mastery - 1);
        return {
          ...t,
          completedCount: Math.min(t.exerciseCount, t.completedCount + 1),
          mastery: nextMastery
        };
      })
    );
  };

  const handleToggleWeek = (weekId) => {
    setLearningPath((prev) => ({
      ...prev,
      weeks: prev.weeks.map((w) => (w.id === weekId ? { ...w, expanded: !w.expanded } : w))
    }));
  };

  const handleToggleTask = (topicId, taskId) => {
    setLearningPath((prev) => ({
      ...prev,
      weeks: prev.weeks.map((w) => ({
        ...w,
        topics: w.topics.map((t) => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            tasks: t.tasks.map((tk) =>
              tk.id === taskId ? { ...tk, completed: !tk.completed } : tk
            )
          };
        })
      }))
    }));
  };

  const handleToggleBookmark = (itemId) => {
    setLibraryItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, bookmarked: !item.bookmarked } : item
      )
    );
  };

  const handleResetAllDemoData = () => {
    setProfile(initialStudentProfile);
    setTopics(initialTopics);
    setProblems(tutorProblems);
    setActiveProblemId('prob_linear_1');
    setConversations({});
    setLearningPath(initialLearningPath);
    setLibraryItems(initialLibraryItems);
    showToast('Đã khôi phục toàn bộ dữ liệu demo về mặc định!', 'success');
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-[#f4f7fb] dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex transition-colors">
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          onOpenHelpModal={() => setHelpModalOpen(true)}
        />

        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
            sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'
          }`}
        >
          <Header
            profile={profile}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onToggleRole={handleToggleRole}
            onToggleTheme={handleToggleTheme}
            onNavigate={setActivePage}
          />

          <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
            {activePage === 'home' && (
              <HomePage
                profile={profile}
                topics={topics}
                onNavigate={setActivePage}
                onSelectPracticeTopic={setSelectedPracticeTopic}
              />
            )}

            {activePage === 'tutor' && (
              <TutorPage
                profile={profile}
                problems={problems}
                activeProblemId={activeProblemId}
                onSelectProblemId={setActiveProblemId}
                conversationsByProblem={conversations}
                onUpdateConversation={handleUpdateConversation}
                onResetConversation={handleResetConversation}
                onNavigate={setActivePage}
                showToast={showToast}
              />
            )}

            {activePage === 'problem-input' && (
              <ProblemInputPage
                onSubmitCustomProblem={handleAddCustomProblem}
                onNavigate={setActivePage}
                showToast={showToast}
              />
            )}

            {activePage === 'practice' && (
              <PracticePage
                profile={profile}
                topics={topics}
                questions={practiceQuestions}
                selectedTopicFilter={selectedPracticeTopic}
                onSelectTopicFilter={setSelectedPracticeTopic}
                onRecordPracticeAnswer={handleRecordPracticeAnswer}
                onSendProblemToTutor={handleAddCustomProblem}
                onNavigate={setActivePage}
                showToast={showToast}
              />
            )}

            {activePage === 'learning-path' && (
              <LearningPathPage
                learningPath={learningPath}
                onToggleWeek={handleToggleWeek}
                onToggleTask={handleToggleTask}
                onNavigate={setActivePage}
                onSelectPracticeTopic={setSelectedPracticeTopic}
                showToast={showToast}
              />
            )}

            {activePage === 'progress' && (
              <StudentProgressPage
                profile={profile}
                topics={topics}
                onNavigate={setActivePage}
                onSelectPracticeTopic={setSelectedPracticeTopic}
              />
            )}

            {activePage === 'teacher' && (
              <TeacherDashboardPage
                topics={topics}
                showToast={showToast}
              />
            )}

            {activePage === 'library' && (
              <LibraryPage
                items={libraryItems}
                onToggleBookmark={handleToggleBookmark}
                onSendProblemToTutor={handleAddCustomProblem}
                onNavigate={setActivePage}
                showToast={showToast}
              />
            )}

            {activePage === 'settings' && (
              <SettingsPage
                profile={profile}
                onUpdateProfile={setProfile}
                onResetAllDemoData={handleResetAllDemoData}
                showToast={showToast}
              />
            )}
          </main>
        </div>

        <ToastNotification toast={toast} onClose={() => setToast(null)} />

        <ConfirmDialog
          open={helpModalOpen}
          title="Giới thiệu dự án nghiên cứu MathTutor AI"
          message="MathTutor AI là nền tảng gia sư Toán thông minh theo phương pháp Socratic Tutoring (đặt câu hỏi gợi mở từng bước thay vì đưa đáp án ngay). Phiên bản hiện tại là bản Frontend hoàn chỉnh sử dụng dữ liệu mô phỏng (Demo) lưu trữ trên LocalStorage trình duyệt."
          confirmText="Đã hiểu"
          cancelText="Đóng"
          onConfirm={() => setHelpModalOpen(false)}
          onCancel={() => setHelpModalOpen(false)}
        />
      </div>
    </div>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AppShell />} />
      </Routes>
    </BrowserRouter>
  );
}
