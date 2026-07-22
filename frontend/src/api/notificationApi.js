import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const notificationApi = {
  getNotificationsByUser: async (userId) => {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (userId) => {
    await api.put(`/notifications/user/${userId}/read-all`);
  }
};
