import axios from 'axios';

// In-memory token storage (never written to localStorage or sessionStorage)
let inMemoryToken: string | null = null;
let inMemoryCsrfToken: string | null = null;

export function setAuthToken(token: string | null): void {
  inMemoryToken = token;
}

export function setCsrfToken(csrf: string | null): void {
  inMemoryCsrfToken = csrf;
}

export function getCsrfToken(): string | null {
  return inMemoryCsrfToken;
}

const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true, // Send httpOnly session cookies and CSRF cookies automatically
});

// Request interceptor: attach in-memory Bearer token and anti-CSRF token
api.interceptors.request.use((config) => {
  if (inMemoryToken) {
    config.headers.Authorization = `Bearer ${inMemoryToken}`;
  }
  if (inMemoryCsrfToken) {
    config.headers['X-CSRF-Token'] = inMemoryCsrfToken;
  }
  return config;
});

// Response interceptor: handle 401 for protected routes
api.interceptors.response.use(
  (response) => {
    // If backend returns a new CSRF token in body or header, capture it in memory
    const newCsrf = response.data?.csrfToken || response.headers['x-csrf-token'];
    if (newCsrf) {
      inMemoryCsrfToken = newCsrf;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      inMemoryToken = null;
      inMemoryCsrfToken = null;
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const isPublicPath =
          path === '/' ||
          path.startsWith('/track') ||
          path.startsWith('/challenges') ||
          path.startsWith('/problems') ||
          path.startsWith('/about') ||
          path.startsWith('/faq') ||
          path.startsWith('/templates') ||
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
