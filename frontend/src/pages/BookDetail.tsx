import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Star, Heart, CheckCircle, XCircle, Clock, Library } from 'lucide-react';
import { toast } from "sonner"; // Pakai sonner
import api from '../services/api';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/api/books/${id}`);
      setBook(res.data);
    } catch (err) {
      toast.error("Gagal memuat detail buku");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast.success("Ditambahkan ke Favorit! 💖");
    } else {
      toast("Dihapus dari Favorit 💔");
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    // Jika membatalkan, gunakan toast konfirmasi (fitur Sonner)
    if (book.status === 'reading' && newStatus === 'none') {
      toast("Yakin ingin membatalkan progres?", {
        action: {
          label: "Ya, Batalkan",
          onClick: () => processUpdate('want-to-read')
        },
      });
      return;
    }
    await processUpdate(newStatus);
  };

  const processUpdate = async (status: string) => {
    try {
      await api.put(`/api/books/${id}`, { status });
      toast.success(status === 'reading' ? "Mulai membaca! Semangat! 📖" : "Status diperbarui");
      fetchDetail();
    } catch (err) {
      toast.error("Gagal memperbarui status");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!book) return <div className="text-center p-10">Buku tidak ditemukan!</div>;

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative pb-20">
      {/* Navigasi Atas */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h2 className="text-lg font-bold text-gray-800">Detail Buku</h2>
        <button 
          onClick={toggleFavorite}
          className={`p-2 rounded-full transition-all ${isFavorite ? 'bg-pink-50 text-pink-500' : 'text-gray-300'}`}
        >
          <Heart size={22} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <main className="px-6 py-8">
        {/* Cover Buku */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img 
              src={book.cover} 
              alt={book.title}
              className="w-44 h-64 object-cover rounded-[2rem] shadow-2xl border-4 border-white"
            />
            {book.status === 'reading' && (
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white p-2 rounded-full shadow-lg">
                <Clock size={16} />
              </div>
            )}
          </div>
        </div>

        {/* Info Buku */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-gray-800 leading-tight mb-1">{book.title}</h1>
          <p className="text-blue-500 font-semibold">{book.author}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-3">
            <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Halaman</p>
              <p className="text-base font-bold text-gray-800">{book.pages}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-3">
            <div className="p-2 bg-yellow-50 text-yellow-500 rounded-xl">
              <Star size={20} fill="currentColor" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Rating</p>
              <p className="text-base font-bold text-gray-800">{book.rating}/5.0</p>
            </div>
          </div>
        </div>

        {/* Sinopsis */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-md font-bold text-gray-800 mb-3">Sinopsis</h3>
          <p className="text-gray-600 leading-relaxed text-sm">
            {book.description || "Belum ada sinopsis untuk buku ini."}
          </p>
        </div>

        {/* Tombol Aksi */}
        {book.status === 'reading' ? (
          <button 
            onClick={() => handleUpdateStatus('none')}
            className="w-full bg-white text-red-500 py-4 rounded-2xl font-bold border-2 border-red-50 flex items-center justify-center space-x-2 active:scale-95 transition-all"
          >
            <XCircle size={20} />
            <span>Batalkan Membaca</span>
          </button>
        ) : (
          <button 
            onClick={() => handleUpdateStatus('reading')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 flex items-center justify-center space-x-2 active:scale-95 transition-all"
          >
            <CheckCircle size={20} />
            <span>Mulai Membaca</span>
          </button>
        )}
      </main>
    </div>
  );
};

export default BookDetail;