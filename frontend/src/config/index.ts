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
  FORGOT_PASSWORD_REQUEST: `${API_BASE_URL}/api/auth/forgot-password/request`,
  FORGOT_PASSWORD_VERIFY: `${API_BASE_URL}/api/auth/forgot-password/verify`,
  FORGOT_PASSWORD_RESET: `${API_BASE_URL}/api/auth/forgot-password/reset`,
  SUCCESS_DATA: `${API_BASE_URL}/api/success`,
};
