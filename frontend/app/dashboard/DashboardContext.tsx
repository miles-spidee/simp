"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface DashboardContextType {
  username: string;
  setUsername: (name: string) => void;
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
  mockExamQuestions: { id: number; question: string; options: string[]; correctAnswer: string }[];
  handleStartExam: () => void;
  handleAnswerQuestion: (optionText: string) => void;
  handleSubmitExam: (forceFail?: boolean) => void;
  handleExitExamHUD: () => void;
  fees: { total: number; paid: number; balance: number };
  paymentHistory: { id: string; date: string; amount: number; method: string; status: string }[];
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
  activeCertificate: CertificateInfo | null;
  setActiveCertificate: (cert: CertificateInfo | null) => void;
  certificatesCatalog: CertificateInfo[];
  uploadedFileName: string;
  setUploadedFileName: (name: string) => void;
  uploadCategory: string;
  setUploadCategory: (cat: string) => void;
  handleUploadDocument: (e: React.FormEvent) => void;
  kpiStats: { technical: number; delivery: number; communication: number; attendance: number; collaboration: number };
  announcements: { date: string; title: string; content: string }[];
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState('Harini');
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Initialize username on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pinesphere_username');
      if (stored) {
        setUsername(stored);
      }
    }
  }, []);

  const showToastNotification = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  };

  // --- ATTENDANCE ---
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [clockInTime] = useState<string | null>('09:00 AM');
  const [attendanceLogs] = useState<AttendanceLog[]>([
    { date: '2026-06-16', clockIn: '09:00 AM', clockOut: 'Active', duration: '--', status: 'Checked In' },
    { date: '2026-06-15', clockIn: '09:01 AM', clockOut: '05:48 PM', duration: '8h 47m', status: 'Present' },
    { date: '2026-06-14', clockIn: '08:55 AM', clockOut: '06:02 PM', duration: '9h 07m', status: 'Present' },
    { date: '2026-06-13', clockIn: '09:12 AM', clockOut: '05:30 PM', duration: '8h 18m', status: 'Present' },
    { date: '2026-06-12', clockIn: '09:00 AM', clockOut: '05:50 PM', duration: '8h 50m', status: 'Present' },
    { date: '2026-06-11', clockIn: '08:45 AM', clockOut: '06:15 PM', duration: '9h 30m', status: 'Present' },
  ]);

  const handleCheckInToggle = () => {
    showToastNotification("Active session is managed automatically by the workstation.");
  };

  // --- AGENDA ---
  const [agenda, setAgenda] = useState([
    { id: 1, task: 'Sprint Planning & Scrum Sync', time: '09:00 AM', completed: true },
    { id: 2, task: 'Advanced Hydration Architecture Learning', time: '11:30 AM', completed: true },
    { id: 3, task: 'Staging Deployment & Diagnostics Dry Run', time: '03:00 PM', completed: false },
    { id: 4, task: 'Technical Evaluation Sync with Guide', time: '05:00 PM', completed: false }
  ]);

  const handleToggleAgendaItem = (id: number) => {
    setAgenda(prev => prev.map(item => {
      if (item.id === id) {
        const nextCompleted = !item.completed;
        showToastNotification(`Agenda item marked as ${nextCompleted ? 'completed' : 'pending'}`);
        return { ...item, completed: nextCompleted };
      }
      return item;
    }));
  };

  // --- LMS ---
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'react-next',
      title: 'Enterprise React & Next.js Architecture',
      category: 'Frontend Development',
      progress: 66,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
      lectures: [
        { title: 'Module 1: Advanced Hooks and State Machines', duration: '45 mins', completed: true, videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner1.mp4', notes: 'Learn patterns for rendering optimization and handling global states without complex third-party tools.' },
        { title: 'Module 2: Server Components & Hydration Protocol', duration: '52 mins', completed: true, videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner2.mp4', notes: 'Server Components are rendered on the server and sent as serializable JSON payload to the client.' },
        { title: 'Module 3: Data Fetching Paradigms & Cache Revalidation', duration: '38 mins', completed: false, videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner3.mp4', notes: 'Leverage static site generation (SSG), incremental static regeneration (ISR), and data cache controls.' },
        { title: 'Module 4: Enterprise Folder Layout & CI/CD Builds', duration: '60 mins', completed: false, videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner4.mp4', notes: 'Structure complex micro-frontends and deploy via modern serverless platforms like Vercel.' }
      ]
    },
    {
      id: 'node-sys',
      title: 'Advanced Node.js & Distributed Systems',
      category: 'Backend Architecture',
      progress: 33,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      lectures: [
        { title: 'Module 1: Event Loop Mechanics & Libuv Threads', duration: '55 mins', completed: true, videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner2.mp4', notes: 'Master callbacks, event queues, macroscopic phases of event loop, and multithreaded worker pools.' },
        { title: 'Module 2: RESTful Microservices & Gateway Routing', duration: '48 mins', completed: false, videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner3.mp4', notes: 'Set up API Gateway services, rate-limiting rules, load balancing, security certificates, and JWT authentications.' },
        { title: 'Module 3: Message Brokers (RabbitMQ & Kafka)', duration: '64 mins', completed: false, videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner1.mp4', notes: 'Handle asynchronous communication channels, distributed commit logs, partitions, and replication parameters.' }
      ]
    },
    {
      id: 'cloud-devops',
      title: 'Cloud DevOps & Infrastructure as Code',
      category: 'System Operations',
      progress: 0,
      image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80',
      lectures: [
        { title: 'Module 1: Docker Containerization for Node Apps', duration: '40 mins', completed: false, videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner4.mp4', notes: 'Write multi-stage Dockerfiles, minimize container footprint, set up dev volumes, and manage docker-compose dependencies.' },
        { title: 'Module 2: Kubernetes Orchestration & Ingress Services', duration: '72 mins', completed: false, videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner1.mp4', notes: 'Define pods, replicas, load balancers, configuration secrets, network policies, and horizontal autoscaling.' },
        { title: 'Module 3: Terraform provisioning on AWS/GCP', duration: '58 mins', completed: false, videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner3.mp4', notes: 'Manage state files, write modules, output dynamic configs, and deploy fully isolated Virtual Private Clouds.' }
      ]
    }
  ]);

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

  const handleMarkLectureComplete = (courseId: string, lectureIndex: number) => {
    let completedTransition = false;
    const updated = courses.map(c => {
      if (c.id === courseId) {
        const updatedLectures = c.lectures.map((l, idx) => {
          if (idx === lectureIndex) return { ...l, completed: !l.completed };
          return l;
        });
        const completedCount = updatedLectures.filter(l => l.completed).length;
        const progress = Math.round((completedCount / updatedLectures.length) * 100);
        if (progress === 100 && c.progress < 100) {
          completedTransition = true;
        }
        return { ...c, lectures: updatedLectures, progress };
      }
      return c;
    });

    setCourses(updated);
    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(updated.find(c => c.id === courseId) || null);
    }
    
    if (completedTransition) {
      showToastNotification("🎉 Learning pathway completed! Certificate is now claimable in Documents Vault.");
    } else {
      showToastNotification("Course progress updated!");
    }
  };

  // --- ASSIGNMENTS ---
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'PS-2026-W3',
      title: 'Week 3 Discipline Evaluation Task: Real-time Frame Selection Script',
      category: 'Week 3 Task',
      assignedBy: 'Mentor Sarah',
      dueDate: 'June 14, 2026 (2 Days Overdue)',
      isOverdue: true,
      alert: 'Alert: This overdue assignment has automatically notified your Reporting Manager. High-priority resolution required to avoid academic credit deduction.',
      status: 'pending',
      code: 'realtime-frame-selection',
      isLocked: false
    },
    {
      id: 'Pr-2026-3Px',
      title: 'Optimization Report: Lightweight Model Compression Metrics',
      category: 'Optimization Report',
      assignedBy: 'Mentor Sarah',
      dueDate: 'June 19, 2026 (3 days remaining)',
      isOverdue: false,
      status: 'review',
      code: 'model-compression',
      isLocked: false
    },
    {
      id: 'Pr-2026-4Ab',
      title: 'Neural Network Visualizer: Frontend Wireframes',
      category: 'Wireframes',
      assignedBy: 'Mentor Sarah',
      dueDate: 'June 25, 2026',
      isOverdue: false,
      status: 'pending',
      code: 'nn-visualizer',
      isLocked: true
    },
    {
      id: 'PS-2026-W2',
      title: 'Week 2: Advanced React Design Patterns',
      category: 'Week 2 Task',
      assignedBy: 'Mentor Sarah',
      dueDate: 'June 07, 2026',
      isOverdue: false,
      status: 'completed',
      code: 'react-design-patterns',
      isLocked: false
    },
    {
      id: 'PS-2026-W1',
      title: 'Week 1: Next.js Boilerplate Integration',
      category: 'Week 1 Task',
      assignedBy: 'Mentor Sarah',
      dueDate: 'May 31, 2026',
      isOverdue: false,
      status: 'review',
      code: 'nextjs-boilerplate',
      isLocked: false
    }
  ]);

  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'pending' | 'review' | 'completed'>('all');
  const [activeUploadAssignmentId, setActiveUploadAssignmentId] = useState<string | null>('PS-2026-W3');
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

  const handleSimulateSubmit = (asgId: string) => {
    const file = uploadedFiles[asgId] || (asgId === 'PS-2026-W3' ? 'frame_selection_script.zip' : 'lightweight_model_metrics.pdf');
    setAssignments(prev => prev.map(a => {
      if (a.id === asgId) {
        return { ...a, status: 'review' };
      }
      return a;
    }));
    setActiveUploadAssignmentId(null);
    showToastNotification(`Successfully uploaded ${file}. Assignment status is now "Under Review".`);
  };

  // --- CAPSTONE ---
  const [capstoneRepoLink, setCapstoneRepoLink] = useState('https://github.com/harini/pinesphere-intern-portal-capstone');
  const [capstoneLiveLink, setCapstoneLiveLink] = useState('');
  const [capstoneStatus, setCapstoneStatus] = useState<'Not Submitted' | 'Under Review' | 'Approved'>('Under Review');
  const [isEditingCapstone, setIsEditingCapstone] = useState(false);
  const [capstoneSubtasks, setCapstoneSubtasks] = useState<CapstoneSubtask[]>([
    { id: 1, phase: 3, task: 'Configure routing structures & context API', completed: true },
    { id: 2, phase: 3, task: 'Complete dashboard overview layout designs', completed: true },
    { id: 3, phase: 3, task: 'Complete proctored assessment HUD pages', completed: true },
    { id: 4, phase: 3, task: 'Sync styling with high-contrast white & blue theme', completed: true },
    { id: 5, phase: 4, task: 'Design mock relational database tables schema', completed: false },
    { id: 6, phase: 4, task: 'Create REST API routes for attendance log synchronization', completed: false },
    { id: 7, phase: 4, task: 'Implement client JWT auth context interceptors', completed: false }
  ]);

  const [capstoneCommits] = useState<CapstoneCommit[]>([
    { commit: 'c82f1a9', author: 'Harini', message: 'feat: add proctored exam overlay and window focus listener', date: 'June 15, 2026', guideComment: 'Mr. Anand Jayavel: Excellent implementation of browser blur detection. Please verify that focus warn limits reset properly on new launch.' },
    { commit: 'a4b10fd', author: 'Harini', message: 'style: match dashboard typography with landing page header design', date: 'June 14, 2026', guideComment: 'Mr. Anand Jayavel: Logo layout looks neat and correctly sized. Theme coordinates match the main brand now.' },
    { commit: 'f00e998', author: 'Harini', message: 'setup: initial nextjs template with sidebar layout navigation', date: 'June 11, 2026', guideComment: '' }
  ]);

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

  const handleSaveCapstone = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingCapstone(false);
    setCapstoneStatus('Under Review');
    showToastNotification("Capstone project parameters updated successfully!");
  };

  // --- ASSESSMENT ---
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

  const pastExamResults = [
    { id: 'ex1', title: 'Next.js Routing & Data Flow', date: 'June 10, 2026', score: 88, status: 'Passed' },
    { id: 'ex2', title: 'Node.js Libuv Event Loop Mechanics', date: 'May 28, 2026', score: 92, status: 'Passed' },
    { id: 'ex3', title: 'Relational Database Schema Design', date: 'May 15, 2026', score: 80, status: 'Passed' }
  ];

  const mockExamQuestions = [
    {
      id: 1,
      question: "Which of the following is a primary characteristic of React Server Components (RSC)?",
      options: [
        "They execute only on the client-side to improve web performance.",
        "They reduce client-side bundle size by staying on the server.",
        "They use useState and useEffect hooks extensively during server render.",
        "They completely eliminate the need for any client-side JavaScript."
      ],
      correctAnswer: "They reduce client-side bundle size by staying on the server."
    },
    {
      id: 2,
      question: "How does the Next.js App Router perform dynamic rendering revalidations?",
      options: [
        "By querying the database directly on every user action.",
        "Through Time-based or Demand-based revalidation (revalidatePath / revalidateTag).",
        "By refreshing the entire browser frame automatically every 60 seconds.",
        "It is not possible to revalidate cached pages dynamically."
      ],
      correctAnswer: "Through Time-based or Demand-based revalidation (revalidatePath / revalidateTag)."
    },
    {
      id: 3,
      question: "What is the purpose of the 'Libuv' library in the Node.js architecture?",
      options: [
        "To compile modern ES6 Javascript files into readable machine code.",
        "To manage multi-threaded input/output event loop execution pools.",
        "To serve as an embedded lightweight database system.",
        "To provide a standard HTTP router layout interface."
      ],
      correctAnswer: "To manage multi-threaded input/output event loop execution pools."
    },
    {
      id: 4,
      question: "In standard database design, what does a CASCADE DELETE constraint do?",
      options: [
        "Blocks the deletion of any rows referenced by key definitions.",
        "Automatically deletes child rows when a referenced parent row is deleted.",
        "Encrypts delete statements automatically in the transaction log.",
        "Speeds up delete queries by disabling indexes."
      ],
      correctAnswer: "Automatically deletes child rows when a referenced parent row is deleted."
    }
  ];

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

  const handleSubmitExam = (forceFail = false) => {
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
    showToastNotification("Assessment exam completed and logged.");
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

  // --- FINANCIALS ---
  const [fees, setFees] = useState(() => {
    if (typeof window !== 'undefined') {
      const type = localStorage.getItem('pinesphere_internship_type') || 'free';
      if (type !== 'free') {
        return { total: 30000, paid: 15000, balance: 15000 };
      }
    }
    return { total: 0, paid: 0, balance: 0 };
  });

  const [paymentHistory, setPaymentHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      const type = localStorage.getItem('pinesphere_internship_type') || 'free';
      if (type !== 'free') {
        return [
          { id: 'INV-2026-001', date: '2026-05-10', amount: 15000, method: 'Credit Card', status: 'Cleared' }
        ];
      }
    }
    return [
      { id: 'ALC-2026-FREE', date: '2026-05-01', amount: 0, method: 'System Grant', status: 'Free Internship' }
    ];
  });

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

  const triggerUPISuccess = () => {
    const amountVal = parseFloat(payAmountInput);
    const newPayment = {
      id: `INV-2026-00${paymentHistory.length + 5}`,
      date: new Date().toISOString().split('T')[0],
      amount: amountVal,
      method: 'UPI Pay',
      status: 'Cleared' as const
    };
    setFees(prev => ({
      ...prev,
      paid: prev.paid + amountVal,
      balance: prev.balance - amountVal
    }));
    setPaymentHistory([newPayment, ...paymentHistory]);
    setIsUPIScannerOpen(false);
    setIsPayModalOpen(false);
    showToastNotification("UPI Payment scanned and cleared successfully!");
  };

  const handleProcessPayment = (e: React.FormEvent) => {
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

    setFees(prev => ({
      ...prev,
      paid: prev.paid + amountVal,
      balance: prev.balance - amountVal
    }));
    setPaymentHistory([newPayment, ...paymentHistory]);
    setIsPayModalOpen(false);
    setCardNumber('');
    setCardExpiry('');
    setCardCVV('');
    setCardName('');
    showToastNotification("Credit Card processed and cleared successfully!");
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

  // --- CHAT ---
  const [activeChatThread, setActiveChatThread] = useState<'mentor' | 'support'>('mentor');
  const [chatInputText, setChatInputText] = useState('');

  const [mentorMessages, setMentorMessages] = useState<ChatMessage[]>([
    { id: 'm1', sender: 'mentor', text: 'Hi Harini, please review Module 3 of React architecture before taking the evaluation.', time: '02:30 PM' },
    { id: 'm2', sender: 'user', text: 'Yes guide, I am working through caching and route revalidation topics.', time: '02:45 PM' },
    { id: 'm3', sender: 'mentor', text: 'Good. Let me know when you submit the Capstone link in the workspace.', time: '02:48 PM' }
  ]);

  const [supportMessages, setSupportMessages] = useState<ChatMessage[]>([
    { id: 's1', sender: 'system', text: 'Welcome to Pinesphere ERP Direct Support Desk. How may we assist you?', time: '09:00 AM' },
    { id: 's2', sender: 'user', text: 'I am unable to see my updated KPI rating from last week.', time: '10:15 AM' },
    { id: 's3', sender: 'system', text: 'Guide ratings are synced at the end of every week. Please expect updates by Friday.', time: '10:16 AM' }
  ]);

  const handleSendChatMessage = (e: React.FormEvent) => {
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
      setChatInputText('');
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `reply-${Date.now()}`,
          sender: 'mentor',
          text: `Got your message! I'm reviewing the logs now. Keep up the great work.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMentorMessages(prev => [...prev, replyMsg]);
      }, 1500);
    } else {
      setSupportMessages(prev => [...prev, userMsg]);
      setChatInputText('');
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `reply-${Date.now()}`,
          sender: 'system',
          text: `Thank you for the update. Ticket #5819 has been refreshed. A support agent will review it shortly.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setSupportMessages(prev => [...prev, replyMsg]);
      }, 1500);
    }
  };

  // --- DOCUMENTS ---
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>([
    { id: 'doc1', name: 'Official_Offer_Letter.pdf', size: '1.2 MB', category: 'Official Documents', date: '2026-05-01', verified: true, downloadable: true },
    { id: 'doc2', name: 'Pinesphere_ERP_NDA_Signed.pdf', size: '2.4 MB', category: 'Official Documents', date: '2026-05-02', verified: true, downloadable: true },
    { id: 'doc3', name: 'College_NOC_Verification.pdf', size: '1.8 MB', category: 'Academics', date: '2026-05-05', verified: true, downloadable: false },
    { id: 'doc4', name: 'Identity_Proof_Aadhaar.pdf', size: '840 KB', category: 'Personal', date: '2026-05-05', verified: true, downloadable: false }
  ]);

  const [activeCertificate, setActiveCertificate] = useState<CertificateInfo | null>(null);

  const certificatesCatalog: CertificateInfo[] = [
    {
      id: 'cert1',
      title: 'Pinesphere React Specialist Certificate',
      description: 'Awarded for mastery of Enterprise React & Next.js Architecture, Server Components, and client-side performance optimizations.',
      issueDate: 'June 16, 2026',
      validationId: 'PS-RSC-2026-9812',
      type: 'Technical Achievement'
    },
    {
      id: 'cert2',
      title: 'Agile Scrum Practitioner Certificate',
      description: 'Awarded for demonstrating excellence in scrum workflows, Kanban tasks, and sprint delivery protocols.',
      issueDate: 'May 30, 2026',
      validationId: 'PS-ASP-2026-4401',
      type: 'Project Management'
    }
  ];

  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Academics');

  const handleUploadDocument = (e: React.FormEvent) => {
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

    setVaultFiles([newDoc, ...vaultFiles]);
    setUploadedFileName('');
    showToastNotification("Document uploaded. Verification pending!");
  };

  // --- STATICS & KPI ---
  const kpiStats = {
    technical: 88,
    delivery: 92,
    communication: 85,
    attendance: 98,
    collaboration: 90
  };

  const announcements = [
    { date: 'June 16, 2026', title: 'Sprint 3 Code Review & Core Audit Schedule', content: 'All capstone repositories must be synced with the main branch by June 19, 2026 for review by the architectural board.' },
    { date: 'June 14, 2026', title: 'Guest Lecture: Hydration Patterns at Scale', content: 'Technical presentation by the core engineering group of pinesphere.com on June 18 at 04:00 PM IST.' }
  ];

  return (
    <DashboardContext.Provider value={{
      username, setUsername,
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
      examHUDCompleted, setExamHUDCompleted, examHUDScore, pastExamResults, mockExamQuestions,
      handleStartExam, handleAnswerQuestion, handleSubmitExam, handleExitExamHUD,
      fees, paymentHistory, isPayModalOpen, setIsPayModalOpen, payAmountInput, setPayAmountInput,
      payMethod, setPayMethod, cardNumber, cardExpiry, cardCVV, cardName,
      handleCardNumberChange, handleCardExpiryChange, handleCardCVVChange, setCardName,
      isUPIScannerOpen, setIsUPIScannerOpen, upiTimer, handleProcessPayment, triggerUPISuccess,
      activeChatThread, setActiveChatThread, chatInputText, setChatInputText,
      mentorMessages, supportMessages, handleSendChatMessage,
      vaultFiles, activeCertificate, setActiveCertificate, certificatesCatalog,
      uploadedFileName, setUploadedFileName, uploadCategory, setUploadCategory, handleUploadDocument,
      kpiStats, announcements
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
