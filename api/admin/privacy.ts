import axiosInstance from '../axiosInstance';

export const createPolicy = async (data: any) => axiosInstance.post('/api/admin/privacy', data);
export const updatePolicy = async (id: string, data: any) => axiosInstance.put(`/api/admin/privacy/${id}`, data);
export const getPaginatedPolicies = async (params?: any) => axiosInstance.get('/api/admin/privacy', { params });
export const activatePolicy = async (id: string) => axiosInstance.put(`/api/admin/privacy/${id}/activate`);
export const deletePolicy = async (id: string) => axiosInstance.delete(`/api/admin/privacy/${id}`);