import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 only for authenticated protected pages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Never forcibly redirect to /login on public citizen routes
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const isPublicPath =
          path === '/' ||
          path.startsWith('/track') ||
          path.startsWith('/report') ||
          path.startsWith('/problems') ||
          path.startsWith('/about') ||
          path.startsWith('/faq') ||
          path.startsWith('/login') ||
          path.startsWith('/signup');

        if (!isPublicPath) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
