import { Star, BookOpen, Clock, BookmarkCheck } from 'lucide-react';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  pages: number;
  genre: string;
  status: 'read' | 'reading' | 'want-to-read' | 'none' | null;
}

interface BookCardProps {
  book: Book;
  variant?: 'default' | 'compact' | 'library' | 'discover';
  onClick?: () => void;
  onToggleFavorite?: () => void;
}

const BookCard = ({ book, variant = 'default', onClick }: BookCardProps) => {
  
  // LOGIKA STATUS: Menentukan apakah buku ini "tersimpan" di database
  const isSaved = book.status !== 'none' && book.status !== null;

  const RenderCover = ({ className, iconSize }: { className: string; iconSize: number }) => (
    <div className={`${className} relative overflow-hidden bg-gray-100`}>
      {book.cover ? (
        <img 
          src={book.cover} 
          alt={book.title} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="opacity-40 text-gray-400" size={iconSize} />
        </div>
      )}
      
      {/* BADGE SAVED: Otomatis muncul jika status di DB bukan 'none' */}
      {isSaved && (
        <div className="absolute top-0 right-0 bg-blue-600 text-white p-1.5 rounded-bl-xl shadow-md z-10">
          <BookmarkCheck size={14} fill="currentColor" />
        </div>
      )}
    </div>
  );

  const cardStyle = "cursor-pointer transition-all duration-200 active:scale-95";

  // VARIANT COMPACT (Biasanya untuk Horizontal Scroll di Home)
  if (variant === 'compact') {
    return (
      <div 
        onClick={onClick} 
        className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md ${cardStyle}`}
      >
        <div className="aspect-[3/4] relative">
          <RenderCover className="w-full h-full" iconSize={32} />
          <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-0.5">
            <span className="text-[10px] font-bold text-white">{book.rating}★</span>
          </div>
        </div>
        <div className="p-2.5">
          <h3 className="font-bold text-xs text-gray-800 mb-0.5 line-clamp-1">{book.title}</h3>
          <p className="text-[10px] text-gray-400 truncate">{book.author}</p>
        </div>
      </div>
    );
  }

  // VARIANT LIBRARY (Tampilan dengan Label Status Jelas)
  if (variant === 'library') {
    return (
      <div 
        onClick={onClick} 
        className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${cardStyle}`}
      >
        <div className="aspect-[3/4] relative">
          <RenderCover className="w-full h-full" iconSize={28} />
          {/* Label Status sesuai database */}
          <div className={`absolute bottom-2 left-2 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm ${
            book.status === 'read' ? 'bg-green-500 text-white' :
            book.status === 'reading' ? 'bg-orange-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            {book.status === 'read' ? 'Finished' : book.status === 'reading' ? 'Reading' : 'Saved'}
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-bold text-sm text-gray-800 mb-1 line-clamp-1">{book.title}</h3>
          <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
            <span>{book.pages} Pages</span>
            <div className="flex items-center text-yellow-500">
              <Star size={10} fill="currentColor" className="mr-0.5" />
              {book.rating}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VARIANT DISCOVER (Tampilan List di Browse)
  if (variant === 'discover') {
    return (
      <div 
        onClick={onClick} 
        className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-3 hover:shadow-md mb-3 ${cardStyle}`}
      >
        <div className="flex space-x-4">
          <RenderCover 
            className="w-20 h-24 rounded-xl flex-shrink-0 shadow-sm" 
            iconSize={24} 
          />
          <div className="flex-1 py-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800 text-sm line-clamp-2 leading-tight pr-2">{book.title}</h3>
                {isSaved && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">Saved</span>}
              </div>
              <p className="text-xs text-gray-500 mt-1">{book.author}</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-bold uppercase tracking-tighter">
                {book.genre}
              </span>
              <div className="flex items-center text-xs font-bold text-gray-700">
                <Star size={14} className="text-yellow-400 mr-1" fill="currentColor" />
                {book.rating}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT VARIANT
  return (
    <div 
      onClick={onClick} 
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 ${cardStyle}`}
    >
      <div className="flex space-x-4">
        <RenderCover 
          className="w-24 h-32 rounded-xl flex-shrink-0 shadow-md" 
          iconSize={28} 
        />
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="font-bold text-lg text-gray-800 mb-1 leading-tight">{book.title}</h3>
          <p className="text-sm text-gray-500 mb-3">{book.author}</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
              <Star size={14} className="text-yellow-500 mr-1" fill="currentColor" />
              <span className="text-xs font-bold text-yellow-700">{book.rating}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Clock size={14} className="mr-1" />
              <span className="text-xs font-medium">{book.pages} pages</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;