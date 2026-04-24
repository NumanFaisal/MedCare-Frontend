import axios from 'axios';

/**
 * Centralized Axios instance for all API calls.
 * 
 * Uses the VITE_API_URL environment variable for the base URL.
 * Falls back to localhost:4000 during local development.
 * 
 * Automatically attaches the JWT token from localStorage to every request.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 and 403 (unauthorized/forbidden) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    // 401 = no token / 403 = token expired or invalid
    if (status === 401 || status === 403) {
      // Clear stale auth state from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      // Only redirect if not already on an auth page
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
