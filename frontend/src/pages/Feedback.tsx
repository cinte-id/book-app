import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  Star,
  Heart,
  MessageSquare,
  Send,
  CheckCircle2,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

// Validation schema
const feedbackFormSchema = z.object({
  name: z.string().min(2, 'Minimal 2 karakter').max(50, 'Maksimal 50 karakter'),
  email: z.string().email('Format email tidak valid'),
  category: z.string().min(1, 'Pilih kategori'),
  rating: z.number().min(1, 'Berikan rating minimal 1 bintang'),
  subject: z.string().min(5, 'Minimal 5 karakter').max(100, 'Maksimal 100 karakter'),
  message: z
    .string()
    .min(20, 'Minimal 20 karakter untuk membantu kami memahami')
    .max(1000, 'Maksimal 1000 karakter'),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

interface SubmittedFeedback extends FeedbackFormValues {
  id: string;
  status: string;
  createdAt: string;
}

// Category options with icons and colors
const categoryOptions = [
  {
    value: 'Fitur Baru',
    label: 'Fitur Baru',
    icon: Sparkles,
    color: 'purple',
    description: 'Saran fitur baru atau perbaikan fitur existing',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  {
    value: 'Perbaikan Bug',
    label: 'Perbaikan Bug',
    icon: MessageSquare,
    color: 'red',
    description: 'Lapor error, crash, atau perilaku tidak sesuai',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  {
    value: 'Pengalaman Pengguna',
    label: 'Pengalaman Pengguna (UX)',
    icon: Heart,
    color: 'pink',
    description: 'Saran UI/UX, alur navigasi, kemudahan penggunaan',
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
  },
  {
    value: 'Konten Katalog',
    label: 'Konten Katalog',
    icon: Star,
    color: 'amber',
    description: 'Request buku, genre, penulis, atau metadata',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  {
    value: 'Lainnya',
    label: 'Lainnya',
    icon: MessageSquare,
    color: 'gray',
    description: 'Saran umum di luar kategori di atas',
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
  },
];

const Feedback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submittedFeedback, setSubmittedFeedback] = useState<SubmittedFeedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mountAnimation, setMountAnimation] = useState(false);

  // Trigger mount animation
  useEffect(() => {
    const t = setTimeout(() => setMountAnimation(true), 50);
    return () => clearTimeout(t);
  }, []);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      name: '',
      email: '',
      category: '',
      rating: 0,
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const feedbackId = `FBK-${Math.floor(100000 + Math.random() * 900000)}`;

    const feedback: SubmittedFeedback = {
      ...data,
      id: feedbackId,
      status: 'Received',
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setSubmittedFeedback(feedback);
    setIsSubmitting(false);
    toast({
      title: 'Terima kasih! Saran Anda telah terkirim.',
      description: `ID Feedback: ${feedbackId}`,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setSubmittedFeedback(null);
    form.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryOption = (value: string) =>
    categoryOptions.find((opt) => opt.value === value);

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating bintang">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => form.setValue('rating', star, { shouldValidate: true })}
          className={`p-1 transition-all duration-200 ${
            star <= rating ? 'text-amber-400' : 'text-gray-300'
          } hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded`}
          aria-label={`${star} bintang`}
          aria-checked={star <= rating}
        >
          <Star size={28} className={star <= rating ? 'fill-current' : ''} />
        </button>
      ))}
    </div>
  );

  if (submittedFeedback) {
    const cat = getCategoryOption(submittedFeedback.category);
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="text-center" style={{ animation: mountAnimation ? 'fadeInDown 0.5s ease-out' : 'none' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-3 shadow-lg shadow-green-200" style={{ animation: mountAnimation ? 'scaleIn 0.5s ease-out 0.1s both' : 'none' }}>
                <CheckCircle2 size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ animation: mountAnimation ? 'fadeInUp 0.5s ease-out 0.2s both' : 'none' }}>
                Terima Kasih!
              </h1>
              <p className="text-gray-600 text-sm max-w-xl mx-auto" style={{ animation: mountAnimation ? 'fadeInUp 0.5s ease-out 0.3s both' : 'none' }}>
                Feedback Anda telah kami terima dan akan ditinjau tim kami.
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Success Card */}
          <Card className="border-green-200 shadow-lg" style={{ animation: mountAnimation ? 'slideUp 0.5s ease-out 0.4s both' : 'none' }}>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-green-800">Feedback Berhasil Dikirim</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-2 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="text-2xl font-bold text-green-700">{submittedFeedback.id}</div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  {submittedFeedback.status}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Kategori</span>
                  <span className="font-medium text-gray-900">{submittedFeedback.category}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Rating</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1">
                    {'★'.repeat(submittedFeedback.rating)}
                    <span className="text-amber-500">{submittedFeedback.rating}/5</span>
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subjek</span>
                  <span className="font-medium text-gray-900 truncate max-w-[200px]">{submittedFeedback.subject}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Waktu</span>
                  <span className="font-medium text-gray-900">{submittedFeedback.createdAt}</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-1">Deskripsi:</p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{submittedFeedback.message}</p>
              </div>

              <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-800">
                  Tim kami akan meninjau saran Anda. Update status akan dikirim ke email Anda.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <MessageSquare size={18} />
                  <span>Kirim Feedback Lain</span>
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                >
                  <ArrowLeft size={18} />
                  <span>Kembali ke Home</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-3 gap-4 mt-6" style={{ animation: mountAnimation ? 'fadeInUp 0.5s ease-out 0.6s both' : 'none' }}>
            <a
              href="/help"
              className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-purple-300 transition-all text-center group"
            >
              <Sparkles size={24} className="text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">Fitur Baru</p>
              <p className="text-xs text-gray-500 mt-1">Lihat saran fitur lain</p>
            </a>
            <a
              href="/contact"
              className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-red-300 transition-all text-center group"
            >
              <MessageSquare size={24} className="text-red-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">Lapor Bug</p>
              <p className="text-xs text-gray-500 mt-1">Butuh bantuan teknis?</p>
            </a>
            <a
              href="/guide"
              className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-amber-300 transition-all text-center group"
            >
              <Heart size={24} className="text-amber-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">Panduan</p>
              <p className="text-xs text-gray-500 mt-1">Pelajari fitur aplikasi</p>
            </a>
          </div>
        </div>

        <style>{`
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100 mb-4"
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </button>

          <div className="text-center" style={{ animation: mountAnimation ? 'fadeInDown 0.5s ease-out' : 'none' }}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-3 shadow-lg shadow-purple-200" style={{ animation: mountAnimation ? 'scaleIn 0.5s ease-out 0.1s both' : 'none' }}>
              <MessageSquare size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ animation: mountAnimation ? 'fadeInUp 0.5s ease-out 0.2s both' : 'none' }}>
              Berikan Saran
            </h1>
            <p className="text-gray-600 text-sm max-w-xl mx-auto" style={{ animation: mountAnimation ? 'fadeInUp 0.5s ease-out 0.3s both' : 'none' }}>
              Bantu kami memperbaiki BookTracker dengan masukan Anda
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" style={{ animation: mountAnimation ? 'fadeInUp 0.6s ease-out 0.3s both' : 'none' }}>
            {/* Name & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nama Anda"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@domain.com"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">Hanya untuk notifikasi status feedback</FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Category Field */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Kategori Saran <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Pilih kategori saran" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${opt.bg}`}>
                              <opt.icon size={18} className={opt.text} />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">{opt.label}</span>
                              <span className="text-xs text-gray-500">{opt.description}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Rating Field */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Rating Pengalaman <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      {renderStars(field.value)}
                      <span className={`text-sm font-medium ${field.value > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                        {field.value > 0 ? `${field.value}/5` : 'Klik bintang untuk rating'}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Subject Field */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Subjek Saran <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="cth. Tambahkan fitur dark mode"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">Ringkas saran Anda dalam satu kalimat</FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Message Field */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Detail Saran <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Jelaskan detail saran Anda: apa yang diinginkan, mengapa penting, bagaimana implementasinya, dll..."
                      className="min-h-[140px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="flex items-center justify-between text-xs">
                    <span>Minimal 20 karakter untuk membantu kami memahami</span>
                    <span className={`font-mono ${
                      field.value.length < 20 ? 'text-gray-400' :
                      field.value.length > 1000 ? 'text-red-500' :
                      'text-green-600'
                    }`}>
                      {field.value.length}/1000
                    </span>
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Privacy Notice */}
            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100" style={{ animation: mountAnimation ? 'fadeInUp 0.5s ease-out 0.5s both' : 'none' }}>
              <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-medium text-purple-900">Privasi & Transparansi</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Data hanya untuk analisis feedback. Tidak dibagikan pihak ketiga. Anda bisa request hapus data kapan saja.
                </p>
              </div>
            </div>

            {/* Submit Footer */}
            <div className="bg-gray-50 px-6 sm:px-8 py-6 border-t border-gray-200" style={{ animation: mountAnimation ? 'fadeInUp 0.5s ease-out 0.6s both' : 'none' }}>
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all text-base font-medium disabled:opacity-50"
                disabled={form.formState.isSubmitting || isSubmitting}
              >
                {isSubmitting || form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Kirim Saran
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Feedback;