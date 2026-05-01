import { Search, Filter, Star, Plus, RefreshCcw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import BookCard from './BookCard';
import BookDetail from './BookDetail';

// Define the Book interface
export interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  pages: number;
  genre: string;
  status: 'read' | 'reading' | 'want-to-read';
}

const BrowseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  function handleBookClick(bookId: number){
    setSelectedBookId(bookId);
  }

  function handleBack(){
    setSelectedBookId(null);
  }

  function handleResetFilter(){
    setSelectedGenre('all');
    setSelectedStatus('all');
    setSearchTerm('');
  }

  // Fetch books from the backend
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

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterContainerRef.current &&
        !filterContainerRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilter]);



  // Get unique genres from books
  const genres = ['all', ...new Set(books.map(book => book.genre))];
  const statuses = [
    { value: 'all', label: 'All' },
    { value: 'read', label: 'Read' },
    { value: 'reading', label: 'Reading' },
    { value: 'want-to-read', label: 'Want To Read' }
  ];
  
  // Filter books based on search term and selected genre
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) 
                          || book.author.toLowerCase().includes(searchTerm.toLowerCase()) 
                          || book.genre.toLowerCase().includes(searchTerm.toLowerCase()); // Menambah fitur search berdasarkan genre
    const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
    const matchesStatus = selectedStatus === 'all' || book.status === selectedStatus;
    return matchesSearch && matchesGenre && matchesStatus;
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

  if (selectedBookId) {
    return <BookDetail bookId={selectedBookId} onBack={handleBack} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Browse Library</h2>
        <div ref={filterContainerRef} className='relative'>
          <div className='flex space-x-3'>
            <button className=' bg-blue-500 text-white px-3 rounded-lg hover:bg-blue-600 transition-colors' onClick={handleResetFilter}>
              <RefreshCcw size={15}/>
            </button>
            <button className="p-2 bg-gray-200 px-3 rounded-lg text-gray-600 hover:text-gray-800 transition-colors"
                onClick={() => setShowFilter(!showFilter)}
            >
                <Filter size={20} />
            </button>
          </div>

          {showFilter && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-3">
              {/* Filter Genre */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2 font-medium">Genre:</p>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedGenre === genre
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {genre === 'all' ? 'All' : genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Status */}
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium">Status:</p>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => setSelectedStatus(status.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedStatus === status.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>    

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-600">
        {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
      </p>

      {/* Books Grid */}
      <div className="space-y-3">
        {filteredBooks.map((book) => (
          <div key={book.id} className="relative">
              <button className='w-full text-left' onClick={() => handleBookClick(book.id)}>
                <BookCard book={book} variant="discover" />
              </button>
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

      {filteredBooks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No books found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default BrowseLibrary;