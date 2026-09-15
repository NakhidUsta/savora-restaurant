import apiClient from './client';

export const login = (email, password) =>
  apiClient.post('/auth/login', { email, password }).then((res) => res.data);

export const logout = () => apiClient.post('/auth/logout').then((res) => res.data);

export const me = () => apiClient.get('/auth/me').then((res) => res.data);
