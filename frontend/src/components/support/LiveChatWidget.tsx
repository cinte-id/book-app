import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

const initialMessages: Message[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: 'Halo! Ada yang bisa saya bantu terkait BookTracker? 😊',
    timestamp: new Date(),
  },
  {
    id: 'options',
    role: 'assistant',
    content: 'Anda bisa menanyakan tentang:\n• Cara meminjam/mengembalikan buku\n• Fitur pencarian & filter buku\n• Pelacakan progres membaca\n• Setting notifikasi & akun\n• Atau keluhan teknis lainnya',
    timestamp: new Date(),
  },
];

const quickReplies = [
  'Cara meminjam buku',
  'Buku tidak muncul di library',
  'Notifikasi tidak muncul',
  'Reset password akun',
  'Laporan bug/error',
];

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when sheet opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Simulate bot response
  const simulateBotResponse = (userMessage: string) => {
    setIsTyping(true);
    
    // Simple keyword-based responses
    const responses: Record<string, string> = {
      pinjam: 'Untuk meminjam buku, buka tab **Library** → **Browse**, cari buku yang diinginkan, lalu klik tombol "Pinjam". Buku akan masuk ke "My Books".',
      kembal: 'Untuk mengembalikan, buka **My Books**, cari buku yang dipinjam, klik menu (⋮) → "Kembalikan". Buku akan kembali ke Browse.',
      cari: 'Gunakan fitur **Search** di tab Discover atau Library. Bisa filter berdasarkan genre, rating, atau status baca.',
      progres: 'Progres baca otomatis tersimpan. Buka tab **Reading** untuk melihat buku yang sedang dibaca dan persentase progresnya.',
      notif: 'Setting notifikasi ada di **Profile** → **Pengaturan** → **Notifikasi**. Aktifkan push notification untuk pengingat baca harian.',
      password: 'Reset password: klik "Lupa Password" di halaman login, masukkan email terdaftar, cek inbox untuk link reset.',
      bug: 'Terima kasih laporan bug-nya! Tolong sertakan: 1) Halaman mana error, 2) Langkah yang dilakukan, 3) Screenshot jika bisa. Tim tech kami akan cek.',
      default: 'Terima kasih pertanyaannya! Tim support kami akan balas dalam 1x24 jam. Untuk response cepat, coba cek **Help/FAQ** atau kirim **Contact Support** form ya.',
    };

    const lowerMsg = userMessage.toLowerCase();
    let response = responses.default;
    
    for (const [keyword, resp] of Object.entries(responses)) {
      if (lowerMsg.includes(keyword)) {
        response = resp;
        break;
      }
    }

    // Simulate typing delay
    const typingDelay = 800 + Math.random() * 1200;
    setTimeout(() => {
      setMessages((prev) => [
        ...prev.filter(m => m.id !== 'typing'),
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      if (!isOpen) setUnreadCount((c) => c + 1);
    }, typingDelay);
  };

  const handleSend = (text?: string) => {
    const userMessage = (text ?? inputValue).trim();
    if (!userMessage || isTyping) return;
    setInputValue('');

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      },
      // Add typing indicator
      {
        id: 'typing',
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isTyping: true,
      },
    ]);

    simulateBotResponse(userMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (text: string) => {
    handleSend(text);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="default"
        size="icon"
        className={cn(
          'fixed bottom-6 right-6 z-50 rounded-full shadow-lg',
          'bg-blue-600',
          'hover:bg-blue-700',
          'text-white transition-all duration-300',
          'hover:scale-105 active:scale-95',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          'data-[state=open]:rotate-45',
          unreadCount > 0 && 'animate-pulse'
        )}
        aria-label={isOpen ? 'Tutup chat' : 'Buka live chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6" aria-hidden="true" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </Button>

      {/* Chat Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-sm h-full max-h-[90vh] flex flex-col">
          <SheetHeader className="flex-shrink-0 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold text-gray-900">Live Chat Support</SheetTitle>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                  Online - Balas dalam 2 menit
                </p>
              </div>
            </div>
          </SheetHeader>

          {/* Messages Area */}
          <ScrollArea className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
            <div className="space-y-4 pb-4" role="log" aria-live="polite" aria-label="Chat messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-3 animate-in fade-in-0 duration-300',
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                      msg.role === 'user'
                        ? 'bg-blue-600'
                        : 'bg-gray-800'
                    )}
                    aria-hidden="true"
                  >
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : msg.isTyping ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-3',
                      'shadow-sm transition-all duration-200',
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
                    )}
                  >
                    {msg.isTyping ? (
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span className="text-xs ml-1">Mengetik...</span>
                      </div>
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                        <p className={cn('text-xs mt-1.5', msg.role === 'user' ? 'text-blue-100' : 'text-gray-400')}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Replies (only show on first open or after bot response) */}
          {messages.length <= 2 && !isTyping && (
            <div className="flex-shrink-0 px-2 pb-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2 px-1">Saran pertanyaan:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <Button
                    key={reply}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickReply(reply)}
                    className="h-8 text-xs px-3 hover:bg-blue-50 hover:text-blue-700 border-blue-100"
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
            <div className="flex items-end gap-2">
              <Input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pesan... (Enter untuk kirim)"
                className="flex-1 h-11 text-sm"
                disabled={isTyping}
                aria-label="Tulis pesan"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
                className="h-11 w-11 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Kirim pesan"
              >
                <Send className="w-5 h-5 text-white" aria-hidden="true" />
              </Button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
                          Percakapan ini tidak disimpan permanen. Untuk tiket resmi, gunakan{' '}
                          <a href="/contact" className="text-blue-600 underline hover:text-blue-700" onClick={() => setIsOpen(false)}>Contact Support</a>.
                        </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default LiveChatWidget;