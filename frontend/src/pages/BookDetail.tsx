import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Star, Heart, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from "sonner";
import api, { fetchBookById, updateBookStatus } from '../services/api';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchDetail = async () => {
    try {
      if (!id) return;
      const res = await fetchBookById(id);
      setBook(res.data);
      
      // Ikon hati menyala jika statusnya 'reading' ATAU 'want-to-read'
      setIsFavorite(res.data.status === 'reading' || res.data.status === 'want-to-read');
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      if (!id || !book) return;

      let newStatus;
      if (isFavorite) {
        // Jika sedang 'reading', kita tidak mau hapus statusnya hanya karena klik Love.
        // Tapi jika user ingin benar-benar menghapus dari saved:
        newStatus = 'none';
        toast("Removed from My Library");
      } else {
        // Jika belum saved, jadikan 'want-to-read'
        newStatus = 'want-to-read';
        toast.success("Added to My Library!");
      }
      
      await updateBookStatus(id, newStatus);
      setIsFavorite(!isFavorite);
      fetchDetail(); 
    } catch (err) {
      toast.error("Failed to update library");
    }
  };

  const handleUpdateStatus = async (newStatus: 'reading' | 'none' | 'want-to-read') => {
    // Jika user klik "Berhenti Membaca", kita kembalikan ke 'want-to-read' (agar tetap tersimpan/saved)
    if (newStatus === 'none' && book.status === 'reading') {
      toast("Stopped reading? The book is still in your library.", {
        action: {
          label: "Yes, Stop",
          onClick: () => processUpdate('want-to-read') 
        },
      });
      return;
    }
    await processUpdate(newStatus);
  };

  const processUpdate = async (status: any) => {
    try {
      if (!id) return;
      await updateBookStatus(id, status);
      const successMsg = status === 'reading' ? "Started reading! Keep it up! 📖" : "Status updated ✨";
      toast.success(successMsg);
      fetchDetail(); 
    } catch (err) {
        console.error(err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 space-y-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      <p className="text-gray-400 text-sm">Preparing page...</p>
    </div>
  );

  if (!book) return (
    <div className="text-center p-10">
      <p className="text-gray-500 mb-4">Book not found!</p>
      <button onClick={() => navigate('/')} className="text-blue-500 font-bold">Back to Home</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h2 className="text-lg font-bold text-gray-800">Book Detail</h2>
        <button 
          onClick={toggleFavorite}
          className={`p-2 rounded-full transition-all ${isFavorite ? 'bg-pink-50 text-pink-500' : 'text-gray-300'}`}
        >
          <Heart size={22} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <main className="px-6 py-8">
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <img 
              src={book.cover} 
              alt={book.title}
              className="w-48 h-64 object-cover rounded-[2.5rem] shadow-2xl border-4 border-white transition-transform group-hover:scale-105 duration-300"
            />
            {book.status === 'reading' && (
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white p-2.5 rounded-full shadow-lg border-2 border-white animate-bounce">
                <Clock size={18} />
              </div>
            )}
            {book.status === 'want-to-read' && (
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-2.5 rounded-full shadow-lg border-2 border-white">
                <CheckCircle size={18} />
              </div>
            )}
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-gray-800 leading-tight mb-2">{book.title}</h1>
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
            {book.author}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-500 rounded-2xl">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pages</p>
              <p className="text-base font-bold text-gray-800">{book.pages}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-3">
            <div className="p-2.5 bg-yellow-50 text-yellow-500 rounded-2xl">
              <Star size={20} fill="currentColor" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Rating</p>
              <p className="text-base font-bold text-gray-800">{book.rating}/5.0</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
          <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-widest">Synopsis</h3>
          <p className="text-gray-600 leading-relaxed text-sm italic">
            {book.description || "No synopsis available for this book."}
          </p>
        </div>

        <div className="fixed bottom-6 left-0 right-0 px-6 max-w-md mx-auto">
          {book.status === 'reading' ? (
            <button 
              onClick={() => handleUpdateStatus('none')}
              className="w-full bg-white text-red-500 py-4 rounded-2xl font-bold border-2 border-red-50 shadow-xl flex items-center justify-center space-x-2 active:scale-95 transition-all"
            >
              <XCircle size={20} />
              <span>Stop Reading</span>
            </button>
          ) : (
            <button 
              onClick={() => handleUpdateStatus('reading')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center space-x-2 active:scale-95 transition-all"
            >
              <CheckCircle size={20} />
              <span>Start Reading</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookDetail;