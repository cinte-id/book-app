export interface Ticket {
  id: string;
  subject: string;
  user: string;
  status: "Open" | "In Progress" | "Resolved";
  category: string;
  date: string;
  message: string;
}

export const seedTickets: Ticket[] = [
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

export const generateTicketId = () =>
  `CS-${String(Math.floor(Math.random() * 900) + 100)}`;

export const todayDate = () => new Date().toISOString().split("T")[0];
