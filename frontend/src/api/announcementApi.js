import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const announcementApi = {
  // Get all active announcements (for student view)
  getActiveAnnouncements: async () => {
    const response = await api.get('/announcements/active');
    return response.data;
  },

  // Get announcements for a specific faculty member
  getAnnouncementsByFaculty: async (facultyId) => {
    const response = await api.get(`/announcements/faculty/${facultyId}`);
    return response.data;
  },

  // Create a new announcement (param: facultyId, body: request data)
  createAnnouncement: async (facultyId, data) => {
    const response = await api.post(`/announcements?facultyId=${facultyId}`, data);
    return response.data;
  },

  // Deactivate an announcement (mark active = false)
  deactivateAnnouncement: async (id) => {
    const response = await api.patch(`/announcements/${id}/deactivate`);
    return response.data;
  },

  // Delete an announcement
  deleteAnnouncement: async (id) => {
    await api.delete(`/announcements/${id}`);
  }
};
