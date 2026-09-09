const en = {
  support: {
    title: "Help & Support",
    subtitle: "Find answers, contact support, or share your feedback.",
    backToProfile: "← Back to Profile",
    search: {
      title: "Search Help",
      placeholder: "Search your question...",
      noResults: "No results found",
      noResultsHint: "Try a different keyword.",
    },
    faq: {
      title: "Frequently Asked Questions",
    },
    guide: {
      title: "User Guide",
    },
    knowledgeBase: {
      title: "Knowledge Base",
    },
    contact: {
      title: "Contact Support",
      subtitle: "Send a message to our customer support team.",
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@example.com",
      subject: "Subject",
      subjectPlaceholder: "What is this about?",
      message: "Message",
      messagePlaceholder: "Describe your issue or question...",
      submit: "Send Message",
      successTitle: "Ticket Created Successfully",
      ticketId: "Ticket ID",
      status: "Status",
      statusOpen: "Open",
      responseTime: "Response time",
      responseTimeValue: "1–2 business days",
      submitAnother: "Submit another ticket",
    },
    feedback: {
      title: "Feedback",
      subtitle: "Tell us how we can improve BookTracker.",
      rating: "Rating",
      comment: "Comment",
      commentPlaceholder: "Tell us what you think about BookTracker...",
      submit: "Submit Feedback",
      successTitle: "Thank you for your feedback!",
      submitAnother: "Submit another response",
      ratingLabels: {
        1: "Poor",
        2: "Fair",
        3: "Good",
        4: "Very Good",
        5: "Excellent",
      },
    },
    survey: {
      title: "Satisfaction Survey",
      subtitle: "Help us understand your experience.",
      submit: "Submit Survey",
      successTitle: "Thank you for your response!",
      successSubtitle: "Your feedback helps us build a better BookTracker.",
      submitAgain: "Take survey again",
    },
    dashboard: {
      title: "Support Dashboard",
      totalTickets: "Total",
      openTickets: "Open",
      resolvedTickets: "Resolved",
      avgRating: "Avg Rating",
      weeklyChart: "Tickets This Week",
      ticketList: "Tickets",
      filter: {
        all: "All",
        open: "Open",
        inProgress: "In Progress",
        resolved: "Resolved",
      },
    },
    liveChat: {
      title: "BookTracker Support",
      placeholder: "Type a message...",
      greeting: "👋 Hi! Welcome to BookTracker support. How can we help you today?",
    },
  },
};

export type Translations = typeof en;
export default en;

