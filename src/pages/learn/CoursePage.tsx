import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import LearnLayout from "./LearnLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, PlayCircle, FileText, CheckCircle2, CalendarClock } from "lucide-react";

type Lesson = {
  id: string;
  module_id: string | null;
  lesson_number: number;
  title_ar: string;
  description_ar: string | null;
  duration_minutes: number | null;
  content_kind: string;
  status: string;
  release_at: string | null;
  is_preview: boolean;
  display_order: number;
};

const isReleased = (l: Lesson) =>
  l.status === "published" && (!l.release_at || new Date(l.release_at) <= new Date());

const CoursePage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();

  const { data: course } = useQuery({
    queryKey: ["learn", "course", courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dynamic_courses")
        .select("id, title_ar, description_ar, image_url, level, duration, age_range")
        .eq("id", courseId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: modules } = useQuery({
    queryKey: ["learn", "modules", courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_modules")
        .select("id, title_ar, description_ar, display_order")
        .eq("course_id", courseId!)
        .eq("is_visible", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: lessons, isLoading } = useQuery({
    queryKey: ["learn", "lessons", courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select(
          "id, module_id, lesson_number, title_ar, description_ar, duration_minutes, content_kind, status, release_at, is_preview, display_order"
        )
        .eq("course_id", courseId!)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Lesson[];
    },
  });

  const { data: progress } = useQuery({
    queryKey: ["learn", "progress", courseId, user?.id],
    enabled: !!courseId && !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("lesson_id, state")
        .eq("course_id", courseId!)
        .eq("student_id", user!.id);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: assignments } = useQuery({
    queryKey: ["learn", "assignments", courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assignments")
        .select("id, title, description, due_at, max_score, status")
        .eq("course_id", courseId!)
        .eq("status", "published")
        .order("due_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const done = (id: string) => (progress ?? []).some((p: any) => p.lesson_id === id && p.state === "completed");

  const grouped = [
    ...(modules ?? []).map((m: any) => ({
      id: m.id,
      title: m.title_ar,
      description: m.description_ar,
      items: (lessons ?? []).filter((l) => l.module_id === m.id),
    })),
    {
      id: "no-module",
      title: "دروس عامة",
      description: null,
      items: (lessons ?? []).filter((l) => !l.module_id),
    },
  ].filter((g) => g.items.length > 0);

  return (
    <LearnLayout
      title={course?.title_ar ?? "الدورة"}
      subtitle={course?.description_ar ?? undefined}
      back={{ to: "/learn", label: "كل دوراتي" }}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <div className="h-48 rounded-xl bg-muted animate-pulse" />
          ) : grouped.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                لا توجد دروس منشورة في هذه الدورة بعد.
              </CardContent>
            </Card>
          ) : (
            grouped.map((g) => (
              <Card key={g.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{g.title}</CardTitle>
                  {g.description && <p className="text-sm text-muted-foreground">{g.description}</p>}
                </CardHeader>
                <CardContent className="space-y-2">
                  {g.items.map((l) => {
                    const open = isReleased(l) || l.is_preview;
                    return (
                      <div
                        key={l.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          {done(l.id) ? (
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          ) : open ? (
                            <PlayCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                          ) : (
                            <Lock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                          )}
                          <div className="min-w-0">
                            <div className="font-medium truncate">
                              {l.lesson_number}. {l.title_ar}
                            </div>
                            <div className="text-xs text-muted-foreground flex flex-wrap gap-2 mt-1">
                              {l.duration_minutes && <span>{l.duration_minutes} دقيقة</span>}
                              {l.is_preview && <Badge variant="secondary">معاينة مجانية</Badge>}
                              {!isReleased(l) && l.release_at && (
                                <span className="flex items-center gap-1">
                                  <CalendarClock className="w-3 h-3" />
                                  يُتاح {new Date(l.release_at).toLocaleDateString("ar-EG")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button asChild={open} size="sm" variant={open ? "default" : "outline"} disabled={!open}>
                          {open ? <Link to={`/learn/lesson/${l.id}`}>ابدأ</Link> : <span>مقفول</span>}
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                الواجبات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(assignments ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">لا توجد واجبات حالياً.</p>
              ) : (
                (assignments ?? []).map((a: any) => (
                  <div key={a.id} className="rounded-lg border border-border/60 p-3 space-y-1">
                    <div className="font-medium text-sm">{a.title}</div>
                    {a.due_at && (
                      <div className="text-xs text-muted-foreground">
                        التسليم قبل {new Date(a.due_at).toLocaleDateString("ar-EG")}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">الدرجة الكاملة: {a.max_score}</div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {course?.image_url && (
            <img src={course.image_url} alt={course.title_ar} className="rounded-xl w-full object-cover" loading="lazy" />
          )}
        </div>
      </div>
    </LearnLayout>
  );
};

export default CoursePage;
