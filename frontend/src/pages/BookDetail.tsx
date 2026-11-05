import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Plus, Check } from 'lucide-react';
import api from '../services/api';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  pages: number;
  genre: string;
  status: string;
}

const statusLabel: Record<string, string> = {
  none: 'Belum ditambah',
  'want-to-read': 'Ingin dibaca',
  reading: 'Sedang dibaca',
  read: 'Selesai',
};

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await api.get<Book>(`/api/books/${id}`);
        setBook(response.data);
        setError(null);
      } catch (err) {
        setError('Buku tidak ditemukan.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const inLibrary = !!book && book.status !== 'none' && book.status !== '';

  const handleAdd = async () => {
    if (!book) return;
    try {
      setAdding(true);
      setAddError(null);
      const response = await api.put<Book>(`/api/books/${book.id}`, {
        status: 'want-to-read',
      });
      setBook(response.data);
    } catch (err) {
      setAddError('Gagal menambahkan ke library. Coba lagi.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
      >
        <ArrowLeft size={20} />
        <span>Kembali</span>
      </button>

      {loading && <p className="text-gray-500">Memuat...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {book && (
        <div className="space-y-5">
          <img
            src={book.cover}
            alt={book.title}
            className="w-40 h-60 mx-auto rounded-xl object-cover shadow-lg"
          />

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{book.title}</h1>
            <p className="text-gray-600">{book.author}</p>
            <div className="flex items-center justify-center space-x-1 text-yellow-500 mt-2">
              <Star size={18} fill="currentColor" />
              <span className="text-gray-800 font-medium">{book.rating}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-blue-50 rounded-xl">
              <div className="font-bold text-blue-600">{book.pages}</div>
              <div className="text-xs text-gray-600">Halaman</div>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <div className="font-bold text-green-600">{book.genre}</div>
              <div className="text-xs text-gray-600">Genre</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <div className="font-bold text-purple-600 text-sm">
                {statusLabel[book.status] ?? book.status}
              </div>
              <div className="text-xs text-gray-600">Status</div>
            </div>
          </div>

          {inLibrary ? (
            <div className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-green-100 text-green-700 font-medium">
              <Check size={18} />
              <span>In your library</span>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={adding}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-medium"
            >
              <Plus size={18} />
              <span>{adding ? 'Menambahkan...' : 'Add to Library'}</span>
            </button>
          )}

          {addError && (
            <p className="text-red-500 text-sm text-center">{addError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookDetail;