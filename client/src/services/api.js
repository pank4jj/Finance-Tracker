import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('token');

// Auth API calls
export const authService = {
  register: (name, email, password) =>
    axios.post(`${API_URL}/auth/register`, { name, email, password }),
  
  login: (email, password) =>
    axios.post(`${API_URL}/auth/login`, { email, password }),
};

// Transaction API calls
export const transactionService = {
  getAll: () =>
    axios.get(`${API_URL}/transactions`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }),
  
  create: (transaction) =>
    axios.post(`${API_URL}/transactions`, transaction, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }),
  
  update: (id, transaction) =>
    axios.put(`${API_URL}/transactions/${id}`, transaction, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }),
  
  delete: (id) =>
    axios.delete(`${API_URL}/transactions/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }),
};

// Budget API calls
export const budgetService = {
  getAll: () =>
    axios.get(`${API_URL}/budgets`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }),
  
  create: (budget) =>
    axios.post(`${API_URL}/budgets`, budget, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }),
  
  update: (id, budget) =>
    axios.put(`${API_URL}/budgets/${id}`, budget, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }),
  
  delete: (id) =>
    axios.delete(`${API_URL}/budgets/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }),
};

// Profile API calls
export const profileService = {
  get: () =>
    axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }),

  update: (profileData) =>
    axios.put(`${API_URL}/profile`, profileData, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }),

  changePassword: (currentPassword, newPassword) =>
    axios.put(`${API_URL}/profile/password`, { currentPassword, newPassword }, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }),
};

// Category API calls
export const categoryService = {
  getAll: () =>
    axios.get(`${API_URL}/categories`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }),
  
  create: (category) =>
    axios.post(`${API_URL}/categories`, category, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }),
  
  delete: (id) =>
    axios.delete(`${API_URL}/categories/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }),
};
