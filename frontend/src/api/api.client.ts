import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://13.60.249.106:8000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Immediately reject to simulate offline backend and remove latency
    return Promise.reject(new axios.Cancel("Backend connection disabled"));
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Implementation for refresh token would go here if needed:
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   const refreshToken = localStorage.getItem('refresh_token');
    //   if (refreshToken) {
    //       ... call refresh endpoint ...
    //   }
    // }
    
    // Log error cleanly or let services handle it
    return Promise.reject(error);
  }
);
