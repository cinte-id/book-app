import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageSquareHeart,
  Send,
  Star,
  Clock,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import StarRating from '@/components/customer-service/StarRating';
import { Badge } from '@/components/ui/badge';

interface FeedbackItem {
  id: string;
  rating: number;
  category: string;
  comment: string;
  createdAt: string;
}

const STORAGE_KEY = 'feedbacks';

const Feedback: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<'id' | 'en'>(() => {
    return (localStorage.getItem('app_lang') as 'id' | 'en') || 'en';
  });

  const changeLang = (newLang: 'id' | 'en') => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  // Form states
  const [rating, setRating] = useState<number>(0);
  const [category, setCategory] = useState<string>('UI/UX');
  const [comment, setComment] = useState<string>('');

  // Validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // List of feedbacks
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFeedbacks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse feedbacks', e);
      }
    }
  }, []);

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (rating === 0) {
      errs.rating = lang === 'en' ? 'Please select a star rating (1 - 5)' : 'Pilih rating bintang terlebih dahulu (1 - 5)';
    }

    if (!comment.trim()) {
      errs.comment = lang === 'en' ? 'Comment/feedback is required' : 'Komentar/saran wajib diisi';
    } else if (comment.trim().length < 10) {
      errs.comment = lang === 'en' ? 'Comment must be at least 10 characters' : 'Komentar minimal 10 karakter';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error(lang === 'en' ? 'Please complete the feedback form correctly' : 'Mohon lengkapi formulir feedback dengan benar');
      return;
    }

    const newFeedback: FeedbackItem = {
      id: `FB-${Date.now()}`,
      rating,
      category,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [newFeedback, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    toast.success(
      lang === 'en'
        ? 'Thank you! Your feedback is highly appreciated.'
        : 'Terima kasih! Feedback Anda sangat berharga bagi kami.'
    );

    // Reset
    setRating(0);
    setCategory('UI/UX');
    setComment('');
    setErrors({});
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'UI/UX':
        return 'UI/UX';
      case 'Fitur':
      case 'Features':
        return lang === 'en' ? 'Features' : 'Fitur';
      case 'Performa':
      case 'Performance':
        return lang === 'en' ? 'Performance' : 'Performa';
      case 'Konten':
      case 'Content':
        return lang === 'en' ? 'Content' : 'Konten';
      case 'Lainnya':
      case 'Other':
        return lang === 'en' ? 'Other' : 'Lainnya';
      default:
        return cat;
    }
  };

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'UI/UX':
        return 'bg-purple-100 text-purple-700';
      case 'Fitur':
      case 'Features':
        return 'bg-blue-100 text-blue-700';
      case 'Performa':
      case 'Performance':
        return 'bg-amber-100 text-amber-700';
      case 'Konten':
      case 'Content':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto px-4 py-6 pb-24 text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-gray-200 transition-colors text-gray-700"
          aria-label={lang === 'en' ? 'Back' : 'Kembali'}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          {lang === 'en' ? 'Feedback & Reviews' : 'Feedback & Saran'}
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

      {/* Hero Card */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-2xl p-5 text-white mb-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <MessageSquareHeart size={22} className="text-pink-200" />
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">
            {lang === 'en' ? 'User Voice' : 'Suara Pengguna'}
          </span>
        </div>
        <h2 className="text-lg font-bold">
          {lang === 'en' ? 'Help Us Improve' : 'Bantu Kami Berkembang'}
        </h2>
        <p className="text-xs text-blue-100 leading-relaxed mt-1">
          {lang === 'en'
            ? 'Your suggestions and reviews mean everything in making BookTracker better every single day.'
            : 'Pendapat dan saran Anda sangat berarti untuk membuat BookTracker menjadi lebih baik setiap harinya.'}
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div className="text-center py-2 bg-gray-50 rounded-xl border border-gray-100">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              {lang === 'en'
                ? 'How was your experience with BookTracker?'
                : 'Bagaimana pengalaman Anda memakai BookTracker?'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex justify-center items-center py-1">
              <StarRating
                rating={rating}
                onRatingChange={(newVal) => {
                  setRating(newVal);
                  if (errors.rating) setErrors({ ...errors, rating: '' });
                }}
                size={30}
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1 font-medium">
              {rating === 1 && (lang === 'en' ? 'Poor' : 'Sangat Kurang')}
              {rating === 2 && (lang === 'en' ? 'Needs Improvement' : 'Kurang Memuaskan')}
              {rating === 3 && (lang === 'en' ? 'Good' : 'Cukup Baik')}
              {rating === 4 && (lang === 'en' ? 'Very Good' : 'Sangat Bagus')}
              {rating === 5 && (lang === 'en' ? 'Outstanding' : 'Luar Biasa Memuaskan')}
              {rating === 0 && (lang === 'en' ? 'Tap a star to rate' : 'Ketuk bintang untuk memberi nilai')}
            </p>
            {errors.rating && (
              <p className="text-[11px] text-red-500 mt-1 flex items-center justify-center space-x-1">
                <AlertCircle size={12} />
                <span>{errors.rating}</span>
              </p>
            )}
          </div>

          {/* Kategori Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {lang === 'en' ? 'Feedback Category' : 'Kategori Feedback'}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="UI/UX">{lang === 'en' ? 'Design & Usability (UI/UX)' : 'Tampilan & Kemudahan (UI/UX)'}</option>
              <option value="Fitur">{lang === 'en' ? 'New Features & Functionality' : 'Fitur Baru & Fungsionalitas'}</option>
              <option value="Performa">{lang === 'en' ? 'Speed & Performance' : 'Kecepatan & Performa'}</option>
              <option value="Konten">{lang === 'en' ? 'Catalog & Book Content' : 'Katalog & Konten Buku'}</option>
              <option value="Lainnya">{lang === 'en' ? 'Other' : 'Lainnya'}</option>
            </select>
          </div>

          {/* Komentar */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {lang === 'en' ? 'Your Feedback & Comments' : 'Saran & Masukan Anda'} <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                if (errors.comment) setErrors({ ...errors, comment: '' });
              }}
              placeholder={
                lang === 'en'
                  ? 'Share your experience or features you would like to see next (min. 10 characters)...'
                  : 'Ceritakan pengalaman Anda atau fitur apa yang ingin Anda lihat selanjutnya (minimal 10 karakter)...'
              }
              className={`w-full text-xs px-3.5 py-2.5 bg-gray-50 rounded-xl border transition-all focus:outline-none focus:ring-2 resize-none ${
                errors.comment
                  ? 'border-red-400 focus:ring-red-300 bg-red-50/30'
                  : 'border-gray-200 focus:ring-blue-500 focus:bg-white'
              }`}
            />
            {errors.comment && (
              <p className="text-[11px] text-red-500 mt-1 flex items-center space-x-1">
                <AlertCircle size={12} />
                <span>{errors.comment}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center space-x-2 active:scale-[0.99] cursor-pointer"
          >
            <Send size={14} />
            <span>{lang === 'en' ? 'Submit Feedback' : 'Kirim Masukan'}</span>
          </button>
        </form>
      </div>

      {/* Feedback Sebelumnya Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-800 flex items-center space-x-2">
          <Sparkles size={16} className="text-amber-500" />
          <span>{lang === 'en' ? `Previous Feedback (${feedbacks.length})` : `Feedback Sebelumnya (${feedbacks.length})`}</span>
        </h2>

        {feedbacks.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
            <MessageSquareHeart size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-xs font-semibold text-gray-700">
              {lang === 'en' ? 'No feedback submitted yet' : 'Belum ada feedback yang dikirim'}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {lang === 'en'
                ? 'Your feedback will appear here once submitted.'
                : 'Masukan Anda akan tampil di daftar ini setelah berhasil dikirim.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {feedbacks.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <StarRating rating={item.rating} readonly size={16} />
                  <span className="flex items-center space-x-1 text-[10px] text-gray-400">
                    <Clock size={11} />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${getCategoryBadgeClass(
                      item.category
                    )}`}
                  >
                    {getCategoryLabel(item.category)}
                  </span>
                </div>

                <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100 leading-relaxed">
                  {item.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
