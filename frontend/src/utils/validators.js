export const validateEmail = (email) => {
  if (!email) return true; // Email is optional
  
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  if (!phone) return true; // Phone is optional
  
  const re = /^[\d\s\-\+\(\)]{10,20}$/;
  return re.test(phone);
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  return null;
};

export const validateEmployeeId = (employeeId) => {
  if (!employeeId) return 'Employee ID is required';
  
  const re = /^[A-Za-z0-9-_]{3,20}$/;
  if (!re.test(employeeId)) {
    return 'Employee ID must be 3-20 characters and contain only letters, numbers, hyphens, and underscores';
  }
  
  return null;
};

export const validateName = (name) => {
  if (!name) return 'Name is required';
  
  if (name.length < 2) {
    return 'Name must be at least 2 characters long';
  }
  
  if (name.length > 100) {
    return 'Name must be less than 100 characters';
  }
  
  return null;
};

export const validateTimeFormat = (time) => {
  if (!time) return null;
  
  const re = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  if (!re.test(time)) {
    return 'Invalid time format. Use HH:MM:SS';
  }
  
  return null;
};

export const validateDateFormat = (date) => {
  if (!date) return null;
  
  const re = /^\d{4}-\d{2}-\d{2}$/;
  if (!re.test(date)) {
    return 'Invalid date format. Use YYYY-MM-DD';
  }
  
  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  if (dateObj.getFullYear() !== year || 
      dateObj.getMonth() !== month - 1 || 
      dateObj.getDate() !== day) {
    return 'Invalid date';
  }
  
  return null;
};

export const validateFutureDate = (date) => {
  const dateError = validateDateFormat(date);
  if (dateError) return dateError;
  
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (dateObj > today) {
    return 'Date cannot be in the future';
  }
  
  return null;
};

export const validateTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return null;
  
  const startError = validateTimeFormat(startTime);
  if (startError) return startError;
  
  const endError = validateTimeFormat(endTime);
  if (endError) return endError;
  
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
    return 'End time must be after start time';
  }
  
  return null;
};