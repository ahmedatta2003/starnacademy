import { useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, PageHeader, Badge, Column, fmtDate } from "../components/DataTable";
import { useAdminTable, useAdminMutate } from "../lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload, PlayCircle, Trash2 } from "lucide-react";
import { getLessonVideoUrl } from "@/lib/lessonVideo";

const BUCKET = "lesson-videos";
const MAX_BYTES = 2 * 1024 * 1024 * 1024; // 2GB

type Lesson = {
  id: string;
  course_id: string;
  title_ar: string;
  title_en: string | null;
  status: string;
  release_at: string | null;
  content_kind: string;
  content_path: string | null;
};

const statusTone = (status: string, releaseAt: string | null) => {
  if (status !== "published") return "warn" as const;
  if (releaseAt && new Date(releaseAt) > new Date()) return "muted" as const;
  return "success" as const;
};

const AdminLessons = () => {
  const { data: lessons, isLoading } = useAdminTable<Lesson>("lessons", {
    orderBy: "display_order",
    ascending: true,
  });
  const { data: courses } = useAdminTable<any>("dynamic_courses", {
    orderBy: "display_order",
    ascending: true,
  });
  const { update, invalidate } = useAdminMutate("lessons");

  const [active, setActive] = useState<Lesson | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progressLabel, setProgressLabel] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const courseName = useMemo(() => {
    const map = new Map<string, string>();
    (courses ?? []).forEach((c: any) => map.set(c.id, c.title_ar || c.title_en || "—"));
    return map;
  }, [courses]);

  const openLesson = (lesson: Lesson) => {
    setActive(lesson);
    setPreviewUrl(null);
    setProgressLabel("");
  };

  const handleUpload = async (file: File) => {
    if (!active) return;
    if (!file.type.startsWith("video/")) {
      toast({ title: "Invalid file", description: "Please pick a video file.", variant: "destructive" });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast({ title: "File too large", description: "Maximum size is 2GB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    setProgressLabel("Uploading…");
    try {
      const ext = file.name.split(".").pop() || "mp4";
      const path = `${active.course_id}/${active.id}/${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (upErr) throw upErr;

      const previous = active.content_path;

      const { error: dbErr } = await supabase
        .from("lessons")
        .update({ content_kind: "video", content_path: path })
        .eq("id", active.id);
      if (dbErr) {
        await supabase.storage.from(BUCKET).remove([path]);
        throw dbErr;
      }

      if (previous) await supabase.storage.from(BUCKET).remove([previous]);

      setActive({ ...active, content_kind: "video", content_path: path });
      setPreviewUrl(null);
      invalidate();
      toast({ title: "Video uploaded", description: "Stored privately. Publish the lesson to make it playable." });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message ?? "Unexpected error", variant: "destructive" });
    } finally {
      setUploading(false);
      setProgressLabel("");
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeVideo = async () => {
    if (!active?.content_path) return;
    const path = active.content_path;
    const { error } = await supabase
      .from("lessons")
      .update({ content_kind: "none", content_path: null })
      .eq("id", active.id);
    if (error) {
      toast({ title: "Remove failed", description: error.message, variant: "destructive" });
      return;
    }
    await supabase.storage.from(BUCKET).remove([path]);
    setActive({ ...active, content_kind: "none", content_path: null });
    setPreviewUrl(null);
    invalidate();
    toast({ title: "Video removed" });
  };

  const loadPreview = async () => {
    if (!active) return;
    setPreviewLoading(true);
    try {
      setPreviewUrl(await getLessonVideoUrl(active.id));
    } catch (e: any) {
      toast({ title: "Cannot play", description: e.message, variant: "destructive" });
    } finally {
      setPreviewLoading(false);
    }
  };

  const setStatus = async (lesson: Lesson, status: string) => {
    const ok = await update(lesson.id, { status });
    if (ok && active?.id === lesson.id) setActive({ ...active, status });
  };

  const setReleaseAt = async (lesson: Lesson, value: string) => {
    const release_at = value ? new Date(value).toISOString() : null;
    const ok = await update(lesson.id, { release_at });
    if (ok && active?.id === lesson.id) setActive({ ...active, release_at });
  };

  const columns: Column<Lesson>[] = [
    { key: "title_ar", header: "Lesson", render: (r) => <span className="font-medium">{r.title_ar}</span> },
    { key: "course_id", header: "Course", render: (r) => courseName.get(r.course_id) ?? "—" },
    {
      key: "content_path",
      header: "Video",
      render: (r) =>
        r.content_kind === "video" && r.content_path ? (
          <Badge tone="success">uploaded</Badge>
        ) : (
          <Badge>none</Badge>
        ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <Badge tone={statusTone(r.status, r.release_at)}>{r.status}</Badge>,
    },
    { key: "release_at", header: "Release", render: (r) => fmtDate(r.release_at) },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <Button size="sm" variant="outline" onClick={() => openLesson(r)}>
          Manage video
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Lesson Videos"
        subtitle="Upload lesson videos to private storage. Playback only works through short-lived signed links after the lesson is published."
      />
      <DataTable
        rows={lessons}
        columns={columns}
        loading={isLoading}
        searchKeys={["title_ar", "title_en", "status"]}
        empty="No lessons yet."
      />

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{active?.title_ar}</DialogTitle>
            <DialogDescription>
              {active ? courseName.get(active.course_id) ?? "—" : ""}
            </DialogDescription>
          </DialogHeader>

          {active && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Video file</Label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleUpload(f);
                  }}
                />
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={uploading}
                    onClick={() => fileRef.current?.click()}
                    className="flex-1"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {progressLabel}
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        {active.content_path ? "Replace video" : "Upload video"}
                      </>
                    )}
                  </Button>
                  {active.content_path && (
                    <Button variant="destructive" size="icon" onClick={removeVideo} disabled={uploading}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Stored in a private bucket. Max 2GB. Students never get a direct file URL.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={active.status === "published" ? "default" : "outline"}
                      onClick={() => setStatus(active, "published")}
                    >
                      Published
                    </Button>
                    <Button
                      size="sm"
                      variant={active.status !== "published" ? "default" : "outline"}
                      onClick={() => setStatus(active, "draft")}
                    >
                      Draft
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="release">Release at</Label>
                  <Input
                    id="release"
                    type="datetime-local"
                    defaultValue={
                      active.release_at
                        ? new Date(active.release_at).toISOString().slice(0, 16)
                        : ""
                    }
                    onBlur={(e) => setReleaseAt(active, e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-md border border-border p-3 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm">
                    {active.status === "published" &&
                    (!active.release_at || new Date(active.release_at) <= new Date())
                      ? "Live — enrolled students can play this lesson."
                      : "Not released — students get no signed link yet."}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!active.content_path || previewLoading}
                    onClick={loadPreview}
                  >
                    {previewLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Preview
                      </>
                    )}
                  </Button>
                </div>
                {previewUrl && (
                  <video src={previewUrl} controls className="w-full rounded-md bg-black" />
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLessons;
