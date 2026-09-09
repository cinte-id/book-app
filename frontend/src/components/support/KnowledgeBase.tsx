import { useState } from "react";
import { ChevronRight, ArrowLeft, BookOpen, Settings, Zap, Shield, HelpCircle } from "lucide-react";

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  readTime: string;
}

interface Category {
  id: string;
  icon: React.ElementType;
  color: string;
  label: string;
  description: string;
  articles: Article[];
}

const categories: Category[] = [
  {
    id: "getting-started",
    icon: BookOpen,
    color: "blue",
    label: "Getting Started",
    description: "Everything you need to begin using BookTracker",
    articles: [
      {
        id: "gs-1",
        title: "Creating your BookTracker account",
        summary: "Step-by-step guide to sign up and verify your account.",
        readTime: "2 min read",
        content: "To create your account, visit the BookTracker app and tap 'Sign Up'. Enter your full name, a valid email address, and a secure password (minimum 8 characters).\n\nAfter submitting, check your inbox for a verification email. Click the link inside to activate your account. If you don't see it within 5 minutes, check your spam folder or request a new link.\n\nOnce verified, you can log in and start building your reading library.",
      },
      {
        id: "gs-2",
        title: "Setting your first reading goal",
        summary: "How to set yearly and monthly reading targets.",
        readTime: "3 min read",
        content: "Reading goals help you stay motivated. After logging in, go to Profile → Reading Goals.\n\nYou can set:\n• Yearly book target (e.g. 50 books)\n• Monthly page goal (e.g. 1,500 pages)\n\nBookTracker tracks your progress automatically as you update your reading activity. You'll see a progress bar on your Profile page showing how close you are to your goal.",
      },
      {
        id: "gs-3",
        title: "Navigating the app",
        summary: "Overview of the main tabs and what each section does.",
        readTime: "2 min read",
        content: "BookTracker has five main sections accessible from the bottom navigation bar:\n\n• Home — Your reading dashboard with a weekly summary and continue-reading shortcuts.\n• Library — All your books organised by status (reading, read, want-to-read).\n• Discover — Browse and search the full book catalogue.\n• Reading — Detailed session log and reading streak.\n• Profile — Account settings, goals, and help.",
      },
    ],
  },
  {
    id: "library",
    icon: Shield,
    color: "green",
    label: "Library & Books",
    description: "Managing your personal book collection",
    articles: [
      {
        id: "lib-1",
        title: "Adding books to your library",
        summary: "How to find and save books from the catalogue.",
        readTime: "2 min read",
        content: "To add a book, go to the Discover tab and use the search bar to find the title or author you're looking for. Tap the book card to open its detail page, then tap 'Add to Library'.\n\nYou can choose the initial status:\n• Want to Read — planning to read it\n• Reading — currently reading\n• Read — already finished\n\nThe book will appear in your Library tab immediately.",
      },
      {
        id: "lib-2",
        title: "Organising books with shelves",
        summary: "Create custom shelves to categorise your collection.",
        readTime: "3 min read",
        content: "Beyond the default statuses, you can create custom shelves to organise your books by genre, mood, or any category you like.\n\nGo to Library → Shelves → New Shelf. Give it a name (e.g. 'Favourites', 'Summer Reads') and optionally a colour.\n\nTo add books to a shelf, long-press any book card and select 'Add to Shelf'. Books can belong to multiple shelves simultaneously.",
      },
    ],
  },
  {
    id: "account",
    icon: Settings,
    color: "purple",
    label: "Account & Privacy",
    description: "Managing your profile, security, and data",
    articles: [
      {
        id: "acc-1",
        title: "Changing your password",
        summary: "How to update your password from inside the app.",
        readTime: "1 min read",
        content: "To change your password:\n1. Go to Profile → Settings → Security\n2. Tap 'Change Password'\n3. Enter your current password, then your new password twice\n4. Tap Save\n\nIf you've forgotten your password, log out and use 'Forgot Password' on the login screen. A reset link will be sent to your registered email.",
      },
      {
        id: "acc-2",
        title: "Deleting your account",
        summary: "What happens to your data when you delete your account.",
        readTime: "2 min read",
        content: "Account deletion is permanent. To delete your account:\n1. Go to Profile → Settings → Account\n2. Scroll to the bottom and tap 'Delete Account'\n3. Confirm by entering your password\n\nAll your books, reading history, goals, and personal data will be permanently removed within 30 days. This action cannot be undone.",
      },
    ],
  },
  {
    id: "troubleshooting",
    icon: Zap,
    color: "orange",
    label: "Troubleshooting",
    description: "Fixes for common issues and errors",
    articles: [
      {
        id: "tr-1",
        title: "App not loading or showing a blank screen",
        summary: "Quick steps to fix loading problems.",
        readTime: "2 min read",
        content: "If the app shows a blank screen or fails to load:\n\n1. Check your internet connection.\n2. Force-close the app and reopen it.\n3. Clear the app cache (Settings → Apps → BookTracker → Clear Cache).\n4. Check if there is a pending app update in the store.\n5. Uninstall and reinstall the app as a last resort — your data is saved to your account.\n\nIf the issue persists, contact support with your device model and OS version.",
      },
      {
        id: "tr-2",
        title: "Reading streak reset unexpectedly",
        summary: "Why streaks reset and how to prevent it.",
        readTime: "2 min read",
        content: "Your reading streak resets if you don't log any reading activity for a full calendar day (midnight to midnight in your local timezone).\n\nCommon reasons for unexpected resets:\n• You updated progress but the timezone setting was incorrect — check Settings → Timezone.\n• The update was saved offline but not synced before midnight.\n\nTo protect your streak, make sure to log at least one page update each day before midnight and ensure you have an active internet connection to sync.",
      },
      {
        id: "tr-3",
        title: "Book missing from library after adding it",
        summary: "Why a book might disappear and how to find it.",
        readTime: "2 min read",
        content: "If a book you added is missing from your Library, try these steps:\n\n1. Pull down on the Library screen to force a refresh.\n2. Check the filter — tap the filter icon and make sure all statuses are visible.\n3. Search for the book title in the Library search bar.\n4. If none of these work, re-add the book from Discover; it should not create a duplicate.\n\nIf the book is still missing, contact support with the book title and the approximate time you added it.",
      },
    ],
  },
  {
    id: "premium",
    icon: HelpCircle,
    color: "pink",
    label: "Premium & Billing",
    description: "Subscriptions, payments, and refunds",
    articles: [
      {
        id: "pr-1",
        title: "What's included in Premium?",
        summary: "Full list of features unlocked with a premium subscription.",
        readTime: "2 min read",
        content: "BookTracker Premium unlocks:\n\n• Unlimited custom shelves (free plan: 3 shelves)\n• Advanced reading analytics and charts\n• Reading speed tracking\n• Export your library to CSV or PDF\n• Ad-free experience\n• Priority customer support\n\nPremium is billed monthly or annually. Annual billing offers a significant discount compared to monthly.",
      },
      {
        id: "pr-2",
        title: "How to cancel your subscription",
        summary: "Steps to cancel before your next billing date.",
        readTime: "2 min read",
        content: "To cancel your Premium subscription:\n1. Go to Profile → Settings → Subscription\n2. Tap 'Manage Subscription'\n3. Tap 'Cancel Plan' and confirm\n\nYour Premium access remains active until the end of the current billing period — you will not receive a pro-rated refund for unused time.\n\nAfter cancellation, your account reverts to the free plan. Your data and library are fully preserved.",
      },
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; light: string }> = {
  blue:   { bg: "bg-blue-500",   text: "text-blue-600",   light: "bg-blue-50" },
  green:  { bg: "bg-green-500",  text: "text-green-600",  light: "bg-green-50" },
  purple: { bg: "bg-purple-500", text: "text-purple-600", light: "bg-purple-50" },
  orange: { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50" },
  pink:   { bg: "bg-pink-500",   text: "text-pink-600",   light: "bg-pink-50" },
};

const KnowledgeBase = () => {
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const category = categories.find((c) => c.id === activeCat);

  if (activeArticle && category) {
    const c = colorMap[category.color];
    return (
      <div className="space-y-4">
        <button
          onClick={() => setActiveArticle(null)}
          className="flex items-center gap-1 text-blue-600 text-sm font-medium"
        >
          <ArrowLeft size={15} />
          {category.label}
        </button>
        <div>
          <h4 className="font-semibold text-gray-800 text-base">{activeArticle.title}</h4>
          <p className={`text-xs mt-1 font-medium ${c.text}`}>{activeArticle.readTime}</p>
        </div>
        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {activeArticle.content}
        </div>
      </div>
    );
  }

  if (category) {
    const Icon = category.icon;
    const c = colorMap[category.color];
    return (
      <div className="space-y-3">
        <button
          onClick={() => setActiveCat(null)}
          className="flex items-center gap-1 text-blue-600 text-sm font-medium"
        >
          <ArrowLeft size={15} />
          All categories
        </button>
        <div className={`flex items-center gap-3 p-3 rounded-xl ${c.light}`}>
          <div className={`p-2 rounded-lg ${c.light} ${c.text}`}>
            <Icon size={18} />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{category.label}</p>
            <p className="text-xs text-gray-500">{category.articles.length} articles</p>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {category.articles.map((article) => (
            <button
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="w-full flex items-center gap-3 py-3 text-left hover:bg-gray-50 transition-colors rounded-lg px-1"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{article.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{article.summary}</p>
                <p className={`text-xs mt-1 font-medium ${c.text}`}>{article.readTime}</p>
              </div>
              <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const c = colorMap[cat.color];
        return (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors text-left"
          >
            <div className={`p-2.5 rounded-xl ${c.light} ${c.text}`}>
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm">{cat.label}</p>
              <p className="text-xs text-gray-500 truncate">{cat.description}</p>
              <p className="text-xs text-gray-400 mt-0.5">{cat.articles.length} articles</p>
            </div>
            <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
          </button>
        );
      })}
    </div>
  );
};

export default KnowledgeBase;

