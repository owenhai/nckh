export const initialStudentProfile = {
  id: 'stu_01',
  name: 'Bin',
  fullName: 'Ngô Phi Bin',
  role: 'student', // 'student' | 'teacher'
  grade: 'Lớp 10A',
  school: 'THPT Chuyên Khoa Học Tự Nhiên',
  email: 'minh@example.com',
  joinDate: '15/08/2024',
  avatarType: 'preset_boy',
  customAvatar: null,
  overallMastery: 72,
  masteryDelta: 5,
  completedExercises: 120,
  correctExercises: 85,
  studyTimeHours: 2.0,
  weeklyAvgHours: 2.5,
  streakDays: 7,
  weeklyExercisesCount: 24,
  weeklyProgressDelta: 12,
  monthlyImprovement: 12,
  quote: '"Không có gì khó, chỉ có điều bạn chưa thử đúng cách."',
  goals: {
    improveScore: true,
    midtermExam: true,
    finalExam: true,
    universityPrep: false,
    other: false,
    currentLevel: 'Trung bình',
    priorityLevel: 'Cao',
    targetScore: '8.5+',
    dailyMinutes: 45,
    interestedTopics: ['Đại số', 'Hình học', 'Xác suất']
  },
  settings: {
    theme: 'light',
    fontSize: 'medium',
    mathRenderMode: 'katex',
    socraticStrictness: 'standard',
    soundEffects: true,
    notifications: {
      dailyReminder: true,
      weeklyReport: true,
      newAssignment: true,
      tutorHintAlert: false
    }
  }
};
