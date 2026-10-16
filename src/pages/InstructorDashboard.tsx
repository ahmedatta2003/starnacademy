import { Navigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const InstructorDashboard = () => {
  const { user, loading } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["instructor", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [ta, sessions] = await Promise.all([
        supabase.from("teacher_assignments")
          .select("id, student_id, course_id, dynamic_courses(title_ar)")
          .eq("teacher_id", user!.id).eq("is_active", true),
        supabase.from("live_sessions")
          .select("id, title, starts_at, status")
          .eq("instructor_id", user!.id).order("starts_at", { ascending: false }).limit(10),
      ]);
      const rows = (ta.data ?? []) as any[];
      const ids = [...new Set(rows.map((r) => r.student_id))];
      const { data: profs } = ids.length
        ? await supabase.from("profiles").select("id, full_name").in("id", ids)
        : { data: [] as any[] };
      const names = new Map((profs ?? []).map((p: any) => [p.id, p.full_name]));
      return {
        students: rows.map((r) => ({ ...r, name: names.get(r.student_id) || "طالب" })),
        sessions: sessions.data ?? [],
      };
    },
  });

  if (loading) return <div className="min-h-screen bg-background" />;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">لوحة المدرب</h1>
          <Button asChild variant="outline"><Link to="/">الرئيسية</Link></Button>
        </div>
        {isLoading ? <div className="h-32 rounded-xl bg-muted animate-pulse" /> : (
          <div className="grid gap-4 md:grid-cols-2">
            <Card><CardHeader><CardTitle className="text-base">طلابي ({data?.students.length ?? 0})</CardTitle></CardHeader><CardContent className="space-y-2">
              {data?.students.length ? data.students.map((s: any) => (
                <div key={s.id} className="flex justify-between text-sm"><span>{s.name}</span><span className="text-muted-foreground">{s.dynamic_courses?.title_ar}</span></div>
              )) : <p className="text-sm text-muted-foreground">لم يتم تعيين طلاب لك بعد</p>}
            </CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">الحصص المباشرة</CardTitle></CardHeader><CardContent className="space-y-2">
              {data?.sessions.length ? data.sessions.map((s: any) => (
                <div key={s.id} className="flex justify-between text-sm"><span>{s.title}</span><span className="text-muted-foreground">{s.starts_at ? new Date(s.starts_at).toLocaleDateString("ar-EG") : ""}</span></div>
              )) : <p className="text-sm text-muted-foreground">لا توجد حصص</p>}
            </CardContent></Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
