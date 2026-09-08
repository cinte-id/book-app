export type Language = "en" | "id";

export const languages: Language[] = ["en", "id"];

export const translations = {
  en: {
    nav: {
      home: "Home",
      library: "Library",
      discover: "Discover",
      reading: "Reading",
      profile: "Profile",
      support: "Support",
    },
    help: {
      title: "Help Center",
      subtitle: "Search our FAQs or follow step-by-step guides.",
      searchPlaceholder: "Search for answers...",
      noResults: "No results found for",
      tutorials: "User Guides",
    },
    contact: {
      title: "Contact Us",
      subtitle: "Have a question or feedback? We'd love to hear from you.",
      contactSupport: "Contact Support",
      contactDescription: "Our team will respond within 24 hours.",
      sendFeedback: "Send Feedback",
      feedbackDescription: "Help us improve the app with your suggestions.",
    },
    dashboard: {
      title: "Support Dashboard",
      subtitle: "Track and manage customer support tickets.",
    },
    chat: {
      title: "Live Chat",
      greeting: "Hi there! How can we help you today?",
      placeholder: "Type a message...",
    },
  },
  id: {
    nav: {
      home: "Beranda",
      library: "Perpustakaan",
      discover: "Jelajah",
      reading: "Bacaan",
      profile: "Profil",
      support: "Bantuan",
    },
    help: {
      title: "Pusat Bantuan",
      subtitle: "Cari jawaban di FAQ atau ikuti panduan langkah demi langkah.",
      searchPlaceholder: "Cari jawaban...",
      noResults: "Tidak ada hasil untuk",
      tutorials: "Panduan Pengguna",
    },
    contact: {
      title: "Hubungi Kami",
      subtitle:
        "Punya pertanyaan atau masukan? Kami akan senang mendengarnya.",
      contactSupport: "Hubungi Dukungan",
      contactDescription: "Tim kami akan membalas dalam 24 jam.",
      sendFeedback: "Kirim Masukan",
      feedbackDescription:
        "Bantu kami meningkatkan aplikasi dengan saran Anda.",
    },
    dashboard: {
      title: "Dasbor Dukungan",
      subtitle: "Pantau dan kelola tiket dukungan pelanggan.",
    },
    chat: {
      title: "Obrolan Langsung",
      greeting: "Halo! Ada yang bisa kami bantu hari ini?",
      placeholder: "Ketik pesan...",
    },
  },
} as const;

export type TranslationKey = keyof typeof translations["en"];