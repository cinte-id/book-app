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
import CustomerServiceDashboard from "./pages/CustomerServiceDashboard";
import LiveChatWidget from "./components/customer-service/LiveChatWidget";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/help" element={<HelpFAQ />} />
          <Route path="/contact" element={<ContactSupport />} />
          <Route path="/guide" element={<UserGuide />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/cs-dashboard" element={<CustomerServiceDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <LiveChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

