import apiClient from './client';

export const sendContactMessage = (data) =>
  apiClient.post('/contact', data).then((res) => res.data);

export const getAllMessages = () => apiClient.get('/contact').then((res) => res.data);

export const deleteMessage = (id) => apiClient.delete(`/contact/${id}`).then((res) => res.data);
