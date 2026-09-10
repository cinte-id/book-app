import { ArrowLeft, BookOpen } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { knowledgeBaseArticles } from "../data/knowledgeBaseData";
import { useLanguage } from "../locales/LanguageContext";

const KnowledgeBaseDetail = () => {
  const { id } = useParams();
  const { language } = useLanguage();

  const article = knowledgeBaseArticles.find(
    (item) => item.id === id
  );

  const text = {
    en: {
      article: "Article",
      knowledgeBase: "Knowledge Base",
      articleNotFound: "Article Not Found",
      articleNotFoundDescription:
        "The article you are looking for does not exist.",
      backToKnowledgeBase: "Back to Knowledge Base",
      stillNeedHelp: "Still need help?",
      contactDescription:
        "Contact our support team if you cannot find the answer you need.",
      contactSupport: "Contact Support",

      categories: {
        "Getting Started": "Getting Started",
        "Account & Profile": "Account & Profile",
        "Books & Library": "Books & Library",
        "Reading Progress": "Reading Progress",
        Troubleshooting: "Troubleshooting",
      },
    },

    id: {
      article: "Artikel",
      knowledgeBase: "Pusat Bantuan",
      articleNotFound: "Artikel Tidak Ditemukan",
      articleNotFoundDescription:
        "Artikel yang Anda cari tidak tersedia.",
      backToKnowledgeBase: "Kembali ke Pusat Bantuan",
      stillNeedHelp: "Masih membutuhkan bantuan?",
      contactDescription:
        "Hubungi tim dukungan kami jika Anda tidak menemukan jawaban yang dibutuhkan.",
      contactSupport: "Hubungi Dukungan",

      categories: {
        "Getting Started": "Memulai",
        "Account & Profile": "Akun & Profil",
        "Books & Library": "Buku & Perpustakaan",
        "Reading Progress": "Progress Membaca",
        Troubleshooting: "Pemecahan Masalah",
      },
    },
  };

  const currentText = text[language];

  const getCategoryLabel = (category: string) => {
    return (
      currentText.categories[
        category as keyof typeof currentText.categories
      ] || category
    );
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <BookOpen
              size={48}
              className="mx-auto text-gray-300 mb-4"
            />

            <h1 className="text-xl font-bold text-gray-800">
              {currentText.articleNotFound}
            </h1>

            <p className="text-gray-500 mt-2">
              {currentText.articleNotFoundDescription}
            </p>

            <Link
              to="/knowledge-base"
              className="inline-block mt-5 bg-blue-500 text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-blue-600"
            >
              {currentText.backToKnowledgeBase}
            </Link>
          </div>
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
              to="/knowledge-base"
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label={currentText.backToKnowledgeBase}
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {currentText.article}
              </h1>

              <p className="text-sm text-gray-500">
                {currentText.knowledgeBase}
              </p>
            </div>
          </div>
        </header>

        <main className="px-4 py-6">
          {/* Article Header */}
          <div className="bg-blue-50 rounded-2xl p-5 mb-6">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
              <BookOpen
                size={24}
                className="text-blue-500"
              />
            </div>

            <span className="text-sm text-blue-500 font-medium">
              {getCategoryLabel(article.category)}
            </span>

            <h2 className="text-2xl font-bold text-gray-800 mt-2">
              {article.title[language]}
            </h2>

            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {article.description[language]}
            </p>
          </div>

          {/* Article Content */}
          <div className="space-y-5">
            {article.content[language].map(
              (paragraph, index) => (
                <div
                  key={index}
                  className="flex gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-500 text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed pt-1">
                    {paragraph}
                  </p>
                </div>
              )
            )}
          </div>

          {/* Contact Support */}
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800">
              {currentText.stillNeedHelp}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {currentText.contactDescription}
            </p>

            <Link
              to="/contact-support"
              className="block mt-4 text-center bg-blue-500 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-600"
            >
              {currentText.contactSupport}
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default KnowledgeBaseDetail;

