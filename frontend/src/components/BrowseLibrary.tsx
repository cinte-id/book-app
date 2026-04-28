import { Search, Plus, Loader2, Check, Clock, CheckCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import api, { fetchBooks, updateBookStatus } from '../services/api';
import BookCard from '../components/BookCard';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  pages: number;
  genre: string;
  status: 'read' | 'reading' | 'want-to-read' | 'none';
}

interface BrowseLibraryProps {
  onBookAdded?: () => void;
  onBookClick?: (id: number | string) => void;
}


const BrowseLibrary = ({ onBookAdded, onBookClick }: BrowseLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [books, setBooks] = useState<Book[]>([]);
  const [availableGenres, setAvailableGenres] = useState<string[]>(['all']);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Load Data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchBooks(
        searchTerm, 
        selectedGenre === 'all' ? undefined : selectedGenre
      );
      
      const dataX = response.data;
      const finalData: Book[] = Array.isArray(dataX) ? dataX : (dataX.books || []);
      
      setBooks(finalData);

      setAvailableGenres(prevGenres => {
        if (prevGenres.length <= 1 && finalData.length > 0) {
          return ['all', ...new Set(finalData.map((b: Book) => b.genre))];
        }
        return prevGenres;
      });

    } catch (err) {
      console.error('Browse Error:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedGenre]); 

  // 2. Debounce Search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadData();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [loadData]);

  // 3. Handle Add Book
  const handleAddBook = async (bookId: number, title: string) => {
    try {
      // Set status to 'want-to-read'
      await updateBookStatus(bookId, 'want-to-read');
      
      // Update UI local SAVED
      setBooks(prev => prev.map(b => 
        b.id === bookId ? { ...b, status: 'want-to-read' } : b
      ));
      
      toast.success(`"${title}" added to your collection!`);
      if (onBookAdded) onBookAdded();
    } catch (err) {
      toast.error("Failed to add book");
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500 pb-32">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Discover</h2>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search books or authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 shadow-sm rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {/* Genre Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {availableGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              selectedGenre === genre 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {genre === 'all' ? 'All Genre' : genre}
          </button>
        ))}
      </div>

      {/* List Buku */}
      <div className="space-y-4">
        {loading && books.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-3">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <p className="text-gray-400 text-sm italic">Finding books for you...</p>
          </div>
        ) : (
          books.map((book) => (
            <div key={book.id} className="relative group transition-all duration-300">
              <BookCard 
                book={book} 
                variant="discover" 
                onClick={() => navigate(`/book-detail/${book.id}`)} 
              />

              {/* Status Button Overlay */}
              <div className="absolute top-4 right-4 z-10">
                {book.status === 'want-to-read' ? (
                  <div className="bg-pink-50 text-pink-600 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 border border-pink-100 shadow-sm">
                    <Check size={12} /> SAVED
                  </div>
                ) : book.status === 'reading' ? (
                  <div className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 border border-orange-100">
                    <Clock size={12} /> READING
                  </div>
                ) : book.status === 'read' ? (
                  <div className="bg-green-50 text-green-600 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 border border-green-100">
                    <CheckCircle size={12} /> FINISHED
                  </div>
                ) : (
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-90"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleAddBook(book.id, book.title); 
                    }}
                  >
                    <Plus size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {books.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 text-sm">No books found in this genre.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseLibrary;