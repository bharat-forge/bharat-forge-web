import axiosInstance from '../axiosInstance';

export const getPaginatedContacts = async (params?: any) => axiosInstance.get('/api/admin/contacts', { params });
export const updateContactStatus = async (id: string, status: string) => axiosInstance.put(`/api/admin/contacts/${id}/status`, { status });
export const deleteContact = async (id: string) => axiosInstance.delete(`/api/admin/contacts/${id}`);