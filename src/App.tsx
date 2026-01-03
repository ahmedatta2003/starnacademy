import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Profile from "./pages/dashboard/Profile";
import Trainers from "./pages/dashboard/Trainers";
import DashboardFAQ from "./pages/dashboard/FAQ";
import DashboardCourses from "./pages/dashboard/Courses";
import DashboardContact from "./pages/dashboard/Contact";
import DashboardSupport from "./pages/dashboard/Support";
import AITutor from "./pages/dashboard/AITutor";
import Students from "./pages/dashboard/Students";
import GradingSystem from "./pages/dashboard/GradingSystem";
import NotFound from "./pages/NotFound";
import Courses from "./pages/Courses";
import Booking from "./pages/Booking";
import FreeSession from "./pages/FreeSession";
import StudentDashboard from "./pages/StudentDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import GamificationSystem from "./components/GamificationSystem";
import StudentProfile from "./pages/StudentProfile";
import Community from "./pages/Community";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
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
                <Route path="profile" element={<Profile />} />
                <Route path="courses" element={<DashboardCourses />} />
                <Route path="trainers" element={<Trainers />} />
                <Route path="faq" element={<DashboardFAQ />} />
                <Route path="contact" element={<DashboardContact />} />
                <Route path="support" element={<DashboardSupport />} />
                <Route path="ai-tutor" element={<AITutor />} />
                <Route path="students" element={<Students />} />
                <Route path="grading" element={<GradingSystem />} />
              </Route>
              <Route path="/courses" element={<Courses />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/free-session" element={<FreeSession />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/parent-dashboard" element={<ParentDashboard />} />
              <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/gamification" element={<GamificationSystem />} />
              <Route path="/student-profile/:studentId" element={<StudentProfile />} />
              <Route path="/community" element={<Community />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
