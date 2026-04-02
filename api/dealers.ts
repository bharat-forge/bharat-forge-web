import axiosInstance from './axiosInstance';

export const fetchDealerProfile = async () => {
  const response = await axiosInstance.get('/api/dealers/profile');
  return response.data;
};

export const submitDealerProfile = async (profileData: any) => {
  const response = await axiosInstance.post('/api/dealers/profile', profileData);
  return response.data;
};

export const fetchAllDealers = async () => {
  const response = await axiosInstance.get('/api/dealers');
  return response.data;
};

export const updateDealerStatus = async (id: string, data: { status: string; pricingTier: string }) => {
  const response = await axiosInstance.put(`/api/dealers/${id}/status`, data);
  return response.data;
};