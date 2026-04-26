import { BookOpen, Play } from 'lucide-react';
import { updateBookProgress } from '../services/api'; // Pastikan fungsi ini ada di api.ts
import { toast } from 'sonner';

interface BookProgress {
  id: number;
  title: string;
  author: string;
  currentPage: number;
  totalPages: number;
  lastRead: string;
  cover?: string;
}

interface ProgressCardProps {
  book: BookProgress;
  onClick?: () => void;
  onUpdate?: () => void; 
}

const ProgressCard = ({ book, onClick, onUpdate }: ProgressCardProps) => {
  
  const progress = book.totalPages > 0 ? (book.currentPage / book.totalPages) * 100 : 0;
  
  const handleUpdateProgress = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    const newPage = prompt(`Which page are you currently on? (Total: ${book.totalPages})`, book.currentPage.toString());
    
    if (newPage !== null) {
      const pageNum = parseInt(newPage);
      
      if (isNaN(pageNum) || pageNum < 0 || pageNum > book.totalPages) {
        toast.error(`Invalid page number! Please enter a number between 0 and ${book.totalPages}`);
        return;
      }

      try {
        // Panggil API untuk update progress
        await updateBookProgress(book.id, pageNum); 
        toast.success(`Progress updated to page ${pageNum} ✨`);
        
        // Panggil onUpdate agar Index.tsx refresh data terbaru
        if (onUpdate) onUpdate(); 
      } catch (err) {
        toast.error("Couldn’t update your reading progress. Please try again.");
      }
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98]"
    >
      <div className="flex items-center space-x-4">
        <div className="w-16 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative">
          {book.cover ? (
            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <BookOpen className="text-orange-500" size={24} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1 text-sm">{book.title}</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-gray-500 font-medium">
              <span>Page {book.currentPage} / {book.totalPages}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-400 to-red-400 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-gray-400 italic">Terakhir: {book.lastRead || 'Baru saja'}</p>
          </div>
        </div>
        
        <button 
          onClick={handleUpdateProgress}
          className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-90"
        >
          <Play size={16} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default ProgressCard;