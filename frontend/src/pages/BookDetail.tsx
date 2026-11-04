import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Star, Plus, Check } from 'lucide-react';
import api from '../services/api';
import type { Book } from '../types/book';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchBook = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        setError(null);
        const res = await api.get<Book>(`/api/books/${id}`);
        if (!ignore) setBook(res.data);
      } catch (err) {
        if (ignore) return;
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError('Failed to load this book. Please try again later.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchBook();
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleAdd = async () => {
    if (!book) return;
    try {
      setAdding(true);
      setError(null);
      await api.put(`/api/books/${book.id}`, { status: 'want-to-read' });
      setBook({ ...book, status: 'want-to-read' });
      setAdded(true);
    } catch (err) {
      console.error('Error adding book:', err);
      setError('Failed to add book. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const backButton = (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
    >
      <ArrowLeft size={20} />
      <span>Back</span>
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-4">
        {backButton}
        <p className="text-center text-gray-600 py-8">Book not found.</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-4">
        {backButton}
        <p className="text-center text-red-500 py-8">{error ?? 'Something went wrong.'}</p>
      </div>
    );
  }

  const roundedRating = Math.round(book.rating);

  return (
    <div className="max-w-md mx-auto p-4 space-y-5">
      {backButton}

      {book.cover ? (
        <img
          src={book.cover}
          alt={`Cover of ${book.title}`}
          className="w-full max-h-96 object-contain rounded-xl bg-gray-100"
        />
      ) : (
        <div className="w-full h-64 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
          No cover
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-800">{book.title}</h1>
        <p className="text-gray-600">{book.author}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
        <span className="px-3 py-1 rounded-full bg-gray-100">{book.genre || 'Unknown genre'}</span>
        <span>{book.pages} pages</span>
        <span className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              size={16}
              className={n <= roundedRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            />
          ))}
          <span className="ml-1">{book.rating}</span>
        </span>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {added ? (
        <div className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-100 text-green-700">
          <Check size={18} /> Added to library
        </div>
      ) : book.status === 'want-to-read' ? (
        <button
          onClick={handleAdd}
          disabled={adding}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-60"
        >
          <Plus size={18} /> {adding ? 'Adding...' : 'Add to Library'}
        </button>
      ) : (
        <div className="w-full py-3 rounded-xl bg-gray-100 text-gray-600 text-center">
          Status: {book.status}
        </div>
      )}
    </div>
  );
};

export default BookDetail;