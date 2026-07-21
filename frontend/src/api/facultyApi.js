import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const facultyApi = {
  findAll: async () => {
    const response = await api.get('/faculty');
    return response.data;
  },
  findById: async (id) => {
    const response = await api.get(`/faculty/${id}`);
    return response.data;
  },
  updateStatus: async (id, statusData) => {
    const response = await api.put(`/faculty/${id}/status`, statusData);
    return response.data;
  },
};
