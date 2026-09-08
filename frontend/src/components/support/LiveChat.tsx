import { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type Message = {
  sender: "support" | "user";
  text: string;
};

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "support",
      text: "Hi! 👋 How can we help you today?",
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: message,
      },
      {
        sender: "support",
        text: "Thanks for contacting BookTracker Support. Please describe the issue you are experiencing and our team will assist you.",
      },
    ]);

    setMessage("");
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md">
      {isOpen && (
        <div className="pointer-events-auto absolute bottom-24 right-5 w-[320px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
            <div>
              <p className="font-semibold">
                BookTracker Support
              </p>

              <p className="text-xs text-blue-100">
                ● Online
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 transition hover:bg-blue-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-72 space-y-3 overflow-y-auto bg-gray-50 p-4">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-5 ${
                    item.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 border-t border-gray-200 bg-white p-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />

            <button
              onClick={handleSend}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="pointer-events-auto absolute bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700"
        aria-label="Open live chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}