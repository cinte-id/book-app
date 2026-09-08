import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Search,
  TicketCheck,
  Tickets,
} from "lucide-react";

type Ticket = {
  id: string;
  name: string;
  email: string;
  category: string;
  priority: string;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
};

export default function SupportDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const storedTickets = JSON.parse(
      localStorage.getItem("booktracker-support-tickets") || "[]"
    );

    setTickets(storedTickets);
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.id.toLowerCase().includes(search.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
        ticket.name.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || ticket.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, search, statusFilter]);

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-medium text-blue-600">
          Support Operations
        </p>

        <h2 className="mt-1 text-2xl font-bold text-gray-900">
          Customer Service Dashboard
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Monitor customer support requests and ticket status.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <Tickets className="h-5 w-5 text-blue-600" />

          <p className="mt-3 text-2xl font-bold text-gray-900">
            {tickets.length}
          </p>

          <p className="text-xs text-gray-500">Total Tickets</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <Clock3 className="h-5 w-5 text-orange-500" />

          <p className="mt-3 text-2xl font-bold text-gray-900">
            {openTickets}
          </p>

          <p className="text-xs text-gray-500">Open</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <TicketCheck className="h-5 w-5 text-purple-500" />

          <p className="mt-3 text-2xl font-bold text-gray-900">
            {inProgressTickets}
          </p>

          <p className="text-xs text-gray-500">In Progress</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <CheckCircle2 className="h-5 w-5 text-green-600" />

          <p className="mt-3 text-2xl font-bold text-gray-900">
            {resolvedTickets}
          </p>

          <p className="text-xs text-gray-500">Resolved</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900">
          Support Ticket Tracking
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Search and review submitted support tickets.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ticket ID, customer, or subject..."
          className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
      >
        <option value="All">All Status</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
      </select>

      <div className="space-y-3">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-blue-600">
                    {ticket.id}
                  </p>

                  <h4 className="mt-1 font-semibold text-gray-900">
                    {ticket.subject}
                  </h4>

                  <p className="mt-1 text-sm text-gray-500">
                    {ticket.name}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    ticket.status === "Resolved"
                      ? "bg-green-100 text-green-700"
                      : ticket.status === "In Progress"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                  {ticket.category}
                </span>

                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                  Priority: {ticket.priority}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {ticket.description}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
            <p className="text-sm font-medium text-gray-700">
              No tickets found.
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Submitted support tickets will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}