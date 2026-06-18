"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/src/config';

export interface AttendanceLog {
  date: string;
  clockIn: string;
  clockOut: string;
  duration: string;
  status: 'Present' | 'Checked In' | 'Absent';
}

export interface Course {
  id: string;
  title: string;
  category: string;
  progress: number;
  image: string;
  lectures: {
    title: string;
    duration: string;
    completed: boolean;
    videoUrl: string;
    notes: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'system' | 'mentor';
  text: string;
  time: string;
}

export interface Assignment {
  id: string;
  title: string;
  category: string;
  assignedBy: string;
  dueDate: string;
  isOverdue: boolean;
  alert?: string;
  status: string;
  code: string;
  isLocked: boolean;
}

export interface CapstoneSubtask {
  id: number;
  phase: number;
  task: string;
  completed: boolean;
}

export interface CapstoneCommit {
  commit: string;
  author: string;
  message: string;
  date: string;
  guideComment: string;
}

export interface VaultFile {
  id: string;
  name: string;
  size: string;
  category: string;
  date: string;
  verified: boolean;
  downloadable: boolean;
}

export interface CertificateInfo {
  id: string;
  title: string;
  description: string;
  issueDate: string;
  validationId: string;
  type: string;
}

export interface UserProfile {
  personalInformation: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    dateOfBirth: string;
    gender: string;
    city: string;
    state: string;
  };
  academicInformation: {
    collegeName: string;
    department: string;
    degree: string;
    currentYear: string;
    cgpaPercentage: string;
    graduationYear: string;
  };
  professionalInformation: {
    skills: string;
    githubUrl: string;
    linkedinUrl: string;
    portfolioUrl: string;
    projectExperience: string;
  };
  internshipSpecificData: {
    internshipType: string;
    preferredTechStack: string;
    relevantExperience?: string;
  };
  documents: {
    resumeName: string;
    resumeBase64: string | null;
  };
}

export const defaultProfile: UserProfile = {
  personalInformation: {
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    dateOfBirth: "",
    gender: "",
    city: "",
    state: "",
  },
  academicInformation: {
    collegeName: "",
    department: "",
    degree: "",
    currentYear: "",
    cgpaPercentage: "",
    graduationYear: "",
  },
  professionalInformation: {
    skills: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    projectExperience: "",
  },
  internshipSpecificData: {
    internshipType: "",
    preferredTechStack: "",
  },
  documents: {
    resumeName: "",
    resumeBase64: null,
  }
};

interface DashboardContextType {
  isDashboardLoading: boolean;
  username: string;
  setUsername: (name: string) => void;
  profilePicture: string | null;
  setProfilePicture: (pic: string | null) => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  handleSaveProfile: (profileData: UserProfile) => Promise<void>;
  isCheckedIn: boolean;
  clockInTime: string | null;
  attendanceLogs: AttendanceLog[];
  handleCheckInToggle: () => void;
  notificationToast: string | null;
  showToastNotification: (msg: string) => void;
  agenda: { id: number; task: string; time: string; completed: boolean }[];
  handleToggleAgendaItem: (id: number) => void;
  courses: Course[];
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  selectedLectureIndex: number;
  setSelectedLectureIndex: (idx: number) => void;
  isVideoPlaying: boolean;
  setIsVideoPlaying: (playing: boolean) => void;
  lmsSearch: string;
  setLmsSearch: (s: string) => void;
  lmsCategoryFilter: string;
  setLmsCategoryFilter: (c: string) => void;
  handleSelectCourse: (course: Course) => void;
  handleMarkLectureComplete: (courseId: string, lectureIndex: number) => void;
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  assignmentFilter: 'all' | 'pending' | 'review' | 'completed';
  setAssignmentFilter: (filter: 'all' | 'pending' | 'review' | 'completed') => void;
  activeUploadAssignmentId: string | null;
  setActiveUploadAssignmentId: (id: string | null) => void;
  uploadedFiles: Record<string, string>;
  handleSimulateBrowse: (asgId: string) => void;
  handleRemoveFile: (asgId: string) => void;
  handleSimulateSubmit: (asgId: string) => void;
  capstoneRepoLink: string;
  setCapstoneRepoLink: (l: string) => void;
  capstoneLiveLink: string;
  setCapstoneLiveLink: (l: string) => void;
  capstoneStatus: 'Not Submitted' | 'Under Review' | 'Approved';
  setCapstoneStatus: (s: 'Not Submitted' | 'Under Review' | 'Approved') => void;
  isEditingCapstone: boolean;
  setIsEditingCapstone: (editing: boolean) => void;
  capstoneSubtasks: CapstoneSubtask[];
  handleToggleSubtask: (id: number) => void;
  capstoneCommits: CapstoneCommit[];
  isLintingActive: boolean;
  lintLogs: string[];
  runDiagnostics: () => void;
  handleSaveCapstone: (e: React.FormEvent) => void;
  assessmentPreflight: { camera: boolean; mic: boolean; screen: boolean; network: boolean };
  setAssessmentPreflight: React.Dispatch<React.SetStateAction<{ camera: boolean; mic: boolean; screen: boolean; network: boolean }>>;
  showExamHUD: boolean;
  setShowExamHUD: (show: boolean) => void;
  examHUDWarningCount: number;
  setExamHUDWarningCount: React.Dispatch<React.SetStateAction<number>>;
  examHUDQuestionIndex: number;
  setExamHUDQuestionIndex: (idx: number) => void;
  examHUDAnswers: Record<number, string>;
  setExamHUDAnswers: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  examHUDSecRemaining: number;
  setExamHUDSecRemaining: React.Dispatch<React.SetStateAction<number>>;
  examHUDCompleted: boolean;
  setExamHUDCompleted: (c: boolean) => void;
  examHUDScore: number;
  pastExamResults: { id: string; title: string; date: string; score: number; status: string }[];
  setPastExamResults: React.Dispatch<React.SetStateAction<{ id: string; title: string; date: string; score: number; status: string }[]>>;
  mockExamQuestions: { id: number; question: string; options: string[]; correctAnswer: string }[];
  handleStartExam: () => void;
  handleAnswerQuestion: (optionText: string) => void;
  handleSubmitExam: (forceFail?: boolean) => void;
  handleExitExamHUD: () => void;
  fees: { total: number; paid: number; balance: number };
  setFees: React.Dispatch<React.SetStateAction<{ total: number; paid: number; balance: number }>>;
  paymentHistory: { id: string; date: string; amount: number; method: string; status: string }[];
  setPaymentHistory: React.Dispatch<React.SetStateAction<{ id: string; date: string; amount: number; method: string; status: string }[]>>;
  isPayModalOpen: boolean;
  setIsPayModalOpen: (open: boolean) => void;
  payAmountInput: string;
  setPayAmountInput: (amt: string) => void;
  payMethod: string;
  setPayMethod: (method: string) => void;
  cardNumber: string;
  cardExpiry: string;
  cardCVV: string;
  cardName: string;
  handleCardNumberChange: (val: string) => void;
  handleCardExpiryChange: (val: string) => void;
  handleCardCVVChange: (val: string) => void;
  setCardName: (name: string) => void;
  isUPIScannerOpen: boolean;
  setIsUPIScannerOpen: (open: boolean) => void;
  upiTimer: number;
  handleProcessPayment: (e: React.FormEvent) => void;
  triggerUPISuccess: () => void;
  activeChatThread: 'mentor' | 'support';
  setActiveChatThread: (thread: 'mentor' | 'support') => void;
  chatInputText: string;
  setChatInputText: (txt: string) => void;
  mentorMessages: ChatMessage[];
  supportMessages: ChatMessage[];
  handleSendChatMessage: (e: React.FormEvent) => void;
  vaultFiles: VaultFile[];
  setVaultFiles: React.Dispatch<React.SetStateAction<VaultFile[]>>;
  activeCertificate: CertificateInfo | null;
  setActiveCertificate: (cert: CertificateInfo | null) => void;
  certificatesCatalog: CertificateInfo[];
  uploadedFileName: string;
  setUploadedFileName: (name: string) => void;
  uploadCategory: string;
  setUploadCategory: (cat: string) => void;
  handleUploadDocument: (e: React.FormEvent) => void;
  kpiStats: { technical: number; delivery: number; communication: number; attendance: number; collaboration: number };
  setKpiStats: React.Dispatch<React.SetStateAction<{ technical: number; delivery: number; communication: number; attendance: number; collaboration: number }>>;
  announcements: { date: string; title: string; content: string }[];
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsernameState] = useState('');
  const [profilePicture, setProfilePictureState] = useState<string | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  const setUsername = (name: string) => {
    setUsernameState(name);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pinesphere_username', name);
    }
  };

  const setProfilePicture = (pic: string | null) => {
    setProfilePictureState(pic);
    if (typeof window !== 'undefined') {
      if (pic) {
        localStorage.setItem('pinesphere_profile_picture', pic);
      } else {
        localStorage.removeItem('pinesphere_profile_picture');
      }
    }
  };

  const handleSaveProfile = async (profileData: UserProfile) => {
    const fullName = `${profileData.personalInformation.firstName.trim()} ${profileData.personalInformation.lastName.trim()}`;
    setUsername(fullName);
    setProfile(profileData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pinesphere_user_profile', JSON.stringify(profileData));
    }

    try {
      const response = await fetch(API_ENDPOINTS.PROFILE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile on backend');
      }
      showToastNotification("Profile synced with backend server!");
    } catch (error) {
      console.error(error);
      showToastNotification("Profile saved locally!");
    }
  };

  const [isDashboardLoading, setIsDashboardLoading] = useState(true);

  // --- ATTENDANCE STATE ---
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);

  // --- AGENDA STATE ---
  const [agenda, setAgenda] = useState<{ id: number; task: string; time: string; completed: boolean }[]>([]);

  // --- LMS STATE ---
  const [courses, setCourses] = useState<Course[]>([]);

  // --- ASSIGNMENTS STATE ---
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // --- ASSESSMENT STATE ---
  const [pastExamResults, setPastExamResults] = useState<{ id: string; title: string; date: string; score: number; status: string }[]>([]);

  const [mockExamQuestions, setMockExamQuestions] = useState<{ id: number; question: string; options: string[]; correctAnswer: string }[]>([]);

  // --- FINANCIALS STATE ---
  const [fees, setFees] = useState({ total: 0, paid: 0, balance: 0 });
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  // --- DOCUMENTS STATE ---
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>([]);

  // --- KPI STATE ---
  const [kpiStats, setKpiStats] = useState({
    technical: 0,
    delivery: 0,
    communication: 0,
    attendance: 0,
    collaboration: 0
  });

  const [announcements, setAnnouncements] = useState<{ date: string; title: string; content: string }[]>([]);

  // Fetch initial dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      // 1. DASHBOARD OVERVIEW DATA
      try {
        const response = await fetch(API_ENDPOINTS.DASHBOARD_DATA);
        if (response.ok) {
          const data = await response.json();
          if (data.agenda) setAgenda(data.agenda);
          if (data.courses) setCourses(data.courses);
          if (data.assignments) setAssignments(data.assignments);
          if (data.capstoneStatus) setCapstoneStatus(data.capstoneStatus);
          if (data.capstoneSubtasks) setCapstoneSubtasks(data.capstoneSubtasks);
          if (data.announcements) setAnnouncements(data.announcements);
        }
      } catch (err) {
        console.error("Failed to fetch general dashboard data:", err);
      }

      // 2. ATTENDANCE
      try {
        const response = await fetch(API_ENDPOINTS.ATTENDANCE);
        if (response.ok) {
          const data = await response.json();
          if (data.isCheckedIn !== undefined) setIsCheckedIn(data.isCheckedIn);
          if (data.clockInTime !== undefined) setClockInTime(data.clockInTime);
          if (data.attendanceLogs) setAttendanceLogs(data.attendanceLogs);
        } else {
          throw new Error();
        }
      } catch (err) {
        if (typeof window !== 'undefined') {
          const storedCheckedIn = localStorage.getItem('pinesphere_isCheckedIn');
          const storedClockIn = localStorage.getItem('pinesphere_clockInTime');
          const storedLogs = localStorage.getItem('pinesphere_attendanceLogs');
          if (storedCheckedIn !== null) setIsCheckedIn(JSON.parse(storedCheckedIn));
          if (storedClockIn !== null) setClockInTime(storedClockIn || null);
          if (storedLogs !== null) setAttendanceLogs(JSON.parse(storedLogs));
        }
      }

      // 3. ASSESSMENT
      try {
        const response = await fetch(API_ENDPOINTS.ASSESSMENT);
        if (response.ok) {
          const data = await response.json();
          if (data.pastExamResults) setPastExamResults(data.pastExamResults);
          if (data.mockExamQuestions) setMockExamQuestions(data.mockExamQuestions);
        } else {
          throw new Error();
        }
      } catch (err) {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('pinesphere_past_exam_results');
          if (stored) setPastExamResults(JSON.parse(stored));
        }
      }

      // 4. DOCUMENTS
      try {
        const response = await fetch(API_ENDPOINTS.DOCUMENTS);
        if (response.ok) {
          const data = await response.json();
          if (data.vaultFiles) setVaultFiles(data.vaultFiles);
        } else {
          throw new Error();
        }
      } catch (err) {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('pinesphere_vault_files');
          if (stored) setVaultFiles(JSON.parse(stored));
        }
      }

      // 5. FINANCIALS
      try {
        const response = await fetch(API_ENDPOINTS.FINANCIALS);
        if (response.ok) {
          const data = await response.json();
          if (data.fees) setFees(data.fees);
          if (data.paymentHistory) setPaymentHistory(data.paymentHistory);
        } else {
          throw new Error();
        }
      } catch (err) {
        if (typeof window !== 'undefined') {
          const storedFees = localStorage.getItem('pinesphere_fees');
          const storedHistory = localStorage.getItem('pinesphere_payment_history');
          if (storedFees) {
            setFees(JSON.parse(storedFees));
          }
          if (storedHistory) {
            setPaymentHistory(JSON.parse(storedHistory));
          }
        }
      }

      // 6. KPI
      try {
        const response = await fetch(API_ENDPOINTS.KPI);
        if (response.ok) {
          const data = await response.json();
          if (data.kpiStats) setKpiStats(data.kpiStats);
        } else {
          throw new Error();
        }
      } catch (err) {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('pinesphere_kpi_stats');
          if (stored) setKpiStats(JSON.parse(stored));
        }
      }

      // 7. PROFILE
      try {
        const response = await fetch(API_ENDPOINTS.PROFILE);
        if (response.ok) {
          const data = await response.json();
          if (data.profile) setProfile(data.profile);
        } else {
          throw new Error();
        }
      } catch (err) {
        if (typeof window !== 'undefined') {
          const storedProfile = localStorage.getItem('pinesphere_user_profile');
          if (storedProfile) {
            try {
              setProfile(JSON.parse(storedProfile));
            } catch (e) {
              console.error("Failed to parse stored profile:", e);
            }
          }
        }
      }

      // 8. TASKS
      try {
        const response = await fetch(API_ENDPOINTS.TASKS);
        if (response.ok) {
          const data = await response.json();
          if (data.assignments) setAssignments(data.assignments);
        }
      } catch (err) {
        console.error("Failed to fetch tasks/assignments dynamically:", err);
      }

      setIsDashboardLoading(false);
    };

    fetchDashboardData();
  }, []);

  const showToastNotification = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  };

  // --- ATTENDANCE ACTIONS ---
  const handleCheckInToggle = async () => {
    const nextCheckedIn = !isCheckedIn;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayStr = now.toISOString().split('T')[0];

    let newLogs = [...attendanceLogs];
    let nextClockIn = clockInTime;

    if (nextCheckedIn) {
      nextClockIn = timeStr;
      newLogs = [{ date: todayStr, clockIn: timeStr, clockOut: 'Active', duration: '--', status: 'Checked In' }, ...attendanceLogs];
      showToastNotification(`Successfully Checked In at ${timeStr}`);
    } else {
      newLogs = attendanceLogs.map(log => {
        if (log.date === todayStr) {
          return { ...log, clockOut: timeStr, duration: '8h 00m', status: 'Present' as const };
        }
        return log;
      });
      nextClockIn = null;
      showToastNotification(`Successfully Checked Out at ${timeStr}`);
    }

    setIsCheckedIn(nextCheckedIn);
    setClockInTime(nextClockIn);
    setAttendanceLogs(newLogs);

    if (typeof window !== 'undefined') {
      localStorage.setItem('pinesphere_isCheckedIn', JSON.stringify(nextCheckedIn));
      localStorage.setItem('pinesphere_clockInTime', nextClockIn || '');
      localStorage.setItem('pinesphere_attendanceLogs', JSON.stringify(newLogs));
    }

    try {
      const response = await fetch(API_ENDPOINTS.ATTENDANCE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCheckedIn: nextCheckedIn, clockInTime: nextClockIn, logs: newLogs }),
      });
      if (!response.ok) {
        throw new Error('Failed to update attendance on server');
      }
    } catch (err) {
      console.error("Failed to sync attendance to backend:", err);
    }
  };

  // --- AGENDA ACTIONS ---
  const handleToggleAgendaItem = async (id: number) => {
    let nextCompletedState = false;
    
    setAgenda(prev => prev.map(item => {
      if (item.id === id) {
        nextCompletedState = !item.completed;
        return { ...item, completed: nextCompletedState };
      }
      return item;
    }));

    try {
      const response = await fetch(`${API_ENDPOINTS.AGENDA}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: nextCompletedState }),
      });

      if (!response.ok) {
        throw new Error('Failed to update agenda item');
      }
      showToastNotification(`Agenda item marked as ${nextCompletedState ? 'completed' : 'pending'}`);
    } catch (error) {
      console.error(error);
      showToastNotification("Failed to update agenda item on server. (Saved locally)");
    }
  };

  // --- LMS ACTIONS ---
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLectureIndex, setSelectedLectureIndex] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [lmsSearch, setLmsSearch] = useState('');
  const [lmsCategoryFilter, setLmsCategoryFilter] = useState('all');

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    const incompleteIndex = course.lectures.findIndex(l => !l.completed);
    setSelectedLectureIndex(incompleteIndex >= 0 ? incompleteIndex : 0);
    setIsVideoPlaying(false);
  };

  const handleMarkLectureComplete = async (courseId: string, lectureIndex: number) => {
    let completedTransition = false;
    let oldCourses = [...courses];
    let newProgress = 0;
    let isCompleted = false;

    const updated = courses.map(c => {
      if (c.id === courseId) {
        const updatedLectures = c.lectures.map((l, idx) => {
          if (idx === lectureIndex) {
            isCompleted = !l.completed;
            return { ...l, completed: isCompleted };
          }
          return l;
        });
        const completedCount = updatedLectures.filter(l => l.completed).length;
        const progress = Math.round((completedCount / updatedLectures.length) * 100);
        if (progress === 100 && c.progress < 100) {
          completedTransition = true;
        }
        newProgress = progress;
        return { ...c, lectures: updatedLectures, progress };
      }
      return c;
    });

    setCourses(updated);
    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(updated.find(c => c.id === courseId) || null);
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.COURSES}/${courseId}/lecture/${lectureIndex}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: isCompleted, progress: newProgress }),
      });

      if (!response.ok) {
        throw new Error('Failed to update course progress');
      }

      if (completedTransition) {
        showToastNotification("🎉 Learning pathway completed! Certificate is now claimable in Documents Vault.");
      } else {
        showToastNotification("Course progress updated!");
      }
    } catch (error) {
      console.error(error);
      showToastNotification("Course progress updated locally!");
    }
  };

  // --- ASSIGNMENTS ACTIONS ---
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'pending' | 'review' | 'completed'>('all');
  const [activeUploadAssignmentId, setActiveUploadAssignmentId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  const handleSimulateBrowse = (asgId: string) => {
    const defaultNames: Record<string, string> = {
      'PS-2026-W3': 'frame_selection_script.zip',
      'Pr-2026-3Px': 'lightweight_model_metrics.pdf',
    };
    const fileName = defaultNames[asgId] || 'deliverables.zip';
    setUploadedFiles(prev => ({ ...prev, [asgId]: fileName }));
    showToastNotification(`Selected file: ${fileName}. Click Simulate Upload to push your work.`);
  };

  const handleRemoveFile = (asgId: string) => {
    setUploadedFiles(prev => {
      const copy = { ...prev };
      delete copy[asgId];
      return copy;
    });
    showToastNotification("File removed.");
  };

  const handleSimulateSubmit = async (asgId: string) => {
    const file = uploadedFiles[asgId] || (asgId === 'PS-2026-W3' ? 'frame_selection_script.zip' : 'lightweight_model_metrics.pdf');
    
    setAssignments(prev => prev.map(a => {
      if (a.id === asgId) {
        return { ...a, status: 'review' };
      }
      return a;
    }));
    setActiveUploadAssignmentId(null);

    try {
      const response = await fetch(`${API_ENDPOINTS.ASSIGNMENTS}/${asgId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit assignment');
      }
      showToastNotification(`Successfully uploaded ${file}. Assignment status is now "Under Review".`);
    } catch (error) {
      console.error(error);
      showToastNotification(`Successfully uploaded ${file} (offline mode).`);
    }
  };

  // --- CAPSTONE ACTIONS ---
  const [capstoneRepoLink, setCapstoneRepoLink] = useState('');
  const [capstoneLiveLink, setCapstoneLiveLink] = useState('');
  const [capstoneStatus, setCapstoneStatus] = useState<'Not Submitted' | 'Under Review' | 'Approved'>('Not Submitted');
  const [isEditingCapstone, setIsEditingCapstone] = useState(false);
  const [capstoneSubtasks, setCapstoneSubtasks] = useState<CapstoneSubtask[]>([]);

  const [capstoneCommits, setCapstoneCommits] = useState<CapstoneCommit[]>([]);

  const [isLintingActive, setIsLintingActive] = useState(false);
  const [lintLogs, setLintLogs] = useState<string[]>([]);

  const handleToggleSubtask = (id: number) => {
    setCapstoneSubtasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextVal = !t.completed;
        showToastNotification(`Subtask marked as ${nextVal ? 'completed' : 'pending'}`);
        return { ...t, completed: nextVal };
      }
      return t;
    }));
  };

  const runDiagnostics = () => {
    setIsLintingActive(true);
    setLintLogs(['Initializing TypeScript typecheck compiler...']);
    setTimeout(() => {
      setLintLogs(prev => [...prev, 'Analyzing 24 source files in app/dashboard/...']);
      setTimeout(() => {
        setLintLogs(prev => [...prev, '✓ No critical compilation errors.', 'ESLint: Passed with 2 minor warnings (unused imports).', 'Vercel Deployment Preview is synced successfully.']);
        setIsLintingActive(false);
        showToastNotification("Staging build checks completed!");
      }, 1000);
    }, 1000);
  };

  const handleSaveCapstone = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingCapstone(false);
    
    try {
      const response = await fetch(API_ENDPOINTS.CAPSTONE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoLink: capstoneRepoLink,
          liveLink: capstoneLiveLink,
          status: 'Under Review'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update capstone details');
      }
      setCapstoneStatus('Under Review');
      showToastNotification("Capstone project parameters updated successfully!");
    } catch (error) {
      console.error(error);
      showToastNotification("Capstone saved locally!");
      setCapstoneStatus('Under Review');
    }
  };

  // --- ASSESSMENT ACTIONS ---
  const [assessmentPreflight, setAssessmentPreflight] = useState({
    camera: false,
    mic: false,
    screen: false,
    network: true
  });
  const [showExamHUD, setShowExamHUD] = useState(false);
  const [examHUDWarningCount, setExamHUDWarningCount] = useState(0);
  const [examHUDQuestionIndex, setExamHUDQuestionIndex] = useState(0);
  const [examHUDAnswers, setExamHUDAnswers] = useState<Record<number, string>>({});
  const [examHUDSecRemaining, setExamHUDSecRemaining] = useState(1200);
  const [examHUDCompleted, setExamHUDCompleted] = useState(false);
  const [examHUDScore, setExamHUDScore] = useState(0);

  const handleStartExam = () => {
    if (!assessmentPreflight.camera || !assessmentPreflight.mic || !assessmentPreflight.screen) {
      showToastNotification("Please complete all hardware check steps before launching exam.");
      return;
    }
    setExamHUDWarningCount(0);
    setExamHUDQuestionIndex(0);
    setExamHUDAnswers({});
    setExamHUDSecRemaining(1200);
    setExamHUDCompleted(false);
    setShowExamHUD(true);
  };

  const handleAnswerQuestion = (optionText: string) => {
    setExamHUDAnswers(prev => ({
      ...prev,
      [examHUDQuestionIndex]: optionText
    }));
  };

  const handleSubmitExam = async (forceFail = false) => {
    let score = 0;
    if (!forceFail) {
      mockExamQuestions.forEach((q, idx) => {
        if (examHUDAnswers[idx] === q.correctAnswer) {
          score += 25;
        }
      });
    }

    setExamHUDScore(score);
    setExamHUDCompleted(true);

    const newResult = {
      id: `ex-${Date.now()}`,
      title: 'React Architecture Prep',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      score: score,
      status: score >= 50 ? 'Passed' : 'Failed'
    };

    const updatedResults = [newResult, ...pastExamResults];
    setPastExamResults(updatedResults);

    if (typeof window !== 'undefined') {
      localStorage.setItem('pinesphere_past_exam_results', JSON.stringify(updatedResults));
    }

    showToastNotification("Assessment exam completed and logged.");

    try {
      const response = await fetch(API_ENDPOINTS.ASSESSMENT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, answers: examHUDAnswers, result: newResult }),
      });
      if (!response.ok) {
        throw new Error('Failed to sync assessment to server');
      }
    } catch (err) {
      console.error("Failed to sync assessment to server:", err);
    }
  };

  const handleExitExamHUD = () => {
    setShowExamHUD(false);
    setAssessmentPreflight({
      camera: false,
      mic: false,
      screen: false,
      network: true
    });
  };

  // --- FINANCIALS ACTIONS ---
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmountInput, setPayAmountInput] = useState('15000');
  const [payMethod, setPayMethod] = useState('upi');

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardName, setCardName] = useState('');

  const [isUPIScannerOpen, setIsUPIScannerOpen] = useState(false);
  const [upiTimer, setUPITimer] = useState(45);

  const handleCardNumberChange = (value: string) => {
    const clean = value.replace(/\D/g, '');
    const formatted = clean.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formatted.slice(0, 19));
  };

  const handleCardExpiryChange = (value: string) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length > 2) {
      setCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2, 4)}`);
    } else {
      setCardExpiry(clean);
    }
  };

  const handleCardCVVChange = (value: string) => {
    const clean = value.replace(/\D/g, '');
    setCardCVV(clean.slice(0, 3));
  };

  const triggerUPISuccess = async () => {
    const amountVal = parseFloat(payAmountInput);
    const newPayment = {
      id: `INV-2026-00${paymentHistory.length + 5}`,
      date: new Date().toISOString().split('T')[0],
      amount: amountVal,
      method: 'UPI Pay',
      status: 'Cleared' as const
    };
    const updatedFees = {
      ...fees,
      paid: fees.paid + amountVal,
      balance: fees.balance - amountVal
    };
    const updatedHistory = [newPayment, ...paymentHistory];

    setFees(updatedFees);
    setPaymentHistory(updatedHistory);
    setIsUPIScannerOpen(false);
    setIsPayModalOpen(false);

    if (typeof window !== 'undefined') {
      localStorage.setItem('pinesphere_fees', JSON.stringify(updatedFees));
      localStorage.setItem('pinesphere_payment_history', JSON.stringify(updatedHistory));
    }

    showToastNotification("UPI Payment scanned and cleared successfully!");

    try {
      const response = await fetch(API_ENDPOINTS.FINANCIALS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayment),
      });
      if (!response.ok) {
        throw new Error('Failed to register payment on server');
      }
    } catch (err) {
      console.error("Failed to sync payment details:", err);
    }
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(payAmountInput);
    if (isNaN(amountVal) || amountVal <= 0 || amountVal > fees.balance) {
      showToastNotification("Invalid amount entered.");
      return;
    }

    if (payMethod === 'upi') {
      setUPITimer(45);
      setIsUPIScannerOpen(true);
      return;
    }

    if (cardNumber.replace(/\s/g, '').length < 16 || cardExpiry.length < 5 || cardCVV.length < 3 || !cardName.trim()) {
      showToastNotification("Please complete all credit card fields correctly.");
      return;
    }

    const newPayment = {
      id: `INV-2026-00${paymentHistory.length + 5}`,
      date: new Date().toISOString().split('T')[0],
      amount: amountVal,
      method: 'Credit Card',
      status: 'Cleared' as const
    };

    const updatedFees = {
      ...fees,
      paid: fees.paid + amountVal,
      balance: fees.balance - amountVal
    };
    const updatedHistory = [newPayment, ...paymentHistory];

    setFees(updatedFees);
    setPaymentHistory(updatedHistory);
    setIsPayModalOpen(false);
    setCardNumber('');
    setCardExpiry('');
    setCardCVV('');
    setCardName('');

    if (typeof window !== 'undefined') {
      localStorage.setItem('pinesphere_fees', JSON.stringify(updatedFees));
      localStorage.setItem('pinesphere_payment_history', JSON.stringify(updatedHistory));
    }

    showToastNotification("Credit Card processed and cleared successfully!");

    try {
      const response = await fetch(API_ENDPOINTS.FINANCIALS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayment),
      });
      if (!response.ok) {
        throw new Error('Failed to register payment on server');
      }
    } catch (err) {
      console.error("Failed to sync payment details:", err);
    }
  };

  useEffect(() => {
    if (!isUPIScannerOpen || upiTimer <= 0) return;
    const timer = setInterval(() => {
      setUPITimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerUPISuccess();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isUPIScannerOpen, upiTimer]);

  // --- CHAT ACTIONS ---
  const [activeChatThread, setActiveChatThread] = useState<'mentor' | 'support'>('mentor');
  const [chatInputText, setChatInputText] = useState('');

  const [mentorMessages, setMentorMessages] = useState<ChatMessage[]>([]);

  const [supportMessages, setSupportMessages] = useState<ChatMessage[]>([]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: chatInputText.trim(),
      time: timeStr
    };

    if (activeChatThread === 'mentor') {
      setMentorMessages(prev => [...prev, userMsg]);
    } else {
      setSupportMessages(prev => [...prev, userMsg]);
    }
    
    setChatInputText('');

    try {
      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread: activeChatThread,
          message: userMsg.text
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: activeChatThread === 'mentor' ? 'mentor' : 'system',
        text: data.reply || 'Message received.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (activeChatThread === 'mentor') {
        setMentorMessages(prev => [...prev, replyMsg]);
      } else {
        setSupportMessages(prev => [...prev, replyMsg]);
      }
    } catch (error) {
      console.error(error);
      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: activeChatThread === 'mentor' ? 'mentor' : 'system',
        text: 'Unable to send message. Please try again later.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      if (activeChatThread === 'mentor') {
        setMentorMessages(prev => [...prev, replyMsg]);
      } else {
        setSupportMessages(prev => [...prev, replyMsg]);
      }
    }
  };

  // --- DOCUMENTS ACTIONS ---
  const [activeCertificate, setActiveCertificate] = useState<CertificateInfo | null>(null);

  const [certificatesCatalog, setCertificatesCatalog] = useState<CertificateInfo[]>([]);

  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Academics');

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFileName.trim()) return;

    const newDoc = {
      id: `doc-${Date.now()}`,
      name: uploadedFileName.trim().endsWith('.pdf') ? uploadedFileName.trim() : `${uploadedFileName.trim()}.pdf`,
      size: '1.5 MB',
      category: uploadCategory,
      date: new Date().toISOString().split('T')[0],
      verified: false,
      downloadable: false
    };

    const updatedFiles = [newDoc, ...vaultFiles];
    setVaultFiles(updatedFiles);
    setUploadedFileName('');
    if (typeof window !== 'undefined') {
      localStorage.setItem('pinesphere_vault_files', JSON.stringify(updatedFiles));
    }

    showToastNotification("Document uploaded. Verification pending!");

    try {
      const response = await fetch(API_ENDPOINTS.DOCUMENTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoc),
      });
      if (!response.ok) {
        throw new Error('Failed to upload document to server');
      }
    } catch (err) {
      console.error("Failed to sync uploaded document:", err);
    }
  };

  // Fee status is loaded from backend via the main useEffect fetch.
  // No hardcoded fallback data is injected.

  return (
    <DashboardContext.Provider value={{
      isDashboardLoading,
      username, setUsername,
      profilePicture, setProfilePicture,
      profile, setProfile, handleSaveProfile,
      isCheckedIn, clockInTime, attendanceLogs, handleCheckInToggle,
      notificationToast, showToastNotification,
      agenda, handleToggleAgendaItem,
      courses, selectedCourse, setSelectedCourse, selectedLectureIndex, setSelectedLectureIndex,
      isVideoPlaying, setIsVideoPlaying, lmsSearch, setLmsSearch, lmsCategoryFilter, setLmsCategoryFilter,
      handleSelectCourse, handleMarkLectureComplete,
      assignments, setAssignments, assignmentFilter, setAssignmentFilter, activeUploadAssignmentId, setActiveUploadAssignmentId,
      uploadedFiles, handleSimulateBrowse, handleRemoveFile, handleSimulateSubmit,
      capstoneRepoLink, setCapstoneRepoLink, capstoneLiveLink, setCapstoneLiveLink, capstoneStatus, setCapstoneStatus,
      isEditingCapstone, setIsEditingCapstone, capstoneSubtasks, handleToggleSubtask, capstoneCommits,
      isLintingActive, lintLogs, runDiagnostics, handleSaveCapstone,
      assessmentPreflight, setAssessmentPreflight, showExamHUD, setShowExamHUD,
      examHUDWarningCount, setExamHUDWarningCount, examHUDQuestionIndex, setExamHUDQuestionIndex,
      examHUDAnswers, setExamHUDAnswers, examHUDSecRemaining, setExamHUDSecRemaining,
      examHUDCompleted, setExamHUDCompleted, examHUDScore, pastExamResults, setPastExamResults, mockExamQuestions,
      handleStartExam, handleAnswerQuestion, handleSubmitExam, handleExitExamHUD,
      fees, setFees, paymentHistory, setPaymentHistory, isPayModalOpen, setIsPayModalOpen, payAmountInput, setPayAmountInput,
      payMethod, setPayMethod, cardNumber, cardExpiry, cardCVV, cardName,
      handleCardNumberChange, handleCardExpiryChange, handleCardCVVChange, setCardName,
      isUPIScannerOpen, setIsUPIScannerOpen, upiTimer, handleProcessPayment, triggerUPISuccess,
      activeChatThread, setActiveChatThread, chatInputText, setChatInputText,
      mentorMessages, supportMessages, handleSendChatMessage,
      vaultFiles, setVaultFiles, activeCertificate, setActiveCertificate, certificatesCatalog,
      uploadedFileName, setUploadedFileName, uploadCategory, setUploadCategory, handleUploadDocument,
      kpiStats, setKpiStats, announcements
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
