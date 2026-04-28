import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = 'http://127.0.0.1:5001';
const API_TIMEOUT = 10000;
const IS_DEBUG = true;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    if (IS_DEBUG) {
      console.log(`[${config.method?.toUpperCase()}] ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = "Something went wrong";

    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.message;

      if (status === 404) {
        errorMessage = "Data not found";
      } else if (status === 400) {
        errorMessage = serverMessage || "Invalid request data";
      } else if (status === 500) {
        errorMessage = "Server error. Please try again later";
      } else if (serverMessage) {
        errorMessage = serverMessage;
      }

    } else if (error.request) {
      errorMessage = "Cannot connect to server. Please check your backend";
    }

    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

/**
 * API SERVICES
 */

// GET all books
export const fetchBooks = (search?: string, genre?: string) => {
  return api.get('/api/books', { params: { search, genre } });
};

// GET book detail
export const fetchBookById = (id: number | string) => {
  return api.get(`/api/books/${id}`);
};

// UPDATE book status
export const updateBookStatus = (id: number | string, status: string) => {
  return api.put(`/api/books/${id}`, { status });
};

// UPDATE reading progress
export const updateBookProgress = (id: number | string, currentPage: number) => {
  return api.put(`/api/books/${id}`, { current_page: currentPage });
};

// DELETE book
export const deleteBook = (id: number | string) => {
  return api.delete(`/api/books/${id}`);
};

// UPDATE rating
export const updateBookRating = (
  id: number | string,
  ratingData: {
    rating: number;
    rating_sum: number;
    rating_count: number;
    user_rating: number;
  }
) => {
  return api.put(`/api/books/${id}`, ratingData);
};

export default api;