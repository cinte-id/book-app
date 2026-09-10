import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { Link } from "react-router-dom";
import {
  knowledgeBaseArticles,
  knowledgeBaseCategories,
} from "../data/knowledgeBaseData";
import { useLanguage } from "../locales/LanguageContext";

const KnowledgeBase = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { language } = useLanguage();

  const text = {
    en: {
      title: "Knowledge Base",
      subtitle: "Helpful articles and guides",
      searchPlaceholder: "Search articles...",
      categories: "Categories",
      helpArticles: "Help Articles",
      article: "articles",
      readArticle: "Read article →",
      noArticles: "No articles found.",
      tryAnother: "Try another keyword or category.",
    },

    id: {
      title: "Pusat Bantuan",
      subtitle: "Artikel dan panduan yang membantu",
      searchPlaceholder: "Cari artikel...",
      categories: "Kategori",
      helpArticles: "Artikel Bantuan",
      article: "artikel",
      readArticle: "Baca artikel →",
      noArticles: "Artikel tidak ditemukan.",
      tryAnother: "Coba kata kunci atau kategori lainnya.",
    },
  };

  const currentText = text[language];

  const categoryLabels: Record<
    string,
    { en: string; id: string }
  > = {
    All: {
      en: "All",
      id: "Semua",
    },

    "Getting Started": {
      en: "Getting Started",
      id: "Memulai",
    },

    "Account & Profile": {
      en: "Account & Profile",
      id: "Akun & Profil",
    },

    "Books & Library": {
      en: "Books & Library",
      id: "Buku & Perpustakaan",
    },

    "Reading Progress": {
      en: "Reading Progress",
      id: "Progres Membaca",
    },

    Troubleshooting: {
      en: "Troubleshooting",
      id: "Pemecahan Masalah",
    },
  };

  const getCategoryLabel = (value: string) => {
    return categoryLabels[value]?.[language] || value;
  };

  const filteredArticles = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return knowledgeBaseArticles.filter((article) => {
      const matchesCategory =
        category === "All" || article.category === category;

      const matchesSearch =
        article.title[language]
          .toLowerCase()
          .includes(searchText) ||
        article.description[language]
          .toLowerCase()
          .includes(searchText) ||
        article.category
          .toLowerCase()
          .includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [search, category, language]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <header className="px-4 py-5 border-b bg-white">
          <div className="flex items-center gap-3">
            <Link
              to="/help"
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label={currentText.title}
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

        <main className="px-4 py-6 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={20}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={currentText.searchPlaceholder}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Categories */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-3">
              {currentText.categories}
            </h2>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {knowledgeBaseCategories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === item
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {getCategoryLabel(item)}
                </button>
              ))}
            </div>
          </div>

          {/* Articles */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-800">
                {currentText.helpArticles}
              </h2>

              <span className="text-xs text-gray-400">
                {filteredArticles.length} {currentText.article}
              </span>
            </div>

            <div className="space-y-3">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/knowledge-base/${article.id}`}
                    className="block border border-gray-200 rounded-xl p-4 hover:bg-gray-50 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen
                          size={20}
                          className="text-blue-500"
                        />
                      </div>

                      <div className="flex-1">
                        <span className="text-xs text-blue-500 font-medium">
                          {getCategoryLabel(article.category)}
                        </span>

                        <h3 className="font-medium text-gray-800 mt-1">
                          {article.title[language]}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                          {article.description[language]}
                        </p>

                        <p className="text-sm text-blue-500 mt-2 font-medium">
                          {currentText.readArticle}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-10">
                  <BookOpen
                    size={40}
                    className="mx-auto text-gray-300 mb-3"
                  />

                  <p className="text-gray-500">
                    {currentText.noArticles}
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    {currentText.tryAnother}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default KnowledgeBase;

