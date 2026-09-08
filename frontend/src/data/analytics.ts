export const analyticsSummary = {
  totalTickets: 128,
  openTickets: 34,
  resolvedTickets: 82,
  avgResponseHours: 6.4,
  csatScore: 4.6,
};

export const ticketsByStatus = [
  { name: "Open", value: 34 },
  { name: "In Progress", value: 12 },
  { name: "Resolved", value: 82 },
] as const;

export const ticketsByCategory = [
  { name: "Accounts", count: 38 },
  { name: "Billing", count: 29 },
  { name: "Library", count: 35 },
  { name: "Reading", count: 26 },
] as const;

export const weeklyVolume = [
  { day: "Mon", tickets: 18 },
  { day: "Tue", tickets: 24 },
  { day: "Wed", tickets: 21 },
  { day: "Thu", tickets: 17 },
  { day: "Fri", tickets: 28 },
  { day: "Sat", tickets: 12 },
  { day: "Sun", tickets: 8 },
] as const;