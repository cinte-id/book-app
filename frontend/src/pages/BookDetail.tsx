import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Star, ChevronDown } from 'lucide-react';
import api from '../services/api';
import { toast } from '@/hooks/use-toast';

interface Book {
  id: number;
  title: string | null;
  author: string | null;
  cover: string;
  rating: number;
  pages: number;
  genre: string | null;
  status: 'read' | 'reading' | 'want-to-read' | 'catalog';
}

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [hasStatusChanged, setHasStatusChanged] = useState(false);
  const returnState = location.state as
    | { returnTo?: string; activeTab?: string; libraryView?: string }
    | null;

  useEffect(() => {
    if (!id) {
      setError('Book ID is missing.');
      setLoading(false);
      return;
    }

    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await api.get<Book>(`/api/books/${id}`);
        setBook(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('Book not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const display = useMemo(() => {
    if (!book) return null;
    return {
      title: book.title?.trim() || 'Untitled',
      author: book.author?.trim() || 'Unknown Author',
      genre: book.genre?.trim() || 'Uncategorized',
      cover: book.cover?.trim() || '',
    };
  }, [book]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-md mx-auto px-4 py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mt-12"></div>
      </div>
    );
  }

  if (error || !book || !display) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-md mx-auto px-4 py-6">
        <button
          onClick={() => {
            if (returnState?.returnTo) {
              navigate(returnState.returnTo, {
                state: {
                  activeTab: returnState.activeTab,
                  libraryView: returnState.libraryView,
                  refreshMyBooks: hasStatusChanged,
                },
              });
              return;
            }
            navigate(-1);
          }}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </button>
        <div className="mt-8 text-center text-red-500">{error || 'Book not found.'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto px-4 py-6">
      <button
        onClick={() => {
          if (returnState?.returnTo) {
            navigate(returnState.returnTo, {
              state: {
                activeTab: returnState.activeTab,
                libraryView: returnState.libraryView,
                refreshMyBooks: hasStatusChanged,
              },
            });
            return;
          }
          navigate(-1);
        }}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back
      </button>

      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative">
          {display.cover ? (
            <img
              src={display.cover}
              alt={display.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <BookOpen className="text-blue-500" size={40} />
            </div>
          )}
        </div>

        <div className="p-5 space-y-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{display.title}</h1>
            <p className="text-sm text-gray-600">{display.author}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              {display.genre}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Star size={14} className="text-yellow-400 mr-1" />
              {book.rating}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-center">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm font-semibold text-gray-800">{book.pages}</div>
              <div className="text-xs text-gray-500">Pages</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-2">Status</div>
              <div className="relative inline-flex items-center">
                <select
                  value={book.status}
                  disabled={statusUpdating}
                  onChange={async (event) => {
                    const nextStatus = event.target.value as Book['status'];
                    try {
                      setStatusUpdating(true);
                      await api.put(`/api/books/${book.id}`, { status: nextStatus });
                      setBook((prev) => (prev ? { ...prev, status: nextStatus } : prev));
                      setHasStatusChanged(true);
                      toast({
                        title: 'Status updated',
                        description: `Status changed to ${nextStatus.replace(/-/g, ' ')}.`,
                      });
                    } catch (err) {
                      console.error('Error updating status:', err);
                      setError('Failed to update status.');
                      toast({
                        title: 'Update failed',
                        description: 'Please try again.',
                        variant: 'destructive',
                      });
                    } finally {
                      setStatusUpdating(false);
                    }
                  }}
                  className="appearance-none text-xs bg-purple-100 text-purple-700 px-2 py-1 pr-6 rounded-full"
                >
                  <option value="want-to-read">Want to Read</option>
                  <option value="reading">Reading</option>
                  <option value="read">Read</option>
                  <option value="catalog">Catalog</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 text-purple-700 pointer-events-none" />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm font-semibold text-gray-800">#{book.id}</div>
              <div className="text-xs text-gray-500">Book ID</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
