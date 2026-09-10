import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
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
    steps: {
      en: [
        "Open the Book App and explore the home page.",
        "Use the navigation menu to access different sections.",
        "Browse available books from the Discover section.",
        "Open a book to see its details.",
      ],
      id: [
        "Buka Book App dan jelajahi halaman utama.",
        "Gunakan menu navigasi untuk mengakses berbagai bagian aplikasi.",
        "Jelajahi buku yang tersedia dari bagian Discover.",
        "Buka sebuah buku untuk melihat detailnya.",
      ],
    },
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
    steps: {
      en: [
        "Open the Discover section.",
        "Enter a book title or author in the search field.",
        "Browse the available search results.",
        "Select a book to view its details.",
      ],
      id: [
        "Buka bagian Discover.",
        "Masukkan judul buku atau nama penulis pada kolom pencarian.",
        "Jelajahi hasil pencarian yang tersedia.",
        "Pilih buku untuk melihat detailnya.",
      ],
    },
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
    steps: {
      en: [
        "Open the My Library section.",
        "Select a book you want to save.",
        "Add the book to your personal library.",
        "Open My Library anytime to access your saved books.",
      ],
      id: [
        "Buka bagian Perpustakaan Saya.",
        "Pilih buku yang ingin Anda simpan.",
        "Tambahkan buku ke perpustakaan pribadi Anda.",
        "Buka Perpustakaan Saya kapan saja untuk mengakses buku yang telah disimpan.",
      ],
    },
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
    steps: {
      en: [
        "Open the Reading section.",
        "Select the book you are currently reading.",
        "Update your reading progress.",
        "Check your progress regularly to track your reading activity.",
      ],
      id: [
        "Buka bagian Reading.",
        "Pilih buku yang sedang Anda baca.",
        "Perbarui progres membaca Anda.",
        "Periksa progres secara berkala untuk memantau aktivitas membaca Anda.",
      ],
    },
  },
];

const UserGuideDetail = () => {
  const { id } = useParams();
  const { language } = useLanguage();

  const tutorial = tutorials.find(
    (item) => item.id === id
  );

  const text = {
    en: {
      userGuide: "User Guide",
      stepByStep: "Step-by-step guide",
      supportQuestion: "Can't find what you're looking for?",
      contactSupport: "Contact Support",
      tutorialNotFound: "Tutorial not found",
      backToGuide: "Back to User Guide",
    },
    id: {
      userGuide: "Panduan Pengguna",
      stepByStep: "Panduan langkah demi langkah",
      supportQuestion: "Tidak menemukan informasi yang Anda cari?",
      contactSupport: "Hubungi Dukungan",
      tutorialNotFound: "Tutorial tidak ditemukan",
      backToGuide: "Kembali ke Panduan Pengguna",
    },
  };

  const currentText = text[language];

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen">
          <main className="px-4 py-16 text-center">
            <h1 className="text-xl font-bold text-gray-800">
              {currentText.tutorialNotFound}
            </h1>

            <Link
              to="/user-guide"
              className="inline-block mt-5 bg-blue-500 text-white px-5 py-3 rounded-xl text-sm"
            >
              {currentText.backToGuide}
            </Link>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <header className="px-4 py-5 border-b bg-white">
          <div className="flex items-center gap-3">
            <Link
              to="/user-guide"
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {tutorial.title[language]}
              </h1>

              <p className="text-sm text-gray-500">
                {currentText.userGuide}
              </p>
            </div>
          </div>
        </header>

        <main className="px-4 py-6">
          {/* Introduction */}
          <div className="bg-blue-50 rounded-2xl p-5 mb-6">
            <h2 className="font-semibold text-gray-800">
              {tutorial.title[language]}
            </h2>

            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {tutorial.description[language]}
            </p>
          </div>

          {/* Steps */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-4">
              {currentText.stepByStep}
            </h2>

            <div className="space-y-4">
              {tutorial.steps[language].map((step, index) => (
                <div
                  key={index}
                  className="flex gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </div>

                  <div className="pt-1">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-8 border-t pt-6">
            <p className="text-sm text-gray-500 text-center mb-3">
              {currentText.supportQuestion}
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

export default UserGuideDetail;

