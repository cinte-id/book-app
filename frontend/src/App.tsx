import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Help from "./pages/Help";
import ContactSupport from "./pages/ContactSupport";
import Tickets from "./pages/Tickets";
import TicketDetail from "./pages/TicketDetail";
import UserGuide from "./pages/UserGuide";
import UserGuideDetail from "./pages/UserGuideDetail";
import Feedback from "./pages/Feedback";
import CustomerServiceDashboard from "./pages/CustomerServiceDashboard";
import KnowledgeBase from "./pages/KnowledgeBase";
import KnowledgeBaseDetail from "./pages/KnowledgeBaseDetail";
import SatisfactionSurvey from "./pages/SatisfactionSurvey";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact-support" element={<ContactSupport />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
          <Route path="/user-guide" element={<UserGuide />} />
          <Route path="/user-guide/:id" element={<UserGuideDetail />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/customer-service" element={<CustomerServiceDashboard />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/knowledge-base/:id" element={<KnowledgeBaseDetail />} />
          <Route path="/satisfaction-survey" element={<SatisfactionSurvey />}/>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
