"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  GraduationCap,
  ListTodo,
  FolderGit2,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  FileText,
  MessageSquare,
  Clock,
  LogOut,
  Bell,
  Search,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  Upload,
  Download,
  Send,
  Video,
  AlertCircle,
  Menu,
  X,
  FileDown,
  Lock,
  RefreshCw,
  Eye,
  Check,
  Tv,
  BookOpen,
  ClipboardList,
  ClipboardCheck,
  Award,
  BarChart3,
  HelpCircle,
  Filter,
  AlertTriangle,
  UploadCloud,
  User
} from 'lucide-react';

// Interfaces for our state
interface AttendanceLog {
  date: string;
  clockIn: string;
  clockOut: string;
  duration: string;
  status: 'Present' | 'Checked In' | 'Absent';
}

interface TaskItem {
  id: string;
  title: string;
  description: string;
  category: string;
  deadline: string;
  status: 'todo' | 'in-progress' | 'in-review' | 'completed';
  submission?: string;
}

interface Course {
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

interface ChatMessage {
  id: string;
  sender: 'user' | 'system' | 'mentor';
  text: string;
  time: string;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [username, setUsername] = useState('Harini');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Close notification popup when clicking anywhere outside
  useEffect(() => {
    if (!showNotificationPopup) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && !target.closest('#notification-bell-widget')) {
        setShowNotificationPopup(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showNotificationPopup]);

  // Initialize username and other defaults on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pinesphere_username');
      if (stored) {
        setUsername(stored);
      }
    }
  }, []);

  // --- STATE 1: ATTENDANCE TRACKING & CHECK-IN ---
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [clockInTime, setClockInTime] = useState<string | null>('09:00 AM');
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([
    { date: '2026-06-16', clockIn: '09:00 AM', clockOut: 'Active', duration: '--', status: 'Checked In' },
    { date: '2026-06-15', clockIn: '09:01 AM', clockOut: '05:48 PM', duration: '8h 47m', status: 'Present' },
    { date: '2026-06-14', clockIn: '08:55 AM', clockOut: '06:02 PM', duration: '9h 07m', status: 'Present' },
    { date: '2026-06-13', clockIn: '09:12 AM', clockOut: '05:30 PM', duration: '8h 18m', status: 'Present' },
    { date: '2026-06-12', clockIn: '09:00 AM', clockOut: '05:50 PM', duration: '8h 50m', status: 'Present' },
    { date: '2026-06-11', clockIn: '08:45 AM', clockOut: '06:15 PM', duration: '9h 30m', status: 'Present' },
  ]);

  const handleCheckInToggle = () => {
    // Session is automatically active. Toggle capability is disabled.
    showToastNotification("Active session is managed automatically by the workstation.");
  };

  // Toast notifier helper
  const showToastNotification = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  };

  // --- STATE FOR AGENDA ---
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

  // --- STATE 2: LMS (MY LEARNING) ---
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

  // --- STATE 3: ASSIGNMENTS & KANBAN TASKS ---
  const [assignments, setAssignments] = useState([
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

  // --- STATE 4: CAPSTONE PROJECT WORKSPACE ---
  const [capstoneRepoLink, setCapstoneRepoLink] = useState('https://github.com/harini/pinesphere-intern-portal-capstone');
  const [capstoneLiveLink, setCapstoneLiveLink] = useState('');
  const [capstoneStatus, setCapstoneStatus] = useState<'Not Submitted' | 'Under Review' | 'Approved'>('Under Review');
  const [isEditingCapstone, setIsEditingCapstone] = useState(false);

  const [capstoneSubtasks, setCapstoneSubtasks] = useState([
    { id: 1, phase: 3, task: 'Configure routing structures & context API', completed: true },
    { id: 2, phase: 3, task: 'Complete dashboard overview layout designs', completed: true },
    { id: 3, phase: 3, task: 'Complete proctored assessment HUD pages', completed: true },
    { id: 4, phase: 3, task: 'Sync styling with high-contrast white & blue theme', completed: true },
    { id: 5, phase: 4, task: 'Design mock relational database tables schema', completed: false },
    { id: 6, phase: 4, task: 'Create REST API routes for attendance log synchronization', completed: false },
    { id: 7, phase: 4, task: 'Implement client JWT auth context interceptors', completed: false }
  ]);

  const [capstoneCommits, setCapstoneCommits] = useState([
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

  // --- STATE 5: ASSESSMENT & PROCTORED EXAM HUD ---
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

  // Proctoring focus loss listener
  useEffect(() => {
    if (!showExamHUD || examHUDCompleted) return;

    const handleBlur = () => {
      setExamHUDWarningCount(prev => {
        const nextCount = prev + 1;
        showToastNotification(`[PROCTORING WARNING] Focus lost! Warning count: ${nextCount}/3. Navigating away is prohibited.`);
        if (nextCount >= 3) {
          handleSubmitExam(true);
        }
        return nextCount;
      });
    };

    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('blur', handleBlur);
    };
  }, [showExamHUD, examHUDCompleted]);

  // Exam timer
  useEffect(() => {
    if (!showExamHUD || examHUDCompleted || examHUDSecRemaining <= 0) return;

    const timer = setInterval(() => {
      setExamHUDSecRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showExamHUD, examHUDCompleted, examHUDSecRemaining]);

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
    setExamHUDAnswers({
      ...examHUDAnswers,
      [examHUDQuestionIndex]: optionText
    });
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

  // --- STATE 6: FINANCIALS & BILLING ---
  const [fees, setFees] = useState({
    total: 0,
    paid: 0,
    balance: 0
  });

  const [paymentHistory, setPaymentHistory] = useState([
    { id: 'ALC-2026-FREE', date: '2026-05-01', amount: 0, method: 'System Grant', status: 'Free Internship' }
  ]);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmountInput, setPayAmountInput] = useState('15000');
  const [payMethod, setPayMethod] = useState('upi');

  // Credit Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardName, setCardName] = useState('');

  // UPI payment simulation
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

    // Process Credit Card Payment
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
    // Reset Card fields
    setCardNumber('');
    setCardExpiry('');
    setCardCVV('');
    setCardName('');
    showToastNotification("Credit Card processed and cleared successfully!");
  };

  // --- STATE 7: CHAT / MESSAGING ---
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

  // --- STATE 8: DOCUMENTS VAULT ---
  const [vaultFiles, setVaultFiles] = useState([
    { id: 'doc1', name: 'Official_Offer_Letter.pdf', size: '1.2 MB', category: 'Official Documents', date: '2026-05-01', verified: true, downloadable: true },
    { id: 'doc2', name: 'Pinesphere_ERP_NDA_Signed.pdf', size: '2.4 MB', category: 'Official Documents', date: '2026-05-02', verified: true, downloadable: true },
    { id: 'doc3', name: 'College_NOC_Verification.pdf', size: '1.8 MB', category: 'Academics', date: '2026-05-05', verified: true, downloadable: false },
    { id: 'doc4', name: 'Identity_Proof_Aadhaar.pdf', size: '840 KB', category: 'Personal', date: '2026-05-05', verified: true, downloadable: false }
  ]);

  interface CertificateInfo {
    id: string;
    title: string;
    description: string;
    issueDate: string;
    validationId: string;
    type: string;
  }

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

  // --- SYSTEM LOGS AND STATS ---
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
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-800 selection:bg-blue-600 selection:text-white relative overflow-x-hidden">

      {/* Subtle blueprint tech-grid watermark overlay */}
      <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none z-0" />

      {/* Dynamic Toast Notification banner */}
      {notificationToast && (
        <div className="fixed top-5 right-5 z-50 bg-blue-600 border border-blue-500 text-white font-bold py-3.5 px-6 shadow-xl animate-slide-in flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-blue-200" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* SIDEBAR NAVIGATION PANEL */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 transition-transform duration-300 flex flex-col justify-between shadow-sm ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>

        {/* Brand header */}
        <div>
          <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Pinesphere Logo" className="h-12 w-auto object-contain transition-transform hover:scale-[1.02]" />
            </Link>
            <button className="lg:hidden text-slate-400 hover:text-slate-600" onClick={() => setIsSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User profile capsule */}
          <div className="p-5 border-b border-slate-100/60 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-sm rounded-xl">
                {username.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-slate-800 truncate">{username}</div>
                <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Intern Developer</div>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1">
            {[
              { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'lms', label: 'My Learning', icon: BookOpen },
              { id: 'tasks', label: 'Assignments', icon: ClipboardList },
              { id: 'assessment', label: 'Assessments', icon: ClipboardCheck },
              { id: 'capstone', label: 'Projects', icon: FolderGit2 },
              { id: 'attendance', label: 'Attendance', icon: CalendarDays },
              { id: 'documents', label: 'Certificates', icon: Award },
              { id: 'financials', label: 'Payments', icon: CreditCard },
              { id: 'kpi', label: 'Performance', icon: BarChart3 },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold tracking-wide transition-all duration-200 ${isActive
                      ? 'bg-blue-50/70 text-blue-600 border-l-4 border-blue-600 pl-3.5'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:pl-5'
                    }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
          <button
            onClick={() => {
              setActiveTab('chat');
              if (window.innerWidth < 1024) setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeTab === 'chat'
                ? 'bg-blue-50/70 text-blue-600 border-l-4 border-blue-600 pl-3.5'
                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600 hover:pl-5'
            }`}
          >
            <HelpCircle className="h-4.5 w-4.5" />
            <span>Help Center</span>
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('pinesphere_username');
              router.push('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold text-xs transition-all duration-200"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER PANEL */}
      <div className="flex-1 min-h-screen flex flex-col transition-all duration-300 lg:pl-64 z-10 relative">

        {/* Top workspace bar */}
        <header className="h-16 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-500 hover:text-slate-800" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h2 className="text-sm font-bold text-slate-700 capitalize">
                Workspace / {activeTab === 'overview' ? 'dashboard' : activeTab.replace('-', ' ')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Static Active Session indicator in header */}
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 font-bold text-[10px] uppercase tracking-wider border border-emerald-250 bg-emerald-50 text-emerald-600">
              <Clock className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
              <span>Active</span>
            </div>

            {/* Notification bell widget */}
            <div className="relative" id="notification-bell-widget">
              <button
                onClick={() => setShowNotificationPopup(!showNotificationPopup)}
                className="h-9 w-9 bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors relative shadow-sm z-50"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-500 rounded-full" />
              </button>

              {showNotificationPopup && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50 animate-slide-in text-slate-850">
                  <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">
                    Recent ERP Notices
                  </h3>
                  <div className="space-y-3">
                    {announcements.map((an, idx) => (
                      <div key={idx} className="text-[11px] leading-relaxed">
                        <div className="flex items-center justify-between text-blue-600 font-bold mb-1">
                          <span className="hover:text-blue-700 transition-colors cursor-pointer">{an.title}</span>
                          <span className="text-[9px] text-slate-400">{an.date}</span>
                        </div>
                        <p className="text-slate-500">{an.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Initials capsule */}
            <div className="h-9 w-9 bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 rounded-full uppercase">
              {username.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </header>

        {/* Dashboard inner panels content layout */}
        <main className="flex-1 p-6 lg:p-8 relative">

          {/* Dynamic Switch render tab contents */}
          <div className="max-w-7xl mx-auto space-y-6">

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-slide-in">
                {/* Welcome Greeting panel - Dark blue and black gradient to capture pinesphere.com core colors */}
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 border border-slate-900 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-lg">
                  <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
                  <div className="space-y-2 relative z-10">
                    <h1 className="text-2xl sm:text-3xl font-black text-white">
                      Welcome Back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">{username}</span>
                    </h1>
                    <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                      Track your performance scorecards, attend lecture paths, submit project code assignments, and keep tabs on payments from one workspace.
                    </p>
                  </div>
                </div>

      {/* Key KPIs metric cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Attendance Target', value: '88%', desc: 'Threshold is 85%', status: 'Normal', color: 'border-l-4 border-emerald-500' },
          { title: 'LMS Progress', value: '33%', desc: '3 active modules complete', status: 'Ahead', color: 'border-l-4 border-blue-600' },
          { 
            title: 'Pending Dues', 
            value: fees.total === 0 ? 'Free' : `₹${fees.balance.toLocaleString()}`, 
            desc: fees.total === 0 ? 'Free Internship (Non-Paying)' : 'Next pay due by 30th June', 
            status: fees.total === 0 ? 'No Fees' : 'Due', 
            color: fees.total === 0 ? 'border-l-4 border-emerald-500' : 'border-l-4 border-amber-500' 
          },
          { title: 'Current KPI Score', value: `${((kpiStats.technical + kpiStats.delivery + kpiStats.communication) / 3).toFixed(1)}/100`, desc: 'Updated weekly', status: 'Excellent', color: 'border-l-4 border-indigo-600' }
        ].map((stat, idx) => (
          <div 
            key={idx} 
            className={`bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-500/40 hover:-translate-y-1 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 ease-out cursor-pointer ${stat.color}`}
          >
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</div>
            <div className="text-2xl font-black text-slate-800 mt-2 tracking-tight">{stat.value}</div>
            <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 mt-3 pt-2 border-t border-slate-100">
              <span>{stat.desc}</span>
              <span className="text-blue-600 font-bold uppercase tracking-wide">{stat.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Announcements and activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Latest notices */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md hover:border-blue-500/20 transition-all duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-600" />
                <span>Announcements</span>
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {announcements.map((an, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                    <span>{an.date}</span>
                    <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-sm">Official</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-850 hover:text-blue-600 transition-colors cursor-pointer">{an.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{an.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Capstone snippet */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-blue-500/30 transition-all duration-300">
            <div className="space-y-1.5">
              <div className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Workspace Project</div>
              <h4 className="font-bold text-sm text-slate-800">Capstone Work: AI ERP Integration Portal</h4>
              <p className="text-xs text-slate-500">Status: <span className="text-amber-600 font-semibold">{capstoneStatus}</span>. Under Guide evaluation.</p>
            </div>
            <Link
              href="/dashboard/capstone"
              className="w-full sm:w-auto px-4 py-2 border border-slate-200 hover:border-blue-600 hover:bg-blue-50 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors shadow-sm text-center"
            >
              Open Workspace
            </Link>
          </div>

          {/* Quick performance widget */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all duration-300">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
              LMS Track Progress
            </h3>
            <div className="space-y-3.5">
              {courses.slice(0, 2).map((course, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600 truncate max-w-[200px]">{course.title}</span>
                    <span className="text-blue-600">{course.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick controls & calendar tracker snippet */}
        <div className="space-y-6">
          {/* Active schedule checklist */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all duration-300">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
              Today&apos;s Agenda
            </h3>
            <ul className="space-y-3.5">
              {agenda.map((item) => (
                <li key={item.id} className="flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleToggleAgendaItem(item.id)}
                    className="flex items-center gap-3 text-left focus:outline-none group"
                  >
                    <span className={`h-4.5 w-4.5 border flex items-center justify-center transition-all ${item.completed
                        ? 'bg-emerald-500 border-emerald-600 text-white'
                        : 'bg-white border-slate-300 group-hover:border-blue-500 text-transparent'
                      }`}>
                      ✓
                    </span>
                    <span className={`transition-colors duration-200 ${item.completed ? 'line-through text-slate-400' : 'text-slate-600 font-medium group-hover:text-slate-800'}`}>
                      {item.task}
                    </span>
                  </button>
                  <span className="text-[10px] text-slate-400 font-bold">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>

                    {/* Internship Roadmap Progress (Circular Indicator) */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between card-premium-hover transition-all duration-300">
                      <h3 className="font-bold text-xs text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3">
                        Internship Timeline
                      </h3>
                      <div className="flex items-center justify-around gap-4 py-2">
                        <div className="relative h-24 w-24 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="48" cy="48" r="40" strokeWidth="5" stroke="#f1f5f9" fill="transparent" />
                            <circle cx="48" cy="48" r="40" strokeWidth="5" stroke="#3794d1" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.50)} strokeLinecap="round" className="transition-all duration-1000" />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-lg font-black text-slate-800">Week 6</span>
                            <span className="text-[7px] text-slate-450 font-bold uppercase">of 12 Weeks</span>
                          </div>
                        </div>
                        <div className="text-xs space-y-1">
                          <div className="font-bold text-slate-800">Timeline: 50% Complete</div>
                          <div className="text-slate-455 font-medium">Enrolled: May 05, 2026</div>
                          <div className="text-slate-455 font-semibold">Graduation: July 28, 2026</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ATTENDANCE LOGS */}
            {activeTab === 'attendance' && (
              <div className="space-y-6 animate-slide-in">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Check-In control card */}
                  <div className="bg-white border border-slate-200 rounded-xl/80 rounded-xl p-6 space-y-6 flex flex-col justify-between shadow-sm">
                    <div>
                      <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Tracker Node</span>
                      <h3 className="text-lg font-bold text-slate-800 mt-1">Live Check-In Portal</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2">
                        Clock in daily to log your hours. Ensure you coordinate with your guide regarding working windows. 85% attendance is required to graduate.
                      </p>
                    </div>

                    <div className="py-4 border-y border-slate-100 space-y-2.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-semibold">Today's Date:</span>
                        <span className="text-slate-750 font-bold">{new Date().toISOString().split('T')[0]}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-semibold">Session Entry:</span>
                        <span className="text-slate-750 font-bold">{clockInTime || '09:00 AM'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-semibold">Connection Status:</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active / Synced</span>
                        </span>
                      </div>
                    </div>

                    <div className="w-full py-4 text-center text-xs font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-100 text-emerald-600">
                      ✓ Auto-Logged Active
                    </div>
                  </div>

                  {/* Circular/stats chart indicators */}
                  <div className="bg-white border border-slate-200 rounded-xl/80 rounded-xl p-6 flex flex-col justify-between shadow-sm">
                    <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                      Metrics Overview
                    </h3>

                    <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
                      {/* Circle tracker */}
                      <div className="relative h-28 w-28 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="56" cy="56" r="48" strokeWidth="8" stroke="#f1f5f9" fill="transparent" />
                          <circle cx="56" cy="56" r="48" strokeWidth="8" stroke="#2563eb" fill="transparent" strokeDasharray="301.6" strokeDashoffset={301.6 * (1 - 0.88)} />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-xl font-black text-slate-800">88%</span>
                          <span className="text-[8px] text-slate-400 font-bold uppercase">Average</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 bg-blue-600 rounded-none" />
                          <span className="text-slate-500"><strong className="text-slate-800">15</strong> Present Days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 bg-red-500 rounded-none" />
                          <span className="text-slate-500"><strong className="text-slate-800">2</strong> Absent Days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 bg-slate-300 rounded-none" />
                          <span className="text-slate-500"><strong className="text-slate-800">1</strong> Leave Days</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3.5 border border-slate-100 text-[10px] text-slate-500 leading-relaxed">
                      💡 <strong>Intern Notice:</strong> Weekend leaves are pre-cleared.
                    </div>
                  </div>

                  {/* Calendar view */}
                  <div className="bg-white border border-slate-200 rounded-xl/80 rounded-xl p-6 space-y-4 shadow-sm">
                    <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                      June 2026 Calendar
                    </h3>
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 30 }).map((_, i) => {
                        const day = i + 1;
                        let bg = 'bg-slate-50 border border-slate-100 text-slate-400';
                        if (day <= 15) {
                          if (day === 7 || day === 14) bg = 'bg-slate-100/50 border border-slate-200/60 text-slate-400';
                          else if (day === 8) bg = 'bg-red-50 text-red-600 border border-red-100';
                          else bg = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
                        } else if (day === 16) {
                          bg = isCheckedIn ? 'bg-blue-600 text-white font-bold' : 'bg-blue-50 border border-blue-300 text-blue-600 animate-pulse';
                        }
                        return (
                          <div key={day} className={`h-8 flex items-center justify-center text-xs font-semibold ${bg}`}>
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Table list logs */}
                <div className="bg-white border border-slate-200 rounded-xl/80 rounded-xl p-6 space-y-4 shadow-sm">
                  <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Historical Check-In Log</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-150 text-slate-400 uppercase tracking-widest font-bold">
                          <th className="py-3 px-4">Log Date</th>
                          <th className="py-3 px-4">Clock In</th>
                          <th className="py-3 px-4">Clock Out</th>
                          <th className="py-3 px-4">Work Duration</th>
                          <th className="py-3 px-4">Grading Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-655">
                        {attendanceLogs.map((log, index) => (
                          <tr key={index} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 font-semibold text-slate-805">{log.date}</td>
                            <td className="py-3 px-4">{log.clockIn}</td>
                            <td className="py-3 px-4">{log.clockOut}</td>
                            <td className="py-3 px-4">{log.duration}</td>
                            <td className="py-3 px-4">
                              <span className="inline-block bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold px-2 py-0.5 rounded-sm">
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LMS (MY LEARNING) */}
            {activeTab === 'lms' && (
              <div className="space-y-6 animate-slide-in">
                {selectedCourse ? (
                  /* COURSE WORKSPACE VIEW */
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                      <button
                        onClick={() => setSelectedCourse(null)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
                      >
                        ← Back to Course Catalog
                      </button>
                      <h4 className="font-black text-xs text-slate-700 uppercase tracking-widest">{selectedCourse.title}</h4>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Video Player */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-900 border border-slate-200 relative aspect-video overflow-hidden flex flex-col justify-between shadow-sm">
                          <video
                            autoPlay={isVideoPlaying}
                            muted
                            loop
                            playsInline
                            src={selectedCourse.lectures[selectedLectureIndex]?.videoUrl}
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                          />
                          {!isVideoPlaying && (
                            <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center z-20">
                              <button
                                onClick={() => setIsVideoPlaying(true)}
                                className="h-16 w-16 bg-blue-600 hover:bg-blue-700 text-white rounded-none flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                              >
                                <Play className="h-8 w-8 fill-current translate-x-0.5" />
                              </button>
                            </div>
                          )}
                          <div className="relative z-30 mt-auto bg-gradient-to-t from-slate-950 to-transparent p-4 flex items-center justify-between">
                            <button
                              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                              className="h-8 w-8 bg-slate-900 border border-slate-800 text-white hover:text-blue-400 flex items-center justify-center transition-colors"
                            >
                              {isVideoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current animate-pulse" />}
                            </button>
                            <span className="text-[10px] font-bold text-slate-300 tracking-wider">
                              Lecture {selectedLectureIndex + 1} of {selectedCourse.lectures.length} ({selectedCourse.lectures[selectedLectureIndex]?.duration})
                            </span>
                            <button
                              onClick={() => handleMarkLectureComplete(selectedCourse.id, selectedLectureIndex)}
                              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-colors ${selectedCourse.lectures[selectedLectureIndex]?.completed
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500/20'
                                }`}
                            >
                              {selectedCourse.lectures[selectedLectureIndex]?.completed ? 'Completed ✓' : 'Mark Complete'}
                            </button>
                          </div>
                        </div>

                        {/* Lecture Notes */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                            Lecture Syllabus & Notes
                          </h3>
                          <div className="text-xs leading-relaxed text-slate-600 space-y-4">
                            <h4 className="font-bold text-blue-600 text-sm">
                              {selectedCourse.lectures[selectedLectureIndex]?.title}
                            </h4>
                            <p className="bg-slate-50 p-4 border border-slate-150 font-mono text-slate-500 leading-relaxed">
                              {selectedCourse.lectures[selectedLectureIndex]?.notes}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Course Content list */}
                      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                        <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                          Course Content
                        </h3>
                        <div className="space-y-2">
                          {selectedCourse.lectures.map((lec, idx) => {
                            const isCurrent = idx === selectedLectureIndex;
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  setSelectedLectureIndex(idx);
                                  setIsVideoPlaying(false);
                                }}
                                className={`w-full text-left p-3.5 border transition-all text-xs flex justify-between items-center ${isCurrent
                                    ? 'bg-blue-650 border-blue-600 text-white font-bold'
                                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                                  }`}
                              >
                                <div className="space-y-1 overflow-hidden pr-2">
                                  <div className="font-bold truncate">{lec.title}</div>
                                  <div className={`text-[9px] font-medium ${isCurrent ? 'text-blue-100' : 'text-slate-400'}`}>
                                    {lec.duration}
                                  </div>
                                </div>
                                <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] font-bold border ${lec.completed
                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                    : 'bg-white border-slate-200 text-slate-400'
                                  }`}>
                                  {lec.completed ? '✓' : idx + 1}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* COURSE CATALOG INDEX */
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-900 text-white p-6 shadow-md">
                      <span className="text-[9px] font-bold text-blue-200 uppercase tracking-widest">Education Terminal</span>
                      <h2 className="text-xl font-bold text-white mt-1">LMS Learning Pathways</h2>
                      <p className="text-xs text-blue-100 mt-2 max-w-xl">
                        Enrolled modules designed by Pinesphere Enterprise. Watch sessions, log modules completed, and verify test components.
                      </p>
                    </div>

                    {/* Filters Toolbar */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                      {/* Category Buttons */}
                      <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        {[
                          { key: 'all', label: 'All Pathways' },
                          { key: 'frontend', label: 'Frontend UI' },
                          { key: 'backend', label: 'Backend Dev' },
                          { key: 'system', label: 'System Ops' }
                        ].map((cat) => (
                          <button
                            key={cat.key}
                            onClick={() => setLmsCategoryFilter(cat.key)}
                            className={`px-4 py-2 text-xs font-bold transition-all border ${lmsCategoryFilter === cat.key
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>

                      {/* Search Input */}
                      <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search modules..."
                          value={lmsSearch}
                          onChange={(e) => setLmsSearch(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Course Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {courses.filter(course => {
                        const matchesSearch = course.title.toLowerCase().includes(lmsSearch.toLowerCase()) || course.category.toLowerCase().includes(lmsSearch.toLowerCase());
                        const matchesCategory = lmsCategoryFilter === 'all' || course.category.toLowerCase().includes(lmsCategoryFilter);
                        return matchesSearch && matchesCategory;
                      }).map((course) => (
                        <div key={course.id} className="bg-white border border-slate-200 rounded-xl/80 rounded-xl overflow-hidden flex flex-col justify-between hover:border-blue-600/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer">
                          <img src={course.image} alt={course.title} className="h-44 w-full object-cover border-b border-slate-100" />
                          <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-2 py-0.5">
                                {course.category}
                              </span>
                              {course.progress === 100 && (
                                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-2 py-0.5 animate-pulse">
                                  ✓ Cleared
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-sm text-slate-800 leading-snug line-clamp-2 min-h-[40px]">
                              {course.title}
                            </h3>

                            <div className="space-y-1.5 pt-2">
                              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                <span>Progress Complete</span>
                                <span>{course.progress}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100">
                                <div className="h-full bg-blue-600 transition-all duration-350" style={{ width: `${course.progress}%` }} />
                              </div>
                            </div>

                            {course.progress === 100 ? (
                              <button
                                onClick={() => {
                                  setActiveTab('documents');
                                  showToastNotification(`Pathway complete! Certificate is ready.`);
                                }}
                                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all uppercase tracking-wider"
                              >
                                Claim Certificate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSelectCourse(course)}
                                className="w-full py-2.5 bg-slate-50 border border-slate-205 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-xs font-bold text-slate-700 transition-all uppercase tracking-wider"
                              >
                                Open Curriculum
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Empty state */}
                      {courses.filter(course => {
                        const matchesSearch = course.title.toLowerCase().includes(lmsSearch.toLowerCase()) || course.category.toLowerCase().includes(lmsSearch.toLowerCase());
                        const matchesCategory = lmsCategoryFilter === 'all' || course.category.toLowerCase().includes(lmsCategoryFilter);
                        return matchesSearch && matchesCategory;
                      }).length === 0 && (
                        <div className="col-span-full bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-455 space-y-2">
                          <AlertCircle className="h-8 w-8 text-slate-300 mx-auto" />
                          <p className="text-xs font-medium">No courses found matching criteria.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
{activeTab === 'tasks' && (
              <div className="space-y-6 animate-slide-in">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <span>Curriculum</span>
                      <span>&gt;</span>
                      <span className="text-blue-600 font-extrabold">Assignments</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Project Assignments & Tasks</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Track your academic progress and deliverable milestones across all modules.
                    </p>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => showToastNotification("Filter options: All, Pending, Under Review, Completed.")}
                      className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-blue-600 hover:text-blue-600 bg-white rounded-lg text-xs font-bold text-slate-700 shadow-sm transition-all duration-200 cursor-pointer"
                    >
                      <Filter className="h-3.5 w-3.5" />
                      <span>Filter</span>
                    </button>
                    <button 
                      onClick={() => showToastNotification("Exporting assignments to CSV...")}
                      className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-blue-600 hover:text-blue-600 bg-white rounded-lg text-xs font-bold text-slate-700 shadow-sm transition-all duration-200 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                {/* Tab Filters Navigation Bar */}
                <div className="border-b border-slate-200 flex items-center gap-6 text-xs font-bold tracking-wide">
                  {[
                    { key: 'all', label: `All Tasks (${assignments.length})` },
                    { 
                      key: 'pending', 
                      label: `Pending Submission`, 
                      badge: assignments.filter(a => a.status === 'pending').length 
                    },
                    { 
                      key: 'review', 
                      label: `Under Review`, 
                      badge: assignments.filter(a => a.status === 'review').length 
                    },
                    { 
                      key: 'completed', 
                      label: `Completed`, 
                      badge: assignments.filter(a => a.status === 'completed').length 
                    }
                  ].map((tab) => {
                    const isActive = assignmentFilter === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setAssignmentFilter(tab.key as any)}
                        className={`py-3 relative flex items-center gap-2 transition-all cursor-pointer ${
                          isActive ? 'text-blue-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <span>{tab.label}</span>
                        {tab.badge !== undefined && (
                          <span className={`h-4.5 min-w-4.5 px-1.5 flex items-center justify-center text-[9px] font-black rounded-full ${
                            isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {tab.badge}
                          </span>
                        )}
                        {isActive && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-6 flex flex-col">
                  {assignments
                    .filter((asg) => {
                      if (assignmentFilter === 'all') return true;
                      return asg.status === assignmentFilter;
                    })
                    .map((asg) => {
                      const isOverdue = asg.isOverdue;
                      const isLocked = asg.isLocked;
                      const hasUploadedFile = uploadedFiles[asg.id];

                      return (
                        <div
                          key={asg.id}
                          className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300 relative"
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                            <div className="flex-1 space-y-3">
                              {/* Header Pill & ID */}
                              <div className="flex items-center gap-2 text-xs">
                                {isOverdue ? (
                                  <span className="bg-[#F97316] text-white font-extrabold text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wide flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                    OVERDUE - LEVEL 1 ESCALATION ACTIVE
                                  </span>
                                ) : (
                                  <span className="bg-slate-100 text-slate-500 font-extrabold text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wide">
                                    PENDING
                                  </span>
                                )}
                                <span className="text-slate-400 font-medium">• ID: {asg.id}</span>
                              </div>

                              {/* Title */}
                              <h3 className="text-base font-bold text-slate-800 tracking-tight leading-snug">
                                {asg.title}
                              </h3>

                              {/* Metadata */}
                              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium pt-1">
                                {asg.assignedBy && (
                                  <div className="flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5 text-slate-400" />
                                    <span>Assigned by: <strong className="text-slate-655 font-semibold">{asg.assignedBy}</strong></span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                  {isOverdue ? (
                                    <>
                                      <CalendarDays className="h-3.5 w-3.5 text-red-500" />
                                      <span className="text-red-500 font-bold">
                                        Due Date: {asg.dueDate}
                                      </span>
                                    </>
                                  ) : asg.id === 'Pr-2026-3Px' ? (
                                    <>
                                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                                      <span className="text-amber-500 font-bold">
                                        Due Date: {asg.dueDate}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                                      <span>
                                        Due Date: {asg.dueDate}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Overdue Warning Alert Box */}
                              {isOverdue && asg.alert && (
                                <div className="bg-red-50/70 border border-red-100 rounded-lg p-3.5 mt-4 flex items-start gap-2.5">
                                  <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                  <span className="text-xs text-red-750 font-medium leading-relaxed">
                                    Alert: This overdue assignment has automatically notified your Reporting Manager. High-priority resolution required to avoid academic credit deduction.
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Action block on the right */}
                            <div className="flex flex-col items-end justify-start gap-2 shrink-0 md:self-stretch md:justify-between">
                              {isLocked ? (
                                <div className="flex items-center justify-center h-full pr-2">
                                  <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                              ) : asg.status === 'pending' ? (
                                <div className="flex flex-col items-end gap-2 w-full md:w-auto mt-2 md:mt-0">
                                  <button
                                    onClick={() => {
                                      if (activeUploadAssignmentId === asg.id) {
                                        setActiveUploadAssignmentId(null);
                                      } else {
                                        setActiveUploadAssignmentId(asg.id);
                                      }
                                    }}
                                    className={`w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer ${
                                      asg.id === 'PS-2026-W3'
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white animate-pulse'
                                        : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-655'
                                    }`}
                                  >
                                    {asg.id === 'Pr-2026-3Px' && <Upload className="h-3.5 w-3.5" />}
                                    <span>{asg.id === 'PS-2026-W3' ? 'Submit Work Now' : 'Upload Deliverables'}</span>
                                  </button>
                                  {asg.id === 'PS-2026-W3' && (
                                    <button
                                      onClick={() => showToastNotification("Viewing instruction PDF...")}
                                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline cursor-pointer"
                                    >
                                      <span>View Instructions</span>
                                      <span className="text-sm">→</span>
                                    </button>
                                  )}
                                </div>
                              ) : asg.status === 'review' ? (
                                <span className="bg-blue-50 border border-blue-100 text-blue-600 font-extrabold text-[10px] px-3 py-1.5 uppercase tracking-wide rounded-sm mt-2 md:mt-0">
                                  Under Review
                                </span>
                              ) : (
                                <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 font-extrabold text-[10px] px-3 py-1.5 uppercase tracking-wide rounded-sm mt-2 md:mt-0">
                                  Completed ✓
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Expandable Dotted Dropzone (Only shown when activeUploadAssignmentId matches asg.id) */}
                          {activeUploadAssignmentId === asg.id && !isLocked && asg.status === 'pending' && (
                            <div className="border-t border-slate-100 pt-5 mt-5 animate-slide-in">
                              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 flex flex-col items-center justify-center text-center">
                                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                                  <UploadCloud className="h-5 w-5" />
                                </div>
                                <h4 className="text-xs font-bold text-slate-700">Drag and drop your files here</h4>
                                <p className="text-[10px] text-slate-400 font-semibold max-w-md mt-1 leading-relaxed">
                                  Upload your submission deliverables. Code files max 10MB (.zip, .py) | Reports max 50MB (PDF only).
                                </p>
                                
                                {hasUploadedFile ? (
                                  <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-3 max-w-sm">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <div className="text-left overflow-hidden">
                                      <div className="text-xs font-bold text-slate-700 truncate">{hasUploadedFile}</div>
                                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Ready to upload</div>
                                    </div>
                                    <button
                                      onClick={() => handleRemoveFile(asg.id)}
                                      className="text-red-500 hover:text-red-750 font-bold text-xs p-1 ml-auto cursor-pointer"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : null}

                                <div className="flex items-center gap-3 mt-4">
                                  <button
                                    onClick={() => handleSimulateBrowse(asg.id)}
                                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-655 font-bold text-xs px-4 py-1.5 shadow-sm transition-colors cursor-pointer"
                                  >
                                    Browse Files
                                  </button>
                                  {hasUploadedFile && (
                                    <button
                                      onClick={() => handleSimulateSubmit(asg.id)}
                                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-1.5 shadow-sm transition-colors cursor-pointer"
                                    >
                                      Simulate Upload
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* TAB 5: CAPSTONE PROJECT */}
            {activeTab === 'capstone' && (
              <div className="space-y-6 animate-slide-in">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <span>Curriculum</span>
                      <span>&gt;</span>
                      <span className="text-blue-600 font-extrabold">Projects</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Capstone Projects</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Track your milestones, subtasks progression, guide reviews and commits history.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left columns */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Active Workspace Info */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                      <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-2 py-0.5">
                        Active Workspace Project
                      </span>
                      <h2 className="text-xl font-bold text-slate-800 mt-1">Pinesphere Intern ERP & Assessment Client</h2>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        The Capstone project is a critical component of graduation parameters. Complete building the ERP Client interfaces, test integrations, and submit repository connections.
                      </p>

                      <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Guide / Mentor</span>
                          <span className="text-slate-800 font-semibold mt-1 block">Mr. Anand Jayavel (Senior Architect)</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Submission Status</span>
                          <span className="text-amber-600 font-semibold mt-1 block">{capstoneStatus}</span>
                        </div>
                      </div>
                    </div>

                    {/* Capstone Phase Roadmap */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
                      <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                        Capstone Phase Roadmap
                      </h3>

                      <div className="relative pl-6 space-y-6 border-l border-slate-200">
                        {[
                          { title: 'Phase 1: Project Outline Proposal', desc: 'Define functional features and database structures.', status: 'completed' },
                          { title: 'Phase 2: UI Wireframes & Mockups', desc: 'Deliver Figma layout designs and theme configurations.', status: 'completed' },
                          { title: 'Phase 3: Frontend Development & State Layouts', desc: 'Build Next.js client pages and state controls.', status: 'active' },
                          { title: 'Phase 4: API Integrations & Database Tests', desc: 'Sync API middlewares and log tables.', status: 'pending' },
                          { title: 'Phase 5: Deployment & Proctored Client Audits', desc: 'Final launch checks and verification reviews.', status: 'pending' },
                        ].map((ph, idx) => (
                          <div key={idx} className="relative">
                            <span className={`absolute -left-9 top-0.5 h-6 w-6 rounded-none flex items-center justify-center text-[10px] font-bold border ${ph.status === 'completed'
                                ? 'bg-emerald-500 border-emerald-600 text-white'
                                : ph.status === 'active'
                                  ? 'bg-blue-600 border-blue-500 text-white animate-pulse'
                                  : 'bg-slate-100 border-slate-200 text-slate-400'
                              }`}>
                              {idx + 1}
                            </span>
                            <div className="space-y-1">
                              <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                                <span>{ph.title}</span>
                                {ph.status === 'completed' && <span className="text-[8px] bg-emerald-50 border border-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-sm uppercase">Cleared</span>}
                                {ph.status === 'active' && <span className="text-[8px] bg-blue-50 border border-blue-100 text-blue-600 px-1.5 py-0.5 rounded-sm uppercase">Active Development</span>}
                              </h4>
                              <p className="text-[11px] text-slate-500">{ph.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Detailed Checklist of Subtasks for Phase 3 and Phase 4 */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">
                          Phase 3 & 4 Subtask Verification
                        </h3>
                        <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 border border-blue-100">
                          {capstoneSubtasks.filter(t => t.completed).length} / {capstoneSubtasks.length} Completed
                        </span>
                      </div>
                      <div className="space-y-3">
                        {capstoneSubtasks.map((task) => (
                          <div key={task.id} className="flex items-start justify-between gap-4 text-xs">
                            <button
                              onClick={() => handleToggleSubtask(task.id)}
                              className="flex items-start gap-3 text-left focus:outline-none group mt-0.5"
                            >
                              <span className={`h-4.5 w-4.5 border flex items-center justify-center transition-all shrink-0 ${task.completed
                                  ? 'bg-emerald-500 border-emerald-650 text-white'
                                  : 'bg-white border-slate-300 group-hover:border-blue-500 text-transparent'
                                }`}>
                                ✓
                              </span>
                              <div className="space-y-0.5">
                                <span className={task.completed ? 'line-through text-slate-400' : 'text-slate-655 font-medium'}>
                                  {task.task}
                                </span>
                                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                                  Phase {task.phase} check
                                </span>
                              </div>
                            </button>
                            <span className={`text-[8px] font-bold uppercase tracking-wider border px-1.5 py-0.5 shrink-0 ${task.completed
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                              : 'bg-amber-50 border-amber-100 text-amber-600'
                            }`}>
                              {task.completed ? 'Passed' : 'Pending'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Guide Review Syncs & Commits logs */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                      <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                        Guide Code Review Comments & Commits Log
                      </h3>
                      <div className="space-y-4">
                        {capstoneCommits.map((item, idx) => (
                          <div key={idx} className="border-l-2 border-blue-500 pl-4 py-1 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 border border-slate-200 text-[10px]">
                                  {item.commit}
                                </span>
                                <span className="font-bold text-slate-800">{item.message}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-semibold">{item.date}</span>
                            </div>
                            <div className="text-[11px] text-slate-450">
                              Authored by: <strong className="text-slate-500">{item.author}</strong>
                            </div>
                            {item.guideComment ? (
                              <div className="bg-blue-50/50 border border-blue-100 p-3 text-xs text-blue-755 italic">
                                💬 <strong>{item.guideComment.split(':')[0]}:</strong>
                                <span>{item.guideComment.split(':').slice(1).join(':')}</span>
                              </div>
                            ) : (
                              <div className="text-[10px] text-slate-405 italic">No feedback comments logged on this commit.</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="space-y-6">
                    {/* Project Link Submission */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
                      <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                        Project Link Submission
                      </h3>

                      {isEditingCapstone ? (
                        <form onSubmit={handleSaveCapstone} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">GitHub Code Link</label>
                            <input
                              type="url"
                              required
                              value={capstoneRepoLink}
                              onChange={(e) => setCapstoneRepoLink(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Live Deployment Link</label>
                            <input
                              type="url"
                              placeholder="https://my-app.vercel.app"
                              value={capstoneLiveLink}
                              onChange={(e) => setCapstoneLiveLink(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white uppercase tracking-wider"
                          >
                            Submit Project Links
                          </button>
                        </form>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-1 bg-slate-50 p-3.5 border border-slate-150">
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">GitHub Code Repository</span>
                            <span className="text-xs text-blue-600 font-semibold truncate block hover:underline cursor-pointer">{capstoneRepoLink || 'Not Linked'}</span>
                          </div>
                          <div className="space-y-1 bg-slate-50 p-3.5 border border-slate-150">
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Live Deploy Link</span>
                            <span className="text-xs text-blue-600 font-semibold truncate block hover:underline cursor-pointer">{capstoneLiveLink || 'Not Linked'}</span>
                          </div>
                          <button
                            onClick={() => setIsEditingCapstone(true)}
                            className="w-full py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-850 text-xs font-bold text-slate-655 uppercase tracking-wider transition-colors"
                          >
                            Modify Submissions
                          </button>
                        </div>
                      )}

                      <div className="bg-slate-50 p-4 border border-slate-150 text-xs text-slate-500 space-y-2">
                        <div className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">Syllabus Criteria:</div>
                        <p className="leading-relaxed">
                          • Verified deployment in Vercel<br />
                          • JWT authorization modules active<br />
                          • Validated check-in/out logs synced
                        </p>
                      </div>
                    </div>

                    {/* Staging Build diagnostics preview logs */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                      <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                        Staging Build Diagnostics
                      </h3>
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-semibold">Deploy Target:</span>
                          <span className="text-slate-850 font-bold bg-blue-50 border border-blue-100 text-blue-600 px-1.5 py-0.5">Vercel Serverless</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-semibold">Active Branch:</span>
                          <span className="text-slate-800 font-mono font-bold">main</span>
                        </div>

                        {/* Diagnostics Log Screen */}
                        <div className="bg-slate-900 text-slate-200 p-3.5 font-mono text-[10px] h-32 overflow-y-auto space-y-1.5 rounded-sm">
                          {lintLogs.length === 0 ? (
                            <span className="text-slate-550 italic">No diagnostics logs parsed. Click trigger button to run.</span>
                          ) : (
                            lintLogs.map((log, lIdx) => (
                              <div key={lIdx} className={log.startsWith('✓') || log.includes('Passed') ? 'text-emerald-450' : 'text-blue-300'}>
                                {log}
                              </div>
                            ))
                          )}
                        </div>

                        <button
                          disabled={isLintingActive}
                          onClick={runDiagnostics}
                          className="w-full py-2 border border-blue-600 hover:bg-blue-650 hover:text-white text-blue-650 font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                        >
                          {isLintingActive ? 'Running Diagnostics...' : 'Trigger Staging Rebuild'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: KPI ANALYTICS SCORECARD */}
            {activeTab === 'kpi' && (
              <div className="space-y-6 animate-slide-in">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Performance dimensions */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
                      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                        <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">
                          KPI Performance Dimensions
                        </h3>
                        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Updated 1 day ago</span>
                      </div>

                      <div className="space-y-4">
                        {[
                          { label: 'Technical Implementation (TypeScript, Next.js)', score: kpiStats.technical, color: 'bg-blue-650' },
                          { label: 'Task Delivery & Timeline Punctuality', score: kpiStats.delivery, color: 'bg-indigo-600' },
                          { label: 'Communication & Active Coordinator Syncs', score: kpiStats.communication, color: 'bg-purple-600' },
                          { label: 'Attendance Rate', score: kpiStats.attendance, color: 'bg-emerald-600' },
                          { label: 'Collaboration & Team Peer Syncs', score: kpiStats.collaboration, color: 'bg-teal-600' }
                        ].map((stat, idx) => (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-slate-500">{stat.label}</span>
                              <span className="text-slate-855">{stat.score}/100</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 overflow-hidden">
                              <div className={`h-full transition-all duration-700 ${stat.color}`} style={{ width: `${stat.score}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Week-by-Week Performance Progression Chart */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                      <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                        Weekly Progression Trends
                      </h3>
                      <div className="h-56 w-full flex items-end justify-around pt-8 border-b border-slate-150 pr-4">
                        {[
                          { week: 'W1', score: 75, date: 'May 08' },
                          { week: 'W2', score: 80, date: 'May 15' },
                          { week: 'W3', score: 85, date: 'May 22' },
                          { week: 'W4', score: 92, date: 'May 29' },
                          { week: 'W5', score: 88, date: 'June 05' },
                          { week: 'W6', score: 91, date: 'June 12' },
                        ].map((week, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-2 group relative">
                            {/* Hover Tooltip */}
                            <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-150 bg-slate-900 text-white text-[9px] font-bold py-1 px-2 shadow-md rounded-none whitespace-nowrap z-10">
                              Score: {week.score}% ({week.date})
                            </div>
                            <span className="text-[10px] font-bold text-blue-600 opacity-80">{week.score}%</span>
                            <div
                              className="w-8 bg-gradient-to-t from-blue-700 via-blue-500 to-indigo-500 transition-all duration-1000 group-hover:from-blue-650 group-hover:to-indigo-650"
                              style={{ height: `${week.score * 1.4}px` }}
                            />
                            <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">{week.week}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold text-center mt-2">
                        Bi-weekly rating averages are calculated from pull requests and assignment reviews.
                      </div>
                    </div>

                    {/* Weak/Strong technical highlights list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Strengths */}
                      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                        <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span>Technical Highlights (Strengths)</span>
                        </h4>
                        <ul className="space-y-2.5 text-xs">
                          <li className="flex items-start gap-2 text-slate-655 leading-relaxed">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span><strong>Next.js App Routing Layouts</strong>: Excellent structure definitions.</span>
                          </li>
                          <li className="flex items-start gap-2 text-slate-655 leading-relaxed">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span><strong>State Management Interceptors</strong>: Solid handling of local states.</span>
                          </li>
                          <li className="flex items-start gap-2 text-slate-655 leading-relaxed">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span><strong>Proctored Exam Focus Checks</strong>: Clean implementation of blur/focus locks.</span>
                          </li>
                        </ul>
                      </div>

                      {/* Growth Areas / Weaknesses */}
                      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                        <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          <span>Growth Dimensions (Weak Highlights)</span>
                        </h4>
                        <ul className="space-y-2.5 text-xs">
                          <li className="flex items-start gap-2 text-slate-655 leading-relaxed">
                            <span className="text-amber-500 font-bold">•</span>
                            <span><strong>Database Cascade Operations</strong>: Refine delete constraints in nested queries.</span>
                          </li>
                          <li className="flex items-start gap-2 text-slate-655 leading-relaxed">
                            <span className="text-amber-500 font-bold">•</span>
                            <span><strong>Hydration Mismatch Audits</strong>: Eliminate client side state conflicts on render.</span>
                          </li>
                          <li className="flex items-start gap-2 text-slate-655 leading-relaxed">
                            <span className="text-amber-500 font-bold">•</span>
                            <span><strong>Message Queue Broker Pools</strong>: Dive deeper into partitioning strategies.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Mentor Reviews */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
                      <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                        Mentor Reviews & Sync Logs
                      </h3>
                      <div className="space-y-4 divide-y divide-slate-150">
                        {[
                          { reviewer: 'Mr. Anand Jayavel (Senior Architect)', date: 'June 12, 2026', comment: 'Harini showed great technical skill in deploying server components and optimizing API gateways. Work on unit tests next sprint.' },
                          { reviewer: 'System Operations Team', date: 'June 05, 2026', comment: 'Punctuality parameters are highly secure. Verified check-in logs show consistent coverage.' }
                        ].map((rev, idx) => (
                          <div key={idx} className="pt-4 first:pt-0 space-y-2 text-xs">
                            <div className="flex justify-between items-center text-[10px] font-bold">
                              <span className="text-blue-600">{rev.reviewer}</span>
                              <span className="text-slate-400">{rev.date}</span>
                            </div>
                            <p className="text-slate-500 leading-relaxed italic">
                              "{rev.comment}"
                            </p>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => showToastNotification("Downloading Harini_KPI_Report.pdf...")}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider text-center block transition-colors mt-2"
                      >
                        Download Report PDF
                      </button>
                    </div>

                    {/* Self Evaluation checkin */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                      <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                        Self-Evaluation Request
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Complete your monthly self-assessment reviews. Your coordinator Mr. Anand will check it during the sync logs cycle.
                      </p>
                      <button
                        onClick={() => showToastNotification("Evaluation request sent to coordinator.")}
                        className="w-full py-2 border border-slate-200 hover:border-blue-600 hover:bg-blue-50 text-xs font-bold text-slate-705 hover:text-blue-600 transition-colors"
                      >
                        Submit Self-Assessment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: ASSESSMENTS */}
            {activeTab === 'assessment' && (
              <div className="space-y-6 animate-slide-in">
                {showExamHUD ? (
                  /* EXAM INTERFACE OVERLAY */
                  <div className="bg-white border border-red-200 rounded-2xl p-6 space-y-6 animate-slide-in relative shadow-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-red-50 border border-red-100 p-4 gap-4">
                      <div>
                        <span className="text-[8px] font-bold text-red-655 uppercase tracking-widest bg-red-100 border border-red-200 px-2 py-0.5 animate-pulse">
                          PROCTOR ACTIVE
                        </span>
                        <h4 className="font-bold text-xs text-slate-800 mt-1.5">
                          ERP Assessment Exam Gateway (Client Mode)
                        </h4>
                      </div>
                      <div className="flex gap-4 text-xs font-bold">
                        <div className="text-amber-600">
                          Warnings: {examHUDWarningCount}/3
                        </div>
                        <div className="text-slate-800">
                          Time Left: {Math.floor(examHUDSecRemaining / 60)}:{(examHUDSecRemaining % 60).toString().padStart(2, '0')}
                        </div>
                      </div>
                    </div>

                    {examHUDCompleted ? (
                      <div className="text-center py-12 space-y-6 max-w-md mx-auto">
                        <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-none flex items-center justify-center mx-auto shadow-sm">
                          <ShieldCheck className="h-10 w-10" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-slate-800">Assessment Exam Submitted</h3>
                          <p className="text-xs text-slate-500">
                            Your scores have been parsed and synced with student analytics metrics.
                          </p>
                        </div>
                        <div className="bg-slate-50 p-6 border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified Score</span>
                          <div className="text-3xl font-black text-slate-800 mt-2">{examHUDScore} / 100</div>
                        </div>
                        <button
                          onClick={handleExitExamHUD}
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white uppercase tracking-wider"
                        >
                          Exit Assessment Mode
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="bg-slate-50 border border-slate-200 p-4 space-y-4">
                          <h5 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Question Palette</h5>
                          <div className="grid grid-cols-4 gap-2">
                            {mockExamQuestions.map((q, idx) => {
                              const isCurrent = idx === examHUDQuestionIndex;
                              const isAnswered = examHUDAnswers[idx] !== undefined;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => setExamHUDQuestionIndex(idx)}
                                  className={`h-9 text-xs font-bold border transition-colors ${isCurrent
                                      ? 'bg-blue-600 border-blue-500 text-white font-bold'
                                      : isAnswered
                                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                        : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
                                    }`}
                                >
                                  {idx + 1}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="lg:col-span-3 bg-slate-50 border border-slate-200 p-6 space-y-6">
                          <div className="space-y-2 text-xs">
                            <span className="text-blue-600 font-bold uppercase tracking-wider text-[9px]">Question {examHUDQuestionIndex + 1} of {mockExamQuestions.length}</span>
                            <h4 className="text-sm font-bold text-slate-800 leading-relaxed">
                              {mockExamQuestions[examHUDQuestionIndex]?.question}
                            </h4>
                          </div>

                          <div className="space-y-2">
                            {mockExamQuestions[examHUDQuestionIndex]?.options.map((option, idx) => {
                              const isSelected = examHUDAnswers[examHUDQuestionIndex] === option;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleAnswerQuestion(option)}
                                  className={`w-full text-left p-4 border transition-all text-xs flex items-center justify-between ${isSelected
                                      ? 'bg-blue-50 border-blue-500 text-slate-800 font-medium'
                                      : 'bg-white border-slate-200 text-slate-655 hover:bg-slate-100/50'
                                    }`}
                                >
                                  <span>{option}</span>
                                  <span className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center text-[10px] ${isSelected
                                      ? 'bg-blue-600 border-blue-500 text-white'
                                      : 'border-slate-300'
                                    }`}>
                                    {isSelected && '✓'}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                            <button
                              disabled={examHUDQuestionIndex === 0}
                              onClick={() => setExamHUDQuestionIndex(prev => prev - 1)}
                              className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold text-slate-705 uppercase tracking-wider transition-colors"
                            >
                              Previous
                            </button>
                            {examHUDQuestionIndex === mockExamQuestions.length - 1 ? (
                              <button
                                onClick={() => handleSubmitExam()}
                                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white uppercase tracking-wider"
                              >
                                Submit Exam
                              </button>
                            ) : (
                              <button
                                onClick={() => setExamHUDQuestionIndex(prev => prev + 1)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white uppercase tracking-wider"
                              >
                                Next Question
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* EXAM PRE-FLIGHT GATEWAY */
                  <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                      <span className="text-[9px] font-bold text-blue-650 uppercase tracking-widest">Security Gateway</span>
                      <h2 className="text-xl font-bold text-slate-800 mt-1">Pre-Flight Assessment Gateway</h2>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Assessments are proctored examinations that lock down the browser frame. Complete the hardware check below to begin.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
                        <h3 className="font-bold text-sm text-slate-850 uppercase tracking-wider border-b border-slate-100 pb-3">
                          Device Diagnostic Checklist
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { key: 'camera', label: 'Camera / Webcam check', desc: 'Allows face detection proctoring.' },
                            { key: 'mic', label: 'Audio / Microphone check', desc: 'Allows background voice logs.' },
                            { key: 'screen', label: 'Screen Share permission', desc: 'Allows client screen checks.' },
                            { key: 'network', label: 'Network connection status', desc: 'Pings pinesphere ERP servers.', static: true }
                          ].map((chk) => {
                            const isChecked = assessmentPreflight[chk.key as keyof typeof assessmentPreflight];
                            return (
                              <div key={chk.key} className="bg-slate-50 border border-slate-150 p-4 flex items-center justify-between gap-4">
                                <div className="space-y-1 pr-2">
                                  <span className="text-xs font-bold text-slate-800 block">{chk.label}</span>
                                  <span className="text-[10px] text-slate-400 block leading-tight">{chk.desc}</span>
                                </div>
                                {chk.static ? (
                                  <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold px-2 py-1 uppercase rounded-sm">Connected</span>
                                ) : (
                                  <button
                                    onClick={() => setAssessmentPreflight({
                                      ...assessmentPreflight,
                                      [chk.key]: !isChecked
                                    })}
                                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors border ${isChecked
                                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                        : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                                      }`}
                                  >
                                    {isChecked ? 'Ready ✓' : 'Verify'}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Past Exam Score History */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm mt-6">
                          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                            Past Examination Scores History
                          </h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-slate-150 text-slate-400 uppercase tracking-widest font-bold">
                                  <th className="py-2.5 px-4 font-semibold">Test Paper / Topic</th>
                                  <th className="py-2.5 px-4">Completion Date</th>
                                  <th className="py-2.5 px-4">Score Obtained</th>
                                  <th className="py-2.5 px-4 text-right">Evaluation Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-600">
                                {pastExamResults.map((result) => (
                                  <tr key={result.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-4 font-semibold text-slate-805">{result.title}</td>
                                    <td className="py-3 px-4 text-slate-550">{result.date}</td>
                                    <td className="py-3 px-4 font-bold text-slate-800">{result.score} / 100</td>
                                    <td className="py-3 px-4 text-right">
                                      <span className="inline-block bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold px-2 py-0.5 rounded-sm">
                                        {result.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 flex flex-col justify-between shadow-sm">
                        <div>
                          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                            Start Exam Panel
                          </h3>
                          <div className="space-y-3 mt-4 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-455">Test Paper:</span>
                              <span className="text-slate-800 font-bold">React Architecture Prep</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-455">Duration:</span>
                              <span className="text-slate-800 font-bold">20 Minutes</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-455">Total Questions:</span>
                              <span className="text-slate-800 font-bold">4 MCQ Items</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleStartExam}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white uppercase tracking-wider mt-6"
                        >
                          Launch Assessment HUD
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 8: FINANCIALS & INVOICES */}
            {activeTab === 'financials' && (
              <div className="space-y-6 animate-slide-in">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 flex flex-col justify-between shadow-sm">
                    <div>
                      <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Billing Desk</span>
                      <h3 className="text-lg font-bold text-slate-800 mt-1">
                        {fees.total === 0 ? 'Free Internship Account' : 'Fee Summary Invoice'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2">
                        {fees.total === 0 
                          ? 'You are enrolled under the Free Internship (Non-Paying) plan. No fees payments are required.' 
                          : 'View outstanding due totals and manage online payments.'}
                      </p>
                    </div>

                    <div className="space-y-3 py-4 border-y border-slate-100 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold">Total Fee:</span>
                        <span className="text-slate-800 font-bold">₹{fees.total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold">Cleared Paid:</span>
                        <span className="text-emerald-600 font-bold">₹{fees.paid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold">Outstanding Balance:</span>
                        <span className="text-slate-800 font-bold">₹{fees.balance.toLocaleString()}</span>
                      </div>
                    </div>

                    {fees.total === 0 ? (
                      <span className="w-full text-center py-3 border border-blue-100 text-blue-600 bg-blue-50 font-bold text-xs uppercase tracking-wider block">
                        Free Internship (No Fees Required)
                      </span>
                    ) : fees.balance > 0 ? (
                      <button
                        onClick={() => {
                          setPayAmountInput(fees.balance.toString());
                          setIsPayModalOpen(true);
                        }}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white uppercase tracking-wider"
                      >
                        Clear Dues (₹{fees.balance.toLocaleString()})
                      </button>
                    ) : (
                      <span className="w-full text-center py-3 border border-emerald-100 text-emerald-600 bg-emerald-50 font-bold text-xs uppercase tracking-wider block">
                        Dues Cleared ✓
                      </span>
                    )}
                  </div>

                  {isPayModalOpen && (
                    <div className="bg-white border border-blue-500 rounded-2xl p-6 animate-slide-in relative lg:col-span-2 shadow-lg">
                      <button
                        onClick={() => setIsPayModalOpen(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                        Pinesphere ERP Online Checkout
                      </h3>
                      <form onSubmit={handleProcessPayment} className="space-y-4 max-w-lg text-xs">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Amount (INR)</label>
                            <input
                              type="number"
                              required
                              max={fees.balance}
                              value={payAmountInput}
                              onChange={(e) => setPayAmountInput(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-4 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Payment Option</label>
                            <select
                              value={payMethod}
                              onChange={(e) => setPayMethod(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-slate-850 focus:outline-none"
                            >
                              <option value="upi">UPI (GPay / PhonePe)</option>
                              <option value="card">Credit / Debit Card</option>
                            </select>
                          </div>
                        </div>

                        {payMethod === 'card' && (
                          <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-3">
                            <div className="col-span-3 space-y-1.5">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Cardholder Name</label>
                              <input
                                type="text"
                                required
                                placeholder="Harini"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 px-4 py-2 text-slate-805 focus:outline-none"
                              />
                            </div>
                            <div className="col-span-3 space-y-1.5">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Card Number</label>
                              <input
                                type="text"
                                required
                                placeholder="XXXX XXXX XXXX XXXX"
                                value={cardNumber}
                                onChange={(e) => handleCardNumberChange(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-205 px-4 py-2 text-slate-805 focus:outline-none font-mono"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Expiry</label>
                              <input
                                type="text"
                                required
                                placeholder="MM/YY"
                                value={cardExpiry}
                                onChange={(e) => handleCardExpiryChange(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 px-4 py-2 text-slate-805 font-mono"
                              />
                            </div>
                            <div className="col-span-2 space-y-1.5">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">CVV</label>
                              <input
                                type="password"
                                required
                                placeholder="XXX"
                                value={cardCVV}
                                onChange={(e) => handleCardCVVChange(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 px-4 py-2 text-slate-805 font-mono"
                              />
                            </div>
                          </div>
                        )}

                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white uppercase tracking-wider"
                        >
                          {payMethod === 'upi' ? 'Scan QR Code & Pay' : 'Process Payment'}
                        </button>
                      </form>
                    </div>
                  )}

                  {isUPIScannerOpen && (
                    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                      <div className="bg-white border border-slate-205 rounded-xl shadow-2xl p-6 w-full max-w-sm animate-slide-in relative text-center text-slate-850">
                        <button
                          onClick={() => setIsUPIScannerOpen(false)}
                          className="absolute top-4 right-4 text-slate-450 hover:text-slate-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
                          Scan UPI QR Code
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">
                          Scan the QR code using GPay, PhonePe, Paytm, or BHIM to pay <strong>₹{parseFloat(payAmountInput).toLocaleString()}</strong>.
                        </p>
                        
                        {/* QR Code Graphic (SVG) */}
                        <div className="bg-slate-50 border border-slate-150 p-4 inline-block mx-auto mb-4">
                          <svg className="h-44 w-44 mx-auto text-slate-900" viewBox="0 0 100 100">
                            {/* Outer square border blocks */}
                            <path d="M5,5 h20 v20 h-20 z M5,9 h12 v12 h-12 z" fill="currentColor" />
                            <path d="M75,5 h20 v20 h-20 z M75,9 h12 v12 h-12 z" fill="currentColor" />
                            <path d="M5,75 h20 v20 h-20 z M5,79 h12 v12 h-12 z" fill="currentColor" />
                            {/* Some random data pixels simulating QR */}
                            <rect x="35" y="10" width="8" height="8" fill="currentColor" />
                            <rect x="45" y="20" width="6" height="6" fill="currentColor" />
                            <rect x="15" y="45" width="10" height="4" fill="currentColor" />
                            <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                            <rect x="70" y="40" width="12" height="6" fill="currentColor" />
                            <rect x="45" y="70" width="8" height="15" fill="currentColor" />
                            <rect x="75" y="75" width="15" height="15" fill="currentColor" />
                            <rect x="10" y="35" width="6" height="6" fill="currentColor" />
                            <rect x="85" y="35" width="8" height="8" fill="currentColor" />
                          </svg>
                        </div>

                        <div className="space-y-3">
                          <div className="text-xs font-semibold text-slate-655 flex items-center justify-center gap-2">
                            <span className="h-2 w-2 bg-blue-600 rounded-full animate-ping" />
                            <span>Awaiting scanner detection... <strong>{upiTimer}s</strong></span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={triggerUPISuccess}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors mt-2"
                          >
                            Simulate Scan Success (Instant Test)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 lg:col-span-2 shadow-sm">
                    <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                      Historical Payments Transaction Logs
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-150 text-slate-400 uppercase tracking-widest font-bold">
                            <th className="py-2.5 px-4">Invoice ID</th>
                            <th className="py-2.5 px-4">Receipt Date</th>
                            <th className="py-2.5 px-4">Paid Amount</th>
                            <th className="py-2.5 px-4">Payment Channel</th>
                            <th className="py-2.5 px-4 text-right">Invoice Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                          {paymentHistory.map((invoice, index) => (
                            <tr key={index} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3 px-4 font-semibold text-blue-600">{invoice.id}</td>
                              <td className="py-3 px-4">{invoice.date}</td>
                              <td className="py-3 px-4">₹{invoice.amount.toLocaleString()}</td>
                              <td className="py-3 px-4">{invoice.method}</td>
                              <td className="py-3 px-4 text-right">
                                <span className="inline-block bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold px-2 py-0.5 rounded-sm">
                                  {invoice.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 9: DOCUMENTS VAULT */}
            {activeTab === 'documents' && (
              <div className="space-y-6 animate-slide-in">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                      <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                        Verified Documents & Credentials
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {vaultFiles.map((file) => (
                          <div key={file.id} className="bg-slate-50 border border-slate-150 p-4 space-y-3 flex flex-col justify-between">
                            <div className="space-y-1">
                              <span className="text-[8px] font-bold text-blue-600 uppercase tracking-widest">{file.category}</span>
                              <h4 className="font-bold text-xs text-slate-805 truncate">{file.name}</h4>
                              <span className="text-[10px] text-slate-400 block">{file.size} • {file.date}</span>
                            </div>

                            <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-xs">
                              <span className={`font-bold ${file.verified ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {file.verified ? 'Verified ✓' : 'Pending Verification'}
                              </span>
                              {file.downloadable && (
                                <button
                                  type="button"
                                  onClick={() => showToastNotification(`Downloading ${file.name}...`)}
                                  className="h-7 w-7 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-805 flex items-center justify-center border border-slate-200"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Awarded Digital Certificates */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                      <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                        Awarded Digital Certificates
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {certificatesCatalog.map((cert) => (
                          <div key={cert.id} className="border border-blue-100 bg-gradient-to-br from-blue-50/20 to-indigo-50/10 p-5 flex flex-col justify-between hover:border-blue-300 transition-all duration-200 shadow-sm relative overflow-hidden group">
                            {/* Decorative badge watermark */}
                            <div className="absolute -right-6 -bottom-6 opacity-5 text-blue-900 pointer-events-none group-hover:scale-110 transition-transform">
                              <GraduationCap className="h-24 w-24" />
                            </div>
                            <div className="space-y-2 relative z-10">
                              <span className="text-[8px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 uppercase tracking-widest inline-block">
                                {cert.type}
                              </span>
                              <h4 className="font-bold text-xs text-slate-850 line-clamp-1">{cert.title}</h4>
                              <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{cert.description}</p>
                              <div className="text-[9px] text-slate-400 font-medium">Issue Date: {cert.issueDate}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setActiveCertificate(cert)}
                              className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider transition-colors z-10"
                            >
                              View Certificate Document
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
                    <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                      Upload Document Files
                    </h3>

                    <form onSubmit={handleUploadDocument} className="space-y-4 text-xs">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Document Filename</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Identity_Proof"
                          value={uploadedFileName}
                          onChange={(e) => setUploadedFileName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Category</label>
                        <select
                          value={uploadCategory}
                          onChange={(e) => setUploadCategory(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                        >
                          <option value="Academics">Academics / NOC</option>
                          <option value="Personal">Personal / ID</option>
                          <option value="External Certificates">External Certs</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider text-xs flex justify-center items-center gap-2 transition-transform active:scale-[0.98]"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Push to Vault</span>
                      </button>
                    </form>
                  </div>
                </div>

                {/* Certificate Overlay Modal */}
                {activeCertificate && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white border-8 border-double border-amber-600 shadow-2xl p-8 w-full max-w-2xl animate-scale-up relative text-center text-slate-800 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.02)_0%,transparent_100%)]">
                      <button
                        type="button"
                        onClick={() => setActiveCertificate(null)}
                        className="absolute top-4 right-4 text-slate-405 hover:text-slate-700 font-bold border border-slate-200 bg-white p-1 rounded-none shadow-sm flex items-center justify-center"
                      >
                        <X className="h-5 w-5" />
                      </button>
                      
                      {/* Pinesphere Academy Header */}
                      <div className="space-y-1.5 border-b border-slate-200 pb-4 mb-6">
                        <img src="/logo.png" alt="Pinesphere Logo" className="h-10 mx-auto" />
                        <h4 className="font-serif text-[11px] font-black text-amber-700 uppercase tracking-widest">
                          Academy of Advanced Software Engineering
                        </h4>
                      </div>

                      {/* Certificate Main Title */}
                      <div className="space-y-4">
                        <h3 className="font-serif text-3xl font-bold text-slate-900 tracking-wide italic">
                          Certificate of Accomplishment
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                          This credential certifies that
                        </p>
                        <h2 className="text-3xl font-black text-slate-800 underline decoration-amber-600 decoration-double underline-offset-8 py-2">
                          {username}
                        </h2>
                        <p className="text-xs text-slate-655 max-w-lg mx-auto leading-relaxed">
                          has successfully completed the curriculum requirements and demonstrated outstanding mastery in the pathway of <strong>{activeCertificate.title}</strong>, showcasing advanced competencies in architectural patterns, clean coding styles, and staging integrations.
                        </p>
                      </div>

                      {/* Seals & Signatures */}
                      <div className="grid grid-cols-3 gap-6 items-center mt-10 border-t border-slate-200/80 pt-6">
                        <div className="text-center text-xs">
                          <div className="font-serif italic font-bold text-slate-800">Anand Jayavel</div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 border-t border-slate-100 pt-1 font-sans">Senior Architect</div>
                        </div>
                        
                        {/* Official Seal SVG */}
                        <div className="flex justify-center">
                          <div className="h-16 w-16 rounded-full border-4 border-double border-amber-600 bg-amber-50 flex items-center justify-center relative shadow-sm">
                            <svg className="h-10 w-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            <div className="absolute text-[6px] font-black text-amber-700 tracking-wider rotate-12 font-sans">VERIFIED</div>
                          </div>
                        </div>

                        <div className="text-center text-xs">
                          <div className="font-serif italic font-bold text-slate-800">{activeCertificate.issueDate}</div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 border-t border-slate-100 pt-1 font-sans">Date of Issuance</div>
                        </div>
                      </div>

                      {/* Validation ID */}
                      <div className="mt-6 text-[9px] text-slate-400 font-mono tracking-widest bg-slate-50 border border-slate-200 py-1.5 px-4 inline-block">
                        CREDENTIAL ID: {activeCertificate.validationId}
                      </div>

                      <div className="mt-6 flex gap-3 justify-center text-xs">
                        <button
                          type="button"
                          onClick={() => showToastNotification(`Downloading ${activeCertificate.title} PDF...`)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white font-bold uppercase tracking-wider"
                        >
                          Download PDF Cert
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveCertificate(null)}
                          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-655 font-bold uppercase tracking-wider"
                        >
                          Close Viewer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 10: COMMUNICATION CENTER */}
            {activeTab === 'chat' && (
              <div className="space-y-6 animate-slide-in">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-white border border-slate-200 rounded-xl h-[600px] overflow-hidden shadow-sm">
                  <div className="border-r border-slate-200 bg-slate-50/50 flex flex-col">
                    <div className="p-4 border-b border-slate-200">
                      <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Contacts Desk</h4>
                    </div>

                    <div className="flex-1 p-2 space-y-1">
                      {[
                        { key: 'mentor', label: 'Guide / Mentor Chat', desc: 'Syncs regarding capstone tasks' },
                        { key: 'support', label: 'Helpdesk Support', desc: 'Queries regarding billing / ERP checks' }
                      ].map((th) => {
                        const isSelected = activeChatThread === th.key;
                        return (
                          <button
                            key={th.key}
                            onClick={() => setActiveChatThread(th.key as any)}
                            className={`w-full text-left p-3.5 transition-all border text-xs ${isSelected
                                ? 'bg-blue-50 border-blue-200 text-blue-600 font-bold'
                                : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100/60'
                              }`}
                          >
                            <span className="block text-slate-800 font-bold">{th.label}</span>
                            <span className="block text-[10px] text-slate-400 mt-1 truncate">{th.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="lg:col-span-3 flex flex-col justify-between bg-white">
                    <div className="p-4 border-b border-slate-250 bg-slate-50/30 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                          {activeChatThread === 'mentor' ? 'Direct Sync: Mr. Anand Jayavel' : 'Pinesphere Desk Support'}
                        </h4>
                        <span className="text-[9px] text-emerald-600 block font-bold mt-0.5">● Connected</span>
                      </div>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-[300px]">
                      {(activeChatThread === 'mentor' ? mentorMessages : supportMessages).map((msg) => {
                        const isUser = msg.sender === 'user';
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col max-w-[75%] ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                          >
                            <div className={`p-3 text-xs leading-relaxed ${isUser
                                ? 'bg-blue-600 text-white rounded-none shadow-sm'
                                : 'bg-slate-100 border border-slate-200 text-slate-700'
                              }`}>
                              {msg.text}
                            </div>
                            <span className="text-[8px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{msg.time}</span>
                          </div>
                        );
                      })}
                    </div>

                    <form onSubmit={handleSendChatMessage} className="p-4 border-t border-slate-200 flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Type updates or queries..."
                        value={chatInputText}
                        onChange={(e) => setChatInputText(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-855 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
