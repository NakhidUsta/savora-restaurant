import apiClient from './client';

export const getSettings = () => apiClient.get('/settings').then((res) => res.data);

export const updateSetting = (key, value) =>
  apiClient.put(`/settings/${key}`, { value }).then((res) => res.data);

export const updateImage = (sectionKey, image_url, alt_text) =>
  apiClient.put(`/settings/images/${sectionKey}`, { image_url, alt_text }).then((res) => res.data);
