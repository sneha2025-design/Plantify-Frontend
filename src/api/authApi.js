import axiosClient from './axiosClient';

export const authApi = {
  register: (data) => axiosClient.post('/register', data),
  login: (data) => axiosClient.post('/login', data),
  logout: () => axiosClient.post('/auth/logout'),
  forgotPassword: (emailOrMobile) => axiosClient.post('/forgot-password', { emailOrMobile }),
  verifyOtp: (emailOrMobile, otp) => axiosClient.post('/verify-otp', { emailOrMobile, otp }),
  resetPassword: (data) => axiosClient.post('/reset-password', data),
  changePassword: (data) => axiosClient.put('/change-password', data),
};
