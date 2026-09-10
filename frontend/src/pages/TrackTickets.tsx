import { useState } from 'react';
import { ArrowLeft, Search, Ticket, Trash2, Mail, Tag, Clock, Star, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  loadTickets,
  findTicket,
  deleteTicket,
  type SupportTicket,
} from '@/data/support/tickets';

const statusStyle = (status: SupportTicket['status']) => {
  switch (status) {
    case 'Open':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'In Progress':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Resolved':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const typeLabel = (type: SupportTicket['type']) =>
  type === 'support' ? 'Support' : 'Feedback';

const TrackTickets = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [tickets, setTickets] = useState<SupportTicket[]>(() => loadTickets());
  const [searched, setSearched] = useState<SupportTicket | null | undefined>(undefined);
  const [openId, setOpenId] = useState<string | null>(null);

  const handleSearch = () => {
    if (!query.trim()) {
      setSearched(undefined);
      return;
    }
    setSearched(findTicket(query) ?? null);
  };

  const handleDelete = (id: string) => {
    setTickets(deleteTicket(id));
    if (searched?.id === id) setSearched(undefined);
    if (openId === id) setOpenId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 rounded-lg p-2 -ml-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </button>
          <div className="text-center">
            <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
              <Ticket size={32} className="text-white" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Lacak Tiket</h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-600">
              Masukkan ID tiket (cth. TKT-123456) atau pilih dari riwayat di perangkat ini
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
        {/* Search */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="TKT-123456 atau FBK-123456"
                  className="h-11 pl-11 font-mono"
                  aria-label="Cari ID tiket"
                />
              </div>
              <Button onClick={handleSearch} className="h-11 bg-blue-600 px-6 hover:bg-blue-700">
                Cari
              </Button>
            </div>
            {searched === null && (
              <p className="mt-3 text-sm text-red-600">
                Tiket tidak ditemukan di perangkat ini. Periksa kembali ID tiket Anda.
              </p>
            )}
            {searched && (
              <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-lg font-bold text-gray-900">{searched.id}</p>
                    <p className="mt-0.5 text-sm text-gray-600">{searched.subject}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle(searched.status)}`}>
                    {searched.status}
                  </span>
                </div>
                <dl className="mt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Kategori</dt>
                    <dd className="font-medium text-gray-900">{searched.category}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Dibuat</dt>
                    <dd className="font-medium text-gray-900">{searched.createdAt}</dd>
                  </div>
                </dl>
              </div>
            )}
          </CardContent>
        </Card>

        {/* History */}
        <div>
          <h2 className="mb-3 px-1 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Riwayat di perangkat ini ({tickets.length})
          </h2>
          {tickets.length === 0 ? (
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                  <Ticket size={28} className="text-gray-400" />
                </div>
                <p className="font-medium text-gray-900">Belum ada tiket</p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-gray-600">
                  Tiket yang Anda buat lewat Contact Support atau Feedback akan tersimpan
                  di sini.
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  <Link to="/contact" className="text-sm font-medium text-blue-600 hover:underline">
                    Hubungi Support
                  </Link>
                  <Link to="/feedback" className="text-sm font-medium text-blue-600 hover:underline">
                    Beri Saran
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => {
                const isOpen = openId === t.id;
                return (
                  <div
                    key={t.id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
                  >
                    <button
                      onClick={() => setOpenId(isOpen ? null : t.id)}
                      className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-gray-50"
                      aria-expanded={isOpen}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <code className="font-mono text-sm font-bold text-blue-600">{t.id}</code>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            {typeLabel(t.type)}
                          </span>
                          <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${statusStyle(t.status)}`}>
                            {t.status}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-sm text-gray-600">{t.subject}</p>
                      </div>
                      <ChevronDown
                        size={20}
                        className={`shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-gray-100 px-4 py-4">
                        <dl className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Tag size={14} className="text-gray-400" />
                            <span>{t.category}</span>
                            {t.priority && (
                              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                                {t.priority}
                              </span>
                            )}
                            {typeof t.rating === 'number' && t.rating > 0 && (
                              <span className="inline-flex items-center gap-1 text-amber-500">
                                <Star size={14} className="fill-current" /> {t.rating}/5
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail size={14} className="text-gray-400" />
                            <span className="truncate">{t.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock size={14} className="text-gray-400" />
                            <span>{t.createdAt}</span>
                          </div>
                        </dl>
                        <p className="mt-3 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">
                          {t.message}
                        </p>
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                            Hapus dari perangkat
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackTickets;
