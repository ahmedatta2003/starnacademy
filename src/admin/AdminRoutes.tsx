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
        <Route path="ai" element={<AdminAI />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="audit" element={<AdminAudit />} />
        <Route path="feature-flags" element={<AdminFeatureFlags />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  </AdminThemeProvider>
);

export default AdminRoutes;
