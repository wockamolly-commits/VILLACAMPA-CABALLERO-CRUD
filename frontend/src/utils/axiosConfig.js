import axios from 'axios';

// Create an axios instance with base configuration
export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000'
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('[Axios] Adding token to request:', config.url);
        } else {
            console.log('[Axios] No token for request:', config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401/403 errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.error('[Axios] Authentication error:', error.response?.data?.message);
            // Clear auth data
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            // Reload page to go back to login
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
