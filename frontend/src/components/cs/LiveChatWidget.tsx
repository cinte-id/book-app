import { useRef, useState, useEffect } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: number;
  from: "user" | "agent";
  text: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    from: "agent",
    text: "Hi there! 👋 How can we help you today?",
  },
];

const autoReplies = [
  "Thanks for your message! Our team is on it.",
  "Got it — can you share a bit more detail?",
  "One moment while I check that for you.",
];

export default function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const replyIndex = useRef(0);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      from: "user",
      text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setDraft("");

    const autoReply: ChatMessage = {
      id: Date.now() + 1,
      from: "agent",
      text: autoReplies[replyIndex.current % autoReplies.length],
    };
    replyIndex.current += 1;
    setMessages((prev) => [...prev, autoReply]);
  };

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      const typing: ChatMessage = {
        id: Date.now() + 2,
        from: "agent",
        text: "Feel free to ask about your account, library, or billing anytime.",
      };
      setMessages((prev) =>
        prev.some((m) => m.id === typing.id) ? prev : [...prev, typing]
      );
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none flex justify-center z-50">
      <div className="w-full max-w-md relative">
        <div className="absolute bottom-24 right-4 pointer-events-auto">
          {open && (
            <div className="mb-2 w-[calc(100vw-2rem)] max-w-sm rounded-lg border bg-background shadow-xl sm:w-80">
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <p className="font-medium">Live Chat</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <ScrollArea className="h-72 p-4">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.from === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                          message.from === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        )}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <form onSubmit={handleSend} className="flex gap-2 border-t p-3">
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message..."
                  aria-label="Chat message"
                />
                <Button type="submit" size="icon" aria-label="Send message">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}

          <Button
            onClick={() => setOpen((prev) => !prev)}
            className="h-14 w-14 rounded-full shadow-lg"
            aria-label={open ? "Close live chat" : "Open live chat"}
          >
            {open ? (
              <X className="h-6 w-6" />
            ) : (
              <MessageSquare className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}