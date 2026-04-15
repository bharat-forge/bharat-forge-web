import axiosInstance from '../axiosInstance';

export const getAdminDashboardStats = async () => axiosInstance.get('/api/admin/dashboard/stats');