import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Trainers from "./pages/dashboard/Trainers";
import DashboardFAQ from "./pages/dashboard/FAQ";
import DashboardCourses from "./pages/dashboard/Courses";
import DashboardContact from "./pages/dashboard/Contact";
import DashboardSupport from "./pages/dashboard/Support";
import AITutor from "./pages/dashboard/AITutor";
import Students from "./pages/dashboard/Students";
import GradingSystem from "./pages/dashboard/GradingSystem";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<DashboardHome />} />
              <Route path="courses" element={<DashboardCourses />} />
              <Route path="trainers" element={<Trainers />} />
              <Route path="faq" element={<DashboardFAQ />} />
              <Route path="contact" element={<DashboardContact />} />
              <Route path="support" element={<DashboardSupport />} />
              <Route path="ai-tutor" element={<AITutor />} />
              <Route path="students" element={<Students />} />
              <Route path="grading" element={<GradingSystem />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
