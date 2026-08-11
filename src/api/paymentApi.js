import axiosClient from './axiosClient';

export const paymentApi = {
  createPaymentOrder: (internalOrderId) =>
    axiosClient.post('/payment/create-order', { internalOrderId }),
  verifyPayment: (payload) =>
    axiosClient.post('/payment/verify', payload),
  cancelPayment: (internalOrderId) =>
    axiosClient.post(`/payment/cancel?internalOrderId=${internalOrderId}`),
};
