import { useState } from "react";
import { useLanguage } from "../locales/LanguageContext";
import {
  Book,
  Search,
  User,
  Plus,
  Library,
} from "lucide-react";

import BookCard from "../components/BookCard";
import ProgressCard from "../components/ProgressCard";
import BottomNav from "../components/BottomNav";
import HeaderNav from "../components/HeaderNav";
import BrowseLibrary from "../components/BrowseLibrary";
import LiveChat from "../components/LiveChat";

import {
  books,
  currentlyReading,
  readingStats,
} from "../data/dummyData";

import { Link } from "react-router-dom";

const Index = () => {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState("home");
  const [libraryView, setLibraryView] = useState("my-books");

  const renderContent = () => {
    switch (activeTab) {
      // =========================
      // LIBRARY
      // =========================
      case "library":
        return (
          <div className="space-y-4">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLibraryView("my-books")}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${libraryView === "my-books"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                <Book size={16} />
                <span>{t.library.myBooks}</span>
              </button>

              <button
                onClick={() => setLibraryView("browse")}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${libraryView === "browse"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                <Library size={16} />
                <span>{t.library.browse}</span>
              </button>
            </div>

            {libraryView === "my-books" ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    {t.library.myLibrary}
                  </h2>

                  <button
                    onClick={() => setLibraryView("browse")}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                    aria-label="Add book"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {books.slice(0, 6).map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      variant="library"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <BrowseLibrary />
            )}
          </div>
        );

      // =========================
      // DISCOVER
      // =========================
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
                placeholder={t.discover.searchBooks}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              {t.discover.trending}
            </h2>

            <div className="space-y-3">
              {books.slice(3, 8).map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  variant="discover"
                />
              ))}
            </div>
          </div>
        );

      // =========================
      // READING
      // =========================
      case "reading":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              {t.reading.currentlyReading}
            </h2>

            <div className="space-y-4">
              {currentlyReading.map((book) => (
                <ProgressCard
                  key={book.id}
                  book={book}
                />
              ))}
            </div>
          </div>
        );

      // =========================
      // PROFILE
      // =========================
      case "profile":
        return (
          <div className="space-y-6">
            {/* Profile */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User
                  className="text-white"
                  size={32}
                />
              </div>

              <h2 className="text-xl font-bold text-gray-800">
                {t.profile.name}
              </h2>

              <p className="text-gray-600">
                {t.profile.subtitle}
              </p>
            </div>

            {/* Reading Statistics */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t.profile.readingStatistics}
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">
                    {readingStats.totalBooks}
                  </div>

                  <div className="text-sm text-gray-600">
                    {t.profile.booksRead}
                  </div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">
                    {readingStats.currentStreak}
                  </div>

                  <div className="text-sm text-gray-600">
                    {t.profile.dayStreak}
                  </div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">
                    {readingStats.avgRating}
                  </div>

                  <div className="text-sm text-gray-600">
                    {t.profile.averageRating}
                  </div>
                </div>
              </div>
            </div>

            {/* Language */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t.language.title}
              </h3>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setLanguage("en")}
                  className={`w-14 h-11 rounded-xl text-2xl flex items-center justify-center transition-all ${language === "en"
                      ? "bg-blue-500 shadow-md scale-105"
                      : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  title="English"
                  aria-label="Switch to English"
                >
                  EN
                </button>

                <button
                  onClick={() => setLanguage("id")}
                  className={`w-14 h-11 rounded-xl text-2xl flex items-center justify-center transition-all ${language === "id"
                      ? "bg-blue-500 shadow-md scale-105"
                      : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  title="Bahasa Indonesia"
                  aria-label="Switch to Indonesian"
                >
                  🇮🇩
                </button>
              </div>
            </div>


            {/* Help & Support */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Help & Support
              </h3>

              <div className="space-y-2">
                {/* Help & FAQ */}
                <Link
                  to="/help"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {t.profile.helpFaq}
                    </p>

                    <p className="text-sm text-gray-500">
                      {t.profile.helpFaqDescription}
                    </p>
                  </div>

                  <span className="text-gray-400 text-xl">
                    ›
                  </span>
                </Link>

                {/* User Guide */}
                <Link
                  to="/user-guide"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {t.profile.userGuide}
                    </p>

                    <p className="text-sm text-gray-500">
                      {t.profile.userGuideDescription}
                    </p>
                  </div>

                  <span className="text-gray-400 text-xl">
                    ›
                  </span>
                </Link>

                {/* My Tickets */}
                <Link
                  to="/tickets"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {t.profile.tickets}
                    </p>

                    <p className="text-sm text-gray-500">
                      {t.profile.ticketsDescription}
                    </p>
                  </div>

                  <span className="text-gray-400 text-xl">
                    ›
                  </span>
                </Link>

                {/* Feedback */}
                <Link
                  to="/feedback"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {t.profile.feedback}
                    </p>

                    <p className="text-sm text-gray-500">
                      {t.profile.feedbackDescription}
                    </p>
                  </div>

                  <span className="text-gray-400 text-xl">
                    ›
                  </span>
                </Link>

                {/* Contact Support */}
                <Link
                  to="/contact-support"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {t.profile.contact}
                    </p>

                    <p className="text-sm text-gray-500">
                      {t.profile.contactDescription}
                    </p>
                  </div>

                  <span className="text-gray-400 text-xl">
                    ›
                  </span>
                </Link>

                {/* Customer Service Dashboard */}
                <Link
                  to="/customer-service"
                  className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-blue-700">
                      {t.profile.dashboard}
                    </p>

                    <p className="text-sm text-blue-500">
                      {t.profile.dashboardDescription}
                    </p>
                  </div>

                  <span className="text-blue-400 text-xl">
                    ›
                  </span>
                </Link>
              </div>
            </div>
          </div>
        );

      // =========================
      // HOME
      // =========================
      default:
        return (
          <div className="space-y-6">
            {/* Welcome */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <h2 className="text-xl font-bold mb-2">
                {t.home.welcome}
              </h2>

              <p className="opacity-90">
                {t.home.pagesThisWeek.replace(
                  "{pages}",
                  String(readingStats.pagesThisWeek)
                )}
              </p>

              <div className="mt-4 bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2 w-3/4" />
              </div>
            </div>

            {/* Continue Reading */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t.home.continueReading}
              </h3>

              <div className="space-y-3">
                {currentlyReading.slice(0, 2).map((book) => (
                  <ProgressCard
                    key={book.id}
                    book={book}
                  />
                ))}
              </div>
            </div>

            {/* Recommended */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t.home.recommended}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {books.slice(0, 4).map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    variant="compact"
                  />
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 max-w-md mx-auto">
      <HeaderNav activeTab={activeTab} />

      <main className="px-4 py-6 pb-20">
        {renderContent()}
      </main>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <LiveChat />
    </div>
  );
};

export default Index;