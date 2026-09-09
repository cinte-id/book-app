export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  // Account & Profile
  {
    id: "acc-1",
    category: "Account & Profile",
    question: "How do I create an account?",
    answer:
      "To create an account, tap the Sign Up button on the welcome screen. Fill in your name, email address, and a secure password. You will receive a verification email — click the link inside to activate your account.",
  },
  {
    id: "acc-2",
    category: "Account & Profile",
    question: "How do I reset my password?",
    answer:
      "Go to the login screen and tap 'Forgot Password'. Enter your registered email address and we will send you a password reset link. The link expires after 24 hours.",
  },
  {
    id: "acc-3",
    category: "Account & Profile",
    question: "Can I change my username or email address?",
    answer:
      "Yes. Go to Profile → Settings → Edit Profile. You can update your display name and email address there. Changing your email will require re-verification.",
  },

  // Reading & Library
  {
    id: "lib-1",
    category: "Reading & Library",
    question: "How do I add a book to my library?",
    answer:
      "Navigate to the Discover tab and search for the book you want. Tap the book card, then press 'Add to Library'. The book will appear in your Library tab immediately.",
  },
  {
    id: "lib-2",
    category: "Reading & Library",
    question: "How do I mark a book as finished?",
    answer:
      "Open the book from your Library, scroll to the progress section, and tap 'Mark as Finished'. Your reading stats will be updated automatically.",
  },
  {
    id: "lib-3",
    category: "Reading & Library",
    question: "How does the reading progress tracking work?",
    answer:
      "You can manually update your current page in the book detail view. BookTracker calculates your progress percentage and estimated days to finish based on your average reading speed.",
  },
  {
    id: "lib-4",
    category: "Reading & Library",
    question: "Can I remove a book from my library?",
    answer:
      "Yes. In your Library, long-press the book card (or tap the three-dot menu) and select 'Remove from Library'. This will not affect your reading history or statistics.",
  },

  // App Features
  {
    id: "feat-1",
    category: "App Features",
    question: "What is the reading streak?",
    answer:
      "The reading streak tracks consecutive days you log reading activity. Your streak increments every day you update your reading progress. Missing a day resets the streak to zero.",
  },
  {
    id: "feat-2",
    category: "App Features",
    question: "How do I search for books?",
    answer:
      "Tap the Discover tab and use the search bar at the top. You can search by title, author, or genre. Results are pulled from our curated catalogue.",
  },
  {
    id: "feat-3",
    category: "App Features",
    question: "Does the app work offline?",
    answer:
      "Your library and reading progress are cached locally, so you can view them offline. Searching for new books and syncing progress require an internet connection.",
  },

  // Billing & Subscriptions
  {
    id: "bill-1",
    category: "Billing & Subscriptions",
    question: "Is BookTracker free to use?",
    answer:
      "Yes, the core features — library management, progress tracking, and reading stats — are completely free. A premium plan is available with additional features such as advanced analytics and unlimited shelves.",
  },
  {
    id: "bill-2",
    category: "Billing & Subscriptions",
    question: "How do I cancel my subscription?",
    answer:
      "Go to Profile → Settings → Subscription → Cancel Plan. Your premium access will remain active until the end of the current billing period.",
  },
  {
    id: "bill-3",
    category: "Billing & Subscriptions",
    question: "Can I get a refund?",
    answer:
      "Refunds are handled case-by-case. If you believe you were charged incorrectly, please contact our support team within 14 days of the charge and we will review your request.",
  },
];
