import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, BookOpen, Trash2, Plus } from 'lucide-react';
import api from '../services/api';

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

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await api.get<Book>(`/api/books/${id}`);
        setBook(response.data);
      } catch (err) {
        setError('Failed to load book details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBook();
  }, [id]);

  const handleRemoveFromLibrary = async () => {
    if (!confirm('Are you sure you want to remove this book from your library?')) return;
    try {
      // Optimistic update: set status to 'discover' instead of deleting
      setBook(prev => prev ? ({ ...prev, status: 'discover' }) : null);
      await api.put(`/api/books/${id}`, { status: 'discover' });
      // We stay on the page to allow the user to add it back if they want
    } catch (err) {
      console.error('Failed to remove book:', err);
      alert('Failed to remove book');
    }
  };

  const handleAddToLibrary = async () => {
    try {
      // Optimistic update: set status to 'want-to-read' (default for add)
      setBook(prev => prev ? ({ ...prev, status: 'want-to-read' }) : null);
      await api.put(`/api/books/${id}`, { status: 'want-to-read' });
    } catch (err) {
      console.error('Failed to add book:', err);
      alert('Failed to add book');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      // Optimistic update
      setBook(prev => prev ? ({ ...prev, status: newStatus as any }) : null);
      await api.put(`/api/books/${id}`, { status: newStatus });
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">{error || 'Book not found'}</p>
        <button 
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative">
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-sm sticky top-0 z-10 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 mr-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-800 truncate">Book Details</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Cover & Title */}
        <div className="flex flex-col items-center space-y-4">
           <div className="w-32 h-44 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center shadow-md overflow-hidden">
                {book.cover && book.cover.startsWith('http') ? (
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                    <BookOpen className="text-blue-500" size={48} />
                )}
           </div>
           <div className="text-center">
             <h2 className="text-2xl font-bold text-gray-900">{book.title}</h2>
             <p className="text-lg text-gray-600">{book.author}</p>
           </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 border-y border-gray-200 py-4 bg-white rounded-xl shadow-sm">
            <div className="text-center">
                <div className="flex items-center justify-center text-gray-800 font-bold text-lg">
                    <Star className="text-yellow-400 mr-1 fill-yellow-400" size={20} /> {book.rating}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Rating</div>
            </div>
            <div className="text-center border-l border-gray-100">
                <div className="flex items-center justify-center text-gray-800 font-bold text-lg">
                    {book.pages}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Pages</div>
            </div>
             <div className="text-center border-l border-gray-100">
                <div className="flex items-center justify-center text-gray-800 font-bold text-lg truncate px-2">
                    {book.genre}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Genre</div>
            </div>
        </div>

        {/* Status & Actions */}
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
            {book.status === 'discover' ? (
                <button 
                    onClick={handleAddToLibrary}
                    className="w-full flex items-center justify-center p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium"
                >
                    <Plus size={20} className="mr-2" />
                    Add to My Library
                </button>
            ) : (
                <>
                    <div>
                        <h3 className="font-semibold mb-3 text-gray-800">Current Status</h3>
                        <select 
                            value={book.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="want-to-read">Want to Read</option>
                            <option value="reading">Reading</option>
                            <option value="read">Read</option>
                        </select>
                    </div>
                    
                    <button 
                        onClick={handleRemoveFromLibrary}
                        className="w-full flex items-center justify-center p-3 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        <Trash2 size={18} className="mr-2" />
                        Remove from Library
                    </button>
                </>
            )}
        </div>
        
        {/* Description (Dummy, since backend doesn't provide it) */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-semibold mb-2 text-gray-800">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
                This is a placeholder description for {book.title}. The current data source does not include book summaries, 
                but in a real application, this section would contain a detailed plot summary or back cover text.
            </p>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
