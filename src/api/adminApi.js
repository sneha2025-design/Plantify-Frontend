import axiosClient from './axiosClient';

export const adminApi = {
  getDashboardAnalytics: () => axiosClient.get('/admin/dashboard'),
  getAllUsers: () => axiosClient.get('/admin/users'),
  getUserById: (userId) => axiosClient.get(`/admin/users/${userId}`),
  updateUser: (userId, data) => axiosClient.put(`/admin/users/${userId}`, data),
  updateUserRole: (userId, role) => axiosClient.put(`/admin/users/${userId}/role?role=${role}`),
  getAllOrders: () => axiosClient.get('/admin/orders'),
  markOrderAsPaid: (orderId) => axiosClient.put(`/admin/orders/${orderId}/mark-paid`),
  createProduct: (data) => axiosClient.post('/admin/products', data),
  updateProduct: (id, data) => axiosClient.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => axiosClient.delete(`/admin/products/${id}`),
  createCategory: (data) => axiosClient.post('/admin/categories', data),
  getDailyRevenue: (date) => axiosClient.get(`/admin/analytics/daily${date ? `?date=${date}` : ''}`),
  getMonthlyRevenue: (year, month) => axiosClient.get(`/admin/analytics/monthly?year=${year}&month=${month}`),
  getYearlyRevenue: (year) => axiosClient.get(`/admin/analytics/yearly?year=${year}`),
  getOverallRevenue: () => axiosClient.get('/admin/analytics/overall'),
};
