// Client-side ticket store (localStorage) for the customer-service system.
// Tickets created via Contact Support and Feedback are persisted here so the
// tracking page and dashboard can list them without backend integration.

export type TicketType = 'support' | 'feedback';

export interface SupportTicket {
  id: string;
  type: TicketType;
  name?: string;
  email: string;
  category: string;
  priority?: string;
  rating?: number;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  ts: number;
}

const STORAGE_KEY = 'booktracker_support_tickets';
const MAX_TICKETS = 50;

export function loadTickets(): SupportTicket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SupportTicket[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export interface TicketInput {
  id: string;
  type: TicketType;
  name?: string;
  email?: string;
  category?: string;
  priority?: string;
  rating?: number;
  subject?: string;
  message?: string;
  status: string;
  createdAt: string;
}

export function saveTicket(ticket: TicketInput): SupportTicket[] {
  const full: SupportTicket = {
    id: ticket.id,
    type: ticket.type,
    name: ticket.name,
    email: ticket.email ?? '',
    category: ticket.category ?? 'Lainnya',
    priority: ticket.priority,
    rating: ticket.rating,
    subject: ticket.subject ?? '(tanpa subjek)',
    message: ticket.message ?? '',
    status: (['Open', 'In Progress', 'Resolved'] as const).includes(
      ticket.status as 'Open' | 'In Progress' | 'Resolved',
    )
      ? (ticket.status as SupportTicket['status'])
      : 'Open',
    createdAt: ticket.createdAt,
    ts: Date.now(),
  };
  const next = [full, ...loadTickets()].slice(0, MAX_TICKETS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable (private mode) — tracking just won't persist
  }
  return next;
}

export function findTicket(id: string): SupportTicket | null {
  const needle = id.trim().toUpperCase();
  if (!needle) return null;
  return loadTickets().find((t) => t.id.toUpperCase() === needle) ?? null;
}

export function deleteTicket(id: string): SupportTicket[] {
  const next = loadTickets().filter((t) => t.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

export function ticketStats() {
  const tickets = loadTickets();
  const support = tickets.filter((t) => t.type === 'support');
  const feedback = tickets.filter((t) => t.type === 'feedback');
  const rated = feedback.filter((t) => (t.rating ?? 0) > 0);
  const avgRating =
    rated.length > 0
      ? rated.reduce((sum, t) => sum + (t.rating ?? 0), 0) / rated.length
      : 0;
  const byCategory: Record<string, number> = {};
  tickets.forEach((t) => {
    byCategory[t.category] = (byCategory[t.category] ?? 0) + 1;
  });
  return {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'Open').length,
    support: support.length,
    feedback: feedback.length,
    avgRating,
    byCategory,
  };
}
