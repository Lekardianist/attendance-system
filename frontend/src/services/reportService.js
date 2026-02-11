import api from './api/axiosConfig';
import { endpoints } from './api/endpoints';

export const reportService = {
  async getDailyReport(date, department = null) {
    const response = await api.get(endpoints.reports.daily, {
      params: { date, department },
    });
    return response.data;
  },

  async getMonthlyReport(year, month, employeeId = null) {
    const response = await api.get(endpoints.reports.monthly, {
      params: { year, month, employee_id: employeeId },
    });
    return response.data;
  },

  async getEmployeeSummary(employeeId, year, month) {
    const response = await api.get(endpoints.reports.employeeSummary(employeeId), {
      params: { year, month },
    });
    return response.data;
  },

  async exportDailyReport(date, format = 'csv') {
    const response = await api.get(endpoints.reports.exportDaily, {
      params: { date, format },
      responseType: 'blob',
    });
    return response.data;
  },
};