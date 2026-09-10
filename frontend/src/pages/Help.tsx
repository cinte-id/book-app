import { useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../locales/LanguageContext";
import { faqCategories, faqs } from "../data/supportData";

const Help = () => {
    const { language, t } = useLanguage();
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const getCategoryLabel = (item: string) => {
        if (language === "id") {
            const categoryMap: Record<string, string> = {
                All: "Semua",
                Account: "Akun",
                Books: "Buku",
                Reading: "Membaca",
                Technical: "Teknis",
            };

            return categoryMap[item] || item;
        }

        return item;
    };

    const filteredFaqs = useMemo(() => {
        const searchText = search.toLowerCase().trim();

        return faqs.filter((faq) => {
            const matchesCategory =
                category === "All" || faq.category === category;

            const question = faq.question[language];
            const answer = faq.answer[language];

            const matchesSearch =
                searchText === "" ||
                question.toLowerCase().includes(searchText) ||
                answer.toLowerCase().includes(searchText);

            return matchesCategory && matchesSearch;
        });
    }, [search, category, language]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-md mx-auto bg-white min-h-screen">
                {/* Header */}
                <header className="px-4 py-5 border-b bg-white">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/"
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <ArrowLeft size={20} />
                        </Link>

                        <div>
                            <h1 className="text-xl font-bold text-gray-800">
                                {t.help.title}
                            </h1>

                            <p className="text-sm text-gray-500">
                                {t.help.subtitle}
                            </p>
                        </div>
                    </div>
                </header>

                <main className="px-4 py-6 space-y-6">
                    {/* Search */}
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-3 text-gray-400"
                            size={20}
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t.help.searchPlaceholder}
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Categories */}
                    <div>
                        <h2 className="font-semibold text-gray-800 mb-3">
                            {t.help.categories}
                        </h2>

                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {faqCategories.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => {
                                        setCategory(item);
                                        setOpenFaq(null);
                                    }}
                                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        category === item
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {getCategoryLabel(item)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FAQ */}
                    <div>
                        <h2 className="font-semibold text-gray-800 mb-3">
                            {t.help.frequentlyAsked}
                        </h2>

                        <div className="space-y-3">
                            {filteredFaqs.length > 0 ? (
                                filteredFaqs.map((faq) => (
                                    <div
                                        key={faq.id}
                                        className="border border-gray-200 rounded-xl bg-white overflow-hidden"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenFaq(
                                                    openFaq === faq.id
                                                        ? null
                                                        : faq.id
                                                )
                                            }
                                            className="w-full flex items-center justify-between gap-4 p-4 text-left"
                                        >
                                            <div>
                                                <span className="text-xs text-blue-500 font-medium">
                                                    {getCategoryLabel(
                                                        faq.category
                                                    )}
                                                </span>

                                                <h3 className="font-medium text-gray-800 mt-1">
                                                    {faq.question[language]}
                                                </h3>
                                            </div>

                                            <ChevronDown
                                                size={20}
                                                className={`flex-shrink-0 transition-transform ${
                                                    openFaq === faq.id
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            />
                                        </button>

                                        {openFaq === faq.id && (
                                            <div className="px-4 pb-4">
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {faq.answer[language]}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-gray-500">
                                        {t.help.noResults}
                                    </p>

                                    <p className="text-sm text-gray-400 mt-1">
                                        {t.help.tryAnother}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Support Actions */}
                    <div className="space-y-3">
                        {/* Contact Support */}
                        <div className="bg-blue-50 rounded-2xl p-5">
                            <h3 className="font-semibold text-gray-800">
                                {t.help.stillNeedHelp}
                            </h3>

                            <p className="text-sm text-gray-600 mt-1 mb-4">
                                {t.help.contactDescription}
                            </p>

                            <Link
                                to="/contact-support"
                                className="block text-center bg-blue-500 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                            >
                                {t.help.contactSupport}
                            </Link>
                        </div>

                        {/* My Tickets */}
                        <Link
                            to="/tickets"
                            className="block border border-gray-200 bg-white text-gray-700 text-center px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            {t.help.tickets}
                        </Link>

                        {/* User Guide */}
                        <Link
                            to="/user-guide"
                            className="block border border-gray-200 bg-white text-gray-700 text-center px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            {t.help.userGuide}
                        </Link>

                        {/* Feedback */}
                        <Link
                            to="/feedback"
                            className="block border border-gray-200 bg-white text-gray-700 text-center px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            {t.help.feedback}
                        </Link>

                        {/* Knowledge Base */}
                        <Link
                            to="/knowledge-base"
                            className="block border border-gray-200 bg-white text-gray-700 text-center px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            {t.help.knowledgeBase}
                        </Link>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Help;
