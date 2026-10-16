import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const ParentDashboard = () => {
  const { user, loading } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);

  const { data: kids = [], isLoading } = useQuery({
    queryKey: ["parent", "children", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: g } = await supabase.from("guardians").select("id").eq("user_id", user!.id).maybeSingle();
      if (!g) return [];
      const { data, error } = await supabase
        .from("children")
        .select("id, user_id, grade_level, school_name, profiles:user_id(full_name, email)")
        .or(`primary_guardian_id.eq.${g.id},backup_guardian_id.eq.${g.id}`);
      if (error) throw error;
      return (data ?? []) as any[];
    },
  });

  useEffect(() => {
    if (!selected && kids.length) setSelected(kids[0].user_id);
  }, [kids, selected]);

  const { data: details } = useQuery({
    queryKey: ["parent", "child", selected],
    enabled: !!selected,
    queryFn: async () => {
      const [enr, grades, att] = await Promise.all([
        supabase.from("enrollments").select("id, status, dynamic_courses(title_ar)").eq("student_id", selected!),
        supabase.from("student_grades").select("id, title, score, max_score, graded_on").eq("student_id", selected!).order("graded_on", { ascending: false }).limit(10),
        supabase.from("attendance").select("id, session_date, status").eq("student_id", selected!).order("session_date", { ascending: false }).limit(10),
      ]);
      return { enr: (enr.data ?? []) as any[], grades: grades.data ?? [], att: att.data ?? [] };
    },
  });

  if (loading) return <div className="min-h-screen bg-background" />;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">لوحة ولي الأمر</h1>
          <Button asChild variant="outline"><Link to="/">الرئيسية</Link></Button>
        </div>

        {isLoading ? (
          <div className="h-32 rounded-xl bg-muted animate-pulse" />
        ) : kids.length === 0 ? (
          <Card><CardContent className="py-12 text-center space-y-3">
            <Users className="w-10 h-10 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">لا يوجد أبناء مرتبطون بحسابك بعد. تواصل مع الأكاديمية لربط حساب ابنك.</p>
          </CardContent></Card>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {kids.map((k) => (
                <Button key={k.id} variant={selected === k.user_id ? "default" : "outline"} onClick={() => setSelected(k.user_id)}>
                  {k.profiles?.full_name || "طالب"}
                </Button>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Card><CardHeader><CardTitle className="text-base">الدورات</CardTitle></CardHeader><CardContent className="space-y-2">
                {details?.enr.length ? details.enr.map((e) => (
                  <div key={e.id} className="flex justify-between text-sm"><span>{e.dynamic_courses?.title_ar}</span><Badge variant="secondary">{e.status}</Badge></div>
                )) : <p className="text-sm text-muted-foreground">لا توجد دورات</p>}
              </CardContent></Card>
              <Card><CardHeader><CardTitle className="text-base">الدرجات</CardTitle></CardHeader><CardContent className="space-y-2">
                {details?.grades.length ? details.grades.map((g: any) => (
                  <div key={g.id} className="flex justify-between text-sm"><span>{g.title}</span><span>{g.score}/{g.max_score}</span></div>
                )) : <p className="text-sm text-muted-foreground">لا توجد درجات</p>}
              </CardContent></Card>
              <Card><CardHeader><CardTitle className="text-base">الحضور</CardTitle></CardHeader><CardContent className="space-y-2">
                {details?.att.length ? details.att.map((a: any) => (
                  <div key={a.id} className="flex justify-between text-sm"><span>{a.session_date}</span><Badge variant="outline">{a.status}</Badge></div>
                )) : <p className="text-sm text-muted-foreground">لا يوجد سجل حضور</p>}
              </CardContent></Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
