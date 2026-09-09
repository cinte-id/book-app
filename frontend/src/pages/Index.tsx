import { useState } from 'react';
import { Book, Search, User, TrendingUp, Plus, Library, HelpCircle, Mail, BookOpen, Star, LayoutDashboard, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import ProgressCard from '../components/ProgressCard';
import BottomNav from '../components/BottomNav';
import HeaderNav from '../components/HeaderNav';
import BrowseLibrary from '../components/BrowseLibrary';
import { books, currentlyReading, readingStats } from '../data/dummyData';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [libraryView, setLibraryView] = useState('my-books'); // 'my-books' or 'browse'

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
                  {books.slice(0, 6).map((book) => (
                    <BookCard key={book.id} book={book} variant="library" />
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

            {/* Menu Customer Support & Bantuan */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-3 py-2">
                Pusat Bantuan & Layanan
              </h3>

              <Link
                to="/help"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition text-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <HelpCircle size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Bantuan & FAQ</p>
                    <p className="text-xs text-gray-400">Pertanyaan umum & pencarian solusi</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>

              <Link
                to="/contact"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition text-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Hubungi Dukungan</p>
                    <p className="text-xs text-gray-400">Kirim kendala & buat tiket bantuan</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>

              <Link
                to="/guide"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition text-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Panduan Aplikasi</p>
                    <p className="text-xs text-gray-400">Tutorial onboarding langkah demi langkah</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>

              <Link
                to="/feedback"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition text-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                    <Star size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Kritik & Masukan</p>
                    <p className="text-xs text-gray-400">Beri ulasan & usulkan fitur baru</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>

              <Link
                to="/admin/cs-dashboard"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 transition text-indigo-700 border-t border-gray-100 mt-2 pt-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                    <LayoutDashboard size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Dashboard Tim CS</p>
                    <p className="text-xs text-indigo-500">Panel admin analitik & kelola tiket</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-indigo-400" />
              </Link>
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