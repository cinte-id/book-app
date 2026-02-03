import { Search, Filter, Star, Plus, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  genre: string;
  status: 'read' | 'reading' | 'want-to-read' | 'discover';
}

const BrowseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchWarning, setSearchWarning] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableGenres, setAvailableGenres] = useState<string[]>(['all']);

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get<Book[]>('/api/books');
        const uniqueGenres = ['all', ...new Set(response.data.map(book => book.genre))];
        setAvailableGenres(uniqueGenres);
      } catch (err) {
        console.error('Failed to fetch genres:', err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch books from the backend
  useEffect(() => {
    // Search validation: require at least 3 characters
    if (searchTerm.length > 0 && searchTerm.length < 3) {
        setSearchWarning(true);
        return;
    }
    setSearchWarning(false);

    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get<Book[]>('/api/books', {
            params: {
                search: searchTerm,
                category: selectedGenre
            }
        });
        setBooks(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch books. Please try again later.');
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
        fetchBooks();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedGenre]);
  
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

  if (loading && !books.length && !searchWarning) {
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

      {/* Search Validation Instruction */}
      {searchWarning && (
        <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-sm">
            <AlertCircle size={16} />
            <span>Please type at least 3 characters to search</span>
        </div>
      )}

      {/* Genre Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {availableGenres.map((genre) => (
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
        {books.length} book{books.length !== 1 ? 's' : ''} found
      </p>

      {/* Books Grid */}
      <div className="space-y-3">
        {books.map((book) => (
          <div key={book.id} className="relative">
            <Link to={`/books/${book.id}`}>
                <BookCard book={book} variant="discover" />
            </Link>
            {book.status === 'discover' ? (
              <button 
                className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors shadow-lg z-10"
                onClick={(e) => {
                    e.preventDefault();
                    handleAddBook(book.id);
                }}
                title="Add to My Library"
              >
                <Plus size={16} />
              </button>
            ) : (
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm z-10 font-medium ${
                  book.status === 'read' ? 'bg-green-100 text-green-700' :
                  book.status === 'reading' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
              }`}>
                {book.status.replace(/-/g, ' ')}
              </div>
            )}
          </div>
        ))}
      </div>

      {books.length === 0 && !loading && !searchWarning && (
        <div className="text-center py-8">
          <p className="text-gray-500">No books found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default BrowseLibrary;
