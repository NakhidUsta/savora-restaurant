import apiClient from './client';

export const createReservation = (data) =>
  apiClient.post('/reservations', data).then((res) => res.data);

export const getAllReservations = () => apiClient.get('/reservations').then((res) => res.data);

export const updateReservationStatus = (id, status) =>
  apiClient.put(`/reservations/${id}`, { status }).then((res) => res.data);
