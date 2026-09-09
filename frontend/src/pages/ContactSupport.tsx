import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Send, Ticket, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TicketData {
  id: string;
  name: string;
  email: string;
  category: string;
  priority: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function ContactSupport() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "Peminjaman Buku",
    priority: "Normal",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedTicket, setSubmittedTicket] = useState<TicketData | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Nama lengkap wajib diisi";
    if (!formData.email.trim()) {
      errs.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Format email tidak valid";
    }
    if (!formData.subject.trim()) errs.subject = "Subjek kendala wajib diisi";
    if (!formData.message.trim()) {
      errs.message = "Pesan pengaduan wajib diisi";
    } else if (formData.message.length < 15) {
      errs.message = "Jelaskan minimal 15 karakter agar masalah jelas";
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const newTicket: TicketData = {
      id: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
      ...formData,
      status: "Open",
      createdAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    setSubmittedTicket(newTicket);
  };

  const resetForm = () => {
    setSubmittedTicket(null);
    setFormData({
      name: "",
      email: "",
      category: "Peminjaman Buku",
      priority: "Normal",
      subject: "",
      message: "",
    });
  };

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
          Hubungi Layanan Bantuan
        </h1>
        <p className="text-gray-500">
          Kirimkan kendala atau pertanyaan Anda, tim support kami siap membantu.
        </p>
      </div>

      {submittedTicket ? (
        <div className="bg-white border border-green-200 rounded-xl p-8 text-center shadow-sm">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Tiket Berhasil Dibuat!
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Simpan ID tiket Anda untuk melacak status penanganan.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 max-w-sm mx-auto mb-6 text-left border border-gray-100">
            <div className="flex justify-between py-1 text-sm border-b border-gray-200">
              <span className="text-gray-500">ID Tiket:</span>
              <span className="font-bold text-blue-600">{submittedTicket.id}</span>
            </div>
            <div className="flex justify-between py-1 text-sm border-b border-gray-200">
              <span className="text-gray-500">Pelapor:</span>
              <span className="font-medium text-gray-700">{submittedTicket.name}</span>
            </div>
            <div className="flex justify-between py-1 text-sm border-b border-gray-200">
              <span className="text-gray-500">Kategori:</span>
              <span className="font-medium text-gray-700">{submittedTicket.category}</span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span className="text-gray-500">Status:</span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700">
                {submittedTicket.status}
              </span>
            </div>
          </div>

          <button
            onClick={resetForm}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Buat Tiket Baru
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="cth. Dwi Namber"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="nama@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori Masalah
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
              >
                <option>Peminjaman Buku</option>
                <option>Akses Akun / Login</option>
                <option>Katalog & Pencarian</option>
                <option>Kendala Bug / Error</option>
                <option>Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tingkat Urgensi
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
              >
                <option>Rendah</option>
                <option>Normal</option>
                <option>Tinggi (Mendesak)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subjek Kendala
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="cth. Buku tidak bisa diklik untuk dipinjam"
            />
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi Masalah
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="Ceritakan kronologi kendala secara mendetail..."
            />
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition text-sm shadow"
          >
            <Send size={16} />
            Kirim Pengaduan
          </button>
        </form>
      )}
    </div>
  );
}