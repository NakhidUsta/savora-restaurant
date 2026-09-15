import apiClient from './client';

export const login = (email, password) =>
  apiClient.post('/auth/login', { email, password }).then((res) => res.data);
