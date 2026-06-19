import axios from 'axios';

// Create a globally configured Axios instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  // CRITICAL: This tells the browser to automatically attach our HTTP-Only cookies to every request!
  withCredentials: true,
});

// Since we use HTTP-Only cookies, we NO LONGER NEED the LocalStorage interceptor.
// The browser handles token passing securely and automatically!

// Add a Response Interceptor for handling 401 Unauthorized errors
apiClient.interceptors.response.use(
  (response) => {
    // If the request succeeds, just return it
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 (Unauthorized) and we haven't already retried this request...
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't intercept calls to the refresh route itself, or to login/register routes
      if (
        originalRequest.url === '/auth/refresh-token' ||
        originalRequest.url === '/auth/login' ||
        originalRequest.url === '/auth/register'
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Attempt to get a new token!
        await apiClient.post('/auth/refresh-token');
        
        // If successful, the new secure cookie is set automatically.
        // Retry the original request!
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refreshing fails (e.g. refresh token is also expired or missing), we just reject.
        // Zustand will catch this rejection in initializeAuth() and cleanly set user to null!
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
