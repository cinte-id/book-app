import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Star, Clock, Tag, Plus, Check } from 'lucide-react';
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
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await api.get<Book>(`/api/books/${id}`);
        setBook(response.data);
        setError(null);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setError('Book not found');
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
      await api.put(`/api/books/${book.id}`, {
        status: 'want-to-read'
      });
      setBook({ ...book, status: 'want-to-read' });
      setAdded(true);
    } catch (err) {
      console.error('Error adding book:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-md md:max-w-5xl mx-auto flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-100 px-4 py-4 flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 hover:text-gray-800 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-800 ml-2">Loading...</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-md md:max-w-5xl mx-auto flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-100 px-4 py-4 flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 hover:text-gray-800 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-800 ml-2">Error</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-xl text-gray-800 font-semibold mb-2">Oops!</p>
          <p className="text-gray-500 mb-6">{error || 'Something went wrong'}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md md:max-w-5xl mx-auto flex flex-col pb-20 md:pb-6">
      <header className="bg-white shadow-sm border-b border-gray-100 px-4 py-4 flex items-center sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 hover:text-gray-800 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800 ml-2 truncate">Book Details</h1>
      </header>

      <main className="flex-1 px-4 md:px-8 py-6">
        <div className="md:flex md:gap-8">
          {/* Left Column: Cover */}
          <div className="md:w-1/3 shrink-0">
        {/* Cover Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="aspect-[3/2] bg-gradient-to-br from-blue-100 to-purple-100 relative flex items-center justify-center">
            <BookOpen className="text-blue-500 opacity-80" size={64} />
          </div>
        </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="md:w-2/3 flex flex-col justify-center">
        {/* Title and Author */}
        <div className="mb-6 text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2 leading-tight">{book.title}</h2>
          <p className="text-lg md:text-xl text-gray-600 mb-4">by {book.author}</p>
          
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              {book.genre}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              book.status === 'read' ? 'bg-green-100 text-green-700' :
              book.status === 'reading' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {book.status === 'read' ? 'Read' : book.status === 'reading' ? 'Reading' : 'Want to Read'}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <div className="flex flex-col items-center justify-center px-2">
              <div className="flex items-center text-gray-800 font-semibold mb-1">
                <Star size={16} className="text-yellow-400 mr-1" fill="currentColor" />
                {book.rating}
              </div>
              <span className="text-xs text-gray-500">Rating</span>
            </div>
            <div className="flex flex-col items-center justify-center px-2">
              <div className="flex items-center text-gray-800 font-semibold mb-1">
                <Clock size={16} className="text-gray-400 mr-1" />
                {book.pages}
              </div>
              <span className="text-xs text-gray-500">Pages</span>
            </div>
            <div className="flex flex-col items-center justify-center px-2 text-center">
              <div className="flex items-center text-gray-800 font-semibold mb-1 justify-center w-full truncate">
                <Tag size={16} className="text-gray-400 mr-1 flex-shrink-0" />
                <span className="truncate">{book.genre}</span>
              </div>
              <span className="text-xs text-gray-500">Category</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {book.status !== 'want-to-read' ? (
             <button 
                disabled
                className="w-full bg-gray-100 text-gray-500 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2"
              >
                <Check size={20} />
                <span>{book.status === 'read' ? 'Already Read' : 'Currently Reading'}</span>
             </button>
          ) : added ? (
             <button 
                disabled
                className="w-full bg-green-100 text-green-700 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2"
              >
                <Check size={20} />
                <span>Added to Library</span>
             </button>
          ) : (
            <button 
              onClick={handleAddBook}
              className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <Plus size={20} />
              <span>Add to Library</span>
            </button>
          )}
        </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetail;
