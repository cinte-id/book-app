import { useState } from "react";
import {
  Search,
  HelpCircle,
  Mail,
  MessageSquare,
  BookOpen,
  Library,
  ClipboardList,
  MessageCircle,
} from "lucide-react";
import FAQSection from "./FAQSection";
import ContactForm from "./ContactForm";
import FeedbackForm from "./FeedbackForm";
import UserGuide from "./UserGuide";
import LiveChat from "./LiveChat";
import KnowledgeBase from "./KnowledgeBase";
import SatisfactionSurvey from "./SatisfactionSurvey";
import { seedTickets, type Ticket } from "./ticketStore";

interface SupportCenterProps {
  onBack?: () => void;
}

const SupportCenter = ({ onBack }: SupportCenterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [, setTickets] = useState<Ticket[]>(seedTickets);

  const handleTicketCreated = (ticket: Ticket) => {
    setTickets((prev) => [ticket, ...prev]);
  };

  return (
    <>
      <div className="space-y-6">
        {onBack && (
          <button
            onClick={onBack}
            className="text-blue-600 text-sm font-medium"
          >
            ← Back to Profile
          </button>
        )}

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Help &amp; Support
          </h2>
          <p className="text-gray-600 mt-1">
            Find answers, contact support, or share your feedback.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Search size={16} className="text-blue-500" />
            Search Help
          </h3>
          <div className="relative mt-3">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your question..."
              className="w-full pl-9 pr-4 py-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Live Chat Button */}
        <button
          onClick={() => setChatOpen(true)}
          className="w-full flex items-center gap-3 bg-blue-500 hover:bg-blue-600 transition-colors text-white rounded-xl px-4 py-3.5"
        >
          <MessageCircle size={20} />
          <div className="text-left">
            <p className="font-semibold text-sm">Chat with Support</p>
            <p className="text-xs text-blue-100">
              Average reply time &lt; 2 minutes
            </p>
          </div>
          <span className="ml-auto flex items-center gap-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-300 rounded-full" />
            Online
          </span>
        </button>

        {/* FAQ */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <HelpCircle size={16} className="text-blue-500" />
            Frequently Asked Questions
          </h3>
          <FAQSection searchQuery={searchQuery} />
        </div>

        {/* Knowledge Base */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Library size={16} className="text-blue-500" />
            Knowledge Base
          </h3>
          <KnowledgeBase />
        </div>

        {/* User Guide */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-blue-500" />
            User Guide
          </h3>
          <UserGuide />
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-1">
            <Mail size={16} className="text-blue-500" />
            Contact Support
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Send a message to our customer support team.
          </p>
          <ContactForm onTicketCreated={handleTicketCreated} />
        </div>

        {/* Feedback */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-1">
            <MessageSquare size={16} className="text-blue-500" />
            Feedback
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Tell us how we can improve BookTracker.
          </p>
          <FeedbackForm />
        </div>

        {/* Satisfaction Survey */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-1">
            <ClipboardList size={16} className="text-blue-500" />
            Satisfaction Survey
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Help us understand your experience with a quick survey.
          </p>
          <SatisfactionSurvey />
        </div>
      </div>

      <LiveChat open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};

export default SupportCenter;
