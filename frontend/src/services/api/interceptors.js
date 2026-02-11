import toast from 'react-hot-toast';

export const interceptors = (instance) => {
  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Clear local storage and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        
        // Don't show error toast for auth endpoints
        if (!originalRequest.url.includes('/auth/login')) {
          toast.error('Session expired. Please login again.');
        }
        
        window.location.href = '/login';
      }

      // Handle 403 Forbidden errors
      if (error.response?.status === 403) {
        toast.error('You do not have permission to perform this action');
      }

      // Handle 404 Not Found errors
      if (error.response?.status === 404) {
        toast.error('Resource not found');
      }

      // Handle 500 Internal Server errors
      if (error.response?.status === 500) {
        toast.error('An unexpected error occurred. Please try again later.');
      }

      return Promise.reject(error);
    }
  );
};