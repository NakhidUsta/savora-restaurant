import apiClient from './client';

export const createOrder = (data) =>
  apiClient.post('/orders', data).then((res) => res.data);

export const getOrderById = (id) =>
  apiClient.get(`/orders/${id}`).then((res) => res.data);

export const getAllOrders = () => apiClient.get('/orders').then((res) => res.data);

export const updateOrderStatus = (id, status) =>
  apiClient.put(`/orders/${id}`, { status }).then((res) => res.data);
