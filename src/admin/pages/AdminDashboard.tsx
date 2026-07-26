import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  Users,
  UserCog,
  GraduationCap,
  Calendar,
  ClipboardList,
  Sparkles,
  MessagesSquare,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import { ReactNode } from "react";

type Stat = {
  label: string;
  value: number | string;
  icon: ReactNode;
  hint?: string;
};

const startOfDayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};
const startOfMonthISO = () => {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

async function count(table: string, filter?: (q: any) => any) {
  let q = supabase.from(table as any).select("*", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count: c, error } = await q;
  if (error) return 0;
  return c ?? 0;
}

const useKpis = () =>
  useQuery({
    queryKey: ["admin-kpis"],
    queryFn: async () => {
      const [students, guardians, trainers, courses, bookingsToday, bookingsMonth, quizAttempts, aiEvents, posts, reports] =
        await Promise.all([
          count("profiles", (q) => q.eq("role", "child")),
          count("profiles", (q) => q.eq("role", "guardian")),
          count("trainers"),
          count("dynamic_courses"),
          count("course_bookings", (q) => q.gte("created_at", startOfDayISO())),
          count("course_bookings", (q) => q.gte("created_at", startOfMonthISO())),
          count("quiz_attempts"),
          count("ai_events", (q) => q.gte("created_at", startOfMonthISO())),
          count("community_posts"),
          count("content_reports", (q) => q.eq("status", "pending")),
        ]);
      return { students, guardians, trainers, courses, bookingsToday, bookingsMonth, quizAttempts, aiEvents, posts, reports };
    },
  });

const useRecentBookings = () =>
  useQuery({
    queryKey: ["admin-recent-bookings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("course_bookings")
        .select("id, student_name, course_type, status, created_at")
        .order("created_at", { ascending: false })
        .limit(6);
      return data ?? [];
    },
  });

const StatCard = ({ label, value, icon, hint }: Stat) => (
  <Card className="p-4 flex items-start justify-between gap-3">
    <div className="min-w-0">
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-semibold mt-1 tabular-nums">{value}</div>
      {hint && <div className="text-[11px] text-muted-foreground mt-1">{hint}</div>}
    </div>
    <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
      {icon}
    </div>
  </Card>
);

const AdminDashboard = () => {
  const { data: k, isLoading } = useKpis();
  const { data: recent } = useRecentBookings();

  const stats: Stat[] = [
    { label: "Students", value: k?.students ?? "—", icon: <Users className="w-4 h-4" /> },
    { label: "Parents", value: k?.guardians ?? "—", icon: <UserCog className="w-4 h-4" /> },
    { label: "Teachers", value: k?.trainers ?? "—", icon: <GraduationCap className="w-4 h-4" /> },
    { label: "Courses", value: k?.courses ?? "—", icon: <BookOpen className="w-4 h-4" /> },
    { label: "Bookings today", value: k?.bookingsToday ?? "—", icon: <Calendar className="w-4 h-4" />, hint: `${k?.bookingsMonth ?? 0} this month` },
    { label: "Quiz attempts", value: k?.quizAttempts ?? "—", icon: <ClipboardList className="w-4 h-4" /> },
    { label: "AI events (mo)", value: k?.aiEvents ?? "—", icon: <Sparkles className="w-4 h-4" /> },
    { label: "Reports pending", value: k?.reports ?? "—", icon: <MessagesSquare className="w-4 h-4" />, hint: `${k?.posts ?? 0} community posts` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time overview of the platform.</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium">Recent bookings</h2>
            <span className="text-xs text-muted-foreground">Last 6</span>
          </div>
          <div className="divide-y divide-border">
            {(recent ?? []).length === 0 && (
              <div className="py-6 text-sm text-muted-foreground text-center">
                {isLoading ? "Loading…" : "No bookings yet."}
              </div>
            )}
            {(recent ?? []).map((b: any) => (
              <div key={b.id} className="py-2.5 flex items-center gap-3 text-sm">
                <div className="flex-1 min-w-0 truncate">{b.student_name ?? "—"}</div>
                <div className="text-xs text-muted-foreground truncate max-w-[120px]">{b.course_type ?? "—"}</div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                  {b.status ?? "new"}
                </span>
                <div className="text-[11px] text-muted-foreground tabular-nums">
                  {new Date(b.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-medium mb-3">System</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Database</span>
              <span className="inline-flex items-center gap-1 text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Healthy
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Auth</span>
              <span className="inline-flex items-center gap-1 text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">AI Gateway</span>
              <span className="inline-flex items-center gap-1 text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ready
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="text-xs">v2.0</span>
            </li>
          </ul>
          <a
            href="/admin/audit"
            className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            View audit logs <ArrowUpRight className="w-3 h-3" />
          </a>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
