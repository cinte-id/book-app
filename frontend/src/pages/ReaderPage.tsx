import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Save, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { toast } from 'sonner';

interface Book {
  id: number | string;
  title: string;
  pages: number;
  content?: string;
  status: 'reading' | 'read' | 'want-to-read' | 'none';
  current_page: number;
}

const ReaderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [book, setBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(false);
  const isFirstRender = useRef(true);

  // 1. Fetch Data Buku
   useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/books/${id}`);
        const data = res.data?.book || res.data;
        if (data.status !== 'reading') {
          toast.error("Please click 'Start Reading' first!");
          navigate(`/book-detail/${id}`);
          return;
        }

        setBook(data);
        const pageFromUrl = searchParams.get('page');
        setCurrentPage(
          pageFromUrl 
            ? Math.min(parseInt(pageFromUrl), data.pages || 1) 
            : (data.current_page || 1)
        );
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, navigate, searchParams]);

  // 2. Fungsi Save (Manual & Auto)
  const saveProgress = useCallback(async (pageToSave: number, quiet = true) => {
    if (!id || !book) return;
    
    try {
      setIsSaving(true);
      const isFinished = pageToSave >= (book?.pages || 0);
      
      await api.put(`/api/books/${id}`, { 
        current_page: pageToSave,
        status: isFinished ? 'read' : 'reading'
      });

      if (!quiet) toast.success("Progress saved successfully");
    } catch (err) {
      console.error("Error saving progress:", err);
      if (!quiet) toast.error("Failed to save progress");
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  }, [id, book]);

  // 3. LOGIKA AUTO-SAVE
  useEffect(() => {
    if (loading || !book || error) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      saveProgress(currentPage, true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentPage, saveProgress, loading, book, error]);

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <AlertCircle className="text-red-400 mb-2" size={40} />
      <p className="font-bold text-gray-800">Book not found</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 font-bold">Go Back</button>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col font-sans">
      {/* HEADER */}
      <div className="p-4 flex items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl">
          <X size={20} />
        </button>
        
        <div className="text-center">
          <h1 className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate max-w-[120px]">
            {book?.title}
          </h1>
          <div className="flex justify-center mt-1">
            {isSaving ? (
              <span className="text-[8px] font-bold text-blue-500 animate-pulse flex items-center gap-1">
                <Loader2 size={8} className="animate-spin" /> AUTOSAVING...
              </span>
            ) : (
              <span className="text-[8px] font-bold text-green-500 flex items-center gap-1">
                <CheckCircle2 size={8} /> ALL CHANGES SAVED
              </span>
            )}
          </div>
        </div>

        <button 
          onClick={() => saveProgress(currentPage, false)} 
          className="p-2 text-blue-600 bg-blue-50 rounded-xl active:scale-90 transition-transform"
        >
          <Save size={20} />
        </button>
      </div>

      {/* NAVIGASI HALAMAN */}
      <div className="bg-white p-6 flex items-center justify-center gap-6 border-b border-gray-100 shadow-sm">
         {/* PREV */}
        <button 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
          className={`p-3 rounded-2xl transition-all ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
              : 'bg-gray-50 text-gray-600 active:scale-90'
          }`}
        >
          <ChevronLeft size={24} />
        </button>

        {/* INPUT PAGE */}
        <div className="flex items-center gap-3 bg-blue-50/50 px-5 py-3 rounded-3xl border-2 border-blue-100 focus-within:border-blue-400 transition-all">
          <input 
            type="number"
            value={currentPage}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (!isNaN(val) && val >= 1 && val <= (book?.pages || 1)) {
                setCurrentPage(val);
              }
            }}
            className="w-12 bg-transparent text-center font-black text-blue-600 outline-none text-xl"
          />
          <span className="text-sm font-black text-blue-200">/</span>
          <span className="text-sm font-black text-blue-300">{book?.pages}</span>
        </div>

        {/* NEXT */}
        <button 
          disabled={currentPage >= (book?.pages || 1)}
          onClick={() => setCurrentPage(p => p + 1)}
          className={`p-3 rounded-2xl transition-all ${
            currentPage >= (book?.pages || 1)
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
              : 'bg-gray-50 text-gray-600 active:scale-90'
          }`}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* READING AREA */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="bg-white min-h-full rounded-[2.5rem] p-10 shadow-sm border border-gray-100 relative">
          <div className="prose prose-blue leading-[1.8] text-gray-700 text-justify italic">
            <p className="text-center text-[9px] font-black text-blue-200 mb-8 uppercase tracking-[0.3em]">
              — Page {currentPage} —
            </p>
            
            {book?.content ? (
              <div className="whitespace-pre-line">{book.content}</div>
            ) : (
              <div className="space-y-4">
                <p>
                  "Books are windows to the world." On page {currentPage}, you are opening another window to new knowledge.
                </p>
                <p>
                  Keep going! You have completed {Math.round((currentPage / (book?.pages || 1)) * 100)}% of this book.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MINI PROGRESS BAR */}
      <div className="px-10 pb-8">
        <div className="w-full bg-white h-1.5 rounded-full shadow-inner overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-400 to-blue-600 h-full transition-all duration-700 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            style={{ width: `${(currentPage / (book?.pages || 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ReaderPage;