import axiosInstance from '../axiosInstance';

export const getPaginatedFaqs = async (params?: any) => axiosInstance.get('/api/public/faqs', { params });
export const getFaqById = async (id: string) => axiosInstance.get(`/api/public/faqs/${id}`);
export const getRelatedFaqs = async (id: string, category: string) => axiosInstance.get(`/api/public/faqs/${id}/related`, { params: { category } });