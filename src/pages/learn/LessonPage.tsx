import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { getLessonVideoUrl } from "@/lib/lessonVideo";
import LearnLayout from "./LearnLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle2, Download, ExternalLink, FileText, Loader2, Lock, Upload } from "lucide-react";

const LessonPage = () => {
  const { lessonId } = useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["learn", "lesson", lessonId],
    enabled: !!lessonId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select(
          "id, course_id, title_ar, description_ar, objectives_ar, duration_minutes, content_kind, status, release_at, is_preview, preview_summary_ar"
        )
        .eq("id", lessonId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: resources } = useQuery({
    queryKey: ["learn", "resources", lessonId],
    enabled: !!lessonId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_resources")
        .select("id, title, kind, external_url, storage_path, mime_type")
        .eq("lesson_id", lessonId!);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: assignments } = useQuery({
    queryKey: ["learn", "lesson-assignments", lessonId],
    enabled: !!lessonId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assignments")
        .select("id, title, description, due_at, max_score")
        .eq("lesson_id", lessonId!)
        .eq("status", "published");
      if (error) throw error;
      return data ?? [];
    },
  });

  const assignment = (assignments ?? [])[0] as any;

  const { data: submission } = useQuery({
    queryKey: ["learn", "submission", assignment?.id, user?.id],
    enabled: !!assignment?.id && !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("id, content, status, score, feedback, submitted_at, storage_path")
        .eq("assignment_id", assignment.id)
        .eq("student_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: progress } = useQuery({
    queryKey: ["learn", "lesson-progress", lessonId, user?.id],
    enabled: !!lessonId && !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("id, state")
        .eq("lesson_id", lessonId!)
        .eq("student_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!lesson || lesson.content_kind !== "video") return;
    let cancelled = false;
    setVideoLoading(true);
    setVideoError(null);
    getLessonVideoUrl(lesson.id)
      .then((url) => !cancelled && setVideoUrl(url))
      .catch((e) => !cancelled && setVideoError(e.message))
      .finally(() => !cancelled && setVideoLoading(false));
    return () => {
      cancelled = true;
    };
  }, [lesson?.id, lesson?.content_kind]);

  const markComplete = async () => {
    if (!lesson || !user) return;
    const payload = {
      student_id: user.id,
      lesson_id: lesson.id,
      course_id: lesson.course_id,
      state: "completed",
      progress_percent: 100,
      completed_at: new Date().toISOString(),
    };
    const { error } = progress
      ? await supabase.from("lesson_progress").update(payload).eq("id", (progress as any).id)
      : await supabase.from("lesson_progress").insert(payload);
    if (error) {
      toast.error("تعذر حفظ التقدم");
      return;
    }
    toast.success("تم إنهاء الدرس");
    qc.invalidateQueries({ queryKey: ["learn"] });
  };

  const submitWork = async (file?: File) => {
    if (!assignment || !user) return;
    setSubmitting(true);
    try {
      let storage_path: string | null = submission?.storage_path ?? null;
      let mime_type: string | null = null;
      let size_bytes: number | null = null;

      if (file) {
        const path = `submissions/${user.id}/${assignment.id}/${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage.from("uploads").upload(path, file, {
          contentType: file.type,
          upsert: false,
        });
        if (upErr) throw upErr;
        storage_path = path;
        mime_type = file.type;
        size_bytes = file.size;
      }

      const row = {
        assignment_id: assignment.id,
        student_id: user.id,
        content: answer || submission?.content || null,
        storage_path,
        mime_type,
        size_bytes,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      };

      const { error } = submission
        ? await supabase.from("submissions").update(row).eq("id", (submission as any).id)
        : await supabase.from("submissions").insert(row);
      if (error) throw error;

      toast.success("تم تسليم الواجب");
      setAnswer("");
      qc.invalidateQueries({ queryKey: ["learn", "submission"] });
    } catch (e: any) {
      toast.error(e.message ?? "تعذر التسليم");
    } finally {
      setSubmitting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const resourceUrl = (r: any) =>
    r.external_url ??
    (r.storage_path ? supabase.storage.from("uploads").getPublicUrl(r.storage_path).data.publicUrl : null);

  if (isLoading) {
    return (
      <LearnLayout title="جارٍ التحميل…">
        <div className="h-64 rounded-xl bg-muted animate-pulse" />
      </LearnLayout>
    );
  }

  if (!lesson) {
    return (
      <LearnLayout title="الدرس غير متاح" back={{ to: "/learn", label: "دوراتي" }}>
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            هذا الدرس غير موجود أو لم يُنشر بعد.
          </CardContent>
        </Card>
      </LearnLayout>
    );
  }

  return (
    <LearnLayout
      title={lesson.title_ar}
      subtitle={lesson.description_ar ?? undefined}
      back={{ to: `/learn/course/${lesson.course_id}`, label: "العودة للدورة" }}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {lesson.content_kind !== "video" ? (
                <div className="p-8 text-center text-muted-foreground">لا يوجد فيديو لهذا الدرس.</div>
              ) : videoLoading ? (
                <div className="aspect-video flex items-center justify-center bg-muted">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : videoUrl ? (
                <video src={videoUrl} controls controlsList="nodownload" className="w-full aspect-video bg-black" />
              ) : (
                <div className="aspect-video flex flex-col items-center justify-center gap-2 bg-muted text-center px-6">
                  <Lock className="w-6 h-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {videoError === "Lesson is not published yet"
                      ? "الفيديو لم يُتح بعد، سيظهر فور نشر الدرس."
                      : videoError === "Not enrolled in this course"
                      ? "هذا الدرس متاح للطلاب المسجلين في الدورة فقط."
                      : videoError ?? "الفيديو غير متاح حالياً."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {Array.isArray(lesson.objectives_ar) && lesson.objectives_ar.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">أهداف الدرس</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(lesson.objectives_ar as string[]).map((o, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {o}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {assignment && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    {assignment.title}
                  </CardTitle>
                  {submission && (
                    <Badge variant={submission.status === "reviewed" ? "default" : "secondary"}>
                      {submission.status === "reviewed" ? `تم التقييم ${submission.score ?? ""}` : "تم التسليم"}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {assignment.description && (
                  <p className="text-sm text-muted-foreground">{assignment.description}</p>
                )}
                {assignment.due_at && (
                  <p className="text-xs text-muted-foreground">
                    آخر موعد للتسليم: {new Date(assignment.due_at).toLocaleString("ar-EG")}
                  </p>
                )}
                {submission?.feedback && (
                  <div className="rounded-lg bg-muted p-3 text-sm">
                    <span className="font-medium">ملاحظات المدرب: </span>
                    {submission.feedback}
                  </div>
                )}
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={submission?.content ? "تحديث إجابتك…" : "اكتب إجابتك هنا…"}
                  rows={4}
                />
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void submitWork(f);
                  }}
                />
                <div className="flex gap-2">
                  <Button onClick={() => submitWork()} disabled={submitting || (!answer && !submission)}>
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
                    تسليم الواجب
                  </Button>
                  <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={submitting}>
                    <Upload className="w-4 h-4 ml-2" />
                    إرفاق ملف
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ملفات الدرس</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(resources ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">لا توجد ملفات مرفقة.</p>
              ) : (
                (resources ?? []).map((r: any) => {
                  const url = resourceUrl(r);
                  return (
                    <a
                      key={r.id}
                      href={url ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-2 rounded-lg border border-border/60 p-3 text-sm hover:bg-muted transition-colors"
                    >
                      <span className="truncate">{r.title}</span>
                      {r.external_url ? (
                        <ExternalLink className="w-4 h-4 shrink-0" />
                      ) : (
                        <Download className="w-4 h-4 shrink-0" />
                      )}
                    </a>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-5 space-y-3">
              <p className="text-sm text-muted-foreground">
                {(progress as any)?.state === "completed" ? "أنهيت هذا الدرس 🎉" : "علّم الدرس كمكتمل بعد المشاهدة."}
              </p>
              <Button
                className="w-full"
                variant={(progress as any)?.state === "completed" ? "outline" : "default"}
                onClick={markComplete}
              >
                <CheckCircle2 className="w-4 h-4 ml-2" />
                {(progress as any)?.state === "completed" ? "مكتمل" : "إنهاء الدرس"}
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link to={`/learn/course/${lesson.course_id}`}>كل دروس الدورة</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </LearnLayout>
  );
};

export default LessonPage;
