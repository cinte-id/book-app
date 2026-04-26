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
    if (IS_DEBUG) console.log(`[${config.method?.toUpperCase()}] ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = "Terjadi kesalahan sistem";

    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.message;

      if (status === 404) errorMessage = "Data tidak ditemukan";
      else if (status === 400) errorMessage = serverMessage || "Data tidak valid";
      else if (status === 500) errorMessage = "Server Error (Backend mati/error)";
      else if (serverMessage) errorMessage = serverMessage;
    } else if (error.request) {
      errorMessage = "Koneksi gagal. Cek apakah Backend (Port 5001) sudah jalan.";
    }

    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

/**
 * API SERVICES
 */

// 1. Ambil semua buku (Discover)
export const fetchBooks = (search?: string, genre?: string) => {
  return api.get('/api/books', { 
    params: { search, genre } 
  });
};

// 2. Ambil detail satu buku
export const fetchBookById = (id: number | string) => {
  return api.get(`/api/books/${id}`);
};

// 3. Update Status (Love/Mulai Baca)
export const updateBookStatus = (id: number | string, status: string) => {
  return api.put(`/api/books/${id}`, { status });
};

// 4. Update Progress (Halaman Baca)
// Pastikan di Backend, kamu menerima body: { "current_page": ... }
export const updateBookProgress = (id: number | string, currentPage: number) => {
  return api.put(`/api/books/${id}`, { current_page: currentPage });
};

// 5. Ambil buku untuk Library (Status != none)
export const fetchMyLibrary = () => {
  return api.get('/api/books/library'); 
};

export default api;