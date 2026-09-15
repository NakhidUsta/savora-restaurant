import apiClient from './client';

export const getStats = () => apiClient.get('/admin/stats').then((res) => res.data);
