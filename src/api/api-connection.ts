import axios, { AxiosError, AxiosResponse } from 'axios';
import { Alert } from 'react-native';

// Get your API URL from environment variables
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.iqueue.online';

// ✅ Custom error type
export interface ApiErrorResponse {
  message: string;
  status: number;
  code: string;
  details?: any;
}

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000, // optional, in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ REQUEST INTERCEPTOR - Add auth token and logging
api.interceptors.request.use(
  (config) => {
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Example: Add auth token if needed
    // const token = await AsyncStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error.message);
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR - Handle errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    // ✅ Handle different error scenarios
    const status = error.response?.status;
    const data = error.response?.data as any;
    const errorMessage = data?.message || error.message || 'Unknown error';

    console.error('❌ API Error:', {
      status,
      message: errorMessage,
      code: error.code,
      url: error.config?.url,
    });

    // ✅ Custom error handling by status code
    switch (status) {
      case 400:
        console.error('❌ Bad Request:', data?.details);
        Alert.alert('Invalid Request', errorMessage || 'Please check your input');
        break;

      case 401:
        console.error('❌ Unauthorized - Token expired');
        Alert.alert('Session Expired', 'Please login again');
        // TODO: Clear auth token and redirect to login
        // await AsyncStorage.removeItem('authToken');
        // navigation.navigate('Login');
        break;

      case 403:
        console.error('❌ Forbidden - Access denied');
        Alert.alert('Access Denied', 'You do not have permission to perform this action');
        break;

      case 404:
        console.error('❌ Not Found:', error.config?.url);
        Alert.alert('Not Found', 'The requested resource was not found');
        break;

      case 409:
        console.error('❌ Conflict:', errorMessage);
        Alert.alert('Conflict', errorMessage || 'This resource already exists');
        break;

      case 422:
        console.error('❌ Validation Error:', data?.details);
        Alert.alert('Validation Error', errorMessage || 'Please check your input');
        break;

      case 429:
        console.error('❌ Too Many Requests - Rate limit exceeded');
        Alert.alert('Too Many Requests', 'Please try again later');
        break;

      case 500:
        console.error('❌ Server Error:', errorMessage);
        Alert.alert('Server Error', 'The server encountered an error. Please try again later');
        break;

      case 502:
      case 503:
      case 504:
        console.error('❌ Service Unavailable');
        Alert.alert('Service Unavailable', 'The server is temporarily unavailable. Please try again later');
        break;

      default:
        // ✅ Handle network errors
        if (error.code === 'ECONNABORTED') {
          console.error('❌ Request Timeout');
          Alert.alert('Timeout', 'Request took too long. Please try again');
        } else if (error.code === 'ECONNREFUSED') {
          console.error('❌ Connection Refused');
          Alert.alert('Connection Error', 'Could not connect to server');
        } else if (error.code === 'ERR_NETWORK') {
          console.error('❌ Network Error');
          Alert.alert('Network Error', 'Check your internet connection');
        } else {
          console.error('❌ Unknown Error:', error.message);
          Alert.alert('Error', errorMessage || 'An unexpected error occurred');
        }
    }

    return Promise.reject({
      status,
      message: errorMessage,
      code: error.code,
      data,
    } as ApiErrorResponse);
  }
);

export default api;