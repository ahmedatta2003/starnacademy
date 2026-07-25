import { Routes, Route, Navigate } from "react-router-dom";
import { AdminThemeProvider } from "./lib/theme";
import AdminLogin from "./pages/AdminLogin";
import AdminGuard from "./guards/AdminGuard";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPlaceholder from "./pages/AdminPlaceholder";

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
        <Route path="students" element={<AdminPlaceholder title="Students" phase={2} />} />
        <Route path="parents" element={<AdminPlaceholder title="Parents" phase={2} />} />
        <Route path="teachers" element={<AdminPlaceholder title="Teachers" phase={2} />} />
        <Route path="courses" element={<AdminPlaceholder title="Courses" phase={2} />} />
        <Route path="quizzes" element={<AdminPlaceholder title="Quizzes" phase={2} />} />
        <Route path="bookings" element={<AdminPlaceholder title="Bookings" phase={2} />} />
        <Route path="attendance" element={<AdminPlaceholder title="Attendance" phase={2} />} />
        <Route path="community" element={<AdminPlaceholder title="Community & Moderation" phase={2} />} />
        <Route path="website" element={<AdminPlaceholder title="Website CMS" phase={2} />} />
        <Route path="ai" element={<AdminPlaceholder title="AI Engine" phase={3} />} />
        <Route path="analytics" element={<AdminPlaceholder title="Analytics" phase={3} />} />
        <Route path="audit" element={<AdminPlaceholder title="Audit Logs" phase={3} />} />
        <Route path="feature-flags" element={<AdminPlaceholder title="Feature Flags" phase={3} />} />
        <Route path="settings" element={<AdminPlaceholder title="Settings" phase={3} />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  </AdminThemeProvider>
);

export default AdminRoutes;
