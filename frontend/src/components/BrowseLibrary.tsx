import { Search, Filter, Star, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import BookCard from './BookCard';

// Define the Book interface
interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  pages: number;
  currentPage?: number;
  genre: string;
  status: 'read' | 'reading' | 'want-to-read' | 'unread' | string;
}

interface PaginatedResponse {
  data: Book[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

const BrowseLibrary = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const selectedGenre = searchParams.get('genre') || 'all';

  const setSearchTerm = (term: string) => {
    setSearchParams(prev => {
      if (term) prev.set('search', term);
      else prev.delete('search');
      return prev;
    });
  };

  const setSelectedGenre = (genre: string) => {
    setSearchParams(prev => {
      if (genre !== 'all') prev.set('genre', genre);
      else prev.delete('genre');
      return prev;
    });
  };

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  // Fetch books from the backend when search, genre, or page changes
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get<PaginatedResponse>('/api/books', {
          params: {
            q: searchTerm,
            genre: selectedGenre,
            page: page,
            limit: 6
          }
        });
        setBooks(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalBooks(response.data.total);
        setError(null);
      } catch (err) {
        setError('Failed to fetch books. Please try again later.');
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    const timerId = setTimeout(() => {
      fetchBooks();
    }, 300); // 300ms debounce

    return () => clearTimeout(timerId);
  }, [searchTerm, selectedGenre, page]);

  // Reset page when search or genre changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedGenre]);

  // Hardcoded genres since we can't extract them perfectly from paginated results
  const genres = ['all', 'Classic', 'Fiction', 'Dystopian', 'Romance', 'Coming-of-age', 'Fantasy', 'Sci-Fi'];

  // Handle adding a book to library
  const handleAddBook = async (bookId: number) => {
    try {
      await api.put(`/api/books/${bookId}`, {
        status: 'want-to-read'
      });
      // Update local state
      setBooks(books.map(book =>
        book.id === bookId
          ? { ...book, status: 'want-to-read' }
          : book
      ));
    } catch (err) {
      console.error('Error adding book:', err);
      setError('Failed to add book. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Browse Library</h2>
        <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
          <Filter size={20} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search books or authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Genre Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedGenre === genre
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {genre === 'all' ? 'All Genres' : genre}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-600">
        {totalBooks} book{totalBooks !== 1 ? 's' : ''} found
      </p>

      {/* Books Grid */}
      <div className="space-y-3">
        {books.map((book) => (
          <div key={book.id} className="relative block">
            <Link to={`/books/${book.id}`} className="block">
              <BookCard book={book} variant="discover" />
            </Link>
            {book.status === 'want-to-read' ? (
              <button
                className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors shadow-lg"
                onClick={() => handleAddBook(book.id)}
              >
                <Plus size={16} />
              </button>
            ) : (
              <div className="absolute top-4 right-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                {book.status}
              </div>
            )}
          </div>
        ))}
      </div>

      {books.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No books found matching your criteria</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 pt-4">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseLibrary;
