import axios from "axios";

// Dengan Vite proxy aktif, cukup pakai path relatif.
// Request ke /api/... akan otomatis di-forward ke backend.
const API_BASE_URL = "/";

const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || "10000");
const IS_DEBUG = import.meta.env.VITE_ENABLE_DEBUG === "true";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
  timeout: API_TIMEOUT,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (IS_DEBUG) {
      console.log("Making request to:", config.baseURL + config.url);
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (IS_DEBUG) {
      console.log("Response received:", response.status, response.statusText);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Response error:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error("Request error - no response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  },
);

// ── typed helpers ────────────────────────────────────────────────────────────

export interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  pages: number;
  genre: string;
  status: "read" | "reading" | "want-to-read";
}

export interface BooksParams {
  search?: string;
  genre?: string;
  status?: string;
}

/** Fetch all books with optional search / genre / status filters */
export const getBooks = (params: BooksParams = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.genre && params.genre !== "all")
    query.append("genre", params.genre);
  if (params.status) query.append("status", params.status);
  const qs = query.toString();
  return api.get<Book[]>(`/api/books${qs ? `?${qs}` : ""}`);
};

/** Fetch a single book by ID */
export const getBookById = (id: number) => api.get<Book>(`/api/books/${id}`);

/** Update a book's fields */
export const updateBook = (id: number, data: Partial<Book>) =>
  api.put<Book>(`/api/books/${id}`, data);

/** Add a new book */
export const createBook = (data: Omit<Book, "id">) =>
  api.post<Book>("/api/books", data);

/** Delete a book */
export const deleteBook = (id: number) => api.delete(`/api/books/${id}`);

export default api;
