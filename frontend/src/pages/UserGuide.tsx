import React, { useState } from "react";
import { BookOpen, Search, BookmarkCheck, ArrowRight, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserGuide() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "1. Temukan Buku Favorit",
      icon: Search,
      desc: "Gunakan kolom pencarian di halaman utama atau filter kategori untuk menemukan buku berdasarkan judul, penulis, maupun genre favorit Anda.",
      tip: "Tips: Manfaatkan tab rekomendasi trending untuk melihat buku paling populer.",
    },
    {
      title: "2. Pinjam & Simpan Koleksi",
      icon: BookOpen,
      desc: "Klik tombol 'Pinjam' pada kartu buku. Buku akan otomatis masuk ke rak 'Currently Reading' Anda.",
      tip: "Tips: Masa peminjaman standar berlaku selama 14 hari.",
    },
    {
      title: "3. Pantau Progres Membaca",
      icon: BookmarkCheck,
      desc: "Perbarui halaman yang telah Anda baca secara berkala pada menu Reading Stats untuk melihat kemajuan membaca Anda.",
      tip: "Tips: Menyelesaikan target mingguan akan meningkatkan statistik profil.",
    },
  ];

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

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Panduan Penggunaan Aplikasi
        </h1>
        <p className="text-gray-500">
          Pelajari langkah mudah memulai pengalaman membaca Anda di BookTracker.
        </p>
      </div>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                isActive
                  ? "border-blue-600 bg-blue-50/50 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                <span className={`text-xs font-semibold uppercase ${isActive ? "text-blue-600" : "text-gray-400"}`}>
                  Langkah {idx + 1}
                </span>
              </div>
              <span className={`text-sm font-medium ${isActive ? "text-gray-900" : "text-gray-600"}`}>
                {step.title.split(". ")[1]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail Step Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            {React.createElement(steps[activeStep].icon, { size: 22 })}
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {steps[activeStep].title}
          </h2>
        </div>

        <p className="text-gray-600 text-base leading-relaxed mb-6">
          {steps[activeStep].desc}
        </p>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-8">
          <p className="text-amber-800 text-sm font-medium">
            {steps[activeStep].tip}
          </p>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <button
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prev) => prev - 1)}
            className="px-4 py-2 border rounded-lg text-sm text-gray-600 disabled:opacity-40 hover:bg-gray-50"
          >
            Sebelumnya
          </button>
          {activeStep < steps.length - 1 ? (
            <button
              onClick={() => setActiveStep((prev) => prev + 1)}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700"
            >
              Langkah Selanjutnya <ArrowRight size={16} />
            </button>
          ) : (
            <span className="text-sm font-medium text-green-600 flex items-center gap-1.5">
              <CheckCircle size={18} /> Siap Membaca!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}