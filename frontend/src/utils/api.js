import axios from 'axios';

const API = axios.create({
  baseURL: 'https://school-complaint-suggestion-portal.onrender.com/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
};

// Complaints
export const complaintAPI = {
  submit: (data) => API.post('/complaints', data),
  getMy: (params) => API.get('/complaints/my', { params }),
  getAll: (params) => API.get('/complaints', { params }),
  getById: (id) => API.get(`/complaints/${id}`),
  updateStatus: (id, data) => API.put(`/complaints/${id}/status`, data),
  reply: (id, data) => API.post(`/complaints/${id}/reply`, data),
  getStats: () => API.get('/complaints/stats'),
};

// Suggestions
export const suggestionAPI = {
  submit: (data) => API.post('/suggestions', data),
  getMy: () => API.get('/suggestions/my'),
  getAll: (params) => API.get('/suggestions', { params }),
  update: (id, data) => API.put(`/suggestions/${id}`, data),
};

// Users
export const userAPI = {
  getAll: (params) => API.get('/users', { params }),
  toggleStatus: (id) => API.put(`/users/${id}/toggle-status`),
  delete: (id) => API.delete(`/users/${id}`),
  getDashboardStats: () => API.get('/users/dashboard-stats'),
};

export default API;
