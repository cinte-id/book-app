import React, { useState } from "react";
import { Star, CheckCircle, Send, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FeedbackPage() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("UI/UX & Desain");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      alert("Silakan berikan rating bintang terlebih dahulu.");
      return;
    }
    setSubmitted(true);
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
          Kritik & Saran
        </h1>
        <p className="text-gray-500">
          Pendapat Anda membantu kami menghadirkan pengalaman membaca yang lebih baik.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white border border-green-200 rounded-xl p-8 text-center shadow-sm">
          <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Terima Kasih atas Masukan Anda!
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Saran Anda telah tercatat dan menjadi acuan pengembangan fitur berikutnya.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setRating(0);
              setFeedback("");
            }}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Kirim Masukan Lain
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
          {/* Star Rating */}
          <div className="text-center">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bagaimana kepuasan Anda menggunakan aplikasi ini?
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={`${
                      (hoverRating || rating) >= star
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topik Masukan
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option>UI/UX & Desain</option>
              <option>Fitur Baru</option>
              <option>Performa / Kecepatan</option>
              <option>Laporan Bug</option>
              <option>Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tuliskan Masukan Anda
            </label>
            <textarea
              rows={4}
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Bagikan pengalaman atau fitur yang ingin Anda tambahkan..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm shadow transition"
          >
            <Send size={16} /> Kirim Masukan
          </button>
        </form>
      )}
    </div>
  );
}