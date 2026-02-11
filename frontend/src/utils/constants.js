export const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'IT',
  'Customer Support',
  'Research & Development',
  'Administration',
];

export const POSITIONS = {
  Engineering: [
    'Software Engineer',
    'Senior Software Engineer',
    'Lead Engineer',
    'Engineering Manager',
    'DevOps Engineer',
    'QA Engineer',
    'Architect',
  ],
  Marketing: [
    'Marketing Specialist',
    'Marketing Manager',
    'SEO Specialist',
    'Content Writer',
    'Social Media Manager',
  ],
  Sales: [
    'Sales Representative',
    'Sales Manager',
    'Account Executive',
    'Business Development',
  ],
  'Human Resources': [
    'HR Generalist',
    'HR Manager',
    'Recruiter',
    'Training Specialist',
  ],
  Finance: [
    'Accountant',
    'Financial Analyst',
    'Finance Manager',
    'Controller',
  ],
  Operations: [
    'Operations Manager',
    'Supply Chain Coordinator',
    'Logistics Specialist',
  ],
  IT: [
    'System Administrator',
    'Network Engineer',
    'IT Support',
    'Database Administrator',
  ],
  'Customer Support': [
    'Support Specialist',
    'Support Manager',
    'Customer Success Manager',
  ],
  'Research & Development': [
    'Research Scientist',
    'Product Developer',
    'R&D Manager',
  ],
  Administration: [
    'Administrative Assistant',
    'Office Manager',
    'Executive Assistant',
  ],
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'Present',
  LATE: 'Late',
  ABSENT: 'Absent',
  HALF_DAY: 'Half-day',
  LEAVE: 'Leave',
  HOLIDAY: 'Holiday',
};

export const STATUS_COLORS = {
  [ATTENDANCE_STATUS.PRESENT]: 'success',
  [ATTENDANCE_STATUS.LATE]: 'warning',
  [ATTENDANCE_STATUS.ABSENT]: 'danger',
  [ATTENDANCE_STATUS.HALF_DAY]: 'info',
  [ATTENDANCE_STATUS.LEAVE]: 'secondary',
  [ATTENDANCE_STATUS.HOLIDAY]: 'primary',
};

export const LEAVE_TYPES = [
  'Annual Leave',
  'Sick Leave',
  'Personal Leave',
  'Maternity Leave',
  'Paternity Leave',
  'Unpaid Leave',
  'Bereavement Leave',
  'Study Leave',
];

export const WORKING_HOURS = {
  START: '09:00:00',
  END: '18:00:00',
  LUNCH_START: '12:00:00',
  LUNCH_END: '13:00:00',
  MINIMUM_HOURS: 8,
  OVERTIME_THRESHOLD: 9,
};

export const LATE_THRESHOLD = {
  GRACE_PERIOD: 30, // minutes
  HALF_DAY_THRESHOLD: 120, // minutes
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 25, 50, 100],
};

export const DATE_FORMATS = {
  DISPLAY_DATE: 'MMM dd, yyyy',
  DISPLAY_DATE_TIME: 'MMM dd, yyyy HH:mm',
  DISPLAY_TIME: 'HH:mm',
  API_DATE: 'yyyy-MM-dd',
  API_DATE_TIME: 'yyyy-MM-dd HH:mm:ss',
  API_TIME: 'HH:mm:ss',
};

export const CHART_COLORS = {
  primary: '#007bff',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#17a2b8',
  dark: '#343a40',
  secondary: '#6c757d',
  light: '#f8f9fa',
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};