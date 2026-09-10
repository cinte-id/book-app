import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

const TicketDetail = () => {
    const { t, language } = useLanguage();
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState<Ticket | null>(null);

    useEffect(() => {
        const savedTickets: Ticket[] = JSON.parse(
            localStorage.getItem("tickets") || "[]"
        );

        const foundTicket = savedTickets.find(
            (item) => item.id === id
        );

        setTicket(foundTicket || null);
    }, [id]);

    const updateStatus = (newStatus: Ticket["status"]) => {
        if (!ticket) return;

        const savedTickets: Ticket[] = JSON.parse(
            localStorage.getItem("tickets") || "[]"
        );

        const updatedTickets = savedTickets.map((item) =>
            item.id === ticket.id
                ? { ...item, status: newStatus }
                : item
        );

        localStorage.setItem(
            "tickets",
            JSON.stringify(updatedTickets)
        );

        setTicket({
            ...ticket,
            status: newStatus,
        });
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

    if (!ticket) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-md mx-auto bg-white min-h-screen">
                    <header className="px-4 py-5 border-b">
                        <div className="flex items-center gap-3">
                            <Link
                                to="/tickets"
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <ArrowLeft size={20} />
                            </Link>

                            <h1 className="text-xl font-bold text-gray-800">
                                {t.support.ticketDetail}
                            </h1>
                        </div>
                    </header>

                    <main className="px-4 py-16 text-center">
                        <div className="text-5xl mb-4">🎫</div>

                        <h2 className="font-semibold text-gray-800">
                            {t.support.ticketNotFound}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1 mb-5">
                            {t.support.ticketNotFoundDescription}
                        </p>

                        <button
                            onClick={() => navigate("/tickets")}
                            className="bg-blue-500 text-white px-5 py-3 rounded-xl text-sm font-medium"
                        >
                            {t.support.backToTickets}
                        </button>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-md mx-auto bg-white min-h-screen">
                {/* Header */}
                <header className="px-4 py-5 border-b bg-white">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/tickets"
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <ArrowLeft size={20} />
                        </Link>

                        <div>
                            <h1 className="text-xl font-bold text-gray-800">
                                {t.support.ticketDetail}
                            </h1>

                            <p className="text-sm text-gray-500">
                                {ticket.id}
                            </p>
                        </div>
                    </div>
                </header>

                <main className="px-4 py-6 space-y-5">
                    {/* Ticket Title */}
                    <div>
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

                        <h2 className="text-xl font-bold text-gray-800">
                            {ticket.subject}
                        </h2>
                    </div>

                    {/* Information */}
                    <div className="border border-gray-200 rounded-2xl p-4 space-y-4">
                        <h3 className="font-semibold text-gray-800">
                            {t.support.ticketInformation}
                        </h3>

                        <div>
                            <p className="text-xs text-gray-400">
                                {t.support.name}
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                                {ticket.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-400">
                                {t.support.email}
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                                {ticket.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-400">
                                {t.support.category}
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                                {ticket.category}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-400">
                                {t.support.priority}
                            </p>
                            <span
                                className={`inline-block text-xs px-3 py-1 rounded-full mt-1 ${getPriorityClass(
                                    ticket.priority
                                )}`}
                            >
                                {getPriorityLabel(ticket.priority)}
                            </span>
                        </div>

                        <div>
                            <p className="text-xs text-gray-400">
                                {t.support.created}
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                                {new Date(ticket.createdAt).toLocaleString(
                                    language === "id" ? "id-ID" : "en-US"
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="border border-gray-200 rounded-2xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">
                            {t.support.description}
                        </h3>

                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                            {ticket.description}
                        </p>
                    </div>

                    {/* Status */}
                    <div className="border border-gray-200 rounded-2xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">
                            {t.support.updateStatus}
                        </h3>

                        <div className="space-y-2">
                            <button
                                onClick={() => updateStatus("Open")}
                                className={`w-full py-3 rounded-xl text-sm font-medium border ${ticket.status === "Open"
                                    ? "bg-blue-500 text-white border-blue-500"
                                    : "bg-white text-gray-600 border-gray-200"
                                    }`}
                            >
                                {t.support.open}
                            </button>

                            <button
                                onClick={() => updateStatus("In Progress")}
                                className={`w-full py-3 rounded-xl text-sm font-medium border ${ticket.status === "In Progress"
                                    ? "bg-yellow-500 text-white border-yellow-500"
                                    : "bg-white text-gray-600 border-gray-200"
                                    }`}
                            >
                                {t.support.inProgress}
                            </button>

                            <button
                                onClick={() => updateStatus("Resolved")}
                                className={`w-full py-3 rounded-xl text-sm font-medium border ${ticket.status === "Resolved"
                                    ? "bg-green-500 text-white border-green-500"
                                    : "bg-white text-gray-600 border-gray-200"
                                    }`}
                            >
                                {t.support.resolved}
                            </button>
                        </div>
                    </div>
                    {ticket.status === "Resolved" && (
                        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="text-yellow-500">
                                    ★
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800">
                                        {t.support.howWasSupport}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {t.support.supportExperience}
                                    </p>

                                    <Link
                                        to={`/satisfaction-survey?ticket=${ticket.id}`}
                                        className="inline-block mt-3 bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600"
                                    >
                                        {t.support.rateSupport}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default TicketDetail;