import { Search, Filter, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import BookCard from './BookCard';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Define the Book interface
interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  pages: number;
  genre: string;
  status: 'read' | 'reading' | 'want-to-read' | 'catalog';
}

interface BrowseLibraryProps {
  onStatusChange?: (bookId: number, status: Book['status']) => void;
}

const BrowseLibrary = ({ onStatusChange }: BrowseLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState<'title' | 'rating' | 'pages'>('title');
  const [filterOpen, setFilterOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch books from the backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get<Book[]>('/api/books');
        setBooks(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch books. Please try again later.');
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Get unique genres from books
  const genres = ['all', ...new Set(books.map(book => book.genre))];
  
  // Filter books based on search term and selected genre
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    if (sortBy === 'pages') {
      return b.pages - a.pages;
    }
    return a.title.localeCompare(b.title);
  });

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
      if (onStatusChange) {
        onStatusChange(bookId, 'want-to-read');
      }
      toast({
        title: 'Added to My Books',
        description: 'Book moved to your library.',
      });
    } catch (err) {
      console.error('Error adding book:', err);
      setError('Failed to add book. Please try again.');
      toast({
        title: 'Add failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
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
        <button
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          onClick={() => setFilterOpen(true)}
          aria-label="Open filters"
        >
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

      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Sort & Filter</DialogTitle>
            <DialogDescription>Adjust how books are shown.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as typeof sortBy);
                  setFilterOpen(false);
                }}
                className="mt-2 w-full text-sm bg-white border border-gray-200 rounded-md px-3 py-2 text-gray-700"
              >
                <option value="title">Title</option>
                <option value="rating">Rating</option>
                <option value="pages">Pages</option>
              </select>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Count */}
      <p className="text-sm text-gray-600">
        {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
      </p>

      {/* Books Grid */}
      <div className="space-y-3">
        {sortedBooks.map((book) => (
          <div key={book.id} className="relative">
            <Link
              to={`/books/${book.id}`}
              state={{ returnTo: '/', activeTab: 'library', libraryView: 'browse' }}
              className="block"
            >
              <BookCard book={book} variant="discover" />
            </Link>
            {book.status === 'catalog' ? (
              <button 
                className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors shadow-lg"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleAddBook(book.id);
                }}
              >
                <Plus size={16} />
              </button>
            ) : (
              <div className="absolute top-4 right-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                {book.status === 'read' ? 'Read' : book.status === 'reading' ? 'Reading' : 'Want to Read'}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No books found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default BrowseLibrary;
