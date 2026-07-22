import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const consultationScheduleApi = {
  getSchedulesByFaculty: async (facultyId) => {
    const response = await api.get(`/consultations/faculty/${facultyId}`);
    return response.data;
  },

  createSchedule: async (facultyId, data) => {
    const response = await api.post(`/consultations?facultyId=${facultyId}`, data);
    return response.data;
  },

  updateSchedule: async (id, data) => {
    const response = await api.put(`/consultations/${id}`, data);
    return response.data;
  },

  deleteSchedule: async (id) => {
    await api.delete(`/consultations/${id}`);
  }
};
