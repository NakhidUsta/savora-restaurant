import apiClient from './client';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return apiClient
    .post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data);
};

export const resolveUploadUrl = (url) => (url && url.startsWith('/uploads') ? `${API_ORIGIN}${url}` : url);
