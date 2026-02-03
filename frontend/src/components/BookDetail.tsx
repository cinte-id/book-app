import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Star, BookOpen, ArrowLeft, Tag, Layers, Bookmark } from 'lucide-react';

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
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get<Book[]>(`/api/books/${id}`);
        setBook(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch books. Please try again later.');
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BookOpen className="animate-pulse text-blue-500" size={40} />
      </div>
    );
  }

  if (error || !book) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-50 shadow-md h-screen max-w-md mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-gray-600 mb-4 hover:text-gray-800"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back
      </button>

      <div className="flex justify-center mb-6">
        <img
          src={book.cover}
          alt={book.title}
          className="w-40 h-56 object-cover rounded-xl shadow-md"
        />
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{book.title}</h1>
        <p className="text-gray-500 mt-1">{book.author}</p>
      </div>

      <div className="flex justify-center items-center gap-2 mb-6">
        <Star className="text-yellow-400" size={18} />
        <span className="text-gray-700 font-medium">{book.rating} / 5</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6 text-center">
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <Layers className="mx-auto text-blue-500 mb-1" size={18} />
          <p className="text-xs text-gray-500">Pages</p>
          <p className="font-semibold">{book.pages}</p>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm">
          <Tag className="mx-auto text-purple-500 mb-1" size={18} />
          <p className="text-xs text-gray-500">Genre</p>
          <p className="font-semibold">{book.genre}</p>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm">
          <Bookmark className="mx-auto text-green-500 mb-1" size={18} />
          <p className="text-xs text-gray-500">Status</p>
          <p className="font-semibold capitalize">
            {book.status.replace('-', ' ')}
          </p>
        </div>
      </div>

      <button className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition">
        Add to Library
      </button>
    </div>
  );
};

export default BookDetail;
