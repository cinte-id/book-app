import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, BookOpen, Clock, Tag, Check, Plus, Trash2, Edit2 } from 'lucide-react';
import api from '../services/api';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  pages: number;
  genre: string;
  status: 'want-to-read' | 'reading' | 'read' | 'completed' | string;
  currentPage: number;
}

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [inputPage, setInputPage] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get<Book>(`/api/books/${id}`);
        setBook(response.data);
        setInputPage(response.data.currentPage || 0);
        setError(null);
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Book not found or API is unavailable.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  // Handle status changes (Add to Library, Status Transitions, or Removal)
  const handleStatusChange = async (newStatus: string) => {
    if (!book) return;
    try {
      setUpdating(true);
      // Reset currentPage to 0 if status is want-to-read, or to total pages if read
      let updatedPage = book.currentPage;
      if (newStatus === 'want-to-read' || newStatus === '') {
        updatedPage = 0;
      } else if (newStatus === 'read' || newStatus === 'completed') {
        updatedPage = book.pages;
      }

      const response = await api.put<Book>(`/api/books/${book.id}`, {
        status: newStatus,
        currentPage: updatedPage
      });

      setBook(response.data);
      setInputPage(response.data.currentPage);
      setValidationError(null);
    } catch (err: any) {
      console.error('Error updating status:', err);
      if (err.response?.status === 401) {
        alert('Unauthorized! Please log in first on the Profile tab.');
      } else {
        alert('Failed to update book status. Please verify field data.');
      }
    } finally {
      setUpdating(false);
    }
  };

  // Handle Reading Progress Page Updates
  const handleProgressUpdate = async () => {
    if (!book) return;
    setValidationError(null);

    // Frontend validation checking matching backend constraint
    if (inputPage < 0) {
      setValidationError('Current page cannot be negative.');
      return;
    }
    if (inputPage > book.pages) {
      setValidationError(`Current page cannot exceed total pages (${book.pages}).`);
      return;
    }

    try {
      setUpdating(true);
      
      // Auto-transition status to 'completed' if reader reaches the last page
      const nextStatus = inputPage === book.pages ? 'read' : book.status;

      const response = await api.put<Book>(`/api/books/${book.id}`, {
        currentPage: inputPage,
        status: nextStatus
      });

      setBook(response.data);
      setValidationError(null);
    } catch (err: any) {
      console.error('Error updating progress:', err);
      // Check for structured backend validation response errors
      if (err.response?.data?.errors?.currentPage) {
        setValidationError(err.response.data.errors.currentPage);
      } else if (err.response?.status === 401) {
        setValidationError('Unauthorized! Please log in first on the Profile tab.');
      } else {
        setValidationError('Failed to update page progress. Please try again.');
      }
    } finally {
      setUpdating(false);
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
      <div className="min-h-screen bg-gray-50 max-w-md mx-auto p-4 flex flex-col items-center justify-center space-y-4">
        <p className="text-red-500 font-medium text-center">{error || 'An error occurred.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-blue-500 font-semibold hover:underline"
        >
          <ArrowLeft size={16} />
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  const isAdded = ['want-to-read', 'reading', 'read', 'completed'].includes(book.status);
  const progressPercent = book.pages > 0 ? Math.min(Math.round((book.currentPage / book.pages) * 100), 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col">
      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Book Details</h1>
        </div>
        {isAdded && (
          <button
            onClick={() => handleStatusChange('')}
            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Remove from Library"
          >
            <Trash2 size={20} />
          </button>
        )}
      </header>

      {/* Detail Content */}
      <main className="p-6 flex-1 space-y-6 overflow-y-auto">
        {/* Book Cover and Rating */}
        <div className="flex justify-center">
          <div className="w-48 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-md flex items-center justify-center relative overflow-hidden">
            {book.cover ? (
              <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <BookOpen className="text-blue-500" size={64} />
            )}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center shadow-sm">
              <Star size={14} className="text-yellow-400 mr-1 fill-yellow-400" />
              <span className="text-xs font-bold text-gray-800">{book.rating}</span>
            </div>
          </div>
        </div>

        {/* Text Headers */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">{book.title}</h2>
          <p className="text-gray-600 text-md font-medium">by {book.author}</p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center space-x-3 shadow-sm">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Clock size={18} />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Pages</div>
              <div className="text-sm font-bold text-gray-800">{book.pages} pages</div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center space-x-3 shadow-sm">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Tag size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-400 font-medium">Genre</div>
              <div className="text-sm font-bold text-gray-800 truncate">{book.genre}</div>
            </div>
          </div>
        </div>

        {/* Reading Progress Component (Visible only when status is 'reading') */}
        {book.status === 'reading' && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm flex items-center">
              <Edit2 size={16} className="mr-2 text-blue-500" />
              <span>Update Reading Progress</span>
            </h3>

            {/* Current progress indicator */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-blue-600">
                <span>Completed</span>
                <span>{progressPercent}% ({book.currentPage} / {book.pages} pages)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Editing Page Input */}
            <div className="flex items-center space-x-3 pt-2">
              <input
                type="number"
                min={0}
                max={book.pages}
                value={inputPage}
                onChange={(e) => setInputPage(parseInt(e.target.value) || 0)}
                className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleProgressUpdate}
                disabled={updating}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl text-sm transition-all"
              >
                {updating ? 'Saving...' : 'Update Page'}
              </button>
            </div>

            {validationError && (
              <p className="text-xs text-red-500 font-medium mt-1">{validationError}</p>
            )}
          </div>
        )}

        {/* Status Lifecycle Management Controller */}
        <div className="pt-2">
          {!isAdded ? (
            <button
              onClick={() => handleStatusChange('want-to-read')}
              disabled={updating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-4 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Plus size={20} />
              <span>Add to Library</span>
            </button>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3 shadow-sm">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Library Status
              </label>
              <select
                value={book.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="want-to-read">Want to Read</option>
                <option value="reading">Currently Reading</option>
                <option value="read">Completed / Read</option>
              </select>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookDetail;