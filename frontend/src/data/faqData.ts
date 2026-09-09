// FAQ Data for BookTracker Customer Service

export interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  tags?: string[];
}

export const faqCategories = [
  'Semua',
  'Peminjaman',
  'Akun & Profil',
  'Pencarian & Katalog',
  'Teknis & Bantuan',
] as const;

export const faqData: FAQItem[] = [
  // Peminjaman
  {
    id: 1,
    category: 'Peminjaman',
    question: 'Bagaimana cara meminjam buku?',
    answer: 'Untuk meminjam buku: 1) Buka halaman Library atau Discover, 2) Cari buku yang ingin dipinjam, 3) Klik tombol "Read" atau "Add to Library" pada kartu buku, 4) Buku akan otomatis masuk ke daftar Currently Reading Anda. Anda dapat memantau progress membaca di tab Reading.',
    tags: ['meminjam', 'buku', 'library'],
  },
  {
    id: 2,
    category: 'Peminjaman',
    question: 'Berapa lama durasi peminjaman buku?',
    answer: 'Durasi standar peminjaman adalah 14 hari (2 minggu). Sistem akan mengingatkan Anda 2 hari sebelum jatuh tempo melalui notifikasi. Anda dapat memperpanjang masa pinjam hingga 2 kali dengan durasi tambahan 7 hari setiap perpanjangan.',
    tags: ['durasi', 'perpanjangan', 'jatuh tempo'],
  },
  {
    id: 3,
    category: 'Peminjaman',
    question: 'Bagaimana cara mengembalikan buku?',
    answer: 'Untuk mengembalikan buku: 1) Buka tab Reading atau Library, 2) Temukan buku yang ingin dikembalikan, 3) Klik menu 3 titik (⋮) pada kartu buku, 4) Pilih "Mark as Completed" atau "Remove from Library". Anda dapat menambahkan rating dan review sebelum mengembalikan.',
    tags: ['mengembalikan', 'selesai', 'review'],
  },
  {
    id: 4,
    category: 'Peminjaman',
    question: 'Apakah ada batasan jumlah buku yang bisa dipinjam?',
    answer: 'Ya, setiap pengguna dapat meminjam maksimal 5 buku secara bersamaan. Batasan ini bertujuan agar semua anggota mendapat kesempatan yang adil. Untuk menambah buku baru, Anda perlu menyelesaikan atau mengembalikan buku yang sedang dipinjam terlebih dahulu.',
    tags: ['batasan', 'maksimal', 'jumlah'],
  },

  // Akun & Profil
  {
    id: 5,
    category: 'Akun & Profil',
    question: 'Bagaimana cara mengganti kata sandi?',
    answer: 'Untuk mengganti kata sandi: 1) Buka tab Profile, 2) Klik ikon Settings (⚙️) di pojok kanan atas, 3) Pilih menu "Security & Password", 4) Masukkan kata sandi lama dan kata sandi baru (minimal 8 karakter), 5) Klik "Save Changes". Anda akan menerima email konfirmasi perubahan.',
    tags: ['password', 'security', 'settings'],
  },
  {
    id: 6,
    category: 'Akun & Profil',
    question: 'Bagaimana cara mengedit profil saya?',
    answer: 'Untuk mengedit profil: 1) Buka tab Profile, 2) Klik tombol "Edit Profile", 3) Ubah informasi seperti nama, foto profil, bio, atau preferensi genre favorit, 4) Klik "Save" untuk menyimpan perubahan. Foto profil mendukung format JPG, PNG dengan maksimal ukuran 2MB.',
    tags: ['profil', 'edit', 'foto'],
  },
  {
    id: 7,
    category: 'Akun & Profil',
    question: 'Bagaimana cara melihat statistik membaca saya?',
    answer: 'Statistik membaca Anda tersedia di tab Profile. Scroll ke bawah untuk melihat: 1) Total buku yang telah dibaca, 2) Total halaman yang diselesaikan, 3) Streak harian, 4) Genre favorit, 5) Grafik aktivitas membaca per bulan. Data diperbarui secara real-time setiap kali Anda update progress.',
    tags: ['statistik', 'stats', 'reading'],
  },

  // Pencarian & Katalog
  {
    id: 8,
    category: 'Pencarian & Katalog',
    question: 'Bagaimana cara mencari buku tertentu?',
    answer: 'Ada 3 cara mencari buku: 1) Gunakan search bar di halaman Discover dengan mengetik judul, penulis, atau genre, 2) Filter buku berdasarkan kategori di tab Library > Browse, 3) Gunakan fitur advanced search dengan klik ikon filter (⚙️) untuk pencarian spesifik berdasarkan rating, jumlah halaman, atau tahun terbit.',
    tags: ['search', 'cari', 'filter'],
  },
  {
    id: 9,
    category: 'Pencarian & Katalog',
    question: 'Apakah saya bisa menyimpan buku untuk dibaca nanti?',
    answer: 'Ya, Anda dapat menyimpan buku ke dalam "Want to Read" list. Caranya: 1) Temukan buku yang diminati, 2) Klik tombol bookmark (🔖) atau "Want to Read", 3) Buku akan masuk ke Library dengan status "Want to Read". Anda dapat melihat daftar lengkapnya di tab Library > My Books.',
    tags: ['wishlist', 'want to read', 'bookmark'],
  },
  {
    id: 10,
    category: 'Pencarian & Katalog',
    question: 'Bagaimana sistem rekomendasi buku bekerja?',
    answer: 'Sistem rekomendasi kami menggunakan algoritma machine learning yang menganalisis: 1) Riwayat buku yang Anda baca, 2) Rating yang Anda berikan, 3) Genre favorit Anda, 4) Trending buku di komunitas. Semakin banyak Anda berinteraksi dengan aplikasi, rekomendasi akan semakin akurat dan personal.',
    tags: ['rekomendasi', 'trending', 'algoritma'],
  },

  // Teknis & Bantuan
  {
    id: 11,
    category: 'Teknis & Bantuan',
    question: 'Apa yang harus dilakukan jika buku gagal dimuat?',
    answer: 'Jika buku gagal dimuat, coba langkah berikut: 1) Pastikan koneksi internet Anda stabil, 2) Refresh halaman dengan pull-to-refresh atau tekan F5, 3) Bersihkan cache browser (Settings > Privacy > Clear Cache), 4) Logout dan login kembali, 5) Jika masih berlanjut, hubungi tim support melalui Contact Form dengan menyertakan screenshot error.',
    tags: ['error', 'loading', 'troubleshoot'],
  },
  {
    id: 12,
    category: 'Teknis & Bantuan',
    question: 'Apakah aplikasi tersedia di mobile?',
    answer: 'Saat ini BookTracker tersedia sebagai Progressive Web App (PWA) yang dapat diakses melalui browser mobile maupun desktop. Anda dapat "Install" aplikasi ke home screen untuk pengalaman seperti native app. Caranya: buka menu browser (⋮) > "Add to Home Screen" atau "Install App". Versi native iOS dan Android sedang dalam pengembangan.',
    tags: ['mobile', 'pwa', 'install'],
  },
  {
    id: 13,
    category: 'Teknis & Bantuan',
    question: 'Bagaimana cara melaporkan bug atau masalah teknis?',
    answer: 'Untuk melaporkan bug: 1) Klik tombol "Help" di navigation bar, 2) Pilih "Contact Support" atau "Feedback", 3) Pilih kategori "Kendala Bug / Error", 4) Jelaskan masalah secara detail (langkah reproduksi, screenshot, browser/device), 5) Submit form. Tim kami akan merespons dalam 1x24 jam.',
    tags: ['bug', 'report', 'support'],
  },
  {
    id: 14,
    category: 'Teknis & Bantuan',
    question: 'Apakah data saya aman?',
    answer: 'Ya, keamanan data Anda adalah prioritas kami. Kami menggunakan: 1) Enkripsi SSL/TLS untuk semua komunikasi, 2) Password hashing dengan bcrypt, 3) Regular security audits, 4) Backup data harian, 5) Compliance dengan GDPR untuk privasi data. Kami tidak akan membagikan data pribadi Anda kepada pihak ketiga tanpa izin.',
    tags: ['keamanan', 'privasi', 'gdpr'],
  },
];

// Utility functions
export const getCategoryCounts = () => {
  const counts: Record<string, number> = {
    'Semua': faqData.length,
  };
  
  faqData.forEach(item => {
    counts[item.category] = (counts[item.category] || 0) + 1;
  });
  
  return counts;
};

export const filterFAQs = (searchTerm: string, category: string) => {
  return faqData.filter(item => {
    const matchesSearch = 
      searchTerm === '' ||
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = 
      category === 'Semua' || item.category === category;
    
    return matchesSearch && matchesCategory;
  });
};
