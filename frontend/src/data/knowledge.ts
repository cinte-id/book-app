export interface KnowledgeArticle {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  views: number;
}

export const knowledgeCategories = [
  "All",
  "Getting Started",
  "Account & Billing",
  "Troubleshooting",
  "Features",
] as const;

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: 1,
    title: "Creating your account",
    excerpt:
      "Learn how to sign up, verify your email, and set up your reading profile in under two minutes.",
    category: "Getting Started",
    views: 1240,
  },
  {
    id: 2,
    title: "Importing your book list",
    excerpt:
      "Import your existing books from a CSV file so you can start tracking right away.",
    category: "Getting Started",
    views: 980,
  },
  {
    id: 3,
    title: "Understanding subscription plans",
    excerpt:
      "Compare Free, Premium, and Family plans to find the best fit for your reading habits.",
    category: "Account & Billing",
    views: 2105,
  },
  {
    id: 4,
    title: "Changing or canceling your plan",
    excerpt:
      "Update your payment method, switch tiers, or cancel anytime from your billing settings.",
    category: "Account & Billing",
    views: 1670,
  },
  {
    id: 5,
    title: "Books not syncing? Try these fixes",
    excerpt:
      "Step-by-step troubleshooting for sync issues across desktop, tablet, and mobile.",
    category: "Troubleshooting",
    views: 1890,
  },
  {
    id: 6,
    title: "Resolving download errors",
    excerpt:
      "What to do when a book fails to download or opens in the wrong format.",
    category: "Troubleshooting",
    views: 742,
  },
  {
    id: 7,
    title: "Reading progress & streaks explained",
    excerpt:
      "How progress bars, streaks, and reading goals are calculated and displayed.",
    category: "Features",
    views: 3105,
  },
  {
    id: 8,
    title: "Using offline reading mode",
    excerpt:
      "Download books for offline reading and keep your progress synced when you reconnect.",
    category: "Features",
    views: 1588,
  },
];