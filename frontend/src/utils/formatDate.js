import { format, parseISO, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

export const formatTime = (time, formatStr = 'HH:mm') => {
  if (!time) return '-';
  try {
    if (typeof time === 'string') {
      // Handle time string format "HH:MM:SS"
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0);
      return format(date, formatStr);
    }
    return format(time, formatStr);
  } catch (error) {
    console.error('Error formatting time:', error);
    return '-';
  }
};

export const formatDateTime = (dateTime, formatStr = 'MMM dd, yyyy HH:mm') => {
  if (!dateTime) return '-';
  try {
    const dateObj = typeof dateTime === 'string' ? parseISO(dateTime) : dateTime;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date time:', error);
    return '-';
  }
};

export const timeAgo = (date) => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    
    const days = differenceInDays(now, dateObj);
    if (days > 30) return formatDate(dateObj);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    const hours = differenceInHours(now, dateObj);
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    
    const minutes = differenceInMinutes(now, dateObj);
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    
    return 'Just now';
  } catch (error) {
    console.error('Error calculating time ago:', error);
    return '-';
  }
};

export const getMonthDays = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getMonthName = (month) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[month];
};

export const getShortMonthName = (month) => {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return monthNames[month];
};

export const getDayName = (day) => {
  const dayNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
  ];
  return dayNames[day];
};

export const getShortDayName = (day) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return dayNames[day];
};

export const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

export const isSameDay = (date1, date2) => {
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
};