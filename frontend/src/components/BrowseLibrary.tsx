import { Search, Filter, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import BookCard from './BookCard';
import { useDebounce } from '../hooks/useDebounce';
import type { Book } from '../types/book';

const STORAGE_KEY = 'browse-library-filters';

const loadSaved = (): { searchTerm?: string; selectedGenre?: string } => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const BrowseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState(() => loadSaved().searchTerm ?? '');
  const [selectedGenre, setSelectedGenre] = useState(() => loadSaved().selectedGenre ?? 'all');
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<string[]>(['all']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Remember filters so they survive navigating to the detail page and back
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ searchTerm, selectedGenre }));
    } catch {
      /* ignore storage errors */
    }
  }, [searchTerm, selectedGenre]);

  // Load the genre list once, so the chips don't shrink while filtering
  useEffect(() => {
    api
      .get<Book[]>('/api/books')
      .then((res) => {
        const unique = [...new Set(res.data.map((b) => b.genre).filter(Boolean))];
        setGenres(['all', ...unique]);
      })
      .catch(() => {
        /* the main fetch below shows the error */
      });
  }, []);

  // Fetch books whenever the (debounced) search or the genre changes
  useEffect(() => {
    let ignore = false;

    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get<Book[]>('/api/books', {
          params: {
            q: debouncedSearch.trim() || undefined,
            genre: selectedGenre === 'all' ? undefined : selectedGenre,
          },
        });
        if (!ignore) {
          setBooks(response.data);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching books:', err);
        if (!ignore) setError('Failed to fetch books. Please try again later.');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchBooks();
    return () => {
      ignore = true;
    };
  }, [debouncedSearch, selectedGenre]);

  // Handle adding a book to library
  const handleAddBook = async (bookId: number) => {
    try {
      await api.put(`/api/books/${bookId}`, { status: 'want-to-read' });
      setBooks((prev) =>
        prev.map((book) => (book.id === bookId ? { ...book, status: 'want-to-read' } : book))
      );
      setActionError(null);
    } catch (err) {
      console.error('Error adding book:', err);
      setActionError('Failed to add book. Please try again.');
    }
  };

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

      {actionError && <p className="text-sm text-red-500">{actionError}</p>}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600">
            {books.length} book{books.length !== 1 ? 's' : ''} found
          </p>

          <div className="space-y-3">
            {books.map((book) => (
              <div key={book.id} className="relative">
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

          {books.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No books found matching your criteria</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrowseLibrary;