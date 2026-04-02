import axiosInstance from './axiosInstance';

export const registerUser = async (data: { email: string; role: string; password?: string }) => {
  const response = await axiosInstance.post('/api/auth/register', data);
  return response.data;
};

export const loginUser = async (data: { email: string; password?: string }) => {
  const response = await axiosInstance.post('/api/auth/login', data);
  return response.data;
};

export const verifyOTP = async (data: { email: string; otp: string }) => {
  const response = await axiosInstance.post('/api/auth/verify-otp', data);
  return response.data;
};

export const resendOTP = async (data: { email: string; type: 'login' | 'register' }) => {
  const response = await axiosInstance.post('/api/auth/resend-otp', data);
  return response.data;
};