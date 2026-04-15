import axiosInstance from '../axiosInstance';

export const getDealerDashboardStats = async () => axiosInstance.get('/api/dealer/dashboard/stats');