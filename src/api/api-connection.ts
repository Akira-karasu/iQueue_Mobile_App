import axios from 'axios';

// Get your API URL from environment variables
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.iqueue.online';

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000, // optional, in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add request interceptor
api.interceptors.request.use(
  config => {
    // Example: Add auth token if needed
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);


export default api;
