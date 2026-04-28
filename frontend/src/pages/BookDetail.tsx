import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, BookOpen, Star, Heart, CheckCircle, Clock, PauseCircle } from 'lucide-react';
import { toast } from "sonner";
import api, { fetchBookById, updateBookStatus, updateBookRating } from '../services/api';

interface Book {
  id: string | number;
  title: string;
  author: string;
  cover: string;
  genre: string;
  pages: number;
  description?: string;
  status: 'reading' | 'read' | 'want-to-read' | 'none' | null;
  rating?: number;
  rating_count?: number;
  rating_sum?: number;
  user_rating?: number;
  current_page: number;
}


const StarRating = ({ rating, onRate, size = 20 }: { rating: number, onRate: (n: number) => void, size?: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate(star)}
          className="transition-transform active:scale-125 focus:outline-none"
        >
          <Star
            size={size}
            fill={star <= rating ? "#EAB308" : "none"}
            className={star <= rating ? "text-yellow-500" : "text-gray-300"}
          />
        </button>
      ))}
    </div>
  );
};

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // 1. Fetch book data from API
  const fetchDetail = useCallback(async () => {
    try {
      if (!id) return;
      const res = await fetchBookById(id);
      const bookData = res.data;
      setBook(bookData);
      setIsFavorite(!!bookData.status && bookData.status !== 'none');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]); // This function only changes if 'id' changes

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]); 

  // 2. Rating Function
  const handleRating = async (newRating: number) => {
    try {
      if (!id || !book) return;

      const oldUserRating = book.user_rating || 0;
      const isEditing = oldUserRating > 0;

      // rating_count dan rating_sum
      const updatedCount = isEditing ? book.rating_count : (book.rating_count || 0) + 1;
      const updatedSum = (book.rating_sum || 0) - oldUserRating + newRating;
      const updatedAverage = updatedCount > 0
      ? parseFloat((updatedSum / updatedCount).toFixed(1))
      : 0;

      // Update rating di backend
      await updateBookRating(id, {
        user_rating: newRating,
        rating_sum: updatedSum,
        rating_count: updatedCount,
        rating: updatedAverage
      });

      // Update state
      setBook(prev => prev ? {
        ...prev,
        user_rating: newRating,
        rating_sum: updatedSum,
        rating_count: updatedCount,
        rating: updatedAverage
      } : prev);

      toast.success(isEditing ? "Rating updated! ⭐" : "Thanks for rating! ⭐");
    } catch (err) {
      toast.error("Failed to submit rating");
    }
  };

  // 3. Toggle Favorite (Add/Remove from Library)
  const toggleFavorite = async () => {
    try {
      if (!id || !book) return;

      if (isFavorite) {
        toast("Remove from Library?", {
          description: `Are you sure you want to remove "${book.title}"?`,
          action: {
            label: "Yes, Remove",
            onClick: async () => {
              await updateBookStatus(id, 'none');
              await api.put(`/api/books/${id}`, { current_page: 0 });
              toast.success("Removed from Library");
              setIsFavorite(false);
              fetchDetail();
            },
          },
        });
        return;
      }
      
      await updateBookStatus(id, 'want-to-read');
      toast.success("Saved to Want to Read ✨");
      setIsFavorite(true);
      fetchDetail();
    } catch (err) {
      toast.error("Unable to update your library. Please try again.");
    }
  };

  // 4. Update Reading Status (Start, Pause, Finish)
  const processUpdate = async (status: 'reading' | 'none' | 'want-to-read' | 'read') => {
    try {
      if (!id) return;
      await updateBookStatus(id, status);
      
      const messages = {
        reading: "Enjoy your reading journey!",
        'want-to-read': "Paused. Book is still in your list.",
        read: "Congratulations! You finished this book!",
        none: "Removed from library"
      };

      toast.success(messages[status] || "Status updated");
      fetchDetail();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-400 text-sm italic">Gathering pages...</p>
    </div>
  );

  if (!book) return (
    <div className="text-center p-10">
      <p className="text-gray-500 mb-4">Book not found!</p>
      <button onClick={() => navigate('/')} className="text-blue-500 font-bold">Back to Home</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* STICKY HEADER */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h2 className="text-lg font-bold text-gray-800 tracking-tight">Book Detail</h2>
        <button 
          onClick={toggleFavorite}
          className={`p-2 rounded-full transition-all ${isFavorite ? 'bg-pink-50 text-pink-500 shadow-sm' : 'text-gray-300'}`}
        >
          <Heart size={22} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <main className="px-6 py-8">
        
        {/* COVER SECTION */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <img 
              src={book.cover}
              alt={book.title}
              className="w-48 h-64 object-cover rounded-[2.5rem] shadow-2xl border-4 border-white transition-transform group-hover:scale-105"
            />
            <div className="absolute -top-2 -right-2">
              {book.status === 'reading' && (
                <div className="bg-orange-500 text-white p-2.5 rounded-full shadow-lg border-2 border-white animate-pulse">
                  <Clock size={18} />
                </div>
              )}
              {book.status === 'read' && (
                <div className="bg-green-500 text-white p-2.5 rounded-full shadow-lg border-2 border-white">
                  <CheckCircle size={18} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Books Info */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-800 leading-tight mb-2 px-2">{book.title}</h1>
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            {book.author}
          </div>
        </div>

        {/* Rating Section */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center mb-8">
          <div className="flex items-center gap-5 mb-6 w-full justify-center">
            <div className="bg-yellow-50 p-4 rounded-3xl">
              <span className="text-3xl font-black text-yellow-600">{book.rating || "0.0"}</span>
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Global Rating</p>
              <StarRating rating={Math.round(book.rating || 0)} onRate={() => {}} size={14} />
              <p className="text-[9px] text-gray-400 font-bold italic mt-1">{book.rating_count || 0} Readers Liked This</p>
            </div>
          </div>

          <div className="w-full h-px bg-gray-50 mb-6"></div>

          <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-3">
            {book.user_rating > 0 ? "Edit Your Rating" : "Rate this masterpiece"}
          </p>
          <StarRating rating={book.user_rating || 0} onRate={handleRating} size={32} />
        </div>

        {/* GRID STATS */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-500 rounded-2xl"><BookOpen size={20} /></div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pages</p>
              <p className="text-base font-black text-gray-800">{book.pages}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-500 rounded-2xl"><Star size={20} /></div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Genre</p>
              <p className="text-base font-black text-gray-800">{book.genre}</p>
            </div>
          </div>
        </div>

        {/* SYNOPSIS */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
          <h3 className="text-xs font-black text-gray-800 mb-3 uppercase tracking-[0.2em]">Synopsis</h3>
          <p className="text-gray-500 leading-relaxed text-sm italic whitespace-pre-line">
            {book.description ? book.description : "Every journey starts with a single page. Open your heart to this story."}
          </p>
        </div>

        {/* PROGRESS PAGE / JUMP TO PAGE */}
        {book.status === 'reading' ? (
          <div className="mt-8 px-2 pb-20 animate-in fade-in zoom-in-95 duration-500">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <BookOpen size={16} className="text-blue-600" /> Continue Progress
            </h3>

            {/* Scroll container */}
            <div className="max-h-72 overflow-y-auto pr-2 custom-scrollbar"> 
              <div className="grid grid-cols-5 gap-3 pb-4">
                {Array.from({ length: book?.pages || 0 }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => navigate(`/reader/${book.id}?page=${page}`)}
                    className={`aspect-square rounded-2xl flex items-center justify-center text-xs font-black transition-all active:scale-90 ${
                      page <= book.current_page 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                      : 'bg-white text-gray-400 border border-gray-50 hover:border-blue-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
    
            {/* Additional info to indicate scrollable area */}
            {book.pages > 25 && (
              <p className="text-[9px] text-center text-gray-400 mt-2 font-bold italic tracking-wider">
                Scroll down to see more pages
              </p>
            )}
          </div>
        ) : (
          <div className="mt-8 px-2 pb-20 text-center">
            <div className="p-8 bg-blue-50/50 rounded-[2rem] border-2 border-dashed border-blue-100">
              <p className="text-gray-400 text-[11px] font-bold italic">
                "Click 'Start Reading' to track your progress and unlock all pages."
              </p>
            </div>
          </div>
        )}

        {/* FLOATING ACTION BUTTONS */}
        <div className="fixed bottom-6 left-0 right-0 px-6 max-w-md mx-auto flex gap-3">
          {book.status === 'reading' ? (
            <>
              <button 
                onClick={() => processUpdate('want-to-read')}
                className="flex-1 bg-white text-orange-500 py-4 rounded-2xl font-black border-2 border-orange-100 shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <PauseCircle size={20} /> Pause
              </button>
              <button 
                onClick={() => processUpdate('read')}
                className="flex-[1.5] bg-green-500 text-white py-4 rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <CheckCircle size={20} /> Finish
              </button>
            </>
          ) : (
            <button 
              onClick={() => processUpdate('reading')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <BookOpen size={20} /> 
              <span>
                {book.status === 'read' 
                  ? 'Read Again' 
                  : book.status === 'want-to-read'
                  ? 'Start Reading'
                  : 'Start Reading Now'}
              </span>
            </button>
          )}
        </div>

      </main>
    </div>
  );
};

export default BookDetail;