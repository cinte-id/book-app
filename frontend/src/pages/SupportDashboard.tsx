import { useMemo } from 'react';
import {
  ArrowLeft,
  HelpCircle,
  Mail,
  BookOpen,
  MessageSquare,
  Ticket,
  Star,
  ArrowRight,
  Inbox,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ticketStats } from '@/data/support/tickets';
import { goBack } from '@/data/support/navigation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const services = [
  {
    to: '/help',
    icon: HelpCircle,
    iconBg: 'bg-blue-50',
    iconText: 'text-blue-600',
    title: 'Pusat Bantuan',
    desc: 'FAQ searchable per kategori',
  },
  {
    to: '/contact',
    icon: Mail,
    iconBg: 'bg-blue-50',
    iconText: 'text-blue-600',
    title: 'Hubungi Support',
    desc: 'Buat tiket bantuan',
  },
  {
    to: '/guide',
    icon: BookOpen,
    iconBg: 'bg-amber-50',
    iconText: 'text-amber-600',
    title: 'Panduan Pengguna',
    desc: 'Tutorial langkah demi langkah',
  },
  {
    to: '/feedback',
    icon: MessageSquare,
    iconBg: 'bg-purple-50',
    iconText: 'text-purple-600',
    title: 'Berikan Saran',
    desc: 'Feedback & rating pengalaman',
  },
  {
    to: '/track',
    icon: Ticket,
    iconBg: 'bg-green-50',
    iconText: 'text-green-600',
    title: 'Lacak Tiket',
    desc: 'Status tiket di perangkat ini',
  },
  {
    to: '/kb',
    icon: BookOpen,
    iconBg: 'bg-indigo-50',
    iconText: 'text-indigo-600',
    title: 'Pusat Pengetahuan',
    desc: 'Artikel panduan per topik',
  },
];

const SupportDashboard = () => {
  const navigate = useNavigate();
  const stats = useMemo(() => ticketStats(), []);
  const chartData = useMemo(
    () =>
      Object.entries(stats.byCategory).map(([name, jumlah]) => ({
        name: name.length > 12 ? `${name.slice(0, 12)}…` : name,
        jumlah,
      })),
    [stats],
  );

  const statCards = [
    { label: 'Total tiket', value: String(stats.total) },
    { label: 'Status open', value: String(stats.open) },
    { label: 'Saran masuk', value: String(stats.feedback) },
    {
      label: 'Rata-rata rating',
      value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '—',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <button
            onClick={() => goBack(navigate)}
            className="mb-4 inline-flex items-center gap-2 rounded-lg p-2 -ml-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </button>
          <div className="text-center">
            <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
              <Inbox size={32} className="text-white" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Pusat Layanan</h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-600">
              Semua bantuan BookTracker di satu tempat — status tiket Anda di perangkat ini
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {statCards.map((s) => (
            <Card key={s.label} className="border-gray-200 bg-white shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="mt-0.5 text-xs text-gray-500">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {services.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.iconBg}`}
              >
                <s.icon size={22} className={s.iconText} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-gray-900">{s.title}</span>
                <span className="block truncate text-xs text-gray-500">{s.desc}</span>
              </span>
              <ArrowRight
                size={18}
                className="shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600"
              />
            </Link>
          ))}
        </div>

        {/* Analytics mockup */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Tiket per kategori</h2>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                Data perangkat ini
              </span>
            </div>
            <p className="mb-4 text-xs text-gray-500">
              Ringkasan analitik layanan pelanggan (mockup dari tiket tersimpan lokal)
            </p>
            {chartData.length === 0 ? (
              <div className="flex flex-col items-center rounded-xl bg-gray-50 px-4 py-10 text-center">
                <Star size={28} className="mb-2 text-gray-300" />
                <p className="text-sm font-medium text-gray-700">Belum ada data</p>
                <p className="mt-1 max-w-xs text-xs text-gray-500">
                  Grafik terisi otomatis setelah Anda membuat tiket atau saran. Coba
                  buat satu lewat Contact Support.
                </p>
              </div>
            ) : (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} interval={0} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid #e5e7eb',
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="jumlah" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={44} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportDashboard;
