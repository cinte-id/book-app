import { useState } from "react";
import {
  BookOpen,
  Library,
  Search,
  TrendingUp,
  User,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

const guides = [
  {
    id: "getting-started",
    icon: BookOpen,
    color: "blue",
    title: "Getting Started",
    summary: "Set up your account and learn the basics of BookTracker.",
    steps: [
      "Create your account and verify your email address.",
      "Complete your profile — add a display name and reading goal.",
      "Explore the Home screen to see your reading dashboard.",
      "Add your first book from the Discover tab to get started.",
    ],
  },
  {
    id: "managing-library",
    icon: Library,
    color: "green",
    title: "Managing Your Library",
    summary: "Organise your books into reading lists and shelves.",
    steps: [
      "Open the Library tab to see all your books.",
      "Tap the + button to browse and add new books.",
      "Long-press a book card to move it between shelves.",
      "Use the filter icons to sort by status, rating, or date added.",
    ],
  },
  {
    id: "discovering-books",
    icon: Search,
    color: "purple",
    title: "Discovering Books",
    summary: "Find new reads through search, genres, and recommendations.",
    steps: [
      "Go to the Discover tab and use the search bar.",
      "Browse curated lists like Trending and New Releases.",
      "Tap a book to read its description and reviews.",
      "Tap 'Add to Library' to save it to your reading list.",
    ],
  },
  {
    id: "tracking-progress",
    icon: TrendingUp,
    color: "orange",
    title: "Tracking Reading Progress",
    summary: "Log your sessions and watch your stats grow.",
    steps: [
      "Open a book from Library and tap 'Update Progress'.",
      "Enter your current page number and tap Save.",
      "Your daily reading streak updates automatically.",
      "View weekly and monthly stats from the Reading tab.",
    ],
  },
  {
    id: "managing-profile",
    icon: User,
    color: "pink",
    title: "Managing Your Profile",
    summary: "Customise your account and review your reading achievements.",
    steps: [
      "Tap the Profile tab at the bottom of the screen.",
      "Tap 'Edit Profile' to update your name or avatar.",
      "Set a yearly reading goal and track progress here.",
      "View your reading badges and achievement history.",
    ],
  },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  pink: "bg-pink-50 text-pink-600",
};

const UserGuide = () => {
  const [active, setActive] = useState<string | null>(null);

  const guide = guides.find((g) => g.id === active);

  if (guide) {
    const Icon = guide.icon;
    return (
      <div className="space-y-4">
        <button
          onClick={() => setActive(null)}
          className="flex items-center gap-1 text-blue-600 text-sm font-medium"
        >
          <ArrowLeft size={15} />
          All guides
        </button>

        <div
          className={`flex items-center gap-3 p-4 rounded-xl ${
            colorMap[guide.color]
          } bg-opacity-30`}
        >
          <div className={`p-2 rounded-lg ${colorMap[guide.color]}`}>
            <Icon size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{guide.title}</h3>
            <p className="text-sm text-gray-500">{guide.summary}</p>
          </div>
        </div>

        <ol className="space-y-3">
          {guide.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {guides.map((g) => {
        const Icon = g.icon;
        return (
          <button
            key={g.id}
            onClick={() => setActive(g.id)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
          >
            <div className={`p-2 rounded-lg ${colorMap[g.color]}`}>
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 text-sm">{g.title}</p>
              <p className="text-xs text-gray-500 truncate">{g.summary}</p>
            </div>
            <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
          </button>
        );
      })}
    </div>
  );
};

export default UserGuide;
