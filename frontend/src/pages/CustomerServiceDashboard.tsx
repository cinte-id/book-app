import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../locales/LanguageContext";
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    MessageSquare,
    Star,
    Ticket as TicketIcon,
    TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

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

type Feedback = {
    id: string;
    name: string;
    email: string;
    type: string;
    rating: string;
    message: string;
    createdAt: string;
};

type SatisfactionSurvey = {
    id: string;
    ticketId: string;
    rating: number;
    comment: string;
    createdAt: string;
};

const CustomerServiceDashboard = () => {
    const { t, language } = useLanguage();

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [surveys, setSurveys] = useState<SatisfactionSurvey[]>([]);

    useEffect(() => {
        const storedTickets: Ticket[] = JSON.parse(
            localStorage.getItem("tickets") || "[]"
        );

        const storedFeedback: Feedback[] = JSON.parse(
            localStorage.getItem("feedback") || "[]"
        );

        const storedSurveys: SatisfactionSurvey[] = JSON.parse(
            localStorage.getItem("satisfactionSurveys") || "[]"
        );

        setTickets(storedTickets);
        setFeedback(storedFeedback);
        setSurveys(storedSurveys);
    }, []);

    const totalTickets = tickets.length;

    const activeTickets = tickets.filter(
        (ticket) =>
            ticket.status === "Open" ||
            ticket.status === "In Progress"
    ).length;

    const resolvedTickets = tickets.filter(
        (ticket) => ticket.status === "Resolved"
    ).length;

    const averageRating = useMemo(() => {
        if (surveys.length === 0) return "0.0";

        const total = surveys.reduce(
            (sum, survey) => sum + survey.rating,
            0
        );

        return (total / surveys.length).toFixed(1);
    }, [surveys]);

    const statusCount = {
        Open: tickets.filter((ticket) => ticket.status === "Open").length,
        "In Progress": tickets.filter(
            (ticket) => ticket.status === "In Progress"
        ).length,
        Resolved: resolvedTickets,
    };

    const priorityCount = {
        High: tickets.filter((ticket) => ticket.priority === "High").length,
        Medium: tickets.filter((ticket) => ticket.priority === "Medium").length,
        Low: tickets.filter((ticket) => ticket.priority === "Low").length,
    };

    const ratingCount = {
        5: surveys.filter((survey) => survey.rating === 5).length,
        4: surveys.filter((survey) => survey.rating === 4).length,
        3: surveys.filter((survey) => survey.rating === 3).length,
        2: surveys.filter((survey) => survey.rating === 2).length,
        1: surveys.filter((survey) => survey.rating === 1).length,
    };

    const maxRatingCount = Math.max(
        ...Object.values(ratingCount),
        1
    );

    const recentTickets = [...tickets]
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

    const recentFeedback = [...feedback]
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

    const recentSurveys = [...surveys]
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString(
            language === "id" ? "id-ID" : "en-US",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
    };

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
                                {t.support.dashboardTitle}
                            </h1>

                            <p className="text-sm text-gray-500">
                                {t.support.dashboardSubtitle}
                            </p>
                        </div>
                    </div>
                </header>

                <main className="px-4 py-6 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Total Tickets */}
                        <div className="bg-blue-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <TicketIcon
                                    size={22}
                                    className="text-blue-500"
                                />

                                <span className="text-xs text-blue-500 font-medium">
                                    {t.support.total}
                                </span>
                            </div>

                            <p className="text-2xl font-bold text-gray-800 mt-3">
                                {totalTickets}
                            </p>

                            <p className="text-sm text-gray-500">
                                {t.support.totalTickets}
                            </p>
                        </div>

                        {/* Active Tickets */}
                        <div className="bg-yellow-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <Clock
                                    size={22}
                                    className="text-yellow-500"
                                />

                                <span className="text-xs text-yellow-600 font-medium">
                                    {t.support.active}
                                </span>
                            </div>

                            <p className="text-2xl font-bold text-gray-800 mt-3">
                                {activeTickets}
                            </p>

                            <p className="text-sm text-gray-500">
                                {t.support.activeTickets}
                            </p>
                        </div>

                        {/* Resolved Tickets */}
                        <div className="bg-green-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <CheckCircle
                                    size={22}
                                    className="text-green-500"
                                />

                                <span className="text-xs text-green-600 font-medium">
                                    {t.support.done}
                                </span>
                            </div>

                            <p className="text-2xl font-bold text-gray-800 mt-3">
                                {resolvedTickets}
                            </p>

                            <p className="text-sm text-gray-500">
                                {t.support.resolved}
                            </p>
                        </div>

                        {/* Average Rating */}
                        <div className="bg-purple-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <Star
                                    size={22}
                                    className="text-purple-500"
                                />

                                <span className="text-xs text-purple-600 font-medium">
                                    {t.support.rating}
                                </span>
                            </div>

                            <p className="text-2xl font-bold text-gray-800 mt-3">
                                {averageRating}
                            </p>

                            <p className="text-sm text-gray-500">
                                {t.support.averageRating}
                            </p>
                        </div>
                    </div>

                    {/* Ticket Overview */}
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp
                                size={20}
                                className="text-blue-500"
                            />

                            <h2 className="font-semibold text-gray-800">
                                {t.support.ticketOverview}
                            </h2>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-4 space-y-4">
                            {[
                                {
                                    label: t.support.open,
                                    value: statusCount.Open,
                                    width:
                                        totalTickets > 0
                                            ? `${(statusCount.Open / totalTickets) * 100}%`
                                            : "0%",
                                    bg: "bg-blue-500",
                                },
                                {
                                    label: t.support.inProgress,
                                    value: statusCount["In Progress"],
                                    width:
                                        totalTickets > 0
                                            ? `${(statusCount["In Progress"] / totalTickets) * 100}%`
                                            : "0%",
                                    bg: "bg-yellow-500",
                                },
                                {
                                    label: t.support.resolved,
                                    value: statusCount.Resolved,
                                    width:
                                        totalTickets > 0
                                            ? `${(statusCount.Resolved / totalTickets) * 100}%`
                                            : "0%",
                                    bg: "bg-green-500",
                                },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">
                                            {item.label}
                                        </span>

                                        <span className="font-medium text-gray-800">
                                            {item.value}
                                        </span>
                                    </div>

                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.bg} rounded-full`}
                                            style={{ width: item.width }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Priority */}
                    <section>
                        <h2 className="font-semibold text-gray-800 mb-3">
                            {t.support.ticketPriority}
                        </h2>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-red-50 rounded-xl p-3 text-center">
                                <p className="text-xl font-bold text-red-500">
                                    {priorityCount.High}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    {t.support.high}
                                </p>
                            </div>

                            <div className="bg-yellow-50 rounded-xl p-3 text-center">
                                <p className="text-xl font-bold text-yellow-600">
                                    {priorityCount.Medium}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    {t.support.medium}
                                </p>
                            </div>

                            <div className="bg-green-50 rounded-xl p-3 text-center">
                                <p className="text-xl font-bold text-green-500">
                                    {priorityCount.Low}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    {t.support.low}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Satisfaction */}
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <MessageSquare
                                size={20}
                                className="text-purple-500"
                            />

                            <h2 className="font-semibold text-gray-800">
                                {t.support.customerSatisfaction}
                            </h2>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-4">
                            {surveys.length === 0 ? (
                                <div className="text-center py-5">
                                    <Star
                                        size={35}
                                        className="mx-auto text-gray-300 mb-2"
                                    />

                                    <p className="text-sm text-gray-500">
                                        {t.support.noSatisfactionSurvey}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {[5, 4, 3, 2, 1].map((rating) => (
                                        <div
                                            key={rating}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="flex items-center gap-1 w-14">
                                                <span className="text-sm font-medium">
                                                    {rating}
                                                </span>

                                                <Star
                                                    size={14}
                                                    className="fill-yellow-400 text-yellow-400"
                                                />
                                            </div>

                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-yellow-400 rounded-full"
                                                    style={{
                                                        width: `${(ratingCount[
                                                            rating as keyof typeof ratingCount
                                                        ] /
                                                            maxRatingCount) *
                                                            100
                                                            }%`,
                                                    }}
                                                />
                                            </div>

                                            <span className="text-xs text-gray-500 w-5 text-right">
                                                {
                                                    ratingCount[
                                                    rating as keyof typeof ratingCount
                                                    ]
                                                }
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Recent Tickets */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-gray-800">
                                {t.support.recentTickets}
                            </h2>

                            <Link
                                to="/tickets"
                                className="text-sm text-blue-500"
                            >
                                {t.support.viewAll}
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {recentTickets.length > 0 ? (
                                recentTickets.map((ticket) => (
                                    <Link
                                        key={ticket.id}
                                        to={`/tickets/${ticket.id}`}
                                        className="block border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-400">
                                                    {ticket.id}
                                                </p>

                                                <h3 className="font-medium text-gray-800 truncate mt-1">
                                                    {ticket.subject}
                                                </h3>

                                                <p className="text-xs text-gray-500 mt-1">
                                                    {ticket.category} • {ticket.priority}
                                                </p>
                                            </div>

                                            <span
                                                className={`self-start text-xs px-2 py-1 rounded-full ${ticket.status === "Open"
                                                    ? "bg-blue-100 text-blue-600"
                                                    : ticket.status === "In Progress"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : "bg-green-100 text-green-600"
                                                    }`}
                                            >
                                                {ticket.status === "Open"
                                                    ? t.support.open
                                                    : ticket.status === "In Progress"
                                                        ? t.support.inProgress
                                                        : t.support.resolved}
                                            </span>
                                        </div>

                                        <p className="text-xs text-gray-400 mt-3">
                                            {formatDate(ticket.createdAt)}
                                        </p>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-6 border border-gray-200 rounded-xl">
                                    <p className="text-sm text-gray-500">
                                        {t.support.noTicketsYet}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Recent Surveys */}
                    <section>
                        <h2 className="font-semibold text-gray-800 mb-3">
                            {t.support.recentSatisfactionFeedback}
                        </h2>

                        <div className="space-y-3">
                            {recentSurveys.length > 0 ? (
                                recentSurveys.map((survey) => (
                                    <div
                                        key={survey.id}
                                        className="border border-gray-200 rounded-xl p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={16}
                                                        className={
                                                            star <= survey.rating
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-gray-300"
                                                        }
                                                    />
                                                ))}
                                            </div>

                                            <span className="text-xs text-gray-400">
                                                {survey.ticketId}
                                            </span>
                                        </div>

                                        {survey.comment ? (
                                            <p className="text-sm text-gray-600 mt-3">
                                                "{survey.comment}"
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-400 mt-3 italic">
                                                No additional comment.
                                            </p>
                                        )}

                                        <p className="text-xs text-gray-400 mt-2">
                                            {formatDate(survey.createdAt)}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 border border-gray-200 rounded-xl">
                                    <p className="text-sm text-gray-500">
                                        {t.support.noSatisfactionFeedback}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Recent Feedback */}
                    <section>
                        <h2 className="font-semibold text-gray-800 mb-3">
                            {t.support.recentFeedback}
                        </h2>

                        <div className="space-y-3">
                            {recentFeedback.length > 0 ? (
                                recentFeedback.map((item) => (
                                    <div
                                        key={item.id}
                                        className="border border-gray-200 rounded-xl p-4"
                                    >
                                        <div className="flex justify-between gap-3">
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {item.type}
                                                </p>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    {item.name}
                                                </p>
                                            </div>

                                            <span className="text-yellow-500 text-sm">
                                                ★ {item.rating}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 mt-3">
                                            {item.message}
                                        </p>

                                        <p className="text-xs text-gray-400 mt-2">
                                            {formatDate(item.createdAt)}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 border border-gray-200 rounded-xl">
                                    <p className="text-sm text-gray-500">
                                        {t.support.noFeedbackYet}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default CustomerServiceDashboard;