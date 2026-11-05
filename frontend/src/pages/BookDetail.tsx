import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Star, Plus, Check, BookOpen } from 'lucide-react';
import api from '../services/api';

type Status = 'read' | 'reading' | 'want-to-read';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  pages: number;
  genre: string;
  status: Status;
}

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [coverFailed, setCoverFailed] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await api.get<Book>(`/api/books/${id}`);
        setBook(response.data);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError('Book not found.');
        } else {
          setError('Failed to load book. Please try again later.');
        }
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const inLibrary = book ? book.status !== 'want-to-read' : false;

  const handleAddToLibrary = async () => {
    if (!book || saving || inLibrary) return;
    try {
      setSaving(true);
      setSaveError(null);
      const response = await api.put<Book>(`/api/books/${book.id}`, {
        status: 'reading',
      });
      setBook(response.data);
    } catch (err) {
      console.error('Error adding book:', err);
      setSaveError('Failed to add book. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Book Detail</h1>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-12 px-5">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              Go back
            </button>
          </div>
        )}

        {!loading && book && (
          <div className="p-5 space-y-5">
            <div className="flex justify-center">
              {book.cover && !coverFailed ? (
                <img
                  src={book.cover}
                  alt={`Cover of ${book.title}`}
                  onError={() => setCoverFailed(true)}
                  className="w-44 h-64 object-cover rounded-xl shadow-lg"
                />
              ) : (
                <div className="w-44 h-64 rounded-xl bg-purple-50 flex items-center justify-center shadow-lg">
                  <BookOpen size={48} className="text-purple-400" />
                </div>
              )}
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-gray-800">{book.title}</h2>
              <p className="text-gray-600">{book.author}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-50 rounded-xl py-3">
                <p className="text-xs text-gray-500">Genre</p>
                <p className="text-sm font-semibold text-gray-800">{book.genre}</p>
              </div>
              <div className="bg-gray-50 rounded-xl py-3">
                <p className="text-xs text-gray-500">Pages</p>
                <p className="text-sm font-semibold text-gray-800">{book.pages}</p>
              </div>
              <div className="bg-gray-50 rounded-xl py-3">
                <p className="text-xs text-gray-500">Rating</p>
                <p className="text-sm font-semibold text-gray-800 flex items-center justify-center gap-1">
                  <Star size={14} className="text-yellow-400" />
                  {book.rating}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleAddToLibrary}
                disabled={saving || inLibrary}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium transition-colors disabled:opacity-100 ${
                  inLibrary
                    ? 'bg-green-500 cursor-default'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {inLibrary ? <Check size={18} /> : <Plus size={18} />}
                {inLibrary ? 'In Your Library' : 'Add to Library'}
              </button>
              {saveError && (
                <p className="text-sm text-red-500 text-center">{saveError}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;