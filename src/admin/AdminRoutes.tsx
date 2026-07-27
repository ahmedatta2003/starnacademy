import { Routes, Route, Navigate } from "react-router-dom";
import { AdminThemeProvider } from "./lib/theme";
import AdminLogin from "./pages/AdminLogin";
import AdminGuard from "./guards/AdminGuard";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminParents from "./pages/AdminParents";
import AdminTeachers from "./pages/AdminTeachers";
import AdminCourses from "./pages/AdminCourses";
import AdminQuizzes from "./pages/AdminQuizzes";
import AdminBookings from "./pages/AdminBookings";
import AdminAttendance from "./pages/AdminAttendance";
import AdminCommunity from "./pages/AdminCommunity";
import AdminWebsite from "./pages/AdminWebsite";
import AdminAI from "./pages/AdminAI";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminAudit from "./pages/AdminAudit";
import AdminFeatureFlags from "./pages/AdminFeatureFlags";
import AdminSettings from "./pages/AdminSettings";
import {
  AdminAIModules,
  AdminBlog,
  AdminLogout,
  AdminMediaLibrary,
  AdminNotifications,
  AdminProfile,
  AdminReports,
  AdminTestimonials,
  AdminUserManagement,
  AdminWebsiteContent,
} from "./pages/AdminExtraPages";

const AdminRoutes = () => (
  <AdminThemeProvider>
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="parents" element={<AdminParents />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="quizzes" element={<AdminQuizzes />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="community" element={<AdminCommunity />} />
        <Route path="website" element={<AdminWebsite />} />
        <Route path="media" element={<AdminMediaLibrary />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="content" element={<AdminWebsiteContent />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="ai" element={<AdminAI />} />
        <Route path="ai-modules" element={<AdminAIModules />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="audit" element={<AdminAudit />} />
        <Route path="feature-flags" element={<AdminFeatureFlags />} />
        <Route path="users" element={<AdminUserManagement />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="logout" element={<AdminLogout />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  </AdminThemeProvider>
);

export default AdminRoutes;
