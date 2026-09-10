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
  ArrowRight,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { saveTicket } from '@/data/support/tickets';
import { goBack } from '@/data/support/navigation';

// Validation schema
const feedbackFormSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  category: z.string().min(1, 'Pilih kategori'),
  rating: z.number(),
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

// Category options with icons and flat colors
const categoryOptions = [
  {
    value: 'Fitur Baru',
    label: 'Fitur Baru',
    icon: Sparkles,
    description: 'Saran fitur baru atau perbaikan fitur existing',
    iconBg: 'bg-blue-50',
    iconText: 'text-blue-600',
  },
  {
    value: 'Perbaikan Bug',
    label: 'Perbaikan Bug',
    icon: MessageSquare,
    description: 'Lapor error, crash, atau perilaku tidak sesuai',
    iconBg: 'bg-red-50',
    iconText: 'text-red-600',
  },
  {
    value: 'Pengalaman Pengguna',
    label: 'Pengalaman Pengguna (UX)',
    icon: Heart,
    description: 'Saran UI/UX, alur navigasi, kemudahan penggunaan',
    iconBg: 'bg-amber-50',
    iconText: 'text-amber-600',
  },
  {
    value: 'Konten Katalog',
    label: 'Konten Katalog',
    icon: Star,
    description: 'Request buku, genre, penulis, atau metadata',
    iconBg: 'bg-green-50',
    iconText: 'text-green-600',
  },
  {
    value: 'Lainnya',
    label: 'Lainnya',
    icon: MessageSquare,
    description: 'Saran umum di luar kategori di atas',
    iconBg: 'bg-gray-100',
    iconText: 'text-gray-600',
  },
];

const ratingLabels = ['', 'Buruk', 'Kurang', 'Cukup', 'Bagus', 'Sangat bagus'];

const Feedback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submittedFeedback, setSubmittedFeedback] =
    useState<SubmittedFeedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      email: '',
      category: '',
      rating: 0,
      message: '',
    },
  });

  const errors = form.formState.errors;

  const onSubmit = async (data: FeedbackFormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const feedbackId = `FBK-${Math.floor(100000 + Math.random() * 900000)}`;

    const feedback: SubmittedFeedback = {
      ...data,
      id: feedbackId,
      status: 'Diterima',
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setSubmittedFeedback(feedback);
    saveTicket({
      ...feedback,
      type: 'feedback',
      subject: feedback.message.slice(0, 60),
    });
    setIsSubmitting(false);
    toast({
      title: 'Saran terkirim',
      description: `ID Feedback: ${feedbackId}`,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setSubmittedFeedback(null);
    setHoverRating(0);
    form.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStars = (value: number) => {
    const shown = hoverRating || value;
    return (
      <div
        className="flex flex-col items-center gap-2"
        role="radiogroup"
        aria-label="Rating pengalaman"
        onMouseLeave={() => setHoverRating(0)}
      >
        <div className="flex items-center justify-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= shown;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={star === value}
              aria-label={`${star} bintang: ${ratingLabels[star]}`}
              onClick={() => form.setValue('rating', star, { shouldValidate: true })}
              onMouseEnter={() => setHoverRating(star)}
              onFocus={() => setHoverRating(star)}
              onBlur={() => setHoverRating(0)}
              style={{ transitionDelay: `${(star - 1) * 15}ms` }}
              className={`rounded-md p-1.5 transition-all duration-150 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                active
                  ? 'scale-100 text-amber-400 hover:scale-125 hover:-translate-y-0.5 active:scale-90'
                  : 'scale-100 text-gray-300 hover:scale-125 hover:-translate-y-0.5 hover:text-amber-300 active:scale-90'
              }`}
            >
              <Star size={30} strokeWidth={1.75} className={active ? 'fill-current' : ''} />
            </button>
          );
        })}
        </div>
        <span
          aria-live="polite"
          className={`text-center text-sm font-medium transition-colors duration-150 ${
            shown > 0 ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          {shown > 0 ? ratingLabels[shown] : 'Pilih rating'}
        </span>
      </div>
    );
  };

  if (submittedFeedback) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
          <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-3 shadow-lg">
              <CheckCircle2 size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Saran Terkirim
            </h1>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Terima kasih! Saran Anda telah kami terima dan akan ditinjau tim kami.
            </p>
          </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <Card
            className={`border-gray-200 bg-white shadow-sm ${
              mounted ? 'fb-enter' : 'fb-enter-hidden'
            }`}
            style={{ animationDelay: '60ms' }}
          >
            <CardContent className="space-y-5 p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-600">
                  <CheckCircle2 size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    ID Feedback
                  </p>
                  <p className="font-mono text-lg font-bold text-gray-900">
                    {submittedFeedback.id}
                  </p>
                </div>
                <span className="ml-auto rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {submittedFeedback.status}
                </span>
              </div>

              <dl className="divide-y divide-gray-100 rounded-xl border border-gray-200 text-sm">
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-gray-500">Kategori</dt>
                  <dd className="font-medium text-gray-900">{submittedFeedback.category}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-gray-500">Rating</dt>
                  <dd className="font-medium text-gray-900">
                    {submittedFeedback.rating > 0 ? (
                      <>
                        <span className="text-amber-400">{'★'.repeat(submittedFeedback.rating)}</span>
                        <span className="text-gray-300">
                          {'★'.repeat(5 - submittedFeedback.rating)}
                        </span>
                        <span className="ml-2 text-gray-500">
                          {ratingLabels[submittedFeedback.rating]}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-400">Tidak diberi rating</span>
                    )}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-gray-500">Email</dt>
                  <dd className="max-w-60 truncate font-medium text-gray-900">
                    {submittedFeedback.email}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-gray-500">Waktu</dt>
                  <dd className="font-medium text-gray-900">{submittedFeedback.createdAt}</dd>
                </div>
              </dl>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Detail saran
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {submittedFeedback.message}
                </p>
              </div>

              <p className="text-sm leading-relaxed text-gray-600">
                Tim kami meninjau setiap saran yang masuk. Kabar terbaru akan dikirim ke{' '}
                <span className="font-medium text-gray-900">{submittedFeedback.email}</span>.
              </p>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <Button onClick={resetForm} variant="outline" className="h-11 flex-1">
                  Kirim saran lain
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  className="h-11 flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Kembali ke beranda
                </Button>
              </div>
              <Link
                to="/track"
                className="block pt-1 text-center text-sm font-medium text-blue-600 hover:underline"
              >
                Lacak status saran ini
              </Link>
            </CardContent>
          </Card>

          <nav
            aria-label="Bantuan lain"
            className={`mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 px-1 text-sm ${
              mounted ? 'fb-enter' : 'fb-enter-hidden'
            }`}
            style={{ animationDelay: '160ms' }}
          >
            <span className="text-gray-500">Butuh yang lain?</span>
            <Link
              to="/help"
              className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Pusat bantuan <ArrowRight size={14} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Hubungi support <ArrowRight size={14} />
            </Link>
            <Link
              to="/guide"
              className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Panduan pengguna <ArrowRight size={14} />
            </Link>
          </nav>
        </div>

        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            @keyframes fb-enter {
              from { opacity: 0; transform: translateY(14px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .fb-enter { animation: fb-enter 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
          }
          .fb-enter-hidden { opacity: 0; }
          @media (prefers-reduced-motion: reduce) {
            .fb-enter-hidden { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <button
            onClick={() => goBack(navigate)}
            className="mb-3 inline-flex items-center gap-2 rounded-lg p-2 -ml-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </button>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-3 shadow-lg shadow-blue-200">
              <MessageSquare size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Berikan Saran
            </h1>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Ceritakan apa yang bisa kami perbaiki di BookTracker. Setiap saran dibaca
              oleh tim kami.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={mounted ? 'fb-enter' : 'fb-enter-hidden'}
          >
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardContent className="space-y-6 p-6 sm:p-8">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Email <span className="text-gray-400">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@domain.com"
                          className={`h-11 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Hanya untuk kabar status saran Anda
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Kategori saran <span className="text-gray-400">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className={`flex flex-wrap gap-2 rounded-xl transition-shadow ${errors.category ? 'ring-2 ring-red-400 ring-offset-2' : ''}`} role="radiogroup" aria-label="Kategori saran">
                          {categoryOptions.map((opt) => {
                            const selected = field.value === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                onClick={() => field.onChange(opt.value)}
                                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                                  selected
                                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                <opt.icon
                                  size={16}
                                  className={selected ? 'text-blue-600' : 'text-gray-400'}
                                />
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Saran Anda <span className="text-gray-400">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Masukan saran anda"
                          className={`min-h-[140px] resize-none ${errors.message ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-right text-xs">
                        {field.value.length > 0 && (
                          <span
                            className={`font-mono ${
                              field.value.length < 20
                                ? 'text-gray-400'
                                : field.value.length > 1000
                                  ? 'text-red-500'
                                  : 'text-green-600'
                            }`}
                          >
                            {field.value.length}/1000
                          </span>
                        )}
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem className={`rounded-xl border p-6 text-center transition-colors ${errors.rating ? 'border-red-400 bg-red-50/60' : 'border-gray-200 bg-gray-50'}`}>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Seberapa puas Anda dengan BookTracker?
                      </FormLabel>
                      <FormControl>{renderStars(field.value)}</FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="mt-6 h-12 w-full bg-blue-600 text-base font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50"
              disabled={form.formState.isSubmitting || isSubmitting}
            >
              {isSubmitting || form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Kirim saran
                </>
              )}
            </Button>
            <p className="mt-3 text-center text-xs leading-relaxed text-gray-500">
              Data hanya dipakai untuk menindaklanjuti saran ini dan tidak dibagikan
              ke pihak ketiga.
            </p>
          </form>
        </Form>
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes fb-enter {
            from { opacity: 0; transform: translateY(14px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fb-enter { animation: fb-enter 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
        }
        .fb-enter-hidden { opacity: 0; }
        @media (prefers-reduced-motion: reduce) {
          .fb-enter-hidden { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Feedback;
