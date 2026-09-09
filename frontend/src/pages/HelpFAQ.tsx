import React, { useState } from "react";
import { Search, HelpCircle, BookOpen, User, Wrench, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    category: "Peminjaman",
    question: "Bagaimana cara meminjam buku?",
    answer: "Cari buku yang ingin dipinjam pada katalog utama, klik detail buku, lalu tekan tombol 'Pinjam Buku'. Sistem akan otomatis memasukkannya ke daftar bacaan Anda.",
  },
  {
    id: 2,
    category: "Peminjaman",
    question: "Berapa batas durasi peminjaman buku?",
    answer: "Durasi standar peminjaman adalah 14 hari. Anda dapat memperpanjang masa pinjam sebelum jatuh tempo melalui profil akun.",
  },
  {
    id: 3,
    category: "Akun",
    question: "Bagaimana cara mengganti kata sandi?",
    answer: "Masuk ke menu Profil, pilih Pengaturan Akun, lalu masukkan kata sandi lama dan baru pada bagian Keamanan.",
  },
  {
    id: 4,
    category: "Teknis",
    question: "Apa yang harus dilakukan jika buku gagal dimuat?",
    answer: "Pastikan koneksi internet Anda stabil, bersihkan cache browser, atau muat ulang halaman. Jika kendala berlanjut, hubungi tim support.",
  },
];

export default function HelpFAQ() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [openId, setOpenId] = useState<number | null>(null);

  const categories = ["Semua", "Peminjaman", "Akun", "Teknis"];

  const filteredFaqs = faqData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto px-4 py-6">
      {/* Tombol Kembali */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition mb-6 p-2 -ml-2 rounded-lg hover:bg-gray-100"
      >
        <ArrowLeft size={18} />
        <span>Kembali</span>
      </button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Pusat Bantuan & FAQ
        </h1>
        <p className="text-gray-500 mb-4">
          Temukan jawaban cepat seputar penggunaan aplikasi dan layanan kami
        </p>

        {/* Pintasan Navigasi Dukungan */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <Link
            to="/contact"
            className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-100 transition shadow-sm"
          >
            ✉️ Buat Tiket / Hubungi Kami
          </Link>
          <Link
            to="/guide"
            className="px-4 py-2 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg hover:bg-amber-100 transition shadow-sm"
          >
            📖 Panduan Aplikasi
          </Link>
          <Link
            to="/feedback"
            className="px-4 py-2 bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg hover:bg-purple-100 transition shadow-sm"
          >
            ⭐ Berikan Saran
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Cari pertanyaan atau kata kunci..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex justify-between items-center text-left font-semibold text-gray-800"
              >
                <span>{faq.question}</span>
                <span className="text-xl text-gray-400">
                  {openId === faq.id ? "−" : "+"}
                </span>
              </button>
              {openId === faq.id && (
                <p className="mt-3 text-gray-600 text-sm border-t pt-3">
                  {faq.answer}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400">
            Tidak ada pertanyaan yang sesuai dengan pencarian Anda.
          </div>
        )}
      </div>
    </div>
  );
}