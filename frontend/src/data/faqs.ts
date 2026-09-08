export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export const faqCategories = [
  "All",
  "Accounts",
  "Reading",
  "Billing",
  "Library",
] as const;

export const faqs: Faq[] = [
  {
    id: 1,
    question: "How do I reset my password?",
    answer:
      "Go to the Sign In page and click 'Forgot password'. We will email you a secure reset link. The link expires after 30 minutes for your safety.",
    category: "Accounts",
  },
  {
    id: 2,
    question: "How do I update my profile information?",
    answer:
      "Open your profile from the top navigation, then select 'Edit Profile'. You can update your name, email, and reading preferences there.",
    category: "Accounts",
  },
  {
    id: 3,
    question: "How do I add a book to my library?",
    answer:
      "Search for a book in the Browse Library page, then click the 'Add to Library' button. You can mark it as Read, Reading, or Want to Read.",
    category: "Library",
  },
  {
    id: 4,
    question: "How do I track my reading progress?",
    answer:
      "When a book is marked as 'Reading', open it from your library and update the current page number. Your progress and reading goals update automatically.",
    category: "Reading",
  },
  {
    id: 5,
    question: "How does the reading goal feature work?",
    answer:
      "Set a yearly book and monthly page goal in the Goals section. The dashboard shows your progress with a progress bar and your current reading streak.",
    category: "Reading",
  },
  {
    id: 6,
    question: "Where can I find my invoices?",
    answer:
      "Go to Settings > Billing & Payments. You can download PDF invoices for all past subscriptions from that page.",
    category: "Billing",
  },
  {
    id: 7,
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes. Navigate to Settings > Billing & Payments and click 'Cancel Subscription'. Your premium access remains active until the end of the billing period.",
    category: "Billing",
  },
  {
    id: 8,
    question: "Why is my book not syncing across devices?",
    answer:
      "Make sure you are signed in on all devices and check your internet connection. Pull to refresh on mobile or reload the page on desktop to force a sync.",
    category: "Accounts",
  },
];
