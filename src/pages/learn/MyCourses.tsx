import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";
import LearnLayout from "./LearnLayout";

type Row = {
  id: string;
  status: string;
  learning_mode: string;
  course_id: string;
  dynamic_courses: {
    id: string;
    title_ar: string;
    description_ar: string | null;
    image_url: string | null;
    level: string | null;
    duration: string | null;
  } | null;
};

const MyCourses = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["learn", "enrollments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select(
          "id, status, learning_mode, course_id, dynamic_courses(id, title_ar, description_ar, image_url, level, duration)"
        )
        .eq("student_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const { data: progress } = useQuery({
    queryKey: ["learn", "progress-all", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("course_id, state")
        .eq("student_id", user!.id);
      if (error) throw error;
      return data ?? [];
    },
  });

  const doneByCourse = (courseId: string) =>
    (progress ?? []).filter((p: any) => p.course_id === courseId && p.state === "completed").length;

  return (
    <LearnLayout title="دوراتي" subtitle="تابع تقدمك في الدورات المسجّل بها">
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (data ?? []).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <BookOpen className="w-10 h-10 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">لم يتم تسجيلك في أي دورة بعد.</p>
            <Button asChild>
              <Link to="/courses">تصفح الدورات</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {(data ?? []).map((e) => {
            const c = e.dynamic_courses;
            return (
              <Card key={e.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {c?.image_url && (
                  <img src={c.image_url} alt={c.title_ar} className="h-32 w-full object-cover" loading="lazy" />
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg">{c?.title_ar ?? "دورة"}</CardTitle>
                    <Badge variant={e.status === "active" ? "default" : "secondary"}>
                      {e.status === "active" ? "نشطة" : e.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{c?.description_ar}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {c?.level && <span className="rounded-full bg-muted px-2 py-1">{c.level}</span>}
                    {c?.duration && <span className="rounded-full bg-muted px-2 py-1">{c.duration}</span>}
                    <span className="rounded-full bg-muted px-2 py-1">
                      {e.learning_mode === "offline" ? "حضوري" : e.learning_mode === "hybrid" ? "هجين" : "أونلاين"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>الدروس المكتملة</span>
                      <span>{doneByCourse(e.course_id)}</span>
                    </div>
                    <Progress value={Math.min(100, doneByCourse(e.course_id) * 10)} className="h-2" />
                  </div>
                  <Button asChild className="w-full">
                    <Link to={`/learn/course/${e.course_id}`}>
                      متابعة الدورة <ArrowLeft className="w-4 h-4 mr-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </LearnLayout>
  );
};

export default MyCourses;
