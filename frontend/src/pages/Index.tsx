import { useEffect, useState } from 'react';
import { Book, Search, User, TrendingUp, Plus, Library, Trash2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import BookCard from '../components/BookCard';
import ProgressCard from '../components/ProgressCard';
import BottomNav from '../components/BottomNav';
import HeaderNav from '../components/HeaderNav';
import BrowseLibrary from '../components/BrowseLibrary';
import { books, currentlyReading, readingStats } from '../data/dummyData';
import api from '../services/api';
import { toast } from '@/hooks/use-toast';

interface LibraryBook {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  pages: number;
  genre: string;
  status: 'read' | 'reading' | 'want-to-read' | 'catalog';
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [libraryView, setLibraryView] = useState('my-books'); // 'my-books' or 'browse'
  const location = useLocation();
  const [myBooks, setMyBooks] = useState<LibraryBook[]>([]);
  const [myBooksLoading, setMyBooksLoading] = useState(true);
  const [myBooksError, setMyBooksError] = useState<string | null>(null);

  const visibleMyBooks = myBooks.filter((book) => book.status !== 'catalog');

  useEffect(() => {
    const state = location.state as { activeTab?: string; libraryView?: string; refreshMyBooks?: boolean } | null;
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
    }
    if (state?.libraryView) {
      setLibraryView(state.libraryView);
    }
    if (state?.refreshMyBooks) {
      fetchMyBooks();
    }
  }, [location.state]);

  const fetchMyBooks = async () => {
    try {
      setMyBooksLoading(true);
      const response = await api.get<LibraryBook[]>('/api/books');
      setMyBooks(response.data);
      setMyBooksError(null);
    } catch (err) {
      console.error('Error fetching my books:', err);
      setMyBooksError('Failed to load your books.');
    } finally {
      setMyBooksLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const handleRemoveFromMyBooks = async (bookId: number) => {
    try {
      await api.put(`/api/books/${bookId}`, {
        status: 'catalog'
      });
      setMyBooks((prev) =>
        prev.map((book) =>
          book.id === bookId ? { ...book, status: 'catalog' } : book
        )
      );
      toast({
        title: 'Removed from My Books',
        description: 'Book moved back to catalog.',
      });
    } catch (err) {
      console.error('Error removing book:', err);
      setMyBooksError('Failed to remove book.');
      toast({
        title: 'Remove failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateMyBookStatus = async (bookId: number, status: LibraryBook['status']) => {
    try {
      await api.put(`/api/books/${bookId}`, { status });
      setMyBooks((prev) => {
        const exists = prev.some((book) => book.id === bookId);
        if (!exists) {
          fetchMyBooks();
          return prev;
        }
        return prev.map((book) =>
          book.id === bookId ? { ...book, status } : book
        );
      });
    } catch (err) {
      console.error('Error updating status:', err);
      setMyBooksError('Failed to update status.');
    }
  };

  const handleSyncMyBookStatus = (bookId: number, status: LibraryBook['status']) => {
    setMyBooks((prev) => {
      const exists = prev.some((book) => book.id === bookId);
      if (!exists) {
        fetchMyBooks();
        return prev;
      }
      return prev.map((book) =>
        book.id === bookId ? { ...book, status } : book
      );
    });
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
                {myBooksLoading ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : myBooksError ? (
                  <div className="text-center py-6 text-red-500">{myBooksError}</div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {visibleMyBooks.map((book) => (
                      <div key={book.id} className="relative">
                        <Link
                          to={`/books/${book.id}`}
                          state={{ returnTo: '/', activeTab: 'library', libraryView: 'my-books' }}
                          className="block"
                        >
                          <BookCard book={book} variant="library" />
                        </Link>
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleRemoveFromMyBooks(book.id);
                          }}
                          className="absolute top-3 right-3 bg-white/90 text-gray-700 p-2 rounded-full hover:bg-white shadow"
                          aria-label="Remove from My Books"
                          title="Remove from My Books"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <BrowseLibrary onStatusChange={handleSyncMyBookStatus} />
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
              {books.slice(3, 8).map((book) => (
                <BookCard key={book.id} book={book} variant="discover" />
              ))}
            </div>
          </div>
        );
      case 'reading':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Currently Reading</h2>
            <div className="space-y-4">
              {currentlyReading.map((book) => (
                <ProgressCard key={book.id} book={book} />
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
              <h2 className="text-xl font-bold text-gray-800">Book Lover</h2>
              <p className="text-gray-600">Reading enthusiast since 2020</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{readingStats.totalBooks}</div>
                <div className="text-sm text-gray-600">Books Read</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{readingStats.currentStreak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{readingStats.avgRating}</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <h2 className="text-xl font-bold mb-2">Welcome back!</h2>
              <p className="opacity-90">You've read {readingStats.pagesThisWeek} pages this week</p>
              <div className="mt-4 bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2 w-3/4"></div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Continue Reading</h3>
              <div className="space-y-3">
                {currentlyReading.slice(0, 2).map((book) => (
                  <ProgressCard key={book.id} book={book} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Recommended for You</h3>
              <div className="grid grid-cols-2 gap-3">
                {books.slice(0, 4).map((book) => (
                  <BookCard key={book.id} book={book} variant="compact" />
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
