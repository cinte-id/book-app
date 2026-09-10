import { useState } from 'react';
import { ArrowLeft, Search, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import {
  kbCategories,
  filterArticles,
  getKbCategoryCounts,
} from '@/data/support/kbArticles';
import { goBack } from '@/data/support/navigation';

const KnowledgeBase = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const counts = getKbCategoryCounts();
  const articles = filterArticles(searchTerm, selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <button
            onClick={() => goBack(navigate)}
            className="mb-4 inline-flex items-center gap-2 rounded-lg p-2 -ml-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </button>
          <div className="text-center">
            <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
              <BookOpen size={32} className="text-white" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Pusat Pengetahuan</h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-600">
              Panduan mendalam per topik — dari langkah pertama sampai troubleshooting
            </p>
          </div>
          <div className="relative mx-auto mt-6 max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari artikel panduan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm shadow-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {kbCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {cat}{' '}
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                    isActive ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {counts[cat] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {(searchTerm || selectedCategory !== 'Semua') && (
          <p className="mb-4 text-sm text-gray-600">
            <span className="font-medium">{articles.length}</span> artikel ditemukan
            {searchTerm && <span className="text-blue-600"> untuk "{searchTerm}"</span>}
          </p>
        )}

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {articles.map((a) => (
              <Link key={a.slug} to={`/kb/${a.slug}`} className="group">
                <Card className="h-full border-gray-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
                  <CardContent className="flex h-full flex-col p-5">
                    <span className="mb-2 inline-block w-fit rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                      {a.category}
                    </span>
                    <h2 className="font-bold text-gray-900 transition-colors group-hover:text-blue-700">
                      {a.title}
                    </h2>
                    <p className="mt-1 flex-1 text-sm leading-relaxed text-gray-600">
                      {a.excerpt}
                    </p>
                    <span className="mt-3 flex items-center justify-between text-xs text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={13} />
                        {a.readMinutes} mnt baca
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium text-blue-600">
                        Baca
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </span>
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Tidak ada artikel ditemukan
            </h3>
            <p className="mx-auto mb-6 max-w-md text-sm text-gray-600">
              Coba kata kunci lain, atau hubungi support untuk bantuan langsung.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Semua');
              }}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
