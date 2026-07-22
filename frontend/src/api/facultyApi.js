import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const mapStatusToFrontend = (status) => {
  const mapping = {
    AVAILABLE: 'Available',
    IN_CLASS: 'InClass',
    BUSY: 'Busy',
    OUT: 'Out',
  };
  return mapping[status] || status;
};

const mapFacultyToFrontend = (faculty) => {
  if (!faculty) return faculty;
  return {
    ...faculty,
    status: mapStatusToFrontend(faculty.status),
  };
};

export const facultyApi = {
  findAll: async () => {
    const response = await api.get('/faculty');
    return (response.data || []).map(mapFacultyToFrontend);
  },
  findById: async (id) => {
    const response = await api.get(`/faculty/${id}`);
    return mapFacultyToFrontend(response.data);
  },
  updateStatus: async (id, statusData) => {
    const response = await api.put(`/faculty/${id}/status`, statusData);
    return mapFacultyToFrontend(response.data);
  },
};
