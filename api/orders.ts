import axiosInstance from './axiosInstance';

export const createOrder = async (orderData: any) => {
  const response = await axiosInstance.post('/api/orders', orderData);
  return response.data;
};

export const verifyPayment = async (paymentData: { orderId: string; razorpayPaymentId: string; razorpaySignature: string }) => {
  const response = await axiosInstance.post('/api/orders/verify-payment', paymentData);
  return response.data;
};

export const fetchUserOrders = async () => {
  const response = await axiosInstance.get('/api/orders/my-orders');
  return response.data;
};