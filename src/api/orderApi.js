import axiosClient from './axiosClient';

export const orderApi = {
  checkout: (data) => axiosClient.post('/orders/checkout', data),
  getUserOrders: () => axiosClient.get('/orders'),
  getOrderDetails: (orderId) => axiosClient.get(`/orders/${orderId}`),
  simulatePayment: (orderId, success = true) => axiosClient.post(`/orders/${orderId}/pay?success=${success}`),
  cancelOrder: (orderId) => axiosClient.put(`/orders/${orderId}/cancel`),
};
