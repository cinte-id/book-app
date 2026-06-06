import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BookDetail from "./pages/BookDetail";
import ReaderPage from './pages/ReaderPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      
      {/* SINGLE TOASTER (FIXED) */}
      <Toaster position="top-center" richColors />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/book-detail/:id" element={<BookDetail />} />
          <Route path="/reader/:id" element={<ReaderPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;