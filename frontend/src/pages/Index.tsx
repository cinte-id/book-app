import { useState, useEffect } from 'react';
import { Book as BookIcon, Search, User, Plus, Library, LogOut, Lock } from 'lucide-react';
import BookCard from '../components/BookCard';
import BottomNav from '../components/BottomNav';
import HeaderNav from '../components/HeaderNav';
import BrowseLibrary from '../components/BrowseLibrary';
import api, { safeLocalStorage } from '../services/api'; // Import safeLocalStorage from api service
import { books, currentlyReading, readingStats } from '../data/dummyData';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  pages: number;
  genre: string;
  status: 'want-to-read' | 'reading' | 'read' | 'completed' | string;
  currentPage?: number; // Optional to prevent dummy data mismatch
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [libraryView, setLibraryView] = useState('my-books');
  const [backendBooks, setBackendBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  // Authentication states secured with imported shared safeLocalStorage
  const [token, setToken] = useState<string | null>(safeLocalStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(safeLocalStorage.getItem('username'));
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Fetch updated book dataset from backend
  useEffect(() => {
    const fetchBooksFromBackend = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/books');
        const data = response.data as any; // Cast to bypass Axios unknown type error
        
        // Handle structured vs flat responses safely
        if (data && typeof data === 'object' && 'books' in data) {
          setBackendBooks(data.books);
        } else if (Array.isArray(data)) {
          setBackendBooks(data);
        }
      } catch (err) {
        console.error('Failed to fetch library books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksFromBackend();
  }, [activeTab, libraryView, token]);

  // Auth Submit Action handler for Login/Register
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!authUsername.trim() || !authPassword.trim()) {
      setAuthError('Please fill in all fields.');
      return;
    }

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    try {
      const response = await api.post(endpoint, {
        username: authUsername,
        password: authPassword
      });

      const responseData = response.data as any; // Cast to bypass Axios unknown type error

      if (isRegister) {
        setIsRegister(false);
        setAuthError(null);
        alert('Registration successful! Please login.');
      } else {
        safeLocalStorage.setItem('token', responseData.token);
        safeLocalStorage.setItem('username', responseData.username);
        setToken(responseData.token);
        setUsername(responseData.username);
        setAuthError(null);
      }
      setAuthUsername('');
      setAuthPassword('');
    } catch (err: any) {
      console.error('Auth action failed:', err);
      if (err.response?.data?.errors) {
        const errorMsg = Object.values(err.response.data.errors)[0] as string;
        setAuthError(errorMsg);
      } else {
        setAuthError('Invalid credentials. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    safeLocalStorage.removeItem('token');
    safeLocalStorage.removeItem('username');
    setToken(null);
    setUsername(null);
  };

  // Compute stats dynamically from live backend data
  const totalCompleted = backendBooks.filter((b) => b.status === 'read' || b.status === 'completed').length;
  
  const getFavoriteGenre = () => {
    const libraryBooks = backendBooks.filter((b) => 
      ['want-to-read', 'reading', 'read', 'completed'].includes(b.status)
    );
    if (libraryBooks.length === 0) return 'None';
    
    const genreCounts: { [key: string]: number } = {};
    libraryBooks.forEach((b) => {
      if (b.genre) {
        genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
      }
    });

    let favGenre = 'None';
    let maxVal = 0;
    Object.entries(genreCounts).forEach(([genre, count]) => {
      if (count > maxVal) {
        maxVal = count;
        favGenre = genre;
      }
    });
    return favGenre;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'library':
        return (
          <div className="space-y-4">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLibraryView('my-books')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  libraryView === 'my-books'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <BookIcon size={16} />
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

                {loading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {/* Render backend books dynamically */}
                    {backendBooks
                      .filter((b) => ['want-to-read', 'reading', 'read', 'completed'].includes(b.status))
                      .map((book) => (
                        <BookCard key={book.id} book={book} variant="library" />
                      ))
                    }
                    
                    {/* Empty library state fallback */}
                    {backendBooks.filter((b) => ['want-to-read', 'reading', 'read', 'completed'].includes(b.status)).length === 0 && (
                      <p className="text-gray-500 text-center col-span-2 py-10 text-sm">
                        Your library is empty. Go to Browse to add some books!
                      </p>
                    )}
                  </div>
                )}
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
              {books.slice(3, 8).map((book) => (
                <BookCard key={book.id} book={book} variant="discover" />
              ))}
            </div>
          </div>
        );
      case 'reading':
        const currentlyReadingList = backendBooks.filter((b) => b.status === 'reading');

        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Currently Reading</h2>
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {currentlyReadingList.map((book) => (
                  <BookCard key={book.id} book={book} variant="default" />
                ))}
                {currentlyReadingList.length === 0 && (
                  <p className="text-gray-500 text-center py-10 text-sm">
                    You are not reading any books currently.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      case 'profile':
        if (!token) {
          // Unauthenticated Form view for login/registration
          return (
            <div className="space-y-6 max-w-sm mx-auto pt-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full mx-auto flex items-center justify-center">
                  <Lock size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  {isRegister ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-xs text-gray-500">
                  {isRegister ? 'Sign up to manage your library' : 'Log in to sync your reading habits'}
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Username"
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {authError && (
                  <p className="text-xs text-red-500 font-semibold">{authError}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md"
                >
                  {isRegister ? 'Register' : 'Log In'}
                </button>
              </form>

              <div className="text-center">
                <button
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setAuthError(null);
                  }}
                  className="text-xs text-blue-500 font-bold hover:underline"
                >
                  {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                </button>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="text-center relative">
              <button
                onClick={handleLogout}
                className="absolute top-0 right-0 p-2 text-gray-400 hover:text-red-500 transition-all"
                title="Log Out"
              >
                <LogOut size={20} />
              </button>
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="text-white" size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{username}</h2>
              <p className="text-gray-600 text-sm">Reading enthusiast since 2020</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl flex flex-col justify-between">
                <div className="text-2xl font-bold text-blue-600">{totalCompleted}</div>
                <div className="text-xs text-gray-600 font-medium">Books Read</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl flex flex-col justify-between">
                <div className="text-2xl font-bold text-green-600">{readingStats.currentStreak}</div>
                <div className="text-xs text-gray-600 font-medium">Day Streak</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl flex flex-col justify-between min-w-0">
                <div className="text-lg font-extrabold text-purple-600 truncate">{getFavoriteGenre()}</div>
                <div className="text-xs text-gray-600 font-medium truncate">Fav Genre</div>
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
                {backendBooks.filter((b) => b.status === 'reading').slice(0, 2).map((book) => (
                  <BookCard key={book.id} book={book} variant="default" />
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