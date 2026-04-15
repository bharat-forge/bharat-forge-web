import axiosInstance from '../axiosInstance';

export const processCheckout = async (data: any) => axiosInstance.post('/api/shared/checkout/process', data);
export const verifyCheckout = async (data: any) => axiosInstance.post('/api/shared/checkout/verify', data);
export const getMyOrdersList = async (params?: any) => axiosInstance.get('/api/shared/checkout/my-orders', { params });