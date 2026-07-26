import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Calendar,
  UserCheck,
  MessagesSquare,
  Globe,
  Sparkles,
  BarChart3,
  ScrollText,
  ToggleLeft,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const groups: { label: string; items: { to: string; icon: any; label: string; end?: boolean }[] }[] = [
  {
    label: "Overview",
    items: [{ to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true }],
  },
  {
    label: "People",
    items: [
      { to: "/admin/students", icon: Users, label: "Students" },
      { to: "/admin/parents", icon: UserCog, label: "Parents" },
      { to: "/admin/teachers", icon: GraduationCap, label: "Teachers" },
    ],
  },
  {
    label: "Learning",
    items: [
      { to: "/admin/courses", icon: BookOpen, label: "Courses" },
      { to: "/admin/quizzes", icon: ClipboardList, label: "Quizzes" },
      { to: "/admin/bookings", icon: Calendar, label: "Bookings" },
      { to: "/admin/attendance", icon: UserCheck, label: "Attendance" },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/community", icon: MessagesSquare, label: "Community" },
      { to: "/admin/website", icon: Globe, label: "Website CMS" },
    ],
  },
  {
    label: "Platform",
    items: [
      { to: "/admin/ai", icon: Sparkles, label: "AI Engine" },
      { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
      { to: "/admin/audit", icon: ScrollText, label: "Audit Logs" },
      { to: "/admin/feature-flags", icon: ToggleLeft, label: "Feature Flags" },
      { to: "/admin/settings", icon: Settings, label: "Settings" },
    ],
  },
];

const AdminSidebar = () => {
  return (
    <aside className="w-60 shrink-0 border-r border-border bg-card/40 hidden md:flex flex-col">
      <div className="h-14 flex items-center gap-2 px-4 border-b border-border">
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary to-primary/60" />
        <div className="leading-tight">
          <div className="text-sm font-semibold">Starn EduOS</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Admin</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {groups.map((g) => (
          <div key={g.label}>
            <div className="px-3 mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {g.label}
            </div>
            <ul className="space-y-0.5">
              {g.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-border text-[10px] text-muted-foreground">
        v2.0 · EduOS Console
      </div>
    </aside>
  );
};

export default AdminSidebar;
