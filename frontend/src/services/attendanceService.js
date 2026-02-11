import api from './api/axiosConfig';
import { endpoints } from './api/endpoints';

export const attendanceService = {
  async checkIn(employeeId, notes = '') {
    const response = await api.post(endpoints.attendance.checkIn, {
      employee_id: employeeId,
      notes,
    });
    return response.data;
  },

  async checkOut(employeeId, notes = '') {
    const response = await api.post(endpoints.attendance.checkOut, {
      employee_id: employeeId,
      notes,
    });
    return response.data;
  },

  async getTodayStatus(employeeId) {
    const response = await api.get(endpoints.attendance.todayStatus, {
      params: { employee_id: employeeId }
    });
    return response.data;
  },

  async getAttendanceHistory(employeeId, startDate, endDate, page = 1, perPage = 30) {
    const response = await api.get(endpoints.attendance.history(employeeId), {
      params: {
        start_date: startDate,
        end_date: endDate,
        page,
        per_page: perPage,
      },
    });
    return response.data;
  },

  async createManualAttendance(data) {
    const response = await api.post(endpoints.attendance.manual, data);
    return response.data;
  },

  async updateAttendance(attendanceId, data) {
    const response = await api.put(endpoints.attendance.update(attendanceId), data);
    return response.data;
  },

  async getStatistics(startDate, endDate, department = null, employeeId = null) {
    const response = await api.get(endpoints.reports.statistics, {
      params: {
        start_date: startDate,
        end_date: endDate,
        department,
        employee_id: employeeId,
      },
    });
    return response.data;
  },

  async exportHistory(employeeId, startDate, endDate) {
    const response = await api.get(endpoints.attendance.history(employeeId), {
      params: {
        start_date: startDate,
        end_date: endDate,
        export: true,
      },
      responseType: 'blob',
    });
    return response.data;
  },
};