import axiosInstance from './axiosInstance';

export const fetchProducts = async (params?: { category?: string; search?: string }) => {
  const response = await axiosInstance.get('/api/products', { params });
  return response.data;
};

export const fetchProductById = async (id: string) => {
  const response = await axiosInstance.get(`/api/products/${id}`);
  return response.data;
};

export const createProduct = async (formData: FormData) => {
  const response = await axiosInstance.post('/api/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};