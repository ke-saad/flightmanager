import axiosInstance from '@/utils/axiosInstance';

const register = (userData) => {
  return axiosInstance.post('/auth/register', userData);
};

const login = (credentials) => {
  return axiosInstance.post('/auth/login', credentials);
};

const forgotPassword = (email) => {
  return axiosInstance.post('/auth/forgot-password', { email });
};

const resetPassword = (token, newPassword) => {
  const url = `/auth/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`;
  return axiosInstance.post(url);
};



export default {
  register,
  login,
  forgotPassword,
  resetPassword
};
