export type TicketStatus = "open" | "in-progress" | "resolved";
export type TicketPriority = "low" | "medium" | "high";

export interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
}

export const tickets: Ticket[] = [
  {
    id: "T-1001",
    subject: "Cannot reset my password",
    category: "Accounts",
    status: "open",
    priority: "high",
    createdAt: "2026-09-08",
  },
  {
    id: "T-1002",
    subject: "Book not syncing across devices",
    category: "Accounts",
    status: "in-progress",
    priority: "medium",
    createdAt: "2026-09-07",
  },
  {
    id: "T-1003",
    subject: "Question about my recent invoice",
    category: "Billing",
    status: "resolved",
    priority: "low",
    createdAt: "2026-09-05",
  },
  {
    id: "T-1004",
    subject: "Progress not updating on dashboard",
    category: "Reading",
    status: "open",
    priority: "medium",
    createdAt: "2026-09-06",
  },
  {
    id: "T-1005",
    subject: "Want to cancel premium subscription",
    category: "Billing",
    status: "in-progress",
    priority: "high",
    createdAt: "2026-09-04",
  },
  {
    id: "T-1006",
    subject: "How to mark a book as read",
    category: "Library",
    status: "resolved",
    priority: "low",
    createdAt: "2026-09-02",
  },
  {
    id: "T-1007",
    subject: "Duplicate entry in my library",
    category: "Library",
    status: "open",
    priority: "low",
    createdAt: "2026-09-08",
  },
];
