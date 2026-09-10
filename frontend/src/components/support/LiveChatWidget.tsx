import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

const initialMessages: Message[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: 'Halo! Ada yang bisa saya bantu terkait BookTracker?',
    timestamp: new Date(),
  },
  {
    id: 'options',
    role: 'assistant',
    content:
      'Anda bisa menanyakan tentang:\n• Cara meminjam / mengembalikan buku\n• Pencarian & filter katalog\n• Progres membaca\n• Notifikasi & akun',
    timestamp: new Date(),
  },
];

const quickReplies = [
  'Cara meminjam buku',
  'Buku tidak muncul',
  'Notifikasi tidak muncul',
  'Reset password',
  'Lapor bug',
];

const responses: Record<string, string> = {
  pinjam:
    'Untuk meminjam buku: buka tab Library → Browse, cari buku yang diinginkan, lalu klik tombol "Pinjam". Buku masuk ke My Books.',
  kembal:
    'Untuk mengembalikan: buka My Books, cari buku yang dipinjam, klik menu (⋮) → "Kembalikan".',
  cari:
    'Gunakan Search di tab Discover atau Library. Bisa filter berdasarkan genre, rating, atau status baca.',
  progres:
    'Progres tersimpan otomatis. Buka tab Reading untuk melihat buku yang sedang dibaca dan persentasenya.',
  notif:
    'Pengaturan notifikasi ada di Profile → Pengaturan → Notifikasi. Aktifkan pengingat baca harian di sana.',
  password:
    'Reset password: klik "Lupa Password" di halaman login, masukkan email terdaftar, lalu cek inbox untuk link reset.',
  bug: 'Terima kasih laporannya! Sertakan: 1) halaman yang error, 2) langkah yang dilakukan, 3) screenshot bila ada.',
  default:
    'Terima kasih! Tim support membalas dalam 1×24 jam. Untuk jawaban cepat, coba halaman Help/FAQ.',
};

export function LiveChatWidget() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animate in after mount (double rAF so the transition applies)
  useEffect(() => {
    if (!visible) return;
    const t = requestAnimationFrame(() =>
      requestAnimationFrame(() => setOpen(true)),
    );
    return () => cancelAnimationFrame(t);
  }, [visible]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // Auto-scroll on new messages (instant when reduced motion)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    messagesEndRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }, [messages, visible]);

  // Focus input + clear badge on open
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 220);
      setUnreadCount(0);
      return () => clearTimeout(t);
    }
  }, [open ]);

  // Escape closes the panel
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible]);

  const handleOpen = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setVisible(true);
  };

  const handleClose = () => {
    setOpen(false);
    closeTimer.current = setTimeout(() => setVisible(false), 170);
  };

  const simulateBotResponse = (userMessage: string) => {
    setIsTyping(true);
    const lowerMsg = userMessage.toLowerCase();
    let response = responses.default;
    for (const [keyword, resp] of Object.entries(responses)) {
      if (keyword !== 'default' && lowerMsg.includes(keyword)) {
        response = resp;
        break;
      }
    }
    const typingDelay = 800 + Math.random() * 1200;
    setTimeout(() => {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== 'typing'),
        { id: `bot-${Date.now()}`, role: 'assistant', content: response, timestamp: new Date() },
      ]);
      setIsTyping(false);
      if (!open) setUnreadCount((c) => c + 1);
    }, typingDelay);
  };

  const handleSend = (text?: string) => {
    const userMessage = (text ?? inputValue).trim();
    if (!userMessage || isTyping) return;
    setInputValue('');
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', content: userMessage, timestamp: new Date() },
      { id: 'typing', role: 'assistant', content: '', timestamp: new Date(), isTyping: true },
    ]);
    simulateBotResponse(userMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Floating Action Button — always on screen */}
      <Button
        onClick={() => (visible ? handleClose() : handleOpen())}
        size="icon"
        aria-label={visible ? 'Tutup live chat' : 'Buka live chat'}
        aria-expanded={visible}
        className={cn(
          'fixed bottom-24 right-6 z-50 h-14 w-14 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/25',
          'transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          'hover:scale-105 hover:bg-blue-700 active:scale-90',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        )}
      >
        <span
          key={String(visible)}
          className="lc-icon-pop flex items-center justify-center"
          aria-hidden="true"
        >
          {visible ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </span>
        {!visible && unreadCount > 0 && (
          <span
            key={unreadCount}
            className="lc-icon-pop absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-xs font-bold text-white"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Messenger panel */}
      {visible && (
        <section
          role="dialog"
          aria-modal="false"
          aria-label="Live chat support"
          className={cn(
            'fixed inset-x-4 bottom-40 z-50 flex h-[540px] max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl',
            'sm:inset-x-auto sm:right-6 sm:w-[380px]',
            'transition-all duration-200 ease-[cubic-bezier(0.32,1.2,0.64,1)]',
            open ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-3 scale-95 opacity-0',
          )}
        >
          {/* Header */}
          <header className="flex shrink-0 items-center gap-3 bg-blue-600 px-4 py-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold leading-tight text-white">Live Chat</h2>
              <p className="flex items-center gap-1.5 text-xs text-blue-100">
                <span className="h-1.5 w-1.5 rounded-full bg-green-300" aria-hidden="true" />
                Online — balas ±2 mnt
              </p>
            </div>
            <button
              onClick={handleClose}
              aria-label="Tutup chat"
              className="rounded-lg p-2 text-white transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4">
            <div className="space-y-3" role="log" aria-live="polite" aria-label="Riwayat chat">
              {messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  style={{ animationDelay: `${Math.min(idx * 45, 360)}ms` }}
                  className={cn('lc-msg flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                >
                  <div
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                      msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-800',
                    )}
                    aria-hidden="true"
                  >
                    {msg.role === 'user' ? (
                      <User className="h-3.5 w-3.5 text-white" />
                    ) : (
                      <Bot className="h-3.5 w-3.5 text-white" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'max-w-[78%] rounded-2xl px-3.5 py-2.5 shadow-sm',
                      msg.role === 'user'
                        ? 'rounded-br-md bg-blue-600 text-white'
                        : 'rounded-bl-md border border-gray-200 bg-white text-gray-800',
                    )}
                  >
                    {msg.isTyping ? (
                      <span className="lc-dots flex items-center gap-1 py-1" aria-label="Asisten mengetik">
                        <span />
                        <span />
                        <span />
                      </span>
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                        <p className={cn('mt-1 text-[11px]', msg.role === 'user' ? 'text-blue-100' : 'text-gray-400')}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && !isTyping && (
            <div className="shrink-0 border-t border-gray-200 bg-white px-3 pb-2 pt-2.5">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    className="shrink-0 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-50 active:scale-95"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="shrink-0 border-t border-gray-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pesan..."
                className="h-11 flex-1 rounded-xl text-sm"
                disabled={isTyping}
                aria-label="Tulis pesan"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
                aria-label="Kirim pesan"
                className="h-11 w-11 shrink-0 rounded-full bg-blue-600 transition-transform hover:bg-blue-700 active:scale-90 disabled:opacity-50"
              >
                <Send className="h-5 w-5 text-white" aria-hidden="true" />
              </Button>
            </div>
            <p className="mt-2 text-center text-[11px] leading-relaxed text-gray-400">
              Untuk tiket resmi, gunakan{' '}
              <Link
                to="/contact"
                onClick={handleClose}
                className="font-medium text-blue-600 hover:underline"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </section>
      )}

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes lc-msg-in {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .lc-msg { animation: lc-msg-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both; }
          @keyframes lc-pop {
            0% { opacity: 0; transform: scale(0.4); }
            60% { transform: scale(1.15); }
            100% { opacity: 1; transform: scale(1); }
          }
          .lc-icon-pop { animation: lc-pop 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }
          @keyframes lc-dot {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-3px); opacity: 1; }
          }
          .lc-dots span {
            width: 6px; height: 6px; border-radius: 9999px; background: #9ca3af;
            animation: lc-dot 1.2s ease-in-out infinite;
          }
          .lc-dots span:nth-child(2) { animation-delay: 0.15s; }
          .lc-dots span:nth-child(3) { animation-delay: 0.3s; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lc-dots span {
            width: 6px; height: 6px; border-radius: 9999px; background: #9ca3af;
          }
        }
      `}</style>
    </>
  );
}

export default LiveChatWidget;
