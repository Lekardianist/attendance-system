export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    profile: '/auth/profile',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
  },

  // Employee endpoints
  employees: {
    list: '/employees/',
    detail: (id) => `/employees/${id}`,
    create: '/employees/',
    update: (id) => `/employees/${id}`,
    delete: (id) => `/employees/${id}`,
    activate: (id) => `/employees/${id}/activate`,
    deactivate: (id) => `/employees/${id}/deactivate`,
  },

  // Attendance endpoints
  attendance: {
    checkIn: '/attendance/check-in',
    checkOut: '/attendance/check-out',
    todayStatus: '/attendance/status/today',
    history: (id) => `/attendance/history/${id}`,
    manual: '/attendance/manual',
    update: (id) => `/attendance/${id}`,
  },

  // Report endpoints
  reports: {
    daily: '/reports/daily',
    monthly: '/reports/monthly',
    employeeSummary: (id) => `/reports/employee-summary/${id}`,
    statistics: '/reports/statistics',
    exportDaily: '/reports/export/daily',
  },
};