import { BookOpen, Flame, Star, BarChart3 } from "lucide-react";

export default function InsightPage() {
  // Dummy insight data (karena task FE only)
  const insight = {
    booksThisMonth: 5,
    pagesThisWeek: 320,
    currentStreak: 7,
    longestStreak: 14,
    favoriteGenre: "Fantasy",
    genrePercent: 60,
    avgRating: 4.2,
    monthlyGoal: 8,
  };

  const progressPercent = (insight.booksThisMonth / insight.monthlyGoal) * 100;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">User Insight</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<BookOpen size={18} />}
          label="Books This Month"
          value={insight.booksThisMonth}
          color="blue"
        />
        <StatCard
          icon={<BarChart3 size={18} />}
          label="Pages This Week"
          value={insight.pagesThisWeek}
          color="purple"
        />
        <StatCard
          icon={<Flame size={18} />}
          label="Current Streak"
          value={`${insight.currentStreak} days`}
          color="orange"
        />
        <StatCard
          icon={<Star size={18} />}
          label="Avg Rating"
          value={insight.avgRating}
          color="green"
        />
      </div>

      {/* Favorite Genre */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="text-sm text-gray-500">Favorite Genre</p>
        <p className="text-lg font-semibold">
          {insight.favoriteGenre} ({insight.genrePercent}%)
        </p>
        <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${insight.genrePercent}%` }}
          />
        </div>
      </div>

      {/* Monthly Goal */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="text-sm text-gray-500">Monthly Reading Goal</p>
        <p className="text-lg font-semibold">
          {insight.booksThisMonth} / {insight.monthlyGoal} books
        </p>
        <div className="w-full bg-gray-200 h-3 rounded-full mt-2">
          <div
            className="bg-green-500 h-3 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Reusable stat card component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "blue" | "purple" | "orange" | "green";
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className={`p-4 rounded-xl ${colors[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        {icon}
      </div>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
