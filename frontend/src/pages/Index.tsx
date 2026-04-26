import { useState, useEffect, useCallback } from 'react';
import { Book, Search, User, Plus, Library, X, Loader2, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'sonner';

// Components
import BookCard from '../components/BookCard';
import ProgressCard from '../components/ProgressCard';
import BottomNav from '../components/BottomNav';
import HeaderNav from '../components/HeaderNav';
import BrowseLibrary from '../components/BrowseLibrary';

const Index = () => {
  const navigate = useNavigate();

  // 1. STATE MANAGEMENT
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('lastActiveTab') || 'home');
  const [libraryView, setLibraryView] = useState(() => localStorage.getItem('lastLibraryView') || 'my-books');
  const [dbBooks, setDbBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [stats, setStats] = useState({
    totalRead: 0,
    currentStreak: 12,
    avgRating: 0
  });

  // 2. FETCH DATA (Sinkronisasi Backend)
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/books');
      const data = Array.isArray(res.data) ? res.data : (res.data.books || []);
      
      setDbBooks(data);

      // Hitung statistik
      const readBooks = data.filter(b => b.status === 'read');
      const ratedBooks = readBooks.filter(b => Number(b.rating) > 0);
      const average = ratedBooks.length > 0 
        ? (ratedBooks.reduce((acc, curr) => acc + Number(curr.rating), 0) / ratedBooks.length).toFixed(1)
        : 0;

      setStats(prev => ({ 
        ...prev, 
        totalRead: readBooks.length,
        avgRating: Number(average)
      }));

    } catch (err) {
      console.error("Gagal sinkronisasi data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. PERSISTENCE & INITIAL LOAD
  useEffect(() => {
    localStorage.setItem('lastActiveTab', activeTab);
    fetchAllData();
  }, [activeTab, fetchAllData]);

  useEffect(() => {
    localStorage.setItem('lastLibraryView', libraryView);
  }, [libraryView]);

  // 4. HANDLERS
  const handleBookClick = (bookId) => {
    // Navigasi ke halaman detail
    navigate(`/book-detail/${bookId}`);
  };

  const handleToggleFavorite = async (book) => {
    try {
      const isCurrentlySaved = book.status && book.status !== 'none';
      const nextStatus = isCurrentlySaved ? 'none' : 'want-to-read';

      const response = await api.put(`/api/books/${book.id}`, { 
        status: nextStatus 
      });

      if (response.status === 200) {
        setDbBooks(prev => prev.map(b => b.id === book.id ? { ...b, status: nextStatus } : b));
        toast.success(nextStatus === 'none' ? "Removed from Library" : "Added to Library");
      }
    } catch (err) {
      console.error("Gagal update status:", err);
      toast.error("Failed to update status");
    }
  };

  // 5. FILTERING LOGIC
  const currentlyReading = dbBooks.filter(b => b.status === 'reading');
  const myLibrary = dbBooks.filter(b => b.status && b.status !== 'none' && b.status !== 'reading');
  const historyBooks = dbBooks.filter(b => b.status === 'read');
  
  // Filter rekomendasi 
  const recommendations = dbBooks.filter(b => b.status === 'none' || !b.status || b.status === 'want-to-read');
  const finalRecommendations = recommendations.length > 0 ? recommendations : dbBooks;

  const searchedBooks = dbBooks.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    if (loading && dbBooks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-500 mb-2" />
          <p className="text-gray-400 text-sm italic">Synchronizing library...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'library':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex space-x-1 bg-gray-200/50 rounded-xl p-1.5">
              <button onClick={() => setLibraryView('my-books')} className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-bold transition-all ${libraryView === 'my-books' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                <Book size={16} /> <span>My Books</span>
              </button>
              <button onClick={() => setLibraryView('browse')} className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-bold transition-all ${libraryView === 'browse' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                <Library size={16} /> <span>Browse</span>
              </button>
            </div>

            {libraryView === 'my-books' ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-extrabold text-gray-800">My Collection</h2>
                  <button onClick={() => setLibraryView('browse')} className="bg-blue-600 text-white p-2 rounded-xl active:scale-90 transition-transform">
                    <Plus size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {myLibrary.map((book) => (
                    <BookCard 
                        key={book.id} 
                        book={book} 
                        variant="library" 
                        onToggleFavorite={() => handleToggleFavorite(book)}
                        onClick={() => handleBookClick(book.id)} // Navigasi Library
                    />
                  ))}
                </div>
              </div>
            ) : <BrowseLibrary onBookAdded={fetchAllData} onBookClick={handleBookClick} /> }
          </div>
        );

      case 'discover':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search books or authors.."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white shadow-sm rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-gray-400">
                  <X size={18} />
                </button>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {searchQuery ? `Results for "${searchQuery}"` : "All Collections"}
            </h2>
            <div className="space-y-3">
              {searchedBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  variant="discover" 
                  onClick={() => handleBookClick(book.id)} // Navigasi Discover
                  onToggleFavorite={() => handleToggleFavorite(book)}
                />
              ))}
            </div>
          </div>
        );

      case 'reading':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-extrabold text-gray-800">Currently Reading</h2>
            <div className="space-y-4">
              {currentlyReading.length > 0 ? (
                currentlyReading.map((book) => (
                  <ProgressCard 
                    key={book.id} 
                    book={book} 
                    onUpdate={fetchAllData} 
                    onClick={() => handleBookClick(book.id)} // Navigasi Progress
                  />
                ))
              ) : (
                <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400 text-sm">No books in progress. 😴</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-8 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-4">
              <div className="w-28 h-28 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full mx-auto p-1 shadow-lg">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <User size={48} className="text-blue-600" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Raden Tania</h2>
                <p className="text-gray-500 text-sm">XII SIJA A Student</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 p-4 rounded-2xl text-center">
                <div className="text-xl font-bold text-blue-700">{stats.totalRead}</div>
                <div className="text-[10px] uppercase tracking-wider text-blue-500 font-bold">Read</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-2xl text-center">
                <div className="text-xl font-bold text-orange-700">{stats.currentStreak}</div>
                <div className="text-[10px] uppercase tracking-wider text-orange-500 font-bold">Streak</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-2xl text-center">
                <div className="text-xl font-bold text-purple-700">{stats.avgRating || '-'}</div>
                <div className="text-[10px] uppercase tracking-wider text-purple-500 font-bold">Rating</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <History size={18} className="text-blue-600" /> Reading History
              </h3>
              <div className="space-y-2">
                {historyBooks.length > 0 ? (
                  historyBooks.map(book => (
                    <div key={book.id} onClick={() => handleBookClick(book.id)} className="flex items-center p-3 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer active:bg-gray-50 transition-all">
                        <img src={book.cover} className="w-10 h-14 object-cover rounded-lg mr-3 shadow-sm" />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-800">{book.title}</p>
                            <p className="text-[10px] text-gray-400">Finished on: {book.completed_at || 'Recently'}</p>
                        </div>
                        <div className="text-orange-400 text-xs font-bold">★ {book.rating}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic text-center py-4">No books finished yet.</p>
                )}
              </div>
            </div>
          </div>
        );

      default: // Home Tab
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-1">Welcome back!</h2>
                <p className="opacity-90 text-sm">You're currently reading {currentlyReading.length} books</p>
                <div className="mt-4 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-1000" 
                    style={{ width: currentlyReading.length > 0 ? '65%' : '0%' }}
                  ></div>
                </div>
              </div>
            </div>

            {currentlyReading.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-800">Continue Reading</h3>
                {currentlyReading.slice(0, 2).map((book) => (
                  <ProgressCard key={book.id} book={book} onUpdate={fetchAllData} onClick={() => handleBookClick(book.id)} />
                ))}
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-800">Recommended for You</h3>
              <div className="grid grid-cols-2 gap-4">
                {finalRecommendations.slice(0, 4).map((book) => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    variant="compact" 
                    onToggleFavorite={() => handleToggleFavorite(book)}
                    onClick={() => handleBookClick(book.id)} // Navigasi Recommendation
                  />
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto border-x border-gray-100 shadow-2xl overflow-hidden flex flex-col">
      <HeaderNav 
        activeTab={activeTab} 
        onSearchClick={() => setActiveTab('discover')} 
      />
      <main className="flex-1 px-6 py-6 pb-28 overflow-y-auto">
        {renderContent()}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Index;