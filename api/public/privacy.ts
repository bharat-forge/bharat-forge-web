import axiosInstance from '../axiosInstance';

export const getActivePolicy = async () => axiosInstance.get('/api/public/privacy/active');