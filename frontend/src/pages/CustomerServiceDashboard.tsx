import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Ticket,
  Clock,
  CheckCircle,
  Timer,
  Star,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Send,
  ChevronRight,
  TrendingUp,
  Headphones,
  ShieldCheck,
  X,
  User,
  Mail,
  FileText,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import StarRating from '@/components/customer-service/StarRating';
import BottomNav from '@/components/BottomNav';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  subtitle,
}) => (
  <div className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm flex flex-col justify-between">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[11px] font-medium text-gray-500">{title}</span>
      <div className={`w-8 h-8 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
        <Icon size={16} />
      </div>
    </div>
    <div>
      <div className="text-xl font-extrabold text-gray-800">{value}</div>
      {subtitle && <p className="text-[10px] text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

interface TicketItem {
  id: string;
  name?: string;
  email?: string;
  category: { id: string; en: string } | string;
  priority: 'Low' | 'Medium' | 'High' | string;
  status: 'Open' | 'In Progress' | 'Resolved' | string;
  time?: { id: string; en: string } | string;
  description?: { id: string; en: string } | string;
  createdAt?: string;
}

const baseRecentTickets: TicketItem[] = [
  {
    id: 'TKT-20260910-0001',
    name: 'Ahmad Fauzi',
    email: 'ahmad@example.com',
    category: { id: 'Laporan Bug', en: 'Bug Report' },
    priority: 'High',
    status: 'Open',
    time: { id: '10m lalu', en: '10m ago' },
    description: {
      id: 'Tombol simpan di halaman profil tidak merespons saat ditekan di browser Chrome mobile.',
      en: 'Save button on profile screen does not respond when clicked on mobile Chrome browser.',
    },
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'TKT-20260910-0002',
    name: 'Siti Rahma',
    email: 'siti@example.com',
    category: { id: 'Masalah Akun', en: 'Account Issue' },
    priority: 'Medium',
    status: 'In Progress',
    time: { id: '1j lalu', en: '1h ago' },
    description: {
      id: 'Email verifikasi belum diterima setelah mendaftar 30 menit yang lalu.',
      en: 'Verification email has not arrived after registering 30 minutes ago.',
    },
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'TKT-20260909-0003',
    name: 'Dewi Lestari',
    email: 'dewi@example.com',
    category: { id: 'Request Fitur', en: 'Feature Request' },
    priority: 'Low',
    status: 'Resolved',
    time: { id: 'Kemarin', en: 'Yesterday' },
    description: {
      id: 'Mohon tambahkan opsi dark mode untuk kenyamanan membaca di malam hari.',
      en: 'Please add a dark mode option for comfortable nighttime reading.',
    },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'TKT-20260909-0004',
    name: 'Rudi Hartono',
    email: 'rudi@example.com',
    category: { id: 'Pertanyaan', en: 'General Inquiry' },
    priority: 'Medium',
    status: 'Open',
    time: { id: 'Kemarin', en: 'Yesterday' },
    description: {
      id: 'Apakah ada batasan jumlah buku yang bisa ditambahkan ke rak koleksi pribadi?',
      en: 'Is there a limit to how many books can be added to personal shelves?',
    },
    createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'TKT-20260908-0005',
    name: 'Budi Santoso',
    email: 'budi@example.com',
    category: { id: 'Laporan Bug', en: 'Bug Report' },
    priority: 'High',
    status: 'Resolved',
    time: { id: '2 hari lalu', en: '2 days ago' },
    description: {
      id: 'Progres halaman buku kembali ke angka 0 setelah me-refresh tab reading.',
      en: 'Book page progress resets to 0 after refreshing the reading tab.',
    },
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

const CustomerServiceDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<'en' | 'id'>(() => {
    return (localStorage.getItem('app_lang') as 'en' | 'id') || 'en';
  });

  const changeLang = (newLang: 'en' | 'id') => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const [allTickets, setAllTickets] = useState<TicketItem[]>(baseRecentTickets);
  const [totalFeedbackCount, setTotalFeedbackCount] = useState<number>(156);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);

  useEffect(() => {
    const savedTickets = localStorage.getItem('support_tickets');
    if (savedTickets) {
      try {
        const parsed: TicketItem[] = JSON.parse(savedTickets);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const formatted = parsed.map((t) => ({
            ...t,
            time: { id: 'Baru saja', en: 'Just now' },
          }));
          setAllTickets([...formatted, ...baseRecentTickets]);
        }
      } catch (e) {
        console.error('Error loading tickets', e);
      }
    }

    const savedFeedbacks = localStorage.getItem('feedbacks');
    if (savedFeedbacks) {
      try {
        const parsedFB = JSON.parse(savedFeedbacks);
        if (Array.isArray(parsedFB)) {
          setTotalFeedbackCount(156 + parsedFB.length);
        }
      } catch (e) {
        console.error('Error loading feedbacks', e);
      }
    }
  }, []);

  const totalTickets = 24 + (allTickets.length - baseRecentTickets.length);
  const openTickets = 8 + allTickets.filter((t) => t.status === 'Open' && !baseRecentTickets.some(bt => bt.id === t.id)).length;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge variant="destructive" className="text-[9px] px-1.5 py-0">High</Badge>;
      case 'Medium':
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-[9px] px-1.5 py-0">Medium</Badge>;
      default:
        return <Badge className="bg-slate-400 hover:bg-slate-500 text-white text-[9px] px-1.5 py-0">Low</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">{lang === 'en' ? 'Open' : 'Baru'}</span>;
      case 'In Progress':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">{lang === 'en' ? 'In Progress' : 'Diproses'}</span>;
      case 'Resolved':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">{lang === 'en' ? 'Resolved' : 'Selesai'}</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const getTicketField = (field: { id: string; en: string } | string | undefined): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field.en || '';
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto px-4 py-6 pb-24 text-gray-800">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-200 transition-colors text-gray-700" aria-label={lang === 'en' ? 'Back' : 'Kembali'}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">{lang === 'en' ? 'Customer Support' : 'Layanan Pelanggan'}</h1>
        <div className="flex items-center bg-gray-200/80 rounded-full p-0.5 text-[11px] font-semibold shadow-inner">
          <button onClick={() => changeLang('en')} className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${lang === 'en' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}>EN</button>
          <button onClick={() => changeLang('id')} className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${lang === 'id' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}>ID</button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 rounded-2xl p-5 text-white mb-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <Headphones size={22} className="text-blue-200" />
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">{lang === 'en' ? 'Customer Support Center' : 'Pusat Layanan Pelanggan'}</span>
        </div>
        <h2 className="text-lg font-bold">{lang === 'en' ? 'CS Dashboard & Overview' : 'Dashboard CS & Ringkasan'}</h2>
        <p className="text-xs text-blue-100 leading-relaxed mt-1">
          {lang === 'en' ? 'Monitor user satisfaction metrics, track support tickets, and manage all BookTracker help services in one unified place.' : 'Pantau metrik kepuasan pengguna, tracking tiket bantuan, dan kelola seluruh layanan support BookTracker secara terpadu.'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard title={lang === 'en' ? 'Total Tickets' : 'Total Tiket'} value={totalTickets} icon={Ticket} iconBg="bg-blue-100" iconColor="text-blue-600" subtitle={lang === 'en' ? `+${allTickets.length - baseRecentTickets.length + 4} new tickets` : `+${allTickets.length - baseRecentTickets.length + 4} tiket baru`} />
        <StatCard title={lang === 'en' ? 'Open Tickets' : 'Tiket Aktif'} value={openTickets} icon={Clock} iconBg="bg-amber-100" iconColor="text-amber-600" subtitle={lang === 'en' ? 'Needs attention' : 'Perlu ditangani'} />
        <StatCard title={lang === 'en' ? 'Response SLA' : 'SLA Respons'} value="98.6%" icon={CheckCircle} iconBg="bg-emerald-100" iconColor="text-emerald-600" subtitle={lang === 'en' ? 'Target > 95%' : 'Target > 95%'} />
        <StatCard title={lang === 'en' ? 'Avg Response' : 'Rata-rata Respons'} value="2.4h" icon={Timer} iconBg="bg-purple-100" iconColor="text-purple-600" subtitle={lang === 'en' ? 'Industry std: 4h' : 'Standar industri: 4j'} />
        <StatCard title={lang === 'en' ? 'CSAT Score' : 'Skor CSAT'} value="4.2 / 5" icon={Star} iconBg="bg-yellow-100" iconColor="text-yellow-600" subtitle={lang === 'en' ? 'From 420+ ratings' : 'Dari 420+ ulasan'} />
        <StatCard title={lang === 'en' ? 'User Feedback' : 'Feedback Pengguna'} value={totalFeedbackCount} icon={MessageSquare} iconBg="bg-rose-100" iconColor="text-rose-600" subtitle={lang === 'en' ? 'Total user reviews' : 'Total masukan pengguna'} />
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 px-1">{lang === 'en' ? 'Support Services & Quick Links' : 'Menu & Layanan Bantuan'}</h3>
        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={() => navigate('/help')} className="flex items-center space-x-3 p-3.5 bg-white hover:bg-blue-50/50 border border-gray-100 hover:border-blue-200 rounded-2xl transition-all text-left shadow-sm group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"><HelpCircle size={20} /></div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-gray-800 truncate">{lang === 'en' ? 'FAQ Center' : 'Pusat FAQ'}</h4>
              <p className="text-[10px] text-gray-500 truncate">{lang === 'en' ? 'Searchable Q&A' : 'Tanya jawab lengkap'}</p>
            </div>
          </button>
          <button onClick={() => navigate('/contact')} className="flex items-center space-x-3 p-3.5 bg-white hover:bg-blue-50/50 border border-gray-100 hover:border-blue-200 rounded-2xl transition-all text-left shadow-sm group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"><Send size={20} /></div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-gray-800 truncate">{lang === 'en' ? 'Contact Support' : 'Kontak CS'}</h4>
              <p className="text-[10px] text-gray-500 truncate">{lang === 'en' ? 'Submit ticket' : 'Kirim tiket masalah'}</p>
            </div>
          </button>
          <button onClick={() => navigate('/guide')} className="flex items-center space-x-3 p-3.5 bg-white hover:bg-blue-50/50 border border-gray-100 hover:border-blue-200 rounded-2xl transition-all text-left shadow-sm group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"><BookOpen size={20} /></div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-gray-800 truncate">{lang === 'en' ? 'User Guide' : 'Panduan'}</h4>
              <p className="text-[10px] text-gray-500 truncate">{lang === 'en' ? 'App tutorials' : 'Tutorial penggunaan'}</p>
            </div>
          </button>
          <button onClick={() => navigate('/feedback')} className="flex items-center space-x-3 p-3.5 bg-white hover:bg-blue-50/50 border border-gray-100 hover:border-blue-200 rounded-2xl transition-all text-left shadow-sm group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"><MessageSquare size={20} /></div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-gray-800 truncate">{lang === 'en' ? 'Feedback' : 'Feedback'}</h4>
              <p className="text-[10px] text-gray-500 truncate">{lang === 'en' ? 'Review & ratings' : 'Beri masukan & rating'}</p>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center space-x-1.5">
            <Ticket size={14} className="text-blue-500" />
            <span>Recent Tickets ({allTickets.length})</span>
          </h3>
          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">{lang === 'en' ? 'Click for details' : 'Klik untuk detail'}</span>
        </div>
        <div className="max-h-[310px] overflow-y-auto pr-1 divide-y divide-gray-100 scroll-smooth [scrollbar-width:thin] scrollbar-thumb-gray-200">
          {allTickets.map((t) => (
            <div key={t.id} onClick={() => setSelectedTicket(t)} className="py-3 px-2 -mx-1 flex items-center justify-between text-xs rounded-xl hover:bg-blue-50/60 cursor-pointer transition-colors group">
              <div className="space-y-1 min-w-0 flex-1 pr-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-blue-600 group-hover:text-blue-700">{t.id}</span>
                  {getPriorityBadge(t.priority)}
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-gray-500 truncate">
                  <span className="font-medium text-gray-700">{getTicketField(t.category)}</span>
                  <span>•</span>
                  <span>{getTicketField(t.time) || new Date(t.createdAt || '').toLocaleDateString()}</span>
                  {t.name && (
                    <>
                      <span>•</span>
                      <span className="text-gray-400 truncate">{t.name}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-1.5 shrink-0">
                {getStatusBadge(t.status)}
                <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          ))}
        </div>
        {allTickets.length > 5 && (
          <div className="pt-2 text-center border-t border-gray-50">
            <span className="text-[10px] text-gray-400">{lang === 'en' ? `Scroll down to view more tickets (${allTickets.length} total)` : `Scroll ke bawah untuk melihat tiket lainnya (${allTickets.length} total)`}</span>
          </div>
        )}
      </div>

      <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="text-emerald-600 shrink-0" size={24} />
          <div>
            <h4 className="text-xs font-bold text-emerald-900">{lang === 'en' ? 'Response SLA 98.6%' : 'SLA Respons 98.6%'}</h4>
            <p className="text-[10px] text-emerald-700">{lang === 'en' ? '24/7 dedicated support team ready to assist' : 'Layanan CS aktif dan siap sedia 24/7'}</p>
          </div>
        </div>
        <div className="text-right">
          <StarRating rating={4} readonly size={13} />
          <span className="text-[10px] text-emerald-800 font-bold">4.2 / 5.0</span>
        </div>
      </div>
      <BottomNav activeTab="support" setActiveTab={() => {}} />

      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-blue-200 tracking-wider">{lang === 'en' ? 'Ticket Tracking Details' : 'Detail Pelacakan Tiket'}</span>
                <h3 className="font-mono text-sm font-bold">{selectedTicket.id}</h3>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer" aria-label={lang === 'en' ? 'Close' : 'Tutup'}>
                <X size={18} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2.5">{lang === 'en' ? 'Ticket Progress' : 'Progres Tiket'}</span>
                <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  <div className="flex items-start space-x-3 relative">
                    <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 z-10 text-[9px] font-bold">✓</div>
                    <div>
                      <p className="font-semibold text-gray-800">{lang === 'en' ? 'Ticket Created & Queued' : 'Tiket Dibuat & Masuk Sistem'}</p>
                      <p className="text-[10px] text-gray-500">{lang === 'en' ? 'Ticket registered in customer service queue.' : 'Tiket terdaftar dalam antrean customer service.'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 relative">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 z-10 text-[9px] font-bold ${selectedTicket.status === 'In Progress' || selectedTicket.status === 'Resolved' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {selectedTicket.status === 'In Progress' || selectedTicket.status === 'Resolved' ? '✓' : '2'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{lang === 'en' ? 'Reviewed by Support Team' : 'Ditinjau oleh Tim Support'}</p>
                      <p className="text-[10px] text-gray-500">{selectedTicket.status === 'Open' ? (lang === 'en' ? 'Awaiting support agent assignment.' : 'Menunggu penugasan agen support.') : (lang === 'en' ? 'Currently analyzed and handled by technical team.' : 'Sedang dianalisis dan ditangani oleh tim teknis.')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 relative">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 z-10 text-[9px] font-bold ${selectedTicket.status === 'Resolved' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {selectedTicket.status === 'Resolved' ? '✓' : '3'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{lang === 'en' ? 'Resolved / Solution Provided' : 'Solusi Diberikan / Selesai'}</p>
                      <p className="text-[10px] text-gray-500">{selectedTicket.status === 'Resolved' ? (lang === 'en' ? 'Issue resolved and confirmation sent.' : 'Kendala telah diselesaikan dan konfirmasi terkirim.') : (lang === 'en' ? 'Solution will be sent to reporter email.' : 'Solusi akan dikirimkan ke email pelapor.')}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 block">{lang === 'en' ? 'Category' : 'Kategori'}</span>
                  <span className="font-semibold text-gray-800">{getTicketField(selectedTicket.category)}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 block">{lang === 'en' ? 'Priority' : 'Prioritas'}</span>
                  <div className="mt-0.5">{getPriorityBadge(selectedTicket.priority)}</div>
                </div>
                {selectedTicket.name && (
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 block">{lang === 'en' ? 'Reporter' : 'Pelapor'}</span>
                    <span className="font-semibold text-gray-800 truncate block">{selectedTicket.name}</span>
                  </div>
                )}
                {selectedTicket.email && (
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 block">{lang === 'en' ? 'Contact Email' : 'Email Kontak'}</span>
                    <span className="font-semibold text-gray-800 truncate block">{selectedTicket.email}</span>
                  </div>
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">{lang === 'en' ? 'Problem Description' : 'Deskripsi Masalah'}</span>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 leading-relaxed text-xs">
                  {getTicketField(selectedTicket.description) || (lang === 'en' ? 'No additional description.' : 'Tidak ada deskripsi tambahan.')}
                </div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
              <button onClick={() => setSelectedTicket(null)} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer">{lang === 'en' ? 'Close Tracking' : 'Tutup Pelacakan'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerServiceDashboard;
