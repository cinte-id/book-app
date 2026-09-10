import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ChevronRight,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface SupportTicket {
  id: string;
  name: string;
  email: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
}

const STORAGE_KEY = 'support_tickets';

const ContactSupport: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<'id' | 'en'>(() => {
    return (localStorage.getItem('app_lang') as 'id' | 'en') || 'en';
  });

  const changeLang = (newLang: 'id' | 'en') => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Bug Report');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [description, setDescription] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // Tickets list
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTickets(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse tickets', e);
      }
    }
  }, []);

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (!name.trim()) {
      errs.name = lang === 'en' ? 'Full name is required' : 'Nama lengkap wajib diisi';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = lang === 'en' ? 'Email address is required' : 'Email wajib diisi';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = lang === 'en' ? 'Invalid email format (e.g. user@mail.com)' : 'Format email tidak valid (contoh: user@mail.com)';
    }

    if (!description.trim()) {
      errs.description = lang === 'en' ? 'Problem description is required' : 'Deskripsi masalah wajib diisi';
    } else if (description.trim().length < 10) {
      errs.description = lang === 'en' ? 'Description must be at least 10 characters' : 'Deskripsi masalah minimal 10 karakter';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const generateTicketId = (): string => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const random4 = Math.floor(1000 + Math.random() * 9000);
    return `TKT-${yyyy}${mm}${dd}-${random4}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error(lang === 'en' ? 'Please check the form for errors' : 'Mohon periksa kembali form yang Anda isi');
      return;
    }

    const newTicket: SupportTicket = {
      id: generateTicketId(),
      name: name.trim(),
      email: email.trim(),
      category,
      priority,
      description: description.trim(),
      status: 'Open',
      createdAt: new Date().toISOString(),
    };

    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTickets));

    setSubmittedTicket(newTicket);
    toast.success(
      lang === 'en'
        ? `Ticket ${newTicket.id} created successfully!`
        : `Tiket ${newTicket.id} berhasil dibuat!`
    );

    // Reset form
    setName('');
    setEmail('');
    setCategory('Bug Report');
    setPriority('Medium');
    setDescription('');
    setErrors({});
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'Bug Report':
        return 'Bug Report';
      case 'Masalah Akun':
      case 'Account Issue':
        return lang === 'en' ? 'Account Issue' : 'Masalah Akun';
      case 'Request Fitur':
      case 'Feature Request':
        return lang === 'en' ? 'Feature Request' : 'Request Fitur';
      case 'Pertanyaan Umum':
      case 'General Inquiry':
        return lang === 'en' ? 'General Inquiry' : 'Pertanyaan Umum';
      case 'Lainnya':
      case 'Other':
        return lang === 'en' ? 'Other' : 'Lainnya';
      default:
        return cat;
    }
  };

  const getPriorityBadge = (p: 'Low' | 'Medium' | 'High') => {
    switch (p) {
      case 'High':
        return <Badge variant="destructive" className="text-[10px] px-2 py-0.5">High</Badge>;
      case 'Medium':
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] px-2 py-0.5">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-slate-500 hover:bg-slate-600 text-white text-[10px] px-2 py-0.5">Low</Badge>;
    }
  };

  const getStatusBadge = (s: 'Open' | 'In Progress' | 'Resolved') => {
    switch (s) {
      case 'Open':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">{lang === 'en' ? 'Open' : 'Baru'}</span>;
      case 'In Progress':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">{lang === 'en' ? 'In Progress' : 'Diproses'}</span>;
      case 'Resolved':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">{lang === 'en' ? 'Resolved' : 'Selesai'}</span>;
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
          {lang === 'en' ? 'Contact Support' : 'Hubungi Support'}
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

      {/* Success Notification Alert if submitted */}
      {submittedTicket && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="text-xs font-bold text-emerald-900">
                {lang === 'en' ? 'Ticket Created Successfully!' : 'Tiket Berhasil Dibuat!'}
              </h3>
              <p className="text-xs text-emerald-700 mt-1">
                {lang === 'en' ? 'Your Ticket ID: ' : 'Nomor Tiket Anda: '}
                <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800">
                  {submittedTicket.id}
                </span>
              </p>
              <p className="text-[11px] text-emerald-600 mt-1.5">
                {lang === 'en' ? (
                  <>Our support team will respond to <span className="font-semibold">{submittedTicket.email}</span>.</>
                ) : (
                  <>Tim CS kami akan merespons melalui email <span className="font-semibold">{submittedTicket.email}</span>.</>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-8">
        <h2 className="text-sm font-bold text-gray-800 mb-1">
          {lang === 'en' ? 'Support Ticket Form' : 'Formulir Bantuan'}
        </h2>
        <p className="text-xs text-gray-500 mb-5">
          {lang === 'en'
            ? 'Fill in the details below and our team will assist you shortly.'
            : 'Isi detail masalah Anda dan tim support kami akan segera membantu.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {lang === 'en' ? 'Full Name' : 'Nama Lengkap'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              placeholder={lang === 'en' ? 'e.g. John Doe' : 'contoh: Ahmad Fauzi'}
              className={`w-full text-xs px-3.5 py-2.5 bg-gray-50 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-red-400 focus:ring-red-300 bg-red-50/30'
                  : 'border-gray-200 focus:ring-blue-500 focus:bg-white'
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-red-500 mt-1 flex items-center space-x-1">
                <AlertCircle size={12} />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {lang === 'en' ? 'Email Address' : 'Alamat Email'} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder={lang === 'en' ? 'e.g. user@mail.com' : 'contoh: user@mail.com'}
              className={`w-full text-xs px-3.5 py-2.5 bg-gray-50 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-red-400 focus:ring-red-300 bg-red-50/30'
                  : 'border-gray-200 focus:ring-blue-500 focus:bg-white'
              }`}
            />
            {errors.email && (
              <p className="text-[11px] text-red-500 mt-1 flex items-center space-x-1">
                <AlertCircle size={12} />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Kategori Masalah */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {lang === 'en' ? 'Issue Category' : 'Kategori Masalah'}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="Bug Report">Bug Report</option>
              <option value="Masalah Akun">{lang === 'en' ? 'Account Issue' : 'Masalah Akun'}</option>
              <option value="Request Fitur">{lang === 'en' ? 'Feature Request' : 'Request Fitur'}</option>
              <option value="Pertanyaan Umum">{lang === 'en' ? 'General Inquiry' : 'Pertanyaan Umum'}</option>
              <option value="Lainnya">{lang === 'en' ? 'Other' : 'Lainnya'}</option>
            </select>
          </div>

          {/* Prioritas Radio Group */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              {lang === 'en' ? 'Priority Level' : 'Tingkat Prioritas'}
            </label>
            <RadioGroup
              value={priority}
              onValueChange={(val) => setPriority(val as 'Low' | 'Medium' | 'High')}
              className="flex space-x-3"
            >
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 flex-1">
                <RadioGroupItem value="Low" id="p-low" />
                <Label htmlFor="p-low" className="text-xs font-medium cursor-pointer">
                  Low
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 flex-1">
                <RadioGroupItem value="Medium" id="p-med" />
                <Label htmlFor="p-med" className="text-xs font-medium cursor-pointer">
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 flex-1">
                <RadioGroupItem value="High" id="p-high" />
                <Label htmlFor="p-high" className="text-xs font-medium cursor-pointer">
                  High
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {lang === 'en' ? 'Problem Description' : 'Deskripsi Masalah'} <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              placeholder={
                lang === 'en'
                  ? 'Describe your issue in detail (min. 10 characters)...'
                  : 'Jelaskan secara detail masalah atau kendala yang Anda alami (minimal 10 karakter)...'
              }
              className={`w-full text-xs px-3.5 py-2.5 bg-gray-50 rounded-xl border transition-all focus:outline-none focus:ring-2 resize-none ${
                errors.description
                  ? 'border-red-400 focus:ring-red-300 bg-red-50/30'
                  : 'border-gray-200 focus:ring-blue-500 focus:bg-white'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-red-500 mt-1 flex items-center space-x-1">
                <AlertCircle size={12} />
                <span>{errors.description}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center space-x-2 active:scale-[0.99] cursor-pointer"
          >
            <Send size={14} />
            <span>{lang === 'en' ? 'Submit Support Ticket' : 'Kirim Laporan Tiket'}</span>
          </button>
        </form>
      </div>

      {/* Tiket Saya Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800 flex items-center space-x-2">
            <Ticket size={16} className="text-blue-500" />
            <span>{lang === 'en' ? `My Tickets (${tickets.length})` : `Tiket Saya (${tickets.length})`}</span>
          </h2>
          {tickets.length > 0 && (
            <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-semibold">
              {lang === 'en' ? 'Click for tracking' : 'Klik untuk pelacakan'}
            </span>
          )}
        </div>

        {tickets.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
            <Ticket size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-xs font-semibold text-gray-700">
              {lang === 'en' ? 'No tickets submitted yet' : 'Belum ada tiket yang diajukan'}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {lang === 'en'
                ? 'Tickets you submit will be saved and displayed here.'
                : 'Tiket yang Anda submit akan tersimpan di sini.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-blue-200 hover:bg-blue-50/20 cursor-pointer transition-all space-y-2.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 group-hover:text-blue-700">
                    {t.id}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    {getStatusBadge(t.status)}
                    <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-gray-500">
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium">
                    {getCategoryLabel(t.category)}
                  </span>
                  <span>•</span>
                  {getPriorityBadge(t.priority)}
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Clock size={11} />
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>

                <p className="text-xs text-gray-700 line-clamp-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Tracking Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-blue-200 tracking-wider">
                  {lang === 'en' ? 'Ticket Tracking Details' : 'Detail Pelacakan Tiket'}
                </span>
                <h3 className="font-mono text-sm font-bold">{selectedTicket.id}</h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label={lang === 'en' ? 'Close' : 'Tutup'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              {/* Status Timeline Tracking */}
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2.5">
                  {lang === 'en' ? 'Ticket Progress' : 'Progres Tiket'}
                </span>
                <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  <div className="flex items-start space-x-3 relative">
                    <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 z-10 text-[9px] font-bold">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {lang === 'en' ? 'Ticket Submitted & Queued' : 'Tiket Terkirim'}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {lang === 'en'
                          ? 'Ticket entered customer support queue.'
                          : 'Tiket masuk antrean customer support.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 relative">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 z-10 text-[9px] font-bold ${
                        selectedTicket.status === 'In Progress' || selectedTicket.status === 'Resolved'
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {selectedTicket.status === 'In Progress' || selectedTicket.status === 'Resolved' ? '✓' : '2'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {lang === 'en' ? 'Reviewed by Support Agent' : 'Ditinjau oleh Agen'}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {selectedTicket.status === 'Open'
                          ? (lang === 'en' ? 'Awaiting agent review on problem details.' : 'Menunggu agen mereview detail masalah Anda.')
                          : (lang === 'en' ? 'Currently investigated by technical team.' : 'Sedang diinvestigasi oleh teknisi kami.')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 relative">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 z-10 text-[9px] font-bold ${
                        selectedTicket.status === 'Resolved'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {selectedTicket.status === 'Resolved' ? '✓' : '3'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {lang === 'en' ? 'Resolved & Solution Provided' : 'Selesai & Solusi'}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {selectedTicket.status === 'Resolved'
                          ? (lang === 'en' ? 'Solution sent to your registered email.' : 'Solusi telah dikirim ke email Anda.')
                          : (lang === 'en' ? 'Result notification will be sent to your email.' : 'Pemberitahuan hasil akan dikirim ke email Anda.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 block">
                    {lang === 'en' ? 'Category' : 'Kategori'}
                  </span>
                  <span className="font-semibold text-gray-800">{getCategoryLabel(selectedTicket.category)}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 block">
                    {lang === 'en' ? 'Priority' : 'Prioritas'}
                  </span>
                  <div className="mt-0.5">{getPriorityBadge(selectedTicket.priority)}</div>
                </div>
                {selectedTicket.name && (
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 block">
                      {lang === 'en' ? 'Reporter' : 'Pelapor'}
                    </span>
                    <span className="font-semibold text-gray-800 truncate block">{selectedTicket.name}</span>
                  </div>
                )}
                {selectedTicket.email && (
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 block">
                      {lang === 'en' ? 'Registered Email' : 'Email Terdaftar'}
                    </span>
                    <span className="font-semibold text-gray-800 truncate block">{selectedTicket.email}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  {lang === 'en' ? 'Full Description' : 'Deskripsi Lengkap'}
                </span>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 leading-relaxed text-xs">
                  {selectedTicket.description}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'Close' : 'Tutup'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSupport;
