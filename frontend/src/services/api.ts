import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5001';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');
const IS_DEBUG = import.meta.env.VITE_ENABLE_DEBUG === 'true';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  timeout: API_TIMEOUT,
});

// Shared in-memory storage fallback when localStorage is blocked
const memoryStorage: Record<string, string> = {};

// EXPORTED: Safe LocalStorage wrapper shared across all modules
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage is blocked, using memory storage fallback.', e);
      return memoryStorage[key] || null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('localStorage is blocked, saving to memory storage fallback.', e);
      memoryStorage[key] = value;
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('localStorage is blocked, clearing from memory storage fallback.', e);
      delete memoryStorage[key];
    }
  }
};

// Automatically attach authorization token to headers safely
api.interceptors.request.use(
  (config) => {
    const token = safeLocalStorage.getItem('token'); // Read from shared safeLocalStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
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
        data: error.response.data
      });
    }
    return Promise.reject(error);
  }
);

export interface Book {
  id?: number;
  title: string;
  author: string;
  cover?: string;
  rating?: number;
  pages: number;
  genre: string;
  status: 'want-to-read' | 'reading' | 'read' | 'completed' | string;
  currentPage: number;
}

export interface GetBooksParams {
  q?: string;
  genre?: string;
  page?: number;
  limit?: number;
}

const getSafePath = (endpoint: string): string => {
  const hasApiPrefix = API_BASE_URL.endsWith('/api') || API_BASE_URL.endsWith('/api/');
  return hasApiPrefix ? endpoint : `/api${endpoint}`;
};

// GET /api/books?q=&genre=&page=&limit=
export const getBooks = async (params?: GetBooksParams): Promise<any> => {
  const response = await api.get(getSafePath('/books'), {
    params: {
      q: params?.q || undefined,
      genre: params?.genre || undefined,
      page: params?.page || undefined,
      limit: params?.limit || undefined
    }
  });
  return response.data;
};

// GET /api/books/:id
export const getBookById = async (id: number): Promise<Book> => {
  const response = await api.get<Book>(getSafePath(`/books/${id}`));
  return response.data;
};

// POST /api/books (Gated)
export const addBook = async (bookData: Omit<Book, 'id'>): Promise<Book> => {
  const response = await api.post<Book>(getSafePath('/books'), bookData);
  return response.data;
};

// PUT /api/books/:id (Gated)
export const updateBook = async (id: number, bookData: Partial<Book>): Promise<Book> => {
  const response = await api.put<Book>(getSafePath(`/books/${id}`), bookData);
  return response.data;
};

// DELETE /api/books/:id (Gated)
export const deleteBook = async (id: number): Promise<Book> => {
  const response = await api.delete<Book>(getSafePath(`/books/${id}`));
  return response.data;
};

export default api;