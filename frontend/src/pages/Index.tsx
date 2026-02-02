import { useState } from "react";
import { Book, Search, User, TrendingUp, Plus, Library } from "lucide-react";
import BookCard from "../components/BookCard";
import ProgressCard from "../components/ProgressCard";
import BottomNav from "../components/BottomNav";
import HeaderNav from "../components/HeaderNav";
import BrowseLibrary from "../components/BrowseLibrary";
import { books, currentlyReading, readingStats } from "../data/dummyData";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import SettingsContent from "@/components/Settings";
import InsightPage from "@/components/Insight";

const Index = () => {
  const [libraryView, setLibraryView] = useState("my-books"); // 'my-books' or 'browse'

  // User
  const { user } = useAuth();

  // insight modal
  const [openInsight, setOpenInsight] = useState(false);

  // settings modal
  const [openSettings, setOpenSettings] = useState(false);

  const [activeTab, setActiveTab] = useState("home");

  // Logout
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "library":
        return (
          <div className="space-y-4">
            {/* Library Navigation */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLibraryView("my-books")}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  libraryView === "my-books"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Book size={16} />
                <span>My Books</span>
              </button>
              <button
                onClick={() => setLibraryView("browse")}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  libraryView === "browse"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Library size={16} />
                <span>Browse</span>
              </button>
            </div>

            {/* Content based on selected view */}
            {libraryView === "my-books" ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    My Library
                  </h2>
                  <button
                    onClick={() => setLibraryView("browse")}
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
      case "discover":
        return (
          <div className="space-y-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
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
      case "reading":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Currently Reading
            </h2>
            <div className="space-y-4">
              {currentlyReading.map((book) => (
                <ProgressCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="text-white" size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-600">Reading enthusiast since 2020</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">
                  {readingStats.totalBooks}
                </div>
                <div className="text-sm text-gray-600">Books Read</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">
                  {readingStats.currentStreak}
                </div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">
                  {readingStats.avgRating}
                </div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-6">
              {/* INSIGHT */}
              <button
                onClick={() => setOpenInsight(true)}
                className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <TrendingUp size={18} />
                  </div>
                  <span className="font-medium text-gray-800">
                    Reading Insight
                  </span>
                </div>
                <span className="text-gray-400">›</span>
              </button>

              <div className="h-px bg-gray-100" />

              {/* SETTINGS */}
              <button
                onClick={() => setOpenSettings(true)}
                className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gray-200 text-gray-700 p-2 rounded-lg">
                    <User size={18} />
                  </div>
                  <span className="font-medium text-gray-800">Settings</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>

              <div className="h-px bg-gray-100" />

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-4 py-4 hover:bg-red-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                    <Plus size={18} />
                  </div>
                  <span className="font-medium text-red-600">Logout</span>
                </div>
                <span className="text-red-400">›</span>
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <h2 className="text-xl font-bold mb-2">Welcome back!</h2>
              <p className="opacity-90">
                You've read {readingStats.pagesThisWeek} pages this week
              </p>
              <div className="mt-4 bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2 w-3/4"></div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Continue Reading
              </h3>
              <div className="space-y-3">
                {currentlyReading.slice(0, 2).map((book) => (
                  <ProgressCard key={book.id} book={book} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Recommended for You
              </h3>
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

      <main className="px-4 py-6 pb-20">{renderContent()}</main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {openSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* BACKDROp */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenSettings(false)}
          />

          {/* MODAL BOX */}
          <div className="relative bg-white w-[90%] max-w-md rounded-xl p-6 shadow-xl z-10 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">User Settings</h2>
              <button
                onClick={() => setOpenSettings(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            <SettingsContent />
          </div>
        </div>
      )}

      {openInsight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* BACKDROp */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenInsight(false)}
          />

          {/* MODAL BOX */}
          <div className="relative bg-white w-[90%] max-w-md rounded-xl p-6 shadow-xl z-10 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">User Settings</h2>
              <button
                onClick={() => setOpenInsight(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            <InsightPage />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
