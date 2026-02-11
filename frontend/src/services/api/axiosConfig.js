import axios from 'axios';
import { interceptors } from './interceptors';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Apply interceptors
interceptors(axiosInstance);

export default axiosInstance;