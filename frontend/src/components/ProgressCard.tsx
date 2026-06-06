import { BookOpen, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Interface sesuai backend (snake_case)
interface BookProgress {
  id: number;
  title: string;
  author: string;
  current_page: number; 
  pages: number;        
  cover?: string;
  completed_at?: string; 
  status: string;
}

interface ProgressCardProps {
  book: BookProgress;
  onClick?: () => void;
  onUpdate?: () => void; 
}

const ProgressCard = ({ book, onUpdate }: ProgressCardProps) => {
  const navigate = useNavigate();

  // Hitung progress
  const total = book.pages || 0;
  const current = Math.min(book.current_page || 0, total);
  const progress = total > 0 ? (current / total) * 100 : 0;
  
  // Fungsi navigasi ke halaman grid pembaca
  const goToReader = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/reader/${book.id}`);
  };

  return (
    <div 
      onClick={() => navigate(`/book-detail/${book.id}`)}
      className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98]"
    >
      <div className="flex items-center space-x-4">
        {/* Cover Buku */}
        <div className="w-16 h-24 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden relative shadow-inner">
          {book.cover ? (
            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <BookOpen className="text-blue-500/50" size={24} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-gray-800 mb-1 line-clamp-1 text-sm">{book.title}</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              <span>Page {current} / {total}</span>
              <span className="text-blue-600 font-black">{Math.round(progress)}%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter italic">
              Status: {
                book.status === 'reading' ? 'In Progress' :
                book.status === 'read' ? 'Finished' :
                book.status === 'want-to-read' ? 'Saved' :
                'Not Started'
              }
            </p>
          </div>
        </div>
        
        {/* Tombol Play -> Ke ReaderPage */}
        <button 
          onClick={goToReader}
          disabled={book.status === 'none'}
          className={`p-3.5 rounded-[1.2rem] transition-all shadow-lg active:scale-90 ${
            book.status === 'none'
              ? 'bg-gray-300 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
          }`}
        >
          <Play size={18} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default ProgressCard;