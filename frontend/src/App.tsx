import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HelpFAQ from "./pages/HelpFAQ";
import ContactSupport from "./pages/ContactSupport";
import UserGuide from "./pages/UserGuide";
import Feedback from "./pages/Feedback";
import TrackTickets from "./pages/TrackTickets";
import SupportDashboard from "./pages/SupportDashboard";
import KnowledgeBase from "./pages/KnowledgeBase";
import KbArticle from "./pages/KbArticle";
import LiveChatWidget from "./components/support/LiveChatWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/help" element={<HelpFAQ />} />
          <Route path="/contact" element={<ContactSupport />} />
          <Route path="/guide" element={<UserGuide />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/track" element={<TrackTickets />} />
          <Route path="/support" element={<SupportDashboard />} />
          <Route path="/kb" element={<KnowledgeBase />} />
          <Route path="/kb/:slug" element={<KbArticle />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* Global customer-service chat — always on screen */}
        <LiveChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
