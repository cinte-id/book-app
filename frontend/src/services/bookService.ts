import api from './api';

export interface Book {
  id: number;
  title: string;
  author: string;
  cover?: string;
  rating?: number;
  pages?: number;
  genre?: string;
  status?: 'want-to-read' | 'reading' | 'read';
}

// Get all books with optional filters
export const getBooks = async (filters?: { genre?: string; status?: string }) => {
  const params = new URLSearchParams();
  if (filters?.genre && filters.genre !== 'all') {
    params.append('genre', filters.genre);
  }
  if (filters?.status && filters.status !== 'all') {
    params.append('status', filters.status);
  }
  
  const queryString = params.toString();
  const url = queryString ? `/api/books?${queryString}` : '/api/books';
  
  const response = await api.get<Book[]>(url);
  return response.data;
};

// Search books
export const searchBooks = async (query: string) => {
  const response = await api.get<Book[]>(`/api/books/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

// Get book detail by ID
export const getBookDetail = async (id: number) => {
  const response = await api.get<Book>(`/api/books/${id}`);
  return response.data;
};

// Add book
export const addBook = async (book: Omit<Book, 'id'>) => {
  const response = await api.post<Book>('/api/books', book);
  return response.data;
};

// Update book
export const updateBook = async (id: number, book: Partial<Book>) => {
  const response = await api.put<Book>(`/api/books/${id}`, book);
  return response.data;
};

// Delete book
export const deleteBook = async (id: number) => {
  const response = await api.delete<Book>(`/api/books/${id}`);
  return response.data;
};