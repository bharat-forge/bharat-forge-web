import axiosInstance from '../axiosInstance';

export const browseProducts = async (params?: any) => axiosInstance.get('/api/public/catalog/browse', { params });
export const getProductDetails = async (id: string) => axiosInstance.get(`/api/public/catalog/${id}`);
export const getProductSuggestions = async (id: string) => axiosInstance.get(`/api/public/catalog/${id}/suggestions`);
export const getCategories = async () => axiosInstance.get('/api/public/catalog/categories');