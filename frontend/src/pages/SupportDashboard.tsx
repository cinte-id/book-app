import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Ticket,
  CheckCircle,
  Clock,
  Star,
  BarChart2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  seedTickets,
  type Ticket as TicketItem,
} from "@/components/support/ticketStore";

const weeklyData = [
  { day: "Mon", tickets: 4 },
  { day: "Tue", tickets: 7 },
  { day: "Wed", tickets: 5 },
  { day: "Thu", tickets: 9 },
  { day: "Fri", tickets: 6 },
  { day: "Sat", tickets: 3 },
  { day: "Sun", tickets: 2 },
];

const satisfactionData = [
  { name: "Promoters", value: 62, fill: "#22c55e" },
  { name: "Passive", value: 25, fill: "#f59e0b" },
  { name: "Detractors", value: 13, fill: "#ef4444" },
];

const statusStyle: Record<string, string> = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Resolved: "bg-green-100 text-green-700",
};

const maxTickets = Math.max(...weeklyData.map((d) => d.tickets));

const SupportDashboardPage = () => {
  const navigate = useNavigate();
  const [tickets] = useState<TicketItem[]>(seedTickets);
  const [selected, setSelected] = useState<TicketItem | null>(null);
  const [filter, setFilter] = useState<
    "All" | "Open" | "In Progress" | "Resolved"
  >("All");

  const open = tickets.filter((t) => t.status === "Open").length;
  const resolved = tickets.filter((t) => t.status === "Resolved").length;

  const stats = [
    {
      label: "Total",
      value: tickets.length,
      icon: Ticket,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Open",
      value: open,
      icon: Clock,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Resolved",
      value: resolved,
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

  const filtered =
    filter === "All" ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart2 size={20} className="text-blue-500" />
              Support Dashboard
            </h1>
            <p className="text-sm text-gray-500">Customer service overview</p>
          </div>
        </div>

        {/* Stat cards */}
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
                <div className="text-2xl font-bold text-gray-800">
                  {s.value}
                </div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Ticket trend chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-semibold text-gray-800 mb-3">
            Ticket Trend — This Week
          </p>
          <ResponsiveContainer width="100%" height={110}>
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

        {/* Satisfaction overview */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-semibold text-gray-800 mb-1">
            Customer Satisfaction (NPS)
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Based on last 30 days of survey responses
          </p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={satisfactionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={32}
                  outerRadius={52}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {satisfactionData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 flex-1">
              {satisfactionData.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: s.fill }}
                    />
                    <span className="text-gray-600">{s.name}</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {s.value}%
                  </span>
                </div>
              ))}
              <div className="pt-1 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  NPS Score:{" "}
                  <span className="font-bold text-green-600">+49</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket list */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {selected ? (
            <div className="p-4 space-y-4">
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
                    <span className="font-medium text-gray-700">
                      Category:{" "}
                    </span>
                    {selected.category}
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    Message
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selected.message}
                  </p>
                </div>
              </div>
              {/* Status timeline */}
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Status Timeline
                </p>
                <div className="flex items-center gap-1">
                  {(["Open", "In Progress", "Resolved"] as const).map(
                    (s, i) => {
                      const steps = ["Open", "In Progress", "Resolved"];
                      const currentIdx = steps.indexOf(selected.status);
                      return (
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
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
                <p className="font-semibold text-gray-800 text-sm">
                  Recent Tickets
                </p>
                <div className="flex gap-1 flex-wrap">
                  {(["All", "Open", "In Progress", "Resolved"] as const).map(
                    (f) => (
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
                    )
                  )}
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {filtered.length === 0 && (
                  <p className="px-4 py-6 text-sm text-center text-gray-400">
                    No tickets found.
                  </p>
                )}
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
                      <p className="text-sm text-gray-800 truncate">
                        {t.subject}
                      </p>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportDashboardPage;
