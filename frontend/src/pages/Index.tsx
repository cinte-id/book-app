import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Book,
  Search,
  User,
  Plus,
  Library,
  Headphones,
  ChevronRight,
} from "lucide-react";

import BookCard from "../components/BookCard";
import ProgressCard from "../components/ProgressCard";
import BottomNav from "../components/BottomNav";
import HeaderNav from "../components/HeaderNav";
import BrowseLibrary from "../components/BrowseLibrary";
import { books, currentlyReading, readingStats } from "../data/dummyData";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialTab =
    location.state?.activeTab === "profile" ? "profile" : "home";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [libraryView, setLibraryView] = useState("my-books");

  const renderContent = () => {
    switch (activeTab) {
      case "library":
        return (
          <div className="space-y-4">
            <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setLibraryView("my-books")}
                className={`flex flex-1 items-center justify-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
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
                className={`flex flex-1 items-center justify-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  libraryView === "browse"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Library size={16} />
                <span>Browse</span>
              </button>
            </div>

            {libraryView === "my-books" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    My Library
                  </h2>

                  <button
                    onClick={() => setLibraryView("browse")}
                    className="rounded-full bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600"
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
                className="w-full rounded-xl border-none bg-gray-100 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Trending Now
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

      case "reading":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Currently Reading
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

      case "profile":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <User
                  className="text-white"
                  size={32}
                />
              </div>

              <h2 className="text-xl font-bold text-gray-800">
                Book Lover
              </h2>

              <p className="text-gray-600">
                Reading enthusiast since 2020
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-blue-50 p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {readingStats.totalBooks}
                </div>

                <div className="text-sm text-gray-600">
                  Books Read
                </div>
              </div>

              <div className="rounded-xl bg-green-50 p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {readingStats.currentStreak}
                </div>

                <div className="text-sm text-gray-600">
                  Day Streak
                </div>
              </div>

              <div className="rounded-xl bg-purple-50 p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {readingStats.avgRating}
                </div>

                <div className="text-sm text-gray-600">
                  Avg Rating
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-500">
                Help & Support
              </h3>

              <button
                onClick={() => navigate("/support")}
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Headphones size={21} />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      Customer Support
                    </p>

                    <p className="mt-0.5 text-sm text-gray-500">
                      FAQ, tickets, feedback & live chat
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={20}
                  className="shrink-0 text-gray-400"
                />
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
              <h2 className="mb-2 text-xl font-bold">
                Welcome back!
              </h2>

              <p className="opacity-90">
                You've read {readingStats.pagesThisWeek} pages this week
              </p>

              <div className="mt-4 h-2 rounded-full bg-white/20">
                <div className="h-2 w-3/4 rounded-full bg-white" />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-800">
                Continue Reading
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

            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-800">
                Recommended for You
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
    <div className="mx-auto min-h-screen max-w-md bg-gray-50">
      <HeaderNav activeTab={activeTab} />

      <main className="px-4 py-6 pb-20">
        {renderContent()}
      </main>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default Index;