import { useState, useEffect } from 'react';
import { Book, Search, User, TrendingUp, Plus, Library } from 'lucide-react';
import api from '../services/api';
import BookCard from '../components/BookCard';
import ProgressCard from '../components/ProgressCard';
import BottomNav from '../components/BottomNav';
import HeaderNav from '../components/HeaderNav';
import BrowseLibrary from '../components/BrowseLibrary';
import { Link } from 'react-router-dom';

interface BookData {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  pages: number;
  genre: string;
  status: 'read' | 'reading' | 'want-to-read' | 'unread' | string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [libraryView, setLibraryView] = useState('my-books'); // 'my-books' or 'browse'
  const [myBooks, setMyBooks] = useState<BookData[]>([]);
  const [stats, setStats] = useState<any>({
    totalBooks: 0,
    pagesThisWeek: 0,
    favouriteGenre: '-',
    currentStreak: 0,
    avgRating: 0
  });

  const username = localStorage.getItem('username');

  useEffect(() => {
    api.get<{data: BookData[]}>('/api/books')
      .then(res => setMyBooks(res.data.data))
      .catch(err => console.error(err));
      
    if (username) {
      api.get('/api/stats')
        .then(res => setStats(res.data))
        .catch(err => console.error(err));
    }
  }, [username]);

  const liveCurrentlyReading = myBooks.filter(b => b.status === 'reading');

  const handleRemoveFromLibrary = async (bookId: number) => {
    try {
      await api.put(`/api/books/${bookId}`, { status: 'unread', currentPage: 0 });
      setMyBooks(prev => prev.map(book => 
        book.id === bookId 
          ? { ...book, status: 'unread', currentPage: 0 } 
          : book
      ));
    } catch (err) {
      console.error('Failed to remove book:', err);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'library':
        return (
          <div className="space-y-4">
            {/* Library Navigation */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLibraryView('my-books')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  libraryView === 'my-books'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Book size={16} />
                <span>My Books</span>
              </button>
              <button
                onClick={() => setLibraryView('browse')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  libraryView === 'browse'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Library size={16} />
                <span>Browse</span>
              </button>
            </div>

            {/* Content based on selected view */}
            {libraryView === 'my-books' ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">My Library</h2>
                  <button 
                    onClick={() => setLibraryView('browse')}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {myBooks.filter(book => book.status !== 'unread').map((book) => (
                    <Link to={`/books/${book.id}`} key={book.id} className="block">
                      <BookCard book={book as any} variant="library" onRemove={handleRemoveFromLibrary} />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <BrowseLibrary />
            )}
          </div>
        );
      case 'discover':
        return (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Trending Now</h2>
            <div className="space-y-3">
              {myBooks.slice(3, 8).map((book) => (
                <Link to={`/books/${book.id}`} key={book.id} className="block">
                  <BookCard book={book as any} variant="discover" />
                </Link>
              ))}
            </div>
          </div>
        );
      case 'reading':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Currently Reading</h2>
            <div className="space-y-4">
              {liveCurrentlyReading.map((book) => (
                <ProgressCard key={book.id} book={book as any} />
              ))}
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="text-white" size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{username || "Guest"}</h2>
              <p className="text-gray-600 mb-4">Reading enthusiast</p>
              
              {username ? (
                <button 
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    window.location.reload();
                  }}
                  className="px-6 py-2 bg-red-50 text-red-600 rounded-full font-medium hover:bg-red-100 transition-colors"
                >
                  Log Out
                </button>
              ) : (
                <Link 
                  to="/login"
                  className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors inline-block"
                >
                  Sign In
                </Link>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{stats.totalBooks}</div>
                <div className="text-sm text-gray-600">Books Read</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{stats.favouriteGenre}</div>
                <div className="text-sm text-gray-600">Fav Genre</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{stats.pagesThisWeek}</div>
                <div className="text-sm text-gray-600">Pages Read</div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <h2 className="text-xl font-bold mb-2">Welcome back{username ? `, ${username}` : ''}!</h2>
              <p className="opacity-90">You've read {stats.pagesThisWeek} pages this week</p>
              <div className="mt-4 bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2 w-3/4"></div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Continue Reading</h3>
              <div className="space-y-3">
                {liveCurrentlyReading.slice(0, 2).map((book) => (
                  <ProgressCard key={book.id} book={book as any} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Recommended for You</h3>
              <div className="grid grid-cols-2 gap-3">
                {myBooks.slice(0, 4).map((book) => (
                  <Link to={`/books/${book.id}`} key={book.id} className="block">
                    <BookCard book={book as any} variant="compact" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      <HeaderNav activeTab={activeTab} />
      
      <main className="px-4 py-6 pb-20">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Index;