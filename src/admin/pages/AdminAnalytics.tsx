import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { PageHeader } from "../components/DataTable";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const lastMonths = (n: number) => {
  const out: string[] = [];
  const d = new Date();
  d.setDate(1);
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push(monthKey(x));
  }
  return out;
};

const useSeries = () =>
  useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const [profiles, bookings, attempts, aiEvents] = await Promise.all([
        supabase.from("profiles").select("created_at, role").limit(5000),
        supabase.from("course_bookings").select("created_at, status").limit(5000),
        supabase.from("quiz_attempts").select("created_at").limit(5000),
        supabase.from("ai_events").select("created_at").limit(5000),
      ]);

      const months = lastMonths(6);
      const bucket = (rows: any[] | null) => {
        const m: Record<string, number> = Object.fromEntries(months.map((k) => [k, 0]));
        (rows ?? []).forEach((r) => {
          const k = monthKey(new Date(r.created_at));
          if (k in m) m[k] += 1;
        });
        return m;
      };

      const signups = bucket(profiles.data as any[]);
      const book = bucket(bookings.data as any[]);
      const quiz = bucket(attempts.data as any[]);
      const ai = bucket(aiEvents.data as any[]);

      const growth = months.map((m) => ({
        month: m.slice(5),
        signups: signups[m],
        bookings: book[m],
      }));
      const usage = months.map((m) => ({ month: m.slice(5), quizzes: quiz[m], ai: ai[m] }));

      const statusCounts = (bookings.data ?? []).reduce<Record<string, number>>((acc, r: any) => {
        const k = r.status || "new";
        acc[k] = (acc[k] ?? 0) + 1;
        return acc;
      }, {});

      return { growth, usage, statusCounts, total: (profiles.data ?? []).length };
    },
  });

const AdminAnalytics = () => {
  const { data, isLoading } = useSeries();

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Growth, engagement and conversion over the last 6 months." />
      {isLoading || !data ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">Loading…</Card>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-5">
              <h2 className="text-sm font-medium mb-4">Signups vs bookings</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.growth}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                    <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Bar dataKey="signups" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="bookings" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="text-sm font-medium mb-4">Quiz & AI usage</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.usage}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                    <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="quizzes" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="ai" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card className="p-5">
            <h2 className="text-sm font-medium mb-3">Booking pipeline</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {Object.entries(data.statusCounts).map(([k, v]) => (
                <div key={k} className="rounded-md border border-border p-3">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{k}</div>
                  <div className="text-xl font-semibold tabular-nums mt-1">{v as number}</div>
                </div>
              ))}
              {Object.keys(data.statusCounts).length === 0 && (
                <div className="text-sm text-muted-foreground">No bookings yet.</div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
