import { Search, Filter, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import BookCard from './BookCard';
import { useNavigate } from 'react-router-dom';

interface Book {
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
  const [books, setBooks] = useState<Book[]>([]);
  const [availableGenres, setAvailableGenres] = useState<string[]>(['all']);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Fungsi Utama Fetch Data
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/books', {
        params: {
          search: searchTerm,
          genre: selectedGenre === 'all' ? '' : selectedGenre
        }
      });
      
      console.log("RAW RESPONSE:", response); 

      const dataX = response.data;
      const finalData = Array.isArray(dataX) ? dataX : (dataX.books || []);
      
      console.log("FINAL DATA TO SET:", finalData);
      setBooks(finalData);

      if (availableGenres.length <= 1 && finalData.length > 0) {
        const genres = ['all', ...new Set(finalData.map((b: any) => b.genre))];
        setAvailableGenres(genres);
      }
    } catch (err) {
      console.error('API ERROR:', err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Effect untuk Search (dengan Debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedGenre]);

  const handleAddBook = async (bookId: number) => {
    try {
      await api.put(`/api/books/${bookId}`, { status: 'want-to-read' });
      setBooks(prev => prev.map(b => b.id === bookId ? { ...b, status: 'want-to-read' } : b));
    } catch (err) {
      alert('Failed to add book');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Browse Library</h2>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search books or authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Genre Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {availableGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shadow-sm border ${
              selectedGenre === genre 
                ? 'bg-blue-500 text-white border-blue-500 scale-95' 
                : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
            }`}
          >
            {genre === 'all' ? 'All Genres' : genre}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-600">{books.length} books found</p>

      {/* Books Grid */}
      <div className="space-y-3">
        {loading && books.length === 0 ? (
          <div className="flex justify-center p-10"><div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full"></div></div>
        ) : (
          books.map((book) => (
            <div key={book.id} className="relative group">
              <div onClick={() => navigate(`/book/${book.id}`)} className="cursor-pointer">
                <BookCard book={book} variant="discover" />
              </div>
              {book.status === 'want-to-read' ? (
                 <div className="absolute top-4 right-4 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">Saved</div>
              ) : (
                <button 
                  className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full"
                  onClick={(e) => { e.stopPropagation(); handleAddBook(book.id); }}
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {books.length === 0 && !loading && (
        <div className="text-center py-10 text-gray-500">No books found.</div>
      )}
    </div>
  );
};

export default BrowseLibrary;