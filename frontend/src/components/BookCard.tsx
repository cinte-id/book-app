import { Star, BookOpen, Clock } from 'lucide-react';

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

interface BookCardProps {
  book: Book;
  variant?: 'default' | 'compact' | 'library' | 'discover';
  onClick?: () => void; // Tambahkan ini
  onToggleFavorite?: () => void; // Tambahkan ini jika dibutuhkan
}

const BookCard = ({ book, variant = 'default', onClick }: BookCardProps) => {
  // Helper to render the cover or the gradient fallback
  const RenderCover = ({ className, iconSize }: { className: string; iconSize: number }) => (
    <div className={`${className} relative overflow-hidden`}>
      {book.cover ? (
        <img 
          src={book.cover} 
          alt={book.title} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="opacity-40" size={iconSize} />
        </div>
      )}
    </div>
  );

  const cardStyle = "cursor-pointer transition-all duration-200 active:scale-95";

  if (variant === 'compact') {
    return (
      <div 
        onClick={onClick} 
        className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:scale-105 ${cardStyle}`}
      >
        <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-purple-100 relative">
          <RenderCover className="w-full h-full" iconSize={32} />
          <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1">
            <span className="text-xs font-medium text-gray-700">{book.rating}★</span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2">{book.title}</h3>
          <p className="text-xs text-gray-600">{book.author}</p>
        </div>
      </div>
    );
  }

  if (variant === 'library') {
    return (
      <div 
        onClick={onClick} 
        className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${cardStyle}`}
      >
        <div className="aspect-[3/4] bg-gradient-to-br from-green-100 to-blue-100 relative">
          <RenderCover className="w-full h-full" iconSize={28} />
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
            book.status === 'read' ? 'bg-green-100 text-green-700' :
            book.status === 'reading' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {book.status === 'read' ? 'Read' : book.status === 'reading' ? 'Reading' : 'Want to Read'}
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2">{book.title}</h3>
          <p className="text-xs text-gray-600 mb-2">{book.author}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{book.pages} pages</span>
            <div className="flex items-center">
              <Star size={12} className="text-yellow-400 mr-1" />
              {book.rating}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'discover') {
    return (
      <div 
        onClick={onClick} 
        className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md ${cardStyle}`}
      >
        <div className="flex space-x-3">
          <RenderCover 
            className="w-16 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex-shrink-0" 
            iconSize={24} 
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{book.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{book.author}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {book.genre}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <Star size={14} className="text-yellow-400 mr-1" />
                {book.rating}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick} 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 ${cardStyle}`}
    >
      <div className="flex space-x-4">
        <RenderCover 
          className="w-20 h-28 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex-shrink-0" 
          iconSize={28} 
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">{book.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{book.author}</p>
          <div className="flex items-center mb-2">
            <Star size={16} className="text-yellow-400 mr-1" />
            <span className="text-sm text-gray-700">{book.rating}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Clock size={12} className="mr-1" />
            {book.pages} pages
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;