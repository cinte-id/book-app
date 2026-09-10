import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../locales/LanguageContext";

type Ticket = {
    id: string;
    name: string;
    email: string;
    category: string;
    priority: string;
    subject: string;
    description: string;
    status: "Open" | "In Progress" | "Resolved";
    createdAt: string;
};

const Tickets = () => {
    const { t, language } = useLanguage();
    const [tickets, setTickets] = useState<Ticket[]>([]);

    useEffect(() => {
        const savedTickets = JSON.parse(
            localStorage.getItem("tickets") || "[]"
        );

        setTickets(savedTickets);
    }, []);

    const getPriorityClass = (priority: string) => {
        switch (priority) {
            case "High":
                return "bg-red-100 text-red-600";

            case "Medium":
                return "bg-yellow-100 text-yellow-600";

            case "Low":
                return "bg-green-100 text-green-600";

            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case "Open":
                return "bg-blue-100 text-blue-600";

            case "In Progress":
                return "bg-yellow-100 text-yellow-600";

            case "Resolved":
                return "bg-green-100 text-green-600";

            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const getStatusLabel = (status: Ticket["status"]) => {
        switch (status) {
            case "Open":
                return t.support.open;

            case "In Progress":
                return t.support.inProgress;

            case "Resolved":
                return t.support.resolved;

            default:
                return status;
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case "High":
                return t.support.high;

            case "Medium":
                return t.support.medium;

            case "Low":
                return t.support.low;

            default:
                return priority;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-md mx-auto bg-white min-h-screen">
                {/* Header */}
                <header className="px-4 py-5 border-b bg-white">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/help"
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <ArrowLeft size={20} />
                        </Link>

                        <div>
                            <h1 className="text-xl font-bold text-gray-800">
                                {t.support.ticketsTitle}
                            </h1>

                            <p className="text-sm text-gray-500">
                                {t.support.ticketsSubtitle}
                            </p>
                        </div>
                    </div>
                </header>

                <main className="px-4 py-6">
                    {tickets.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-5xl mb-4">🎫</div>

                            <h2 className="font-semibold text-gray-800">
                                {t.support.noTickets}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1 mb-5">
                                {t.support.noTicketsDescription}
                            </p>

                            <Link
                                to="/contact-support"
                                className="inline-block bg-blue-500 text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-blue-600"
                            >
                                {t.support.contactSupport}
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tickets.map((ticket) => (
                                <Link
                                    key={ticket.id}
                                    to={`/tickets/${ticket.id}`}
                                    className="block border border-gray-200 rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between gap-3 mb-3">
                                        <span className="text-sm font-semibold text-blue-500">
                                            {ticket.id}
                                        </span>

                                        <span
                                            className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusClass(
                                                ticket.status
                                            )}`}
                                        >
                                            {getStatusLabel(ticket.status)}
                                        </span>
                                    </div>

                                    <h2 className="font-semibold text-gray-800 mb-2">
                                        {ticket.subject}
                                    </h2>

                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                        {ticket.description}
                                    </p>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                            {ticket.category}
                                        </span>

                                        <span
                                            className={`text-xs px-3 py-1 rounded-full ${getPriorityClass(
                                                ticket.priority
                                            )}`}
                                        >
                                            {getPriorityLabel(ticket.priority)}
                                        </span>
                                    </div>

                                    <p className="text-xs text-gray-400 mt-4">
                                        {t.support.created}:{" "}
                                        {new Date(ticket.createdAt).toLocaleString(
                                            language === "id" ? "id-ID" : "en-US"
                                        )}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Create Ticket */}
                    {tickets.length > 0 && (
                        <Link
                            to="/contact-support"
                            className="block text-center bg-blue-500 text-white py-3 rounded-xl font-medium mt-6 hover:bg-blue-600"
                        >
                            {t.support.createTicket}
                        </Link>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Tickets;