import { useState, useEffect, useCallback, useMemo } from 'react';
import { Book, Search, User, Library, Loader2, History, Trash2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../services/api';
import api from '../services/api';
import { toast } from 'sonner';

// Components - Pastikan path ini benar di folder kamu
import BookCard from '../components/BookCard';
import ProgressCard from '../components/ProgressCard';
import BottomNav from '../components/BottomNav';
import HeaderNav from '../components/HeaderNav';
import BrowseLibrary from '../components/BrowseLibrary';

interface Book {
  id: number | string;
  title: string;
  author: string;
  cover: string;
  genre?: string;
  status?: 'read' | 'reading' | 'want-to-read' | 'none';
  rating?: number | string;
  current_page?: number;
}

const Index = () => {
  const navigate = useNavigate();

  // 1. STATE MANAGEMENT (DENGAN PENGECEKAN LOCALSTORAGE)
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem('lastActiveTab') || 'home';
    } catch {
      return 'home';
    }
  });

  const [libraryView, setLibraryView] = useState(() => {
    try {
      return localStorage.getItem('lastLibraryView') || 'my-books';
    } catch {
      return 'my-books';
    }
  });

  const [dbBooks, setDbBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalRead: 0,
    currentStreak: 12,
    avgRating: 0,
    readingCount: 0
  });

  // 2. FETCH DATA DENGAN LOGIKA STATISTIK LENGKAP
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchBooks();
      
      // Ambil data buku dengan proteksi jika res.data bukan array
      const data = Array.isArray(res.data) ? res.data : (res.data?.books || []);
      setDbBooks(data);

      // Hitung Statistik Koleksi (Read, Reading, Want to Read)
      const readingBooks = data.filter(b => b.status === 'reading');
      const readBooks = data.filter(b => b.status === 'read');
      const wantToRead = data.filter(b => b.status === 'want-to-read');
      
      const totalInCollection = readingBooks.length + readBooks.length + wantToRead.length;

      // Hitung Rata-rata Rating
      const ratedBooks = readBooks.filter(b => b.rating && Number(b.rating) > 0);
      const average = ratedBooks.length > 0 
        ? (ratedBooks.reduce((acc, curr) => acc + Number(curr.rating), 0) / ratedBooks.length).toFixed(1)
        : 0;

      setStats({ 
        totalBooks: totalInCollection,
        totalRead: readBooks.length,
        readingCount: readingBooks.length,
        currentStreak: 12, 
        avgRating: Number(average)
      });

    } catch (err) {
      console.error("Failed to sync data:", err);
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
  const handleBookClick = (bookId: number | string) => {
    navigate(`/book-detail/${bookId}`);
  };

    const handleToggleFavorite = async (book: Book) => {
      try {
        const isCurrentlySaved = book.status !== 'none' && book.status != null;
        const nextStatus = isCurrentlySaved ? 'none' : 'want-to-read';

        const response = await api.put(`/api/books/${book.id}`, { status: nextStatus });

        if (response.status === 200) {
          toast.success(nextStatus === 'none' ? "Removed from your Library" : "Saved to Want to Reads");
          fetchAllData();
        }
      } catch (err) {
        toast.error("Failed to update status");
      }
    };

  const handleDeleteReading = (bookId: number | string) => {
    // Memunculkan Toast Modern dengan aksi (Action)
    toast("Remove Progress?", {
      description: "Are you sure you want to stop reading this book?",
      action: {
        label: "Yes, Remove",
        onClick: async () => {
          try {
            await api.put(`/api/books/${bookId}`, { 
              status: 'none', 
              current_page: 0 
            });
            toast.success("Reading progress removed");
            fetchAllData();
          } catch (err) {
            toast.error("Failed to delete progress");
          }
        },
      },
      cancel: {
        label: "No",
        onClick: () => toast.dismiss(),
      },
    });
  };

  // 5. LOGIKA REKOMENDASI PINTAR
  const recommendations = useMemo(() => {
    // 1. Ambil data buku yang sudah ada interaksi (sebagai acuan selera)
    const userInterests = dbBooks.filter(b => b.status && b.status !== 'none');
    
    // 2. Ambil daftar Genre dan Penulis unik yang disukai Tania
    const favGenres = [...new Set(userInterests.map(b => b.genre))];
    const favAuthors = [...new Set(userInterests.map(b => b.author))];

    // 3. Filter: Cari buku yang Genre ATAU Penulisnya cocok
    let matched = dbBooks.filter(b => 
      favGenres.includes(b.genre) || favAuthors.includes(b.author)
    );

    // 4. Pengacakan (Shuffle) agar rekomendasi selalu segar setiap refresh
    matched = matched.sort(() => 0.5 - Math.random());

    // 5. Logika "Always Show": Jika hasil cocok kurang dari 4, ambil dari seluruh buku secara acak
    if (matched.length < 4) {
      // Cari buku yang belum masuk ke list 'matched'
      const remainingBooks = dbBooks.filter(b => !matched.find(m => m.id === b.id));
      
      // Ambil acak sisa bukunya sebagai filler
      const filler = remainingBooks.sort(() => 0.5 - Math.random()).slice(0, 4 - matched.length);
      
      return [...matched, ...filler];
    }

    // 6. Batasi maksimal 4 buku yang paling relevan
    return matched.slice(0, 4);
  }, [dbBooks]);

  // Kategori Filtering
  const currentlyReading = dbBooks.filter(b => b.status === 'reading');
  const myCollection = dbBooks.filter(b => ['read', 'reading', 'want-to-read'].includes(b.status || ''));
  const historyBooks = dbBooks.filter(b => b.status === 'read');
  const filteredAndSortedBooks = useMemo(() => {
    const result = dbBooks.filter(book => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return [...result].sort((a, b) => {
      if (sortBy === 'rating') return Number(b.rating || 0) - Number(a.rating || 0);
      if (sortBy === 'alphabet') return (a.title || "").localeCompare(b.title || "");
      return Number(b.id) - Number(a.id); // 'latest'
    });
  }, [dbBooks, searchQuery, sortBy]);

  // 6. RENDER LOGIC
  const renderContent = () => {
    if (loading && dbBooks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
          <p className="text-gray-400 text-sm font-medium animate-pulse">Loading your library...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'library':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Tab Switcher: My Books | Browse */}
            <div className="flex space-x-1 bg-gray-200/50 rounded-2xl p-1.5">
              <button 
                onClick={() => setLibraryView('my-books')} 
                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold transition-all ${libraryView === 'my-books' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500'}`}
              >
                <Book size={16} /> <span>My Books</span>
              </button>
              <button 
                onClick={() => setLibraryView('browse')} 
                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold transition-all ${libraryView === 'browse' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500'}`}
              >
                <Library size={16} /> <span>Browse</span>
              </button>
            </div>

            {/* Content Logic */}
            {libraryView === 'my-books' ? (
              <div className="space-y-4">
                <h2 className="text-xl font-black text-gray-800">My Collection</h2>
                <div className="grid grid-cols-2 gap-4">
                  {myCollection.length > 0 ? myCollection.map((book) => (
                    <BookCard key={book.id} book={book} variant="library" onClick={() => handleBookClick(book.id)} />
                  )) : (
                    <div className="col-span-2 text-center py-12 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
                      <p className="text-gray-400 text-sm">Your library is empty</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500">
                <BrowseLibrary onBookAdded={fetchAllData} onBookClick={handleBookClick} />
              </div>
            )}
          </div>
        );

      case 'discover':
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h2 className="text-xl font-black text-gray-800">Search Books</h2>
          
          {/* SEARCH BAR */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search books or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white shadow-sm rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            />
          </div>

          {/* --- TOMBOL SORTING --- */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'latest', label: 'Latest' },
              { id: 'rating', label: 'Top Rated' },
              { id: 'alphabet', label: 'A-Z' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  sortBy === option.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'bg-white text-gray-400 border border-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* LIST HASIL */}
          <div className="space-y-3">
            {filteredAndSortedBooks.map((book) => (
              <BookCard key={book.id} book={book} variant="discover" onClick={() => handleBookClick(book.id)} />
            ))}
            {filteredAndSortedBooks.length === 0 && (
              <p className="text-center text-gray-400 py-10">No books found...</p>
            )}
          </div>
        </div>
      );

      case 'reading':
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-black text-gray-800">Currently Reading</h2>
            <div className="space-y-4">
              {currentlyReading.length > 0 ? currentlyReading.map((book) => (
                <div key={book.id} className="relative group">
                  <ProgressCard book={book} onUpdate={fetchAllData} onClick={() => handleBookClick(book.id)} />
                  <button 
                    onClick={() => handleDeleteReading(book.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-100 md:opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )) : (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 text-sm font-medium">No reading activity yet</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-8 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-4">
              <div className="w-28 h-28 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[2.2rem] mx-auto p-1 shadow-xl rotate-3">
                <div className="w-full h-full bg-white rounded-[2rem] flex items-center justify-center overflow-hidden rotate-[-3deg]">
                  <User size={48} className="text-blue-600" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-800">Raden Tania Cinta Kinan Lestari</h2>
                <p className="text-gray-500 text-xs font-black uppercase tracking-widest">SMK Negeri 1 Cimahi</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-5 rounded-[1.8rem] shadow-sm border border-gray-50 text-center">
                <div className="text-xl font-black text-blue-600">{stats.totalBooks}</div>
                <div className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Total Books</div>
              </div>
              <div className="bg-white p-5 rounded-[1.8rem] shadow-sm border border-gray-50 text-center">
                <div className="text-xl font-black text-orange-500">{stats.currentStreak}</div>
                <div className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Streak</div>
              </div>
              <div className="bg-white p-5 rounded-[1.8rem] shadow-sm border border-gray-50 text-center">
                <div className="text-xl font-black text-purple-600">{stats.avgRating}</div>
                <div className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Rating</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <History size={18} className="text-blue-600" /> Finished Books
              </h3>
              <div className="grid gap-3">
                {historyBooks.map(book => (
                  <div key={book.id} onClick={() => handleBookClick(book.id)} className="flex items-center p-3 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer active:scale-[0.98] transition-transform">
                    <img src={book.cover} className="w-10 h-14 object-cover rounded-lg mr-4" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800 line-clamp-1">{book.title}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase italic">Completed</p>
                    </div>
                    <div className="text-yellow-500 text-xs font-black bg-yellow-50 px-2 py-1 rounded-lg">★ {book.rating}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default: // HOME
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-black mb-1 italic">Welcome back!</h2>
                <p className="opacity-80 text-sm font-medium">You're reading {stats.readingCount} books</p>
                <div className="mt-5 bg-white/20 rounded-full h-2.5 w-full">
                  <div 
                    className="bg-white rounded-full h-2.5 transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.4)]" 
                    style={{ width: `${Math.min((stats.totalRead / (stats.totalBooks || 1)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <BookOpen size={100} className="absolute -bottom-4 -right-4 opacity-10 rotate-12" />
            </div>

            {currentlyReading.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-gray-800">Continue Reading</h3>
                {currentlyReading.slice(0, 2).map((book) => (
                  <ProgressCard key={book.id} book={book} onUpdate={fetchAllData} onClick={() => handleBookClick(book.id)} />
                ))}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-black text-gray-800">Recommended for You</h3>
              <div className="grid grid-cols-2 gap-4">
                {recommendations.map((book) => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    variant="compact" 
                    onToggleFavorite={() => handleToggleFavorite(book)}
                    onClick={() => handleBookClick(book.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto border-x border-gray-100 shadow-2xl flex flex-col relative overflow-hidden">
      <HeaderNav 
        activeTab={activeTab} 
        onSearchClick={() => setActiveTab('discover')} 
      />
      
      <main className="flex-1 px-6 py-6 pb-32 overflow-y-auto scrollbar-hide">
        {renderContent()}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;