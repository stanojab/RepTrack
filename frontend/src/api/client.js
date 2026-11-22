import axios from 'axios';

// Address of the backend API. Locally it is /api, which Vite forwards to the backend (see vite.config.js);
// in production the backend runs on its own address, set with VITE_API_URL at build time.
export function apiBaseUrl(backendUrl = import.meta.env.VITE_API_URL) {
  return backendUrl ? `${backendUrl.replace(/\/+$/, '')}/api` : '/api';
}

const api = axios.create({ baseURL: apiBaseUrl() });

// Add the login token to every request, if the user is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token has expired, remove it and go back to the login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url === '/auth/login';
    if (error.response?.status === 401 && !isLoginRequest && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      window.location.href = `${import.meta.env.BASE_URL}login`;
    }
    return Promise.reject(error);
  },
);

// The error message sent by the backend, or a general one
export function errorMessage(error) {
  return error.response?.data?.message || 'Something went wrong. Please try again.';
}

export default api;
