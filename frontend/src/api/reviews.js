import apiClient from './client';

export const getReviews = () =>
  apiClient.get('/reviews').then((res) => res.data);

export const createReview = (data) =>
  apiClient.post('/reviews', data).then((res) => res.data);

export const getAllReviews = () => apiClient.get('/reviews/admin').then((res) => res.data);

export const updateReviewStatus = (id, is_approved) =>
  apiClient.put(`/reviews/${id}`, { is_approved }).then((res) => res.data);

export const deleteReview = (id) => apiClient.delete(`/reviews/${id}`).then((res) => res.data);
