import { useMemo, useState } from "react";
import { Search, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

type FAQItem = {
  category: string;
  question: string;
  answer: string;
};

const faqData: FAQItem[] = [
  {
    category: "Book Management",
    question: "How do I add a new book?",
    answer:
      "Go to the Library section, choose the book you want, and add it to your reading list.",
  },
  {
    category: "Book Management",
    question: "How do I change a book's reading status?",
    answer:
      "Open the selected book and update its status to Unread, Reading, or Completed.",
  },
  {
    category: "Book Management",
    question: "How do I remove a book from my library?",
    answer:
      "Open the book details and choose the delete or remove option. Confirm the action when prompted.",
  },
  {
    category: "Troubleshooting",
    question: "Why is my book not appearing in the library?",
    answer:
      "Refresh the page and make sure your internet connection is stable. If the issue continues, contact support.",
  },
  {
    category: "Troubleshooting",
    question: "Why are my changes not being saved?",
    answer:
      "Check your internet connection and try the action again. If the problem persists, submit a support ticket.",
  },
  {
    category: "Troubleshooting",
    question: "What should I do if the application fails to load?",
    answer:
      "Reload the page, check your connection, and try opening the application again. Contact support if the issue continues.",
  },
  {
    category: "General",
    question: "What is BookTracker?",
    answer:
      "BookTracker is an application that helps you manage your reading list and monitor your reading progress.",
  },
  {
    category: "General",
    question: "What reading statuses are available?",
    answer:
      "Books can be marked as Unread, Reading, or Completed.",
  },
];

export default function FAQSection() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = ["All", ...new Set(faqData.map((item) => item.category))];

  const filteredFaqs = useMemo(() => {
    return faqData.filter((item) => {
      const matchSearch =
        item.question.toLowerCase().includes(search.toLowerCase()) ||
        item.answer.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        activeCategory === "All" || item.category === activeCategory;

      return matchSearch && matchCategory;
    });
  }, [search, activeCategory]);

  return (
    <section className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Help & FAQ</h2>
        </div>

        <p className="text-sm text-gray-500">
          Find quick answers to common questions about BookTracker.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

        <input
          type="text"
          placeholder="Search for help..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category);
              setOpenIndex(null);
            }}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              activeCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={`${item.question}-${index}`}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left"
                >
                  <div>
                    <span className="mb-1 block text-xs font-medium text-blue-600">
                      {item.category}
                    </span>

                    <span className="text-sm font-semibold text-gray-900">
                      {item.question}
                    </span>
                  </div>

                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 shrink-0 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 shrink-0 text-gray-500" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 px-4 py-3">
                    <p className="text-sm leading-6 text-gray-600">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
            <p className="text-sm font-medium text-gray-700">
              No matching questions found.
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Try another keyword or contact support.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}