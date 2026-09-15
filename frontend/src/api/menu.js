import apiClient from './client';

export const getMenuItems = (category) =>
  apiClient.get('/menu', { params: category ? { category } : {} }).then((res) => res.data);

export const getMenuItemById = (id) =>
  apiClient.get(`/menu/${id}`).then((res) => res.data);

export const createMenuItem = (data) => apiClient.post('/menu', data).then((res) => res.data);

export const updateMenuItem = (id, data) => apiClient.put(`/menu/${id}`, data).then((res) => res.data);

export const deleteMenuItem = (id) => apiClient.delete(`/menu/${id}`).then((res) => res.data);
