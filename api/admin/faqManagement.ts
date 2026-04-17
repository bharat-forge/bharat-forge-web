import axiosInstance from '../axiosInstance';

export const getPaginatedFaqsAdmin = async (params?: any) => axiosInstance.get('/api/admin/faqs', { params });
export const getUniqueCategories = async () => axiosInstance.get('/api/admin/faqs/categories');
export const createFaq = async (data: any) => axiosInstance.post('/api/admin/faqs', data);
export const updateFaq = async (id: string, data: any) => axiosInstance.put(`/api/admin/faqs/${id}`, data);
export const deleteFaq = async (id: string) => axiosInstance.delete(`/api/admin/faqs/${id}`);