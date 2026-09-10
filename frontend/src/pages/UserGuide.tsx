import {
  ArrowLeft,
  BookOpen,
  Library,
  PlayCircle,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../locales/LanguageContext";

const tutorials = [
  {
    id: "getting-started",
    title: {
      en: "Getting Started",
      id: "Memulai",
    },
    description: {
      en: "Learn the basics of using Book App.",
      id: "Pelajari dasar-dasar penggunaan Book App.",
    },
    icon: PlayCircle,
  },
  {
    id: "discover-books",
    title: {
      en: "Discover Books",
      id: "Menemukan Buku",
    },
    description: {
      en: "Learn how to search and discover new books.",
      id: "Pelajari cara mencari dan menemukan buku baru.",
    },
    icon: BookOpen,
  },
  {
    id: "my-library",
    title: {
      en: "My Library",
      id: "Perpustakaan Saya",
    },
    description: {
      en: "Learn how to manage your personal library.",
      id: "Pelajari cara mengelola perpustakaan pribadi Anda.",
    },
    icon: Library,
  },
  {
    id: "reading-progress",
    title: {
      en: "Reading Progress",
      id: "Progres Membaca",
    },
    description: {
      en: "Learn how to track your reading progress.",
      id: "Pelajari cara melacak progres membaca Anda.",
    },
    icon: TrendingUp,
  },
];

const UserGuide = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const text = {
    en: {
      title: "User Guide",
      subtitle: "Learn how to use Book App",
      welcome: "Welcome to Book App",
      introduction:
        "Follow these simple tutorials to learn how to discover books, manage your library, and track your reading progress.",
      tutorials: "Tutorials",
      stillNeedHelp: "Still need help?",
      contactSupport: "Contact Support",
    },
    id: {
      title: "Panduan Pengguna",
      subtitle: "Pelajari cara menggunakan Book App",
      welcome: "Selamat Datang di Book App",
      introduction:
        "Ikuti tutorial sederhana berikut untuk mempelajari cara menemukan buku, mengelola perpustakaan, dan melacak progres membaca Anda.",
      tutorials: "Tutorial",
      stillNeedHelp: "Masih membutuhkan bantuan?",
      contactSupport: "Hubungi Dukungan",
    },
  };

  const currentText = text[language];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <header className="px-4 py-5 border-b bg-white">
          <div className="flex items-center gap-3">
            <Link
              to="/help"
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {currentText.title}
              </h1>

              <p className="text-sm text-gray-500">
                {currentText.subtitle}
              </p>
            </div>
          </div>
        </header>

        <main className="px-4 py-6">
          {/* Introduction */}
          <div className="bg-blue-50 rounded-2xl p-5 mb-6">
            <h2 className="font-semibold text-gray-800">
              {currentText.welcome}
            </h2>

            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {currentText.introduction}
            </p>
          </div>

          {/* Tutorial List */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-3">
              {currentText.tutorials}
            </h2>

            <div className="space-y-3">
              {tutorials.map((tutorial) => {
                const Icon = tutorial.icon;

                return (
                  <button
                    key={tutorial.id}
                    onClick={() =>
                      navigate(`/user-guide/${tutorial.id}`)
                    }
                    className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-2xl text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Icon
                        size={22}
                        className="text-blue-500"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">
                        {tutorial.title[language]}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {tutorial.description[language]}
                      </p>
                    </div>

                    <span className="text-gray-400">
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Support */}
          <div className="mt-6 border-t pt-6">
            <p className="text-sm text-gray-500 text-center mb-3">
              {currentText.stillNeedHelp}
            </p>

            <Link
              to="/contact-support"
              className="block text-center bg-blue-500 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-600"
            >
              {currentText.contactSupport}
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserGuide;
