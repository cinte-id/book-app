import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type Message = {
    id: number;
    sender: "user" | "support";
    text: string;
};

const LiveChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: "support",
            text: "Hi! 👋 How can we help you today?",
        },
    ]);

    const handleSend = () => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage) return;

        const newMessage: Message = {
            id: Date.now(),
            sender: "user",
            text: trimmedMessage,
        };

        setMessages((prev) => [...prev, newMessage]);
        setMessage("");

        // Simulasi balasan customer service
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: "support",
                    text: "Thanks for your message. Our support team will assist you shortly.",
                },
            ]);
        }, 800);
    };

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 z-50 w-[calc(100%-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-500 text-white px-4 py-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">Customer Support</h3>
                            <p className="text-xs text-blue-100">
                                Usually replies instantly
                            </p>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 rounded-full hover:bg-blue-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {messages.map((item) => (
                            <div
                                key={item.id}
                                className={`flex ${item.sender === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${item.sender === "user"
                                            ? "bg-blue-500 text-white rounded-br-md"
                                            : "bg-white text-gray-700 border border-gray-200 rounded-bl-md"
                                        }`}
                                >
                                    {item.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t bg-white">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSend();
                                    }
                                }}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                onClick={handleSend}
                                className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-20 left-[calc(50%+168px)] -translate-x-1/2 z-40 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                    aria-label="Open customer support chat"
                >
                    <MessageCircle size={26} />
                </button>
            )}
        </>
    );
};

export default LiveChat;