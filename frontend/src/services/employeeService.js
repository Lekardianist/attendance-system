import api from './api/axiosConfig';
import { endpoints } from './api/endpoints';

export const employeeService = {
  async getEmployees(activeOnly = true, department = null, page = 1, perPage = 20) {
    const params = { page, per_page: perPage };
    if (activeOnly !== undefined) params.active_only = activeOnly;
    if (department) params.department = department;
    
    const response = await api.get(endpoints.employees.list, { params });
    return response.data;
  },

  async getEmployeeById(employeeId) {
    const response = await api.get(endpoints.employees.detail(employeeId));
    return response.data;
  },

  async createEmployee(data) {
    const response = await api.post(endpoints.employees.create, data);
    return response.data;
  },

  async updateEmployee(employeeId, data) {
    const response = await api.put(endpoints.employees.update(employeeId), data);
    return response.data;
  },

  async deleteEmployee(employeeId) {
    const response = await api.delete(endpoints.employees.delete(employeeId));
    return response.data;
  },

  async activateEmployee(employeeId) {
    const response = await api.post(endpoints.employees.activate(employeeId));
    return response.data;
  },

  async deactivateEmployee(employeeId) {
    const response = await api.post(endpoints.employees.deactivate(employeeId));
    return response.data;
  },

  async searchEmployees(searchTerm) {
    const response = await api.get(endpoints.employees.list, {
      params: { search: searchTerm, active_only: true }
    });
    return response.data.employees;
  },
};