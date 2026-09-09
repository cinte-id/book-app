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
import FeedbackPage from "./pages/FeedbackPage";
import CSDashboard from "./pages/CSDashboard";
import LiveChatWidget from "./components/LiveChatWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contact" element={<ContactSupport />} />
          <Route path="/guide" element={<UserGuide />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/admin/cs-dashboard" element={<CSDashboard />} />
          <Route path="/help" element={<HelpFAQ />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <LiveChatWidget/>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
