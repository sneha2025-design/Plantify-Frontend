import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('plantify_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Clear expired token if 401 received on protected endpoint
        if (localStorage.getItem('plantify_token') && !window.location.pathname.includes('/login')) {
          localStorage.removeItem('plantify_token');
          localStorage.removeItem('plantify_user');
          window.location.href = '/login?expired=true';
        }
      }
      return Promise.reject(error.response.data || { message: 'Server error' });
    }
    return Promise.reject({ message: 'Network error. Please check backend API server connection.' });
  }
);

export default axiosClient;
