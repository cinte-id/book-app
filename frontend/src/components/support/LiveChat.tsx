import { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";

interface Message {
  id: number;
  from: "customer" | "support";
  text: string;
}

interface LiveChatProps {
  open: boolean;
  onClose: () => void;
}

const initialMessages: Message[] = [
  {
    id: 1,
    from: "support",
    text: "👋 Hi! Welcome to BookTracker support. How can we help you today?",
  },
];

const autoReplies = [
  "Thanks for reaching out! Let me look into that for you.",
  "I understand. Could you give me a bit more detail?",
  "Great question! Our team will get back to you shortly.",
  "I've noted your concern and will escalate it to the relevant team.",
];

let replyIndex = 0;

const LiveChat = ({ open, onClose }: LiveChatProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "customer", text },
    ]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "support",
          text: autoReplies[replyIndex % autoReplies.length],
        },
      ]);
      replyIndex++;
    }, 900);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-4 px-4 bg-black/30">
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ height: 440 }}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-blue-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-white font-semibold text-sm">
              BookTracker Support
            </span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-gray-50">
          {messages.map((msg) => {
            const isCustomer = msg.from === "customer";
            return (
              <div
                key={msg.id}
                className={
                  isCustomer ? "flex justify-end" : "flex justify-start"
                }
              >
                <div
                  className={
                    isCustomer
                      ? "max-w-[78%] px-3 py-2 rounded-2xl rounded-br-sm text-sm leading-relaxed bg-blue-500 text-white"
                      : "max-w-[78%] px-3 py-2 rounded-2xl rounded-bl-sm text-sm leading-relaxed bg-white text-gray-800 border border-gray-100"
                  }
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-100 bg-white">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={send}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors flex-shrink-0"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
