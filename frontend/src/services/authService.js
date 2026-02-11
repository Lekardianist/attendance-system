import api from './api/axiosConfig';
import { endpoints } from './api/endpoints';

export const authService = {
  async login(employeeId) {
    const response = await api.post(endpoints.auth.login, { employee_id: employeeId });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.employee));
    }
    return response.data;
  },

  async getProfile() {
    const response = await api.get(endpoints.auth.profile);
    return response.data;
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },
};