import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ArrowLeft, 
  Mail, 
  CheckCircle2, 
  Send, 
  Ticket, 
  AlertCircle,
  User,
  MessageSquare,
  Flag,
  FileText
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

// Zod validation schema
const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Nama minimal 2 karakter')
    .max(50, 'Nama maksimal 50 karakter'),
  email: z.string()
    .email('Format email tidak valid')
    .min(5, 'Email terlalu pendek'),
  category: z.string()
    .min(1, 'Pilih kategori masalah'),
  priority: z.enum(['Rendah', 'Normal', 'Tinggi (Mendesak)'], {
    required_error: 'Pilih tingkat urgensi',
  }),
  subject: z.string()
    .min(5, 'Subjek minimal 5 karakter')
    .max(100, 'Subjek maksimal 100 karakter'),
  message: z.string()
    .min(15, 'Jelaskan masalah minimal 15 karakter untuk memudahkan tim support')
    .max(1000, 'Pesan maksimal 1000 karakter'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface SubmittedTicket extends ContactFormValues {
  id: string;
  status: string;
  createdAt: string;
}

const ContactSupport = () => {
  const navigate = useNavigate();
  const [submittedTicket, setSubmittedTicket] = useState<SubmittedTicket | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      category: '',
      priority: 'Normal',
      subject: '',
      message: '',
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    // Generate ticket ID
    const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const ticket: SubmittedTicket = {
      ...data,
      id: ticketId,
      status: 'Open',
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setSubmittedTicket(ticket);
    
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setSubmittedTicket(null);
    form.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Tinggi (Mendesak)':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Normal':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Rendah':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100 mb-4"
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-3 shadow-lg shadow-blue-200">
              <Mail size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hubungi Layanan Bantuan
            </h1>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Kirimkan kendala atau pertanyaan Anda, tim support kami siap membantu dalam 1x24 jam
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {submittedTicket ? (
          /* Success State */
          <div className="bg-white rounded-2xl border border-green-200 overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 border-b border-green-100">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 shadow-lg">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Tiket Berhasil Dibuat!
                </h2>
                <p className="text-gray-600 text-sm">
                  Simpan nomor tiket Anda untuk melacak status penanganan
                </p>
              </div>
            </div>

            <div className="p-8">
              {/* Ticket Info Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <Ticket className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-600">ID Tiket:</span>
                      <code className="text-lg font-bold text-blue-600 bg-white px-3 py-1 rounded-lg border border-blue-200">
                        {submittedTicket.id}
                      </code>
                    </div>
                    <p className="text-xs text-gray-500">
                      {submittedTicket.createdAt}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    submittedTicket.status === 'Open' 
                      ? 'bg-amber-100 text-amber-700 border-amber-200' 
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {submittedTicket.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
                    <User className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Pelapor</p>
                      <p className="font-medium text-gray-900 truncate">{submittedTicket.name}</p>
                      <p className="text-sm text-gray-600 truncate">{submittedTicket.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
                    <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Kategori</p>
                      <p className="font-medium text-gray-900">{submittedTicket.category}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
                    <Flag className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Prioritas</p>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        getPriorityColor(submittedTicket.priority)
                      }`}>
                        {submittedTicket.priority}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
                    <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Subjek</p>
                      <p className="font-medium text-gray-900">{submittedTicket.subject}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  Apa yang akan terjadi selanjutnya?
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">1.</span>
                    <span>Tim support kami akan meninjau tiket Anda dalam <strong>1x24 jam</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">2.</span>
                    <span>Anda akan menerima <strong>email konfirmasi</strong> ke {submittedTicket.email}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">3.</span>
                    <span>Update status tiket akan dikirimkan melalui email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">4.</span>
                    <span>Gunakan nomor tiket <code className="bg-white px-2 py-0.5 rounded text-blue-600 font-mono text-xs">{submittedTicket.id}</code> untuk referensi</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={resetForm}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Buat Tiket Baru
                </Button>
                <Button
                  onClick={() => navigate('/help')}
                  variant="outline"
                  className="flex-1"
                >
                  Kembali ke Bantuan
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Form State */
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
                <div className="p-6 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Name Field */}
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
                              placeholder="cth. Alfatih Akbar"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Email Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Alamat Email <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="nama@email.com"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Category Field */}
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Kategori Masalah <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Pilih kategori" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Peminjaman Buku">📚 Peminjaman Buku</SelectItem>
                              <SelectItem value="Akses Akun / Login">🔐 Akses Akun / Login</SelectItem>
                              <SelectItem value="Katalog & Pencarian">🔍 Katalog & Pencarian</SelectItem>
                              <SelectItem value="Kendala Bug / Error">🐛 Kendala Bug / Error</SelectItem>
                              <SelectItem value="Fitur & Saran">💡 Fitur & Saran</SelectItem>
                              <SelectItem value="Lainnya">📝 Lainnya</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Priority Field */}
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Tingkat Urgensi <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Pilih urgensi" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Rendah">🟢 Rendah</SelectItem>
                              <SelectItem value="Normal">🔵 Normal</SelectItem>
                              <SelectItem value="Tinggi (Mendesak)">🔴 Tinggi (Mendesak)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Subject Field */}
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel className="text-sm font-semibold text-gray-700">
                          Subjek Kendala <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="cth. Buku tidak bisa diklik untuk dipinjam"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Deskripsikan masalah Anda dalam satu kalimat
                        </FormDescription>
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
                          Deskripsi Masalah <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ceritakan kronologi kendala secara mendetail... Sertakan langkah-langkah yang Anda lakukan, pesan error yang muncul, dan kapan masalah terjadi."
                            className="min-h-[140px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs flex items-center justify-between">
                          <span>Minimal 15 karakter untuk memudahkan tim support</span>
                          <span className={`font-mono ${
                            field.value.length < 15 ? 'text-gray-400' :
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
                </div>

                {/* Form Footer */}
                <div className="bg-gray-50 px-6 sm:px-8 py-6 border-t border-gray-200">
                  <div className="flex items-start gap-3 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium text-blue-900 mb-1">Informasi Privasi</p>
                      <p className="text-xs text-gray-600">
                        Data yang Anda kirimkan akan dijaga kerahasiaannya dan hanya digunakan untuk menangani tiket support Anda.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all text-base font-medium"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Kirim Pengaduan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default ContactSupport;
