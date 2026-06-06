import { Search, Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import BookCard from './BookCard';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  pages: number;
  genre: string;
  status: 'read' | 'reading' | 'want-to-read' | string;
  currentPage?: number; // Made optional to prevent dummy data mismatch
}

const BrowseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Stable list to preserve genre filter categories
  const [allGenres, setAllGenres] = useState<string[]>(['all']);

  // Pagination states (Optional Mid-Level specification)
  const [page, setPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const limit = 4; // Display 4 items per page for testing

  // Fetch stable genre list once on initial component load
  useEffect(() => {
    const fetchAllGenres = async () => {
      try {
        const response = await api.get('/api/books');
        const data = response.data as any; // Cast to bypass Axios unknown type compiler error
        const rawList = data && typeof data === 'object' && 'books' in data ? data.books : data;
        if (Array.isArray(rawList)) {
          const uniqueGenres = ['all', ...new Set(rawList.map((book: Book) => book.genre))];
          setAllGenres(uniqueGenres);
        }
      } catch (err) {
        console.error('Failed to pre-fetch genres:', err);
      }
    };
    fetchAllGenres();
  }, []);

  // Fetch books with server-side query params (GET /api/books?q=&genre=&page=&limit=)
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/books', {
          params: {
            q: searchTerm ? searchTerm.trim() : undefined,
            genre: selectedGenre !== 'all' ? selectedGenre : undefined,
            page: page,
            limit: limit
          }
        });

        const data = response.data as any; // Cast to bypass Axios unknown type compiler error
        // Parse structured vs flat response safely
        if (data && typeof data === 'object' && 'books' in data) {
          setBooks(data.books);
          setTotalBooks(data.total);
        } else if (Array.isArray(data)) {
          setBooks(data);
          setTotalBooks(data.length);
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch books. Please try again later.');
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchBooks();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedGenre, page]);

  // Reset page to 1 when search or genre filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedGenre]);

  // Books list derived from backend results
  const filteredBooks = books;

  // Add book to library with auth-gate handling
  const handleAddBook = async (bookId: number) => {
    try {
      await api.put(`/api/books/${bookId}`, {
        status: 'want-to-read'
      });
      // Update state locally
      setBooks(books.map(book => 
        book.id === bookId 
          ? { ...book, status: 'want-to-read' }
          : book
      ));
    } catch (err: any) {
      console.error('Error adding book:', err);
      if (err.response?.status === 401) {
        alert('Unauthorized! Please log in on the Profile tab first.');
      } else {
        setError('Failed to add book. Please try again.');
      }
    }
  };

  const totalPages = Math.ceil(totalBooks / limit);

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
        {allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedGenre === genre
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
        Showing books {Math.max((page - 1) * limit + 1, 1)} - {Math.min(page * limit, totalBooks)} of {totalBooks} found
      </p>

      {/* Books Grid */}
      <div className="space-y-3">
        {filteredBooks.map((book) => {
          const isAdded = ['want-to-read', 'reading', 'read', 'completed'].includes(book.status);

          return (
            <div key={book.id} className="relative">
              <BookCard book={book} variant="discover" />
              
              {/* Action overlay with bubbling protection */}
              {!isAdded ? (
                <button 
                  className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors shadow-lg z-10"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card link navigation
                    handleAddBook(book.id);
                  }}
                >
                  <Plus size={16} />
                </button>
              ) : (
                <div 
                  className="absolute top-4 right-4 bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full text-xs z-10"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card link navigation
                  }}
                >
                  {book.status === 'want-to-read' ? 'Want to Read' : book.status === 'reading' ? 'Reading' : 'Completed'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-2 border rounded-xl hover:bg-gray-100 disabled:opacity-40 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-semibold text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="p-2 border rounded-xl hover:bg-gray-100 disabled:opacity-40 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {filteredBooks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No books found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default BrowseLibrary;