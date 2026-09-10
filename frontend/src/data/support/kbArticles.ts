// Knowledge base articles for BookTracker customer service.
// Long-form guides grouped by category, complements the short Q&A in faqData.ts.

export interface KBSection {
  heading: string;
  paragraphs: string[];
  steps?: string[];
}

export interface KBArticle {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  updatedAt: string;
  readMinutes: number;
  sections: KBSection[];
}

export const kbCategories = [
  'Semua',
  'Memulai',
  'Katalog & Pencarian',
  'Akun & Profil',
  'Teknis & Bantuan',
] as const;

export const kbArticles: KBArticle[] = [
  {
    slug: 'cara-meminjam-buku',
    category: 'Memulai',
    title: 'Cara meminjam buku pertama Anda',
    excerpt: 'Dari mencari buku sampai masuk ke rak Currently Reading dalam 4 langkah.',
    updatedAt: 'Sep 2026',
    readMinutes: 3,
    sections: [
      {
        heading: 'Langkah meminjam',
        paragraphs: [
          'Peminjaman di BookTracker dirancang agar selesai dalam hitungan detik. Buku yang dipinjam otomatis masuk ke daftar Currently Reading dan progresnya terlacak sendiri.',
        ],
        steps: [
          'Buka halaman Library atau Discover.',
          'Cari buku lewat kolom pencarian atau filter kategori.',
          'Klik tombol "Read" atau "Add to Library" pada kartu buku.',
          'Buku masuk ke Currently Reading. Pantau progres di tab Reading.',
        ],
      },
      {
        heading: 'Durasi dan batasan',
        paragraphs: [
          'Durasi standar peminjaman adalah 14 hari. Sistem mengingatkan Anda 2 hari sebelum jatuh tempo, dan masa pinjam bisa diperpanjang 2 kali (masing-masing 7 hari). Setiap pengguna dapat meminjam maksimal 5 buku bersamaan agar semua anggota mendapat kesempatan yang adil.',
        ],
      },
    ],
  },
  {
    slug: 'mengembalikan-buku',
    category: 'Memulai',
    title: 'Mengembalikan buku dan memberi rating',
    excerpt: 'Tandai buku selesai, beri rating, dan bebaskan slot pinjaman Anda.',
    updatedAt: 'Sep 2026',
    readMinutes: 2,
    sections: [
      {
        heading: 'Langkah mengembalikan',
        paragraphs: [
          'Buku yang dikembalikan akan keluar dari slot pinjaman sehingga Anda bisa meminjam buku baru.',
        ],
        steps: [
          'Buka tab Reading atau Library.',
          'Temukan buku yang ingin dikembalikan.',
          'Klik menu tiga titik (⋮) pada kartu buku.',
          'Pilih "Mark as Completed" atau "Remove from Library".',
        ],
      },
      {
        heading: 'Rating dan review',
        paragraphs: [
          'Sebelum mengembalikan, Anda dapat menambahkan rating dan review singkat. Rating Anda melatih sistem rekomendasi agar saran buku berikutnya semakin personal.',
        ],
      },
    ],
  },
  {
    slug: 'mencari-dan-menyimpan-buku',
    category: 'Katalog & Pencarian',
    title: 'Mencari buku dan menyimpan Want to Read',
    excerpt: 'Tiga cara menemukan buku plus menyimpan daftar bacaan nanti.',
    updatedAt: 'Sep 2026',
    readMinutes: 3,
    sections: [
      {
        heading: 'Tiga cara mencari',
        paragraphs: ['Pilih cara yang paling cocok dengan kebutuhan Anda.'],
        steps: [
          'Search bar di Discover: ketik judul, penulis, atau genre.',
          'Filter kategori di Library > Browse untuk menjelajah per genre.',
          'Advanced search (ikon filter) untuk kriteria spesifik: rating, jumlah halaman, tahun terbit.',
        ],
      },
      {
        heading: 'Simpan untuk dibaca nanti',
        paragraphs: [
          'Klik tombol bookmark atau "Want to Read" pada buku yang diminati. Buku tersimpan di Library dengan status tersebut dan bisa dilihat kapan saja di tab Library > My Books.',
        ],
      },
      {
        heading: 'Cara kerja rekomendasi',
        paragraphs: [
          'Sistem rekomendasi menganalisis riwayat bacaan, rating, genre favorit, dan tren komunitas. Semakin aktif Anda berinteraksi, semakin akurat rekomendasinya.',
        ],
      },
    ],
  },
  {
    slug: 'mengelola-akun-dan-statistik',
    category: 'Akun & Profil',
    title: 'Mengelola akun dan membaca statistik Anda',
    excerpt: 'Ganti password, edit profil, dan pahami Reading Stats.',
    updatedAt: 'Sep 2026',
    readMinutes: 4,
    sections: [
      {
        heading: 'Mengganti kata sandi',
        paragraphs: ['Ganti password secara berkala untuk menjaga keamanan akun.'],
        steps: [
          'Buka tab Profile.',
          'Klik ikon Settings (⚙️) di pojok kanan atas.',
          'Pilih menu "Security & Password".',
          'Masukkan kata sandi lama dan baru (minimal 8 karakter), lalu simpan.',
        ],
      },
      {
        heading: 'Mengedit profil',
        paragraphs: [
          'Lewat tombol "Edit Profile" Anda bisa mengubah nama, foto profil (JPG/PNG, maks 2MB), bio, dan preferensi genre favorit.',
        ],
      },
      {
        heading: 'Membaca statistik',
        paragraphs: [
          'Scroll ke bawah di tab Profile untuk melihat total buku selesai, total halaman, streak harian, genre favorit, dan grafik aktivitas bulanan. Data diperbarui real-time setiap kali progres di-update.',
        ],
      },
    ],
  },
  {
    slug: 'mengatasi-buku-gagal-dimuat',
    category: 'Teknis & Bantuan',
    title: 'Mengatasi buku yang gagal dimuat',
    excerpt: 'Urutan perbaikan mandiri sebelum menghubungi support.',
    updatedAt: 'Sep 2026',
    readMinutes: 3,
    sections: [
      {
        heading: 'Perbaikan mandiri berurutan',
        paragraphs: [
          'Ikuti langkah ini berurutan. Sebagian besar masalah selesai di tiga langkah pertama.',
        ],
        steps: [
          'Pastikan koneksi internet stabil.',
          'Refresh halaman (pull-to-refresh atau F5).',
          'Bersihkan cache browser (Settings > Privacy > Clear Cache).',
          'Logout lalu login kembali.',
          'Masih gagal? Buat tiket via Contact Support sertakan screenshot error.',
        ],
      },
      {
        heading: 'Melaporkan bug dengan baik',
        paragraphs: [
          'Laporan yang baik mempercepat perbaikan. Sertakan: halaman yang error, langkah reproduksi, pesan error persis, serta browser/perangkat yang dipakai. Pilih kategori "Kendala Bug / Error" agar tiket langsung masuk antrean teknis.',
        ],
      },
    ],
  },
  {
    slug: 'aplikasi-mobile-dan-privasi',
    category: 'Teknis & Bantuan',
    title: 'Aplikasi mobile dan keamanan data',
    excerpt: 'Install PWA di HP dan pahami bagaimana data Anda dilindungi.',
    updatedAt: 'Sep 2026',
    readMinutes: 3,
    sections: [
      {
        heading: 'Install di HP',
        paragraphs: [
          'BookTracker tersedia sebagai Progressive Web App untuk browser mobile maupun desktop. Buka menu browser (⋮) lalu pilih "Add to Home Screen" atau "Install App" untuk pengalaman seperti aplikasi native. Versi native iOS dan Android sedang dikembangkan.',
        ],
      },
      {
        heading: 'Keamanan data Anda',
        paragraphs: [
          'Semua komunikasi memakai enkripsi SSL/TLS, password di-hash dengan bcrypt, data di-backup harian, dan audit keamanan dilakukan berkala. Data pribadi tidak dibagikan ke pihak ketiga tanpa izin, sesuai prinsip privasi GDPR.',
        ],
      },
    ],
  },
];

export const getArticle = (slug: string): KBArticle | undefined =>
  kbArticles.find((a) => a.slug === slug);

export const relatedArticles = (slug: string, limit = 2): KBArticle[] => {
  const current = getArticle(slug);
  if (!current) return [];
  const sameCat = kbArticles.filter(
    (a) => a.slug !== slug && a.category === current.category,
  );
  const rest = kbArticles.filter(
    (a) => a.slug !== slug && a.category !== current.category,
  );
  return [...sameCat, ...rest].slice(0, limit);
};

export const filterArticles = (searchTerm: string, category: string): KBArticle[] => {
  const q = searchTerm.trim().toLowerCase();
  return kbArticles.filter((a) => {
    const matchesCategory = category === 'Semua' || a.category === category;
    const matchesSearch =
      q === '' ||
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.sections.some(
        (s) =>
          s.heading.toLowerCase().includes(q) ||
          s.paragraphs.some((p) => p.toLowerCase().includes(q)),
      );
    return matchesCategory && matchesSearch;
  });
};

export const getKbCategoryCounts = (): Record<string, number> => {
  const counts: Record<string, number> = { Semua: kbArticles.length };
  kbArticles.forEach((a) => {
    counts[a.category] = (counts[a.category] ?? 0) + 1;
  });
  return counts;
};
