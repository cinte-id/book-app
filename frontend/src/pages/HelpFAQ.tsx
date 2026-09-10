import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  X,
  Globe,
  BookOpen,
  FileText,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
  id: string;
  category: { id: string; en: string };
  question: { id: string; en: string };
  answer: { id: string; en: string };
}

const faqData: FAQItem[] = [
  // Akun
  {
    id: 'akun-1',
    category: { id: 'Akun', en: 'Account' },
    question: {
      id: 'Bagaimana cara membuat akun?',
      en: 'How do I create an account?',
    },
    answer: {
      id: 'Klik "Sign Up" di halaman utama, isi formulir pendaftaran dengan email dan password, lalu verifikasi email Anda.',
      en: 'Click "Sign Up" on the home page, fill in the registration form with your email and password, then verify your email.',
    },
  },
  {
    id: 'akun-2',
    category: { id: 'Akun', en: 'Account' },
    question: {
      id: 'Bagaimana cara reset password?',
      en: 'How do I reset my password?',
    },
    answer: {
      id: 'Klik "Forgot Password" di halaman login, masukkan email terdaftar, dan ikuti instruksi di email.',
      en: 'Click "Forgot Password" on the login screen, enter your registered email, and follow the instructions sent to your inbox.',
    },
  },
  {
    id: 'akun-3',
    category: { id: 'Akun', en: 'Account' },
    question: {
      id: 'Apakah data saya aman?',
      en: 'Is my data secure?',
    },
    answer: {
      id: 'Ya, kami mengenkripsi semua data pengguna dan tidak membagikan informasi pribadi ke pihak ketiga.',
      en: 'Yes, we encrypt all user data and do not share personal information with any third parties.',
    },
  },
  // Buku & Library
  {
    id: 'lib-1',
    category: { id: 'Buku & Library', en: 'Books & Library' },
    question: {
      id: 'Bagaimana cara menambahkan buku?',
      en: 'How do I add a book?',
    },
    answer: {
      id: 'Buka tab Library, klik tombol + di pojok kanan atas, lalu cari buku yang ingin ditambahkan.',
      en: 'Go to the Library tab, tap the + button in the top right corner, and search for the book you want to add.',
    },
  },
  {
    id: 'lib-2',
    category: { id: 'Buku & Library', en: 'Books & Library' },
    question: {
      id: 'Bisa tracking progress membaca?',
      en: 'Can I track reading progress?',
    },
    answer: {
      id: 'Ya, buka tab Reading untuk melihat dan mengupdate progress membaca buku Anda.',
      en: 'Yes, open the Reading tab to view and update your reading progress anytime.',
    },
  },
  {
    id: 'lib-3',
    category: { id: 'Buku & Library', en: 'Books & Library' },
    question: {
      id: 'Bagaimana cara mencari buku?',
      en: 'How do I discover new books?',
    },
    answer: {
      id: 'Gunakan tab Discover dan ketik judul atau penulis buku di kolom pencarian.',
      en: 'Use the Discover tab and type the title or author name in the search field.',
    },
  },
  {
    id: 'lib-4',
    category: { id: 'Buku & Library', en: 'Books & Library' },
    question: {
      id: 'Bagaimana cara menghapus buku dari library?',
      en: 'How do I remove a book from my library?',
    },
    answer: {
      id: 'Buka detail buku di Library, lalu klik tombol "Remove from Library".',
      en: 'Open the book details in your Library, then click the "Remove from Library" button.',
    },
  },
  // Teknis
  {
    id: 'tek-1',
    category: { id: 'Teknis', en: 'Technical' },
    question: {
      id: 'App tidak bisa dibuka?',
      en: 'App is not opening or loading?',
    },
    answer: {
      id: 'Pastikan koneksi internet stabil, coba refresh halaman, atau bersihkan cache browser.',
      en: 'Ensure your internet connection is stable, try refreshing the page, or clear your browser cache.',
    },
  },
  {
    id: 'tek-2',
    category: { id: 'Teknis', en: 'Technical' },
    question: {
      id: 'Data buku hilang?',
      en: 'Missing book data?',
    },
    answer: {
      id: 'Coba refresh halaman. Jika masih hilang, logout dan login kembali.',
      en: 'Try refreshing the page. If the issue persists, log out and log back in.',
    },
  },
  {
    id: 'tek-3',
    category: { id: 'Teknis', en: 'Technical' },
    question: {
      id: 'Bagaimana cara update aplikasi?',
      en: 'How do I update the application?',
    },
    answer: {
      id: 'Aplikasi web otomatis terupdate. Cukup refresh browser untuk mendapatkan versi terbaru.',
      en: 'The web app updates automatically. Simply refresh your browser for the latest version.',
    },
  },
  // Umum
  {
    id: 'um-1',
    category: { id: 'Umum', en: 'General' },
    question: {
      id: 'Apakah aplikasi ini gratis?',
      en: 'Is BookTracker free to use?',
    },
    answer: {
      id: 'Ya, BookTracker sepenuhnya gratis untuk digunakan.',
      en: 'Yes, BookTracker is completely free to use.',
    },
  },
  {
    id: 'um-2',
    category: { id: 'Umum', en: 'General' },
    question: {
      id: 'Bagaimana cara menghubungi support?',
      en: 'How do I contact customer support?',
    },
    answer: {
      id: 'Buka halaman Contact Support melalui menu navigasi atau klik link di bawah.',
      en: 'Open the Contact Support page from the navigation menu or click the contact link below.',
    },
  },
  {
    id: 'um-3',
    category: { id: 'Umum', en: 'General' },
    question: {
      id: 'Apakah ada aplikasi mobile?',
      en: 'Is there a mobile app available?',
    },
    answer: {
      id: 'Saat ini BookTracker tersedia sebagai web app yang responsif dan bisa diakses dari browser mobile.',
      en: 'Currently, BookTracker is available as a responsive web app optimized for mobile browsers.',
    },
  },
];

const knowledgeBaseArticles = [
  {
    title: { id: 'Panduan Memulai Cepat', en: 'Quickstart Onboarding' },
    readTime: '3 min read',
    icon: Zap,
    color: 'text-amber-600 bg-amber-50',
  },
  {
    title: { id: 'Sinkronisasi Progress Baca', en: 'Reading Progress Sync' },
    readTime: '2 min read',
    icon: BookOpen,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    title: { id: 'Keamanan & Privasi Data', en: 'Security & Data Privacy' },
    readTime: '4 min read',
    icon: ShieldCheck,
    color: 'text-emerald-600 bg-emerald-50',
  },
];

const HelpFAQ: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<'id' | 'en'>(() => {
    return (localStorage.getItem('app_lang') as 'id' | 'en') || 'en';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const initialLang = (localStorage.getItem('app_lang') as 'id' | 'en') || 'en';
    return initialLang === 'id' ? 'Semua' : 'All';
  });

  const changeLang = (newLang: 'id' | 'en') => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
    setSelectedCategory(newLang === 'id' ? 'Semua' : 'All');
  };

  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const categories = useMemo(() => {
    return lang === 'id'
      ? ['Semua', 'Akun', 'Buku & Library', 'Teknis', 'Umum']
      : ['All', 'Account', 'Books & Library', 'Technical', 'General'];
  }, [lang]);

  useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [categories]);

  const slide = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const amount = direction === 'left' ? -150 : 150;
      sliderRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  const filteredFAQs = useMemo(() => {
    return faqData.filter((item) => {
      const catName = lang === 'id' ? item.category.id : item.category.en;
      const allKeyword = lang === 'id' ? 'Semua' : 'All';
      const matchCategory = selectedCategory === allKeyword || catName === selectedCategory;

      const qText = item.question[lang].toLowerCase();
      const aText = item.answer[lang].toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchQuery = !query || qText.includes(query) || aText.includes(query) || catName.toLowerCase().includes(query);
      return matchCategory && matchQuery;
    });
  }, [searchQuery, selectedCategory, lang]);

  const groupedCategories = useMemo(() => {
    const groups: { [key: string]: FAQItem[] } = {};
    filteredFAQs.forEach((item) => {
      const catName = lang === 'id' ? item.category.id : item.category.en;
      if (!groups[catName]) {
        groups[catName] = [];
      }
      groups[catName].push(item);
    });
    return groups;
  }, [filteredFAQs, lang]);

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto px-4 py-6 pb-24 text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-gray-200 transition-colors text-gray-700"
          aria-label="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          {lang === 'id' ? 'Pusat Bantuan & FAQ' : 'Help Center & FAQ'}
        </h1>
        {/* Language Switcher Pill */}
        <div className="flex items-center bg-gray-200/80 rounded-full p-0.5 text-[11px] font-semibold shadow-inner">
          <button
            onClick={() => changeLang('en')}
            className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
              lang === 'en' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => changeLang('id')}
            className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
              lang === 'id' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ID
          </button>
        </div>
      </div>

      {/* Hero / Intro Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white mb-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-2">
          <HelpCircle size={24} className="text-blue-200" />
          <h2 className="text-lg font-bold">
            {lang === 'id' ? 'Ada yang bisa dibantu?' : 'How can we help?'}
          </h2>
        </div>
        <p className="text-xs text-blue-100 leading-relaxed">
          {lang === 'id'
            ? 'Temukan jawaban instan seputar fitur, akun, dan kendala teknis di BookTracker.'
            : 'Find instant answers regarding features, account, and troubleshooting in BookTracker.'}
        </p>

        {/* Search Bar */}
        <div className="relative mt-4">
          <Search size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'id'
                ? 'Cari pertanyaan atau kata kunci...'
                : 'Search questions or keywords...'
            }
            className="w-full pl-10 pr-9 py-2.5 bg-white text-gray-800 text-xs rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Knowledge Base Featured Articles */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {lang === 'id' ? 'Artikel Knowledge Base' : 'Knowledge Base Articles'}
          </h3>
          <span className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate('/guide')}>
            {lang === 'id' ? 'Lihat Semua' : 'View All'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {knowledgeBaseArticles.map((article, i) => {
            const Icon = article.icon;
            return (
              <div
                key={i}
                onClick={() => navigate('/guide')}
                className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-xs hover:border-blue-200 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div className={`w-7 h-7 rounded-lg ${article.color} flex items-center justify-center mb-1.5`}>
                  <Icon size={14} />
                </div>
                <h4 className="text-[10px] font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-blue-600">
                  {article.title[lang]}
                </h4>
                <span className="text-[9px] text-gray-400 mt-1">{article.readTime}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Pills Carousel Slider */}
      <div className="relative mb-6 group/carousel">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => slide('left')}
            aria-label="Slide left"
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:text-blue-600 hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-xs"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => slide('right')}
            aria-label="Slide right"
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:text-blue-600 hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-xs"
          >
            <ChevronRight size={16} />
          </button>
        )}

        <div
          ref={sliderRef}
          onScroll={checkScroll}
          className="-mx-4 px-4 flex items-center space-x-2 overflow-x-auto pb-1.5 pt-0.5 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={(e) => {
                setSelectedCategory(cat);
                e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
              }}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white shadow-sm ring-2 ring-blue-400/30 font-semibold'
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-blue-600 border border-gray-200 shadow-xs'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      {filteredFAQs.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm mb-6">
          <HelpCircle size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-semibold text-gray-700">
            {lang === 'id' ? 'Pertanyaan tidak ditemukan' : 'No questions found'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {lang === 'id'
              ? 'Coba kata kunci lain atau hubungi tim customer service kami.'
              : 'Try different keywords or contact our support team.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory(lang === 'id' ? 'Semua' : 'All');
            }}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-lg transition-colors font-medium"
          >
            {lang === 'id' ? 'Reset Pencarian' : 'Reset Search'}
          </button>
        </div>
      ) : (
        <div className="space-y-6 mb-8">
          {Object.entries(groupedCategories).map(([category, items]) => (
            <div key={category} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 px-1">
                {category}
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {items.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border-b border-gray-100 last:border-none">
                    <AccordionTrigger className="text-left text-xs font-medium text-gray-800 py-3.5 hover:no-underline hover:text-blue-600">
                      {faq.question[lang]}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-gray-600 leading-relaxed pt-1 pb-3">
                      {faq.answer[lang]}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      )}

      {/* Contact Support CTA */}
      <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <MessageSquare size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-800">
              {lang === 'id' ? 'Belum menemukan jawaban?' : 'Still have questions?'}
            </h4>
            <p className="text-[11px] text-gray-500">
              {lang === 'id' ? 'Tim kami siap membantu kendala Anda' : 'Our team is ready to help you'}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/contact')}
          className="flex items-center space-x-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-xl transition-colors shadow-sm"
        >
          <span>{lang === 'id' ? 'Kontak' : 'Contact'}</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default HelpFAQ;
