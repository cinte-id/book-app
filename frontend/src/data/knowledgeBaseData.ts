export type KnowledgeBaseArticle = {
  id: string;
  title: {
    en: string;
    id: string;
  };
  category: string;
  description: {
    en: string;
    id: string;
  };
  content: {
    en: string[];
    id: string[];
  };
};

export const knowledgeBaseCategories = [
  "All",
  "Getting Started",
  "Account & Profile",
  "Books & Library",
  "Reading Progress",
  "Troubleshooting",
];

export const knowledgeBaseArticles: KnowledgeBaseArticle[] = [
  {
    id: "getting-started",

    title: {
      en: "Getting Started with Book App",
      id: "Memulai Menggunakan Book App",
    },

    category: "Getting Started",

    description: {
      en: "Learn the basic steps to start using Book App and manage your reading activity.",
      id: "Pelajari langkah-langkah dasar untuk mulai menggunakan Book App dan mengelola aktivitas membaca Anda.",
    },

    content: {
      en: [
        "Book App helps you discover books, manage your personal library, and track your reading progress.",
        "Start by exploring the Discover section to find books that interest you.",
        "You can add books to My Library and organize the books you want to read.",
        "When you start reading a book, use the Reading section to monitor your progress.",
      ],

      id: [
        "Book App membantu Anda menemukan buku, mengelola perpustakaan pribadi, dan memantau progres membaca.",
        "Mulailah dengan menjelajahi bagian Discover untuk menemukan buku yang menarik bagi Anda.",
        "Anda dapat menambahkan buku ke Perpustakaan Saya dan mengatur buku yang ingin Anda baca.",
        "Saat mulai membaca buku, gunakan bagian Reading untuk memantau progres membaca Anda.",
      ],
    },
  },

  {
    id: "manage-profile",

    title: {
      en: "How to Manage Your Profile",
      id: "Cara Mengelola Profil",
    },

    category: "Account & Profile",

    description: {
      en: "Learn how to manage your account information and access support features.",
      id: "Pelajari cara mengelola informasi akun dan mengakses fitur dukungan.",
    },

    content: {
      en: [
        "Open the Profile section from the bottom navigation.",
        "Your profile contains your reading statistics and account-related features.",
        "From the Help & Support section, you can access FAQ, User Guide, My Tickets, Feedback, and Contact Support.",
        "Make sure your account information is kept up to date.",
      ],

      id: [
        "Buka bagian Profile melalui navigasi di bagian bawah.",
        "Profil Anda berisi statistik membaca dan fitur yang berkaitan dengan akun.",
        "Dari bagian Help & Support, Anda dapat mengakses FAQ, Panduan Pengguna, Tiket Saya, Feedback, dan Hubungi Dukungan.",
        "Pastikan informasi akun Anda selalu diperbarui.",
      ],
    },
  },

  {
    id: "add-books",

    title: {
      en: "How to Add Books to Your Library",
      id: "Cara Menambahkan Buku ke Perpustakaan",
    },

    category: "Books & Library",

    description: {
      en: "Learn how to save books to your personal library.",
      id: "Pelajari cara menyimpan buku ke perpustakaan pribadi Anda.",
    },

    content: {
      en: [
        "Open the Discover section and browse the available books.",
        "Select a book that you want to save.",
        "Choose the option to add the book to your library.",
        "The selected book will then appear in the My Library section.",
      ],

      id: [
        "Buka bagian Discover dan jelajahi buku yang tersedia.",
        "Pilih buku yang ingin Anda simpan.",
        "Pilih opsi untuk menambahkan buku ke perpustakaan Anda.",
        "Buku yang dipilih kemudian akan muncul di bagian Perpustakaan Saya.",
      ],
    },
  },

  {
    id: "reading-progress",

    title: {
      en: "How to Track Reading Progress",
      id: "Cara Melacak Progres Membaca",
    },

    category: "Reading Progress",

    description: {
      en: "Learn how to monitor your reading activity and progress.",
      id: "Pelajari cara memantau aktivitas dan progres membaca Anda.",
    },

    content: {
      en: [
        "Open the Reading section from the bottom navigation.",
        "The Currently Reading section displays books that you are currently reading.",
        "Your reading progress is displayed for each book.",
        "Use this information to keep track of your reading activity.",
      ],

      id: [
        "Buka bagian Reading melalui navigasi di bagian bawah.",
        "Bagian Sedang Dibaca menampilkan buku yang sedang Anda baca.",
        "Progres membaca Anda ditampilkan untuk setiap buku.",
        "Gunakan informasi tersebut untuk memantau aktivitas membaca Anda.",
      ],
    },
  },

  {
    id: "troubleshooting",

    title: {
      en: "Application Troubleshooting",
      id: "Pemecahan Masalah Aplikasi",
    },

    category: "Troubleshooting",

    description: {
      en: "Basic troubleshooting steps when the application is not working properly.",
      id: "Langkah-langkah dasar untuk mengatasi masalah ketika aplikasi tidak berfungsi dengan baik.",
    },

    content: {
      en: [
        "First, check your internet connection and make sure it is working properly.",
        "Try refreshing or reopening the application.",
        "If the problem continues, check whether other features of the application are working.",
        "If you still need assistance, create a support ticket through Contact Support.",
      ],

      id: [
        "Pertama, periksa koneksi internet Anda dan pastikan koneksi berfungsi dengan baik.",
        "Coba muat ulang atau buka kembali aplikasi.",
        "Jika masalah masih terjadi, periksa apakah fitur aplikasi lainnya dapat digunakan.",
        "Jika masih membutuhkan bantuan, buat tiket dukungan melalui Hubungi Dukungan.",
      ],
    },
  },

  {
    id: "support-ticket",

    title: {
      en: "How to Create a Support Ticket",
      id: "Cara Membuat Tiket Dukungan",
    },

    category: "Getting Started",

    description: {
      en: "Learn how to report problems or request assistance from the customer service team.",
      id: "Pelajari cara melaporkan masalah atau meminta bantuan dari tim customer service.",
    },

    content: {
      en: [
        "Open Profile and select Contact Support.",
        "Fill in your name, email address, category, priority, subject, and description.",
        "Describe your problem clearly so the support team can understand the issue.",
        "Submit the form to create your support ticket.",
        "You can track your ticket from the My Tickets section.",
      ],

      id: [
        "Buka Profile dan pilih Hubungi Dukungan.",
        "Isi nama, alamat email, kategori, prioritas, subjek, dan deskripsi.",
        "Jelaskan masalah Anda dengan jelas agar tim dukungan dapat memahami masalah tersebut.",
        "Kirim formulir untuk membuat tiket dukungan.",
        "Anda dapat melacak tiket melalui bagian Tiket Saya.",
      ],
    },
  },
];

