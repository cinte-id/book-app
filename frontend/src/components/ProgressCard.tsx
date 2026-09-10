import { BookOpen, Play } from "lucide-react";
import { useLanguage } from "../locales/LanguageContext";

interface BookProgress {
  id: number;
  title: string;
  author: string;
  currentPage: number;
  totalPages: number;
  lastRead: string;
}

interface ProgressCardProps {
  book: BookProgress;
}

const ProgressCard = ({ book }: ProgressCardProps) => {
  const { language } = useLanguage();

  const progress =
    (book.currentPage / book.totalPages) * 100;

  const text = {
    en: {
      page: "Page",
      of: "of",
      lastRead: "Last read",
      continueReading: "Continue reading",
    },

    id: {
      page: "Halaman",
      of: "dari",
      lastRead: "Terakhir dibaca",
      continueReading: "Lanjut membaca",
    },
  };

  const currentText = text[language];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center space-x-4">
        {/* Book Icon */}
        <div className="w-16 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpen
            className="text-orange-500"
            size={24}
          />
        </div>

        {/* Book Information */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
            {book.title}
          </h3>

          <p className="text-sm text-gray-600 mb-2">
            {book.author}
          </p>

          <div className="space-y-2">
            {/* Page Progress */}
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                {currentText.page} {book.currentPage}{" "}
                {currentText.of} {book.totalPages}
              </span>

              <span>
                {Math.round(progress)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            {/* Last Read */}
            <p className="text-xs text-gray-500">
              {currentText.lastRead}: {book.lastRead}
            </p>
          </div>
        </div>

        {/* Continue Reading Button */}
        <button
          className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors"
          aria-label={currentText.continueReading}
          title={currentText.continueReading}
        >
          <Play size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProgressCard;

