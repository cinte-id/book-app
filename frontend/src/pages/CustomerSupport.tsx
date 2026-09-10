import { FormEvent, useMemo, useState } from "react";

type Ticket = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "Open" | "Pending" | "Resolved";
  createdAt: string;
};

type Feedback = {
  id: string;
  name: string;
  message: string;
  rating: number;
  createdAt: string;
};

type ChatMessage = {
  sender: "support" | "user";
  text: string;
};

const FAQ_DATA = [
  {
    category: "Library",
    question: "How do I add a new book?",
    answer:
      "Open the Library page and use the Add Book button. Enter the book title, author, and reading status, then save the book.",
  },
  {
    category: "Library",
    question: "How do I edit a book?",
    answer:
      "Open the book details from your library and select the edit option. Update the information and save your changes.",
  },
  {
    category: "Reading",
    question: "How do I update my reading status?",
    answer:
      "Open your book details and change the status between Unread, Reading, and Completed.",
  },
  {
    category: "Reading",
    question: "Can I track my reading progress?",
    answer:
      "Yes. You can use the reading information on the book details page to keep track of your progress.",
  },
  {
    category: "Account",
    question: "What should I do if I have a problem with my account?",
    answer:
      "If you cannot solve the issue using the FAQ, submit a support ticket and our customer service team can assist you.",
  },
  {
    category: "Support",
    question: "How can I contact customer support?",
    answer:
      "Use the Contact Support form below. After submitting the form, a support ticket will be created.",
  },
];

const getTickets = (): Ticket[] => {
  try {
    return JSON.parse(localStorage.getItem("booktracker_tickets") || "[]");
  } catch {
    return [];
  }
};

const getFeedback = (): Feedback[] => {
  try {
    return JSON.parse(localStorage.getItem("booktracker_feedback") || "[]");
  } catch {
    return [];
  }
};

const CustomerSupport = () => {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [ticket, setTicket] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [feedback, setFeedback] = useState({
    name: "",
    message: "",
    rating: 5,
  });

  const [ticketSuccess, setTicketSuccess] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState("");

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "support",
      text: "Hello! Welcome to BookTracker Support. How can we help you today?",
    },
  ]);

  const filteredFaq = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return FAQ_DATA;
    }

    return FAQ_DATA.filter(
      (item) =>
        item.question.toLowerCase().includes(keyword) ||
        item.answer.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword)
    );
  }, [search]);

  const handleTicketSubmit = (event: FormEvent) => {
    event.preventDefault();

    setTicketSuccess("");

    if (
      !ticket.name.trim() ||
      !ticket.email.trim() ||
      !ticket.subject.trim() ||
      !ticket.message.trim()
    ) {
      return;
    }

    const newTicket: Ticket = {
      id: `TKT-${Date.now()}`,
      name: ticket.name,
      email: ticket.email,
      subject: ticket.subject,
      message: ticket.message,
      status: "Open",
      createdAt: new Date().toLocaleString(),
    };

    const tickets = getTickets();

    localStorage.setItem(
      "booktracker_tickets",
      JSON.stringify([newTicket, ...tickets])
    );

    setTicketSuccess(
      `Ticket ${newTicket.id} berhasil dibuat. Status: Open.`
    );

    setTicket({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const handleFeedbackSubmit = (event: FormEvent) => {
    event.preventDefault();

    setFeedbackSuccess("");

    if (!feedback.name.trim() || !feedback.message.trim()) {
      return;
    }

    const newFeedback: Feedback = {
      id: `FDB-${Date.now()}`,
      name: feedback.name,
      message: feedback.message,
      rating: feedback.rating,
      createdAt: new Date().toLocaleString(),
    };

    const feedbackList = getFeedback();

    localStorage.setItem(
      "booktracker_feedback",
      JSON.stringify([newFeedback, ...feedbackList])
    );

    setFeedbackSuccess("Thank you! Your feedback has been submitted.");

    setFeedback({
      name: "",
      message: "",
      rating: 5,
    });
  };

  const sendChatMessage = () => {
    const message = chatInput.trim();

    if (!message) {
      return;
    }

    setChatMessages((previous) => [
      ...previous,
      {
        sender: "user",
        text: message,
      },
      {
        sender: "support",
        text: "Thanks for contacting us. Please submit a support ticket if you need detailed assistance.",
      },
    ]);

    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">BookTracker Support</h1>
            <p className="text-sm text-slate-500">
              Customer Service Center
            </p>
          </div>

          <div className="flex gap-2">
            <a
              href="/"
              className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
            >
              Back to BookTracker
            </a>

            <a
              href="/support/dashboard"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
            >
              CS Dashboard
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        {/* HERO */}
        <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
          <p className="mb-2 text-sm font-medium text-blue-100">
            CUSTOMER SERVICE
          </p>

          <h2 className="mb-3 text-3xl font-bold">
            How can we help you?
          </h2>

          <p className="mb-6 max-w-2xl text-blue-100">
            Search our FAQ, learn how to use BookTracker, contact support,
            or send us your feedback.
          </p>

          <div className="max-w-2xl rounded-xl bg-white p-2">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search help articles..."
              className="w-full rounded-lg px-4 py-3 text-slate-900 outline-none"
            />
          </div>
        </section>

        {/* QUICK ACCESS */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">
            How can we help?
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="#faq"
              className="rounded-xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-3 text-3xl">❓</div>
              <h3 className="font-semibold">Help & FAQ</h3>
              <p className="mt-2 text-sm text-slate-500">
                Search frequently asked questions.
              </p>
            </a>

            <a
              href="#guide"
              className="rounded-xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-3 text-3xl">📖</div>
              <h3 className="font-semibold">User Guide</h3>
              <p className="mt-2 text-sm text-slate-500">
                Learn how to use BookTracker.
              </p>
            </a>

            <a
              href="#contact"
              className="rounded-xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-3 text-3xl">🎧</div>
              <h3 className="font-semibold">Contact Support</h3>
              <p className="mt-2 text-sm text-slate-500">
                Create a support ticket.
              </p>
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="rounded-2xl border bg-white p-6"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Frequently Asked Questions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredFaq.length} article(s) found.
            </p>
          </div>

          <div className="space-y-3">
            {filteredFaq.map((item, index) => (
              <div
                key={`${item.category}-${item.question}`}
                className="overflow-hidden rounded-xl border"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                  className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50"
                >
                  <div>
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">
                      {item.category}
                    </span>

                    <p className="mt-2 font-semibold">
                      {item.question}
                    </p>
                  </div>

                  <span className="text-xl">
                    {openFaq === index ? "−" : "+"}
                  </span>
                </button>

                {openFaq === index && (
                  <div className="border-t bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}

            {filteredFaq.length === 0 && (
              <div className="rounded-xl bg-slate-50 p-8 text-center text-slate-500">
                No FAQ articles found.
              </div>
            )}
          </div>
        </section>

        {/* USER GUIDE */}
        <section
          id="guide"
          className="rounded-2xl border bg-white p-6"
        >
          <h2 className="text-2xl font-bold">User Guide</h2>

          <p className="mt-1 text-sm text-slate-500">
            Follow these steps to get started with BookTracker.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border p-5">
              <div className="mb-3 text-3xl font-bold text-blue-600">
                01
              </div>
              <h3 className="font-semibold">Add a Book</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Add a book to your library by entering the title,
                author, and reading status.
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <div className="mb-3 text-3xl font-bold text-blue-600">
                02
              </div>
              <h3 className="font-semibold">Track Reading</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Update the reading status as you progress through
                your books.
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <div className="mb-3 text-3xl font-bold text-blue-600">
                03
              </div>
              <h3 className="font-semibold">Manage Library</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Browse your books and manage your personal reading
                collection.
              </p>
            </div>
          </div>
        </section>

        {/* CONTACT SUPPORT */}
        <section
          id="contact"
          className="rounded-2xl border bg-white p-6"
        >
          <h2 className="text-2xl font-bold">Contact Support</h2>

          <p className="mt-1 text-sm text-slate-500">
            Submit a ticket and our customer service team can review
            your issue.
          </p>

          {ticketSuccess && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              ✅ {ticketSuccess}
            </div>
          )}

          <form
            onSubmit={handleTicketSubmit}
            className="mt-6 space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                required
                value={ticket.name}
                onChange={(event) =>
                  setTicket({
                    ...ticket,
                    name: event.target.value,
                  })
                }
                placeholder="Your name"
                className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                type="email"
                required
                value={ticket.email}
                onChange={(event) =>
                  setTicket({
                    ...ticket,
                    email: event.target.value,
                  })
                }
                placeholder="Email address"
                className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <input
              type="text"
              required
              value={ticket.subject}
              onChange={(event) =>
                setTicket({
                  ...ticket,
                  subject: event.target.value,
                })
              }
              placeholder="Subject"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            <textarea
              required
              value={ticket.message}
              onChange={(event) =>
                setTicket({
                  ...ticket,
                  message: event.target.value,
                })
              }
              placeholder="Describe your problem..."
              rows={5}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              Submit Support Ticket
            </button>
          </form>
        </section>

        {/* FEEDBACK */}
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-2xl font-bold">
            Feedback & Suggestions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Tell us how we can improve BookTracker.
          </p>

          {feedbackSuccess && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              ✅ {feedbackSuccess}
            </div>
          )}

          <form
            onSubmit={handleFeedbackSubmit}
            className="mt-6 space-y-4"
          >
            <input
              type="text"
              required
              value={feedback.name}
              onChange={(event) =>
                setFeedback({
                  ...feedback,
                  name: event.target.value,
                })
              }
              placeholder="Your name"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            <div>
              <label className="mb-2 block text-sm font-medium">
                Satisfaction
              </label>

              <select
                value={feedback.rating}
                onChange={(event) =>
                  setFeedback({
                    ...feedback,
                    rating: Number(event.target.value),
                  })
                }
                className="rounded-lg border px-4 py-3"
              >
                <option value={5}>5 - Very satisfied</option>
                <option value={4}>4 - Satisfied</option>
                <option value={3}>3 - Neutral</option>
                <option value={2}>2 - Unsatisfied</option>
                <option value={1}>1 - Very unsatisfied</option>
              </select>
            </div>

            <textarea
              required
              value={feedback.message}
              onChange={(event) =>
                setFeedback({
                  ...feedback,
                  message: event.target.value,
                })
              }
              placeholder="Your feedback or suggestion..."
              rows={5}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
            >
              Submit Feedback
            </button>
          </form>
        </section>
      </main>

      {/* LIVE CHAT BUTTON */}
      <button
        type="button"
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 rounded-full bg-blue-600 px-5 py-4 font-semibold text-white shadow-xl hover:bg-blue-700"
      >
        💬 {chatOpen ? "Close Chat" : "Live Chat"}
      </button>

      {/* LIVE CHAT */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 z-30 flex w-80 flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">
          <div className="bg-blue-600 p-4 text-white">
            <p className="font-semibold">BookTracker Support</p>
            <p className="text-xs text-blue-100">
              Customer Service · Online
            </p>
          </div>

          <div className="h-72 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 border-t p-3">
            <input
              type="text"
              value={chatInput}
              onChange={(event) =>
                setChatInput(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  sendChatMessage();
                }
              }}
              placeholder="Type a message..."
              className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
            />

            <button
              type="button"
              onClick={sendChatMessage}
              className="rounded-lg bg-blue-600 px-3 text-white hover:bg-blue-700"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSupport;