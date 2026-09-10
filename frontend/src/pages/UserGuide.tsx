import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  UserPlus,
  BookOpen,
  TrendingUp,
  Search,
  BarChart3,
  BookCheck,
  Sparkles,
} from 'lucide-react';

interface GuideStep {
  step: number;
  title: { id: string; en: string };
  icon: React.ElementType;
  bgClass: string;
  borderClass: string;
  iconBgClass: string;
  iconColorClass: string;
  badgeClass: string;
  paragraphs: { id: string[]; en: string[] };
}

const guideSteps: GuideStep[] = [
  {
    step: 1,
    title: {
      id: 'Memulai & Akun',
      en: 'Getting Started & Account',
    },
    icon: UserPlus,
    bgClass: 'bg-blue-50/70',
    borderClass: 'border-blue-100',
    iconBgClass: 'bg-blue-100',
    iconColorClass: 'text-blue-600',
    badgeClass: 'bg-blue-600 text-white',
    paragraphs: {
      id: [
        'Untuk mulai menggunakan BookTracker, buat akun baru dengan mengklik tombol "Sign Up" di halaman utama. Masukkan alamat email aktif dan password yang kuat.',
        'Setelah pendaftaran berhasil, lakukan verifikasi melalui tautan yang dikirimkan ke email Anda. Anda kemudian dapat langsung masuk dan mulai mengatur preferensi membaca pribadi Anda.',
        'Pastikan untuk melengkapi profil membaca Anda agar BookTracker dapat memberikan rekomendasi buku yang lebih akurat sesuai minat Anda.',
      ],
      en: [
        'To begin using BookTracker, create a new account by clicking the "Sign Up" button on the main page. Enter your active email address and a strong password.',
        'After registering, verify your email via the confirmation link sent to your inbox. Once verified, you can immediately log in and customize your reading preferences.',
        'Make sure to complete your reader profile so BookTracker can recommend personalized book suggestions matching your interests.',
      ],
    },
  },
  {
    step: 2,
    title: {
      id: 'Mengelola Library',
      en: 'Managing Your Library',
    },
    icon: BookOpen,
    bgClass: 'bg-emerald-50/70',
    borderClass: 'border-emerald-100',
    iconBgClass: 'bg-emerald-100',
    iconColorClass: 'text-emerald-600',
    badgeClass: 'bg-emerald-600 text-white',
    paragraphs: {
      id: [
        'Tab Library adalah tempat Anda menyimpan seluruh koleksi buku pribadi. Anda dapat mengkategorikan buku ke dalam status: Belum Dibaca (Unread), Sedang Dibaca (Reading), atau Selesai (Completed).',
        'Untuk menambahkan buku baru ke dalam library, klik tombol tambah (+) di bagian pojok kanan atas tab Library. Anda dapat mencari judul buku yang tersedia atau memasukkan detail buku secara manual.',
        'Jika ingin menghapus atau mengubah informasi buku, buka detail buku tersebut dari daftar library Anda, lalu pilih opsi edit atau hapus dari koleksi.',
      ],
      en: [
        'The Library tab is where your personal book collection is organized. You can categorize books into three statuses: Unread, Reading, or Completed.',
        'To add a new book to your library, click the plus (+) button at the top right of the Library screen. You can search existing titles or input book details manually.',
        'To edit or delete books from your collection, tap the book card in your library list and choose the edit or delete options.',
      ],
    },
  },
  {
    step: 3,
    title: {
      id: 'Tracking Progress Bacaan',
      en: 'Tracking Reading Progress',
    },
    icon: TrendingUp,
    bgClass: 'bg-purple-50/70',
    borderClass: 'border-purple-100',
    iconBgClass: 'bg-purple-100',
    iconColorClass: 'text-purple-600',
    badgeClass: 'bg-purple-600 text-white',
    paragraphs: {
      id: [
        'Buka tab Reading untuk memantau buku apa saja yang sedang aktif Anda baca saat ini. Anda bisa mencatat nomor halaman terakhir yang dibaca setiap hari.',
        'Aplikasi akan menghitung persentase progres secara otomatis dan memperkirakan waktu selesai berdasarkan kecepatan membaca harian Anda.',
        'Tandai buku sebagai "Selesai" ketika Anda telah menuntaskan bacaan, dan jangan lupa untuk memberikan ulasan serta rating bintang.',
      ],
      en: [
        'Open the Reading tab to track your currently active books. Log your latest completed page number each day to keep progress up to date.',
        'The app automatically calculates your reading percentage and estimates completion times based on your daily reading velocity.',
        'Mark books as "Completed" once finished, and share your thoughts by leaving ratings and reviews.',
      ],
    },
  },
  {
    step: 4,
    title: {
      id: 'Discover & Search Buku',
      en: 'Discover & Search Books',
    },
    icon: Search,
    bgClass: 'bg-amber-50/70',
    borderClass: 'border-amber-100',
    iconBgClass: 'bg-amber-100',
    iconColorClass: 'text-amber-600',
    badgeClass: 'bg-amber-600 text-white',
    paragraphs: {
      id: [
        'Gunakan tab Discover untuk menjelajahi ribuan katalog buku baru dari berbagai genre, seperti Fiksi, Non-Fiksi, Sains, Sejarah, hingga Pengembangan Diri.',
        'Ketik judul buku, nama penulis, atau topik spesifik pada bilah pencarian di bagian atas untuk menemukan karya favorit Anda secara instan.',
        'Klik pada kartu buku untuk melihat sinopsis lengkap, rating pembaca lain, dan langsung menyimpannya ke daftar "Ingin Dibaca" Anda.',
      ],
      en: [
        'Use the Discover tab to explore thousands of curated titles across genres like Fiction, Non-Fiction, Science, History, and Self-Improvement.',
        'Type any title, author, or keyword in the top search bar to find your favorite books instantly.',
        'Tap on any book card to read full synopses, view community reviews, and add titles to your "Want to Read" shelf with a single click.',
      ],
    },
  },
  {
    step: 5,
    title: {
      id: 'Profil & Statistik',
      en: 'Profile & Reading Analytics',
    },
    icon: BarChart3,
    bgClass: 'bg-pink-50/70',
    borderClass: 'border-pink-100',
    iconBgClass: 'bg-pink-100',
    iconColorClass: 'text-pink-600',
    badgeClass: 'bg-pink-600 text-white',
    paragraphs: {
      id: [
        'Kunjungi tab Profile untuk melihat rangkuman performa membaca Anda sepanjang bulan maupun tahun ini.',
        'Pantau reading streak harian, total halaman yang telah dibaca, serta pencapaian lencana (badges) yang berhasil Anda buka seiring bertambahnya buku yang Anda selesaikan.',
        'Anda juga dapat menetapkan target membaca tahunan (misal: 20 buku setahun) dan membagikan progres pencapaian Anda ke teman-teman.',
      ],
      en: [
        'Visit your Profile tab to see a comprehensive breakdown of your reading performance throughout the month and year.',
        'Track daily reading streaks, total pages read, and achievements/badges unlocked as you complete more books.',
        'Set annual reading goals (e.g. 20 books per year) and celebrate milestones with friends.',
      ],
    },
  },
];

const UserGuide: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<'id' | 'en'>(() => {
    return (localStorage.getItem('app_lang') as 'id' | 'en') || 'en';
  });

  const changeLang = (newLang: 'id' | 'en') => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto px-4 py-6 pb-24 text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-gray-200 transition-colors text-gray-700 cursor-pointer"
          aria-label={lang === 'en' ? 'Back' : 'Kembali'}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          {lang === 'en' ? 'User Guide' : 'Panduan Pengguna'}
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

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-5 text-white mb-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles size={20} className="text-yellow-300" />
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">
            {lang === 'en' ? 'BookTracker Tutorials' : 'Tutorial BookTracker'}
          </span>
        </div>
        <h2 className="text-lg font-bold">
          {lang === 'en' ? 'Getting the Most Out of BookTracker' : 'Panduan Pengguna BookTracker'}
        </h2>
        <p className="text-xs text-blue-100 leading-relaxed mt-1">
          {lang === 'en'
            ? 'Learn step-by-step how to optimize your reading workflow, organize your library, and track daily habits seamlessly.'
            : 'Pelajari langkah demi langkah cara mengoptimalkan seluruh fitur membaca di BookTracker agar pengalaman membacamu lebih teratur dan menyenangkan.'}
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-4 mb-8">
        {guideSteps.map((guide) => {
          const Icon = guide.icon;
          return (
            <div
              key={guide.step}
              className={`rounded-2xl p-5 border ${guide.bgClass} ${guide.borderClass} shadow-sm transition-all hover:shadow-md`}
            >
              {/* Header Step */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${guide.iconBgClass} ${guide.iconColorClass} flex items-center justify-center font-bold`}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      {lang === 'en' ? `Step ${guide.step}` : `Langkah ${guide.step}`}
                    </span>
                    <h3 className="text-sm font-bold text-gray-800">{guide.title[lang]}</h3>
                  </div>
                </div>
                <span
                  className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${guide.badgeClass}`}
                >
                  {guide.step}
                </span>
              </div>

              {/* Step Paragraphs */}
              <div className="space-y-2 mt-2 pt-2 border-t border-gray-200/50">
                {guide.paragraphs[lang].map((p, idx) => (
                  <p key={idx} className="text-xs text-gray-600 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Support Card */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
        <BookCheck size={32} className="mx-auto text-blue-500 mb-2" />
        <h3 className="text-xs font-bold text-gray-800">
          {lang === 'en' ? 'Still need assistance?' : 'Masih membutuhkan bantuan?'}
        </h3>
        <p className="text-[11px] text-gray-500 mt-1 mb-4">
          {lang === 'en'
            ? 'Check our FAQ knowledge base or reach out directly to customer support.'
            : 'Cek halaman Tanya Jawab kami atau hubungi tim customer service.'}
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/help')}
            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {lang === 'en' ? 'Browse FAQ' : 'Lihat FAQ'}
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            {lang === 'en' ? 'Contact Support' : 'Hubungi Support'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
