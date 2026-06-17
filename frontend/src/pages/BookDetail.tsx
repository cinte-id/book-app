import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, BookOpen, Plus, Check } from 'lucide-react';
import api from '../services/api';

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

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await api.get<Book>(`/api/books/${id}`);
        setBook(response.data);
        setError(null);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setError('Book not found.');
        } else {
          setError('Failed to fetch book details. Please try again later.');
        }
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const handleAddBook = async () => {
    if (!book) return;
    
    try {
      setIsAdding(true);
      await api.put(`/api/books/${book.id}`, {
        status: 'want-to-read'
      });
      setBook({ ...book, status: 'want-to-read' });
    } catch (err) {
      console.error('Error adding book:', err);
      alert('Failed to add book to library.');
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-md mx-auto p-4 flex flex-col">
        <button 
          onClick={() => navigate(-1)} 
          className="self-start p-2 mb-8 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
            <BookOpen size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-500">{error || 'Book not found'}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 py-4 border-b border-gray-100">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
      </div>

      {/* Book Cover */}
      <div className="px-4 pt-6 pb-8 flex flex-col items-center">
        <div className="w-48 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-lg flex items-center justify-center mb-6 overflow-hidden relative">
          {book.cover ? (
            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <BookOpen className="text-blue-500" size={64} />
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">{book.title}</h1>
        <p className="text-lg text-gray-600 text-center mb-6">{book.author}</p>
        
        <div className="flex space-x-4 mb-8">
          <div className="flex flex-col items-center px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center text-gray-800 font-bold text-lg mb-1">
              {book.rating} <Star size={16} className="text-yellow-400 ml-1 fill-yellow-400" />
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Rating</span>
          </div>
          
          <div className="flex flex-col items-center px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center text-gray-800 font-bold text-lg mb-1">
              {book.pages}
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Pages</span>
          </div>

          <div className="flex flex-col items-center px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center text-gray-800 font-bold text-lg mb-1">
              {book.genre}
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Genre</span>
          </div>
        </div>

        {/* Action Button */}
        {book.status === 'want-to-read' ? (
          <button 
            disabled={true}
            className="w-full py-4 bg-green-50 text-green-600 rounded-xl font-bold flex items-center justify-center space-x-2 border border-green-200"
          >
            <Check size={20} />
            <span>In Library</span>
          </button>
        ) : (
          <button 
            onClick={handleAddBook}
            disabled={isAdding}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center space-x-2"
          >
            {isAdding ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Plus size={20} />
                <span>Add to Library</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Book Synopsis */}
      <div className="px-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">About this book</h3>
        <p className="text-gray-600 leading-relaxed">
          Discover more about "{book.title}" by {book.author}. 
          Add this book to your library to start tracking your reading progress.
        </p>
      </div>
    </div>
  );
};

export default BookDetail;
