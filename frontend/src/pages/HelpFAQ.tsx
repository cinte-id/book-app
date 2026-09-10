import { useState } from 'react';
import { Search, HelpCircle, BookOpen, User, Wrench, ArrowLeft, Mail, FileText, MessageSquare, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { faqData, faqCategories, filterFAQs, getCategoryCounts, type FAQItem } from '@/data/faqData';
import LiveChatWidget from '../components/support/LiveChatWidget';

const HelpFAQ = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [openId, setOpenId] = useState<number | null>(null);
  
  const categoryCounts = getCategoryCounts();
  const filteredFaqs = filterFAQs(searchTerm, selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Peminjaman':
        return <BookOpen size={16} className="text-blue-600" />;
      case 'Akun & Profil':
        return <User size={16} className="text-purple-600" />;
      case 'Pencarian & Katalog':
        return <Search size={16} className="text-green-600" />;
      case 'Teknis & Bantuan':
        return <Wrench size={16} className="text-amber-600" />;
      default:
        return <HelpCircle size={16} className="text-gray-600" />;
    }
  };

  const handleToggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft size={18} />
              <span>Kembali</span>
            </button>
          </div>
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-3">
              <HelpCircle size={32} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pusat Bantuan
            </h1>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Temukan jawaban cepat untuk pertanyaan Anda tentang BookTracker
            </p>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Link
              to="/contact"
              className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl hover:shadow-md transition-all duration-200 group border border-blue-200/50"
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                <Mail size={20} className="text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-blue-900 text-center">Contact Support</span>
            </Link>
            
            <Link
              to="/guide"
              className="flex flex-col items-center p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl hover:shadow-md transition-all duration-200 group border border-amber-200/50"
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                <FileText size={20} className="text-amber-600" />
              </div>
              <span className="text-xs font-semibold text-amber-900 text-center">User Guide</span>
            </Link>
            
            <Link
              to="/feedback"
              className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl hover:shadow-md transition-all duration-200 group border border-purple-200/50"
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                <MessageSquare size={20} className="text-purple-600" />
              </div>
              <span className="text-xs font-semibold text-purple-900 text-center">Feedback</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari pertanyaan atau kata kunci..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white shadow-sm text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Category Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {faqCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {cat !== 'Semua' && getCategoryIcon(cat)}
                <span>{cat}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Count */}
        {(searchTerm || selectedCategory !== 'Semua') && (
          <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
            <span className="font-medium">{filteredFaqs.length}</span> 
            <span>pertanyaan ditemukan</span>
            {searchTerm && (
              <span className="text-blue-600">
                untuk "{searchTerm}"
              </span>
            )}
          </div>
        )}

        {/* FAQ List - Accordion */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <button
                    onClick={() => handleToggle(faq.id)}
                    className="w-full flex items-start justify-between gap-4 p-5 text-left transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getCategoryIcon(faq.category)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 pr-4">
                          {faq.question}
                        </h3>
                        <span className="inline-block text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                    <div className={`flex-shrink-0 mt-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown size={20} className="text-gray-400" />
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0">
                      <div className="pl-9 border-l-2 border-blue-200 ml-2">
                        <p className="text-gray-700 text-sm leading-relaxed pl-4">
                          {faq.answer}
                        </p>
                        {faq.tags && faq.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4 pl-4">
                            {faq.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tidak ada pertanyaan ditemukan
              </h3>
              <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
                Tidak ada pertanyaan yang sesuai dengan pencarian Anda. 
                Coba kata kunci lain atau hubungi support untuk bantuan lebih lanjut.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('Semua');
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Reset Filter
                </button>
                <Link
                  to="/contact"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {filteredFaqs.length > 0 && (
          <div className="mt-12 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Masih butuh bantuan?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Tim support kami siap membantu Anda 24/7
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
              >
                <Mail size={18} />
                <span>Hubungi Support</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpFAQ;
