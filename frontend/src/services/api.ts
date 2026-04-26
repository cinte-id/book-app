import axios from 'axios';

// Get API configuration from environment variables
const API_BASE_URL = 'http://127.0.0.1:5001';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');
const IS_DEBUG = true;

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, 
  timeout: API_TIMEOUT,
});

// Add request interceptor for error handling
api.interceptors.request.use(
  (config) => {
    if (IS_DEBUG) {
      console.log('Making request to:', config.baseURL + config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    if (IS_DEBUG) {
      console.log('Response received:', response.status, response.statusText);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('Request error - no response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * PENGEMBANGAN FITUR FULLSTACK
 */

// Fungsi untuk mengambil semua buku dengan dukungan filter pencarian dan genre
export const fetchBooks = (search?: string, genre?: string) => {
  return api.get('/api/books', { 
    params: { 
      search: search, 
      genre: genre 
    } 
  });
};

// Fungsi untuk mengambil detail satu buku berdasarkan ID
export const fetchBookById = (id: string | number) => {
  return api.get(`/api/books/${id}`);
};

export default api;