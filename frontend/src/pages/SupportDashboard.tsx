import { useEffect, useState } from "react";

type TicketStatus = "Open" | "Pending" | "Resolved";

type Ticket = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: TicketStatus;
  createdAt: string;
};

type Feedback = {
  id: string;
  name: string;
  message: string;
  rating: number;
  createdAt: string;
};

const SupportDashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  const loadData = () => {
    try {
      const savedTickets = JSON.parse(
        localStorage.getItem("booktracker_tickets") || "[]"
      );

      const savedFeedback = JSON.parse(
        localStorage.getItem("booktracker_feedback") || "[]"
      );

      setTickets(savedTickets);
      setFeedback(savedFeedback);
    } catch {
      setTickets([]);
      setFeedback([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateTicketStatus = (
    id: string,
    status: TicketStatus
  ) => {
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === id
        ? {
            ...ticket,
            status,
          }
        : ticket
    );

    setTickets(updatedTickets);

    localStorage.setItem(
      "booktracker_tickets",
      JSON.stringify(updatedTickets)
    );
  };

  const deleteTicket = (id: string) => {
    const updatedTickets = tickets.filter(
      (ticket) => ticket.id !== id
    );

    setTickets(updatedTickets);

    localStorage.setItem(
      "booktracker_tickets",
      JSON.stringify(updatedTickets)
    );
  };

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const pendingTickets = tickets.filter(
    (ticket) => ticket.status === "Pending"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const averageRating =
    feedback.length > 0
      ? (
          feedback.reduce(
            (total, item) => total + item.rating,
            0
          ) / feedback.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              Customer Service Dashboard
            </h1>

            <p className="text-sm text-slate-500">
              Monitor support tickets and customer feedback
            </p>
          </div>

          <a
            href="/support"
            className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
          >
            ← Support Center
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        {/* STATISTICS */}
        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-slate-500">
              Open Tickets
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {openTickets}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-slate-500">
              Pending Tickets
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-500">
              {pendingTickets}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-slate-500">
              Resolved Tickets
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {resolvedTickets}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-slate-500">
              Satisfaction
            </p>

            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {averageRating}/5
            </p>
          </div>
        </section>

        {/* ANALYTICS */}
        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-bold">
            Customer Service Analytics
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Overview of current support activity.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-5">
              <p className="text-sm text-blue-600">
                Total Tickets
              </p>

              <p className="mt-2 text-2xl font-bold">
                {tickets.length}
              </p>
            </div>

            <div className="rounded-lg bg-indigo-50 p-5">
              <p className="text-sm text-indigo-600">
                Total Feedback
              </p>

              <p className="mt-2 text-2xl font-bold">
                {feedback.length}
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-5">
              <p className="text-sm text-green-600">
                Resolution Rate
              </p>

              <p className="mt-2 text-2xl font-bold">
                {tickets.length > 0
                  ? `${Math.round(
                      (resolvedTickets / tickets.length) * 100
                    )}%`
                  : "0%"}
              </p>
            </div>
          </div>
        </section>

        {/* TICKETS */}
        <section className="rounded-xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Support Tickets
              </h2>

              <p className="text-sm text-slate-500">
                Manage incoming customer requests.
              </p>
            </div>

            <button
              onClick={loadData}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            {tickets.length === 0 ? (
              <div className="rounded-lg bg-slate-50 p-8 text-center text-slate-500">
                No support tickets yet.
              </div>
            ) : (
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="px-4 py-3">Ticket</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b last:border-0"
                    >
                      <td className="px-4 py-4 font-medium">
                        {ticket.id}
                        <div className="text-xs text-slate-400">
                          {ticket.createdAt}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-medium">
                          {ticket.name}
                        </div>

                        <div className="text-xs text-slate-500">
                          {ticket.email}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        {ticket.subject}
                      </td>

                      <td className="max-w-xs px-4 py-4 text-slate-500">
                        {ticket.message}
                      </td>

                      <td className="px-4 py-4">
                        <select
                          value={ticket.status}
                          onChange={(event) =>
                            updateTicketStatus(
                              ticket.id,
                              event.target
                                .value as TicketStatus
                            )
                          }
                          className="rounded-lg border px-3 py-2"
                        >
                          <option value="Open">
                            Open
                          </option>

                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Resolved">
                            Resolved
                          </option>
                        </select>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          onClick={() =>
                            deleteTicket(ticket.id)
                          }
                          className="rounded-lg bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* FEEDBACK */}
        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-bold">
            Customer Feedback
          </h2>

          <div className="mt-6 space-y-3">
            {feedback.length === 0 ? (
              <div className="rounded-lg bg-slate-50 p-8 text-center text-slate-500">
                No feedback submitted yet.
              </div>
            ) : (
              feedback.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border p-4"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">
                        {item.name}
                      </p>

                      <p className="text-xs text-slate-400">
                        {item.createdAt}
                      </p>
                    </div>

                    <span className="font-medium text-yellow-600">
                      ★ {item.rating}/5
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-600">
                    {item.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SupportDashboard;