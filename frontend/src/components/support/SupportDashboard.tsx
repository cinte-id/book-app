import { useState } from "react";
import { Ticket, CheckCircle, Clock, Star, ArrowLeft } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface TicketItem {
  id: string;
  subject: string;
  user: string;
  status: "Open" | "In Progress" | "Resolved";
  category: string;
  date: string;
  message: string;
}

const allTickets: TicketItem[] = [
  {
    id: "CS-001",
    subject: "Cannot log in to my account",
    user: "alice@email.com",
    status: "Open",
    category: "Account",
    date: "2026-09-09",
    message:
      "I've tried resetting my password three times but I still can't log in. The reset email arrives but the link says it's expired.",
  },
  {
    id: "CS-002",
    subject: "Book not showing in library",
    user: "bob@email.com",
    status: "Resolved",
    category: "Library",
    date: "2026-09-08",
    message:
      "I added a book from the Discover tab but it never appeared in my Library. Tried refreshing several times.",
  },
  {
    id: "CS-003",
    subject: "Reading streak reset incorrectly",
    user: "carol@email.com",
    status: "In Progress",
    category: "App Features",
    date: "2026-09-08",
    message:
      "My 30-day streak was reset to zero even though I updated my reading progress yesterday before midnight.",
  },
  {
    id: "CS-004",
    subject: "Request for dark mode",
    user: "dave@email.com",
    status: "Resolved",
    category: "Feature Request",
    date: "2026-09-07",
    message:
      "Would love to have a dark mode option. Reading at night is uncomfortable with the current bright interface.",
  },
  {
    id: "CS-005",
    subject: "Billing charge discrepancy",
    user: "eve@email.com",
    status: "Open",
    category: "Billing",
    date: "2026-09-07",
    message:
      "I was charged twice for my monthly subscription this month. Please refund the duplicate charge.",
  },
  {
    id: "CS-006",
    subject: "App crashes when opening stats",
    user: "frank@email.com",
    status: "In Progress",
    category: "Bug",
    date: "2026-09-06",
    message:
      "Every time I tap on the Statistics section the app closes immediately. Running iOS 17 on iPhone 14.",
  },
  {
    id: "CS-007",
    subject: "Cannot export library to CSV",
    user: "grace@email.com",
    status: "Resolved",
    category: "Premium",
    date: "2026-09-05",
    message:
      "The export button in Library is greyed out even though I have an active Premium subscription.",
  },
];

const weeklyData = [
  { day: "Mon", tickets: 4 },
  { day: "Tue", tickets: 7 },
  { day: "Wed", tickets: 5 },
  { day: "Thu", tickets: 9 },
  { day: "Fri", tickets: 6 },
  { day: "Sat", tickets: 3 },
  { day: "Sun", tickets: 2 },
];

const stats = [
  {
    label: "Total",
    value: 128,
    icon: Ticket,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Open",
    value: 23,
    icon: Clock,
    color: "bg-orange-50 text-orange-600",
  },
  {
    label: "Resolved",
    value: 105,
    icon: CheckCircle,
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Avg Rating",
    value: "4.7★",
    icon: Star,
    color: "bg-purple-50 text-purple-600",
  },
];

const statusStyle: Record<string, string> = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Resolved: "bg-green-100 text-green-700",
};

const maxTickets = Math.max(...weeklyData.map((d) => d.tickets));

const SupportDashboard = () => {
  const [selected, setSelected] = useState<TicketItem | null>(null);
  const [filter, setFilter] = useState<
    "All" | "Open" | "In Progress" | "Resolved"
  >("All");

  const filtered =
    filter === "All"
      ? allTickets
      : allTickets.filter((t) => t.status === filter);

  if (selected) {
    const steps = ["Open", "In Progress", "Resolved"] as const;
    const currentIdx = steps.indexOf(selected.status as (typeof steps)[number]);

    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1 text-blue-600 text-sm font-medium"
        >
          <ArrowLeft size={15} />
          All tickets
        </button>

        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-gray-800 text-sm">
              {selected.subject}
            </p>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                statusStyle[selected.status]
              }`}
            >
              {selected.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div>
              <span className="font-medium text-gray-700">ID: </span>
              {selected.id}
            </div>
            <div>
              <span className="font-medium text-gray-700">Date: </span>
              {selected.date}
            </div>
            <div>
              <span className="font-medium text-gray-700">User: </span>
              {selected.user}
            </div>
            <div>
              <span className="font-medium text-gray-700">Category: </span>
              {selected.category}
            </div>
          </div>
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-1">Message</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {selected.message}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-700 mb-2">
            Status Timeline
          </p>
          <div className="flex items-center gap-1">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1 flex-1">
                <div
                  className={`flex-1 text-center py-1.5 rounded-lg text-xs font-medium ${
                    i <= currentIdx
                      ? statusStyle[s]
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {s}
                </div>
                {i < 2 && (
                  <div
                    className={`w-3 h-0.5 flex-shrink-0 ${
                      i < currentIdx ? "bg-green-400" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
            >
              <div className={`inline-flex p-2 rounded-lg ${s.color} mb-2`}>
                <Icon size={15} />
              </div>
              <div className="text-xl font-bold text-gray-800">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-sm font-semibold text-gray-800 mb-3">
          Tickets This Week
        </p>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart
            data={weeklyData}
            margin={{ top: 0, right: 0, left: -30, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #f3f4f6",
              }}
              cursor={{ fill: "#f9fafb" }}
            />
            <Bar dataKey="tickets" radius={[4, 4, 0, 0]}>
              {weeklyData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.tickets === maxTickets ? "#3b82f6" : "#bfdbfe"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
          <p className="font-semibold text-gray-800 text-sm">Tickets</p>
          <div className="flex gap-1 flex-wrap">
            {(["All", "Open", "In Progress", "Resolved"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                  filter === f
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {filtered.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
            >
              <span className="font-mono text-xs text-gray-400 w-14 flex-shrink-0">
                {t.id}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">{t.subject}</p>
                <p className="text-xs text-gray-400">{t.user}</p>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  statusStyle[t.status]
                }`}
              >
                {t.status}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;
