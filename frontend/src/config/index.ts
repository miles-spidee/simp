export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  OPPORTUNITIES: `${API_BASE_URL}/api/opportunities`,
  APPLY: `${API_BASE_URL}/api/apply`,

  DASHBOARD_DATA: `${API_BASE_URL}/api/dashboard`,
  AGENDA: `${API_BASE_URL}/api/agenda`,
  COURSES: `${API_BASE_URL}/api/courses`,
  ASSIGNMENTS: `${API_BASE_URL}/api/assignments`,
  CAPSTONE: `${API_BASE_URL}/api/capstone`,
  CHAT: `${API_BASE_URL}/api/chat`,

  LOGIN: `${API_BASE_URL}/api/auth/login`,
  // Student Portal sub-modules
  ATTENDANCE: `${API_BASE_URL}/api/attendance`,
  ASSESSMENT: `${API_BASE_URL}/api/assessment`,
  DOCUMENTS: `${API_BASE_URL}/api/documents`,
  FINANCIALS: `${API_BASE_URL}/api/financials`,
  KPI: `${API_BASE_URL}/api/kpi`,
  PROFILE: `${API_BASE_URL}/api/profile`,
  TASKS: `${API_BASE_URL}/api/tasks`,
  FORGOT_PASSWORD_REQUEST: `${API_BASE_URL}/api/auth/forgot-password/request`,
  FORGOT_PASSWORD_VERIFY: `${API_BASE_URL}/api/auth/forgot-password/verify`,
  FORGOT_PASSWORD_RESET: `${API_BASE_URL}/api/auth/forgot-password/reset`,
  SUCCESS_DATA: `${API_BASE_URL}/api/success`,
  // HR Dashboard endpoints
  HR_METRICS: `${API_BASE_URL}/api/hr/metrics`,
  HR_STUDENTS: `${API_BASE_URL}/api/hr/students`,
  HR_PROGRAMS: `${API_BASE_URL}/api/hr/programs`,
  HR_COLLEGES: `${API_BASE_URL}/api/hr/colleges`,
  HR_ESCALATIONS: `${API_BASE_URL}/api/hr/escalations`,
  HR_NOTIFICATIONS: `${API_BASE_URL}/api/hr/notifications`,
  HR_ATTENDANCE: `${API_BASE_URL}/api/hr/attendance`,
  HR_PAYMENTS: `${API_BASE_URL}/api/hr/payments`,
  HR_CERTIFICATES: `${API_BASE_URL}/api/hr/certificates`,
  HR_PLACEMENTS: `${API_BASE_URL}/api/hr/placements`,
  HR_ASSESSMENTS: `${API_BASE_URL}/api/hr/assessments`,
  HR_REPORTS: `${API_BASE_URL}/api/hr/reports`,
};
