import axiosInstance from '../axiosInstance';

export const submitContactRequest = async (data: any) => axiosInstance.post('/api/public/contacts', data);