import { Navigate } from "react-router-dom";

// The real student area (courses, lessons, assignments, lesson chat) lives at /learn
// and reads everything from the database.
const StudentDashboard = () => <Navigate to="/learn" replace />;

export default StudentDashboard;
