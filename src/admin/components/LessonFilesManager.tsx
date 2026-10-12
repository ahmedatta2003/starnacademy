import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Download, FilePlus, Loader2, Trash2 } from "lucide-react";
import { getLessonFileUrl } from "@/lib/lessonVideo";

const BUCKET = "lesson-videos";
const MAX = 200 * 1024 * 1024;

const LessonFilesManager = ({ lessonId, courseId }: { lessonId: string; courseId: string }) => {
  const qc = useQueryClient();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const key = ["admin", "lesson_resources", lessonId];

  const { data: files } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_resources")
        .select("id, title, storage_path, size_bytes")
        .eq("lesson_id", lessonId)
        .order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });

  const upload = async (file: File) => {
    if (file.size > MAX) {
      toast({ title: "File too large", description: "Max 200MB.", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const safe = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `resources/${courseId}/${lessonId}/${Date.now()}-${safe}`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
      if (upErr) throw upErr;
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("lesson_resources").insert({
        lesson_id: lessonId,
        course_id: courseId,
        title: file.name,
        kind: "file",
        storage_path: path,
        mime_type: file.type || null,
        size_bytes: file.size,
        uploaded_by: u.user?.id ?? null,
      });
      if (error) {
        await supabase.storage.from(BUCKET).remove([path]);
        throw error;
      }
      qc.invalidateQueries({ queryKey: key });
      toast({ title: "File added" });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };

  const remove = async (f: any) => {
    const { error } = await supabase.from("lesson_resources").delete().eq("id", f.id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    if (f.storage_path) await supabase.storage.from(BUCKET).remove([f.storage_path]);
    qc.invalidateQueries({ queryKey: key });
  };

  const open = async (id: string) => {
    try {
      window.open(await getLessonFileUrl(id), "_blank");
    } catch (e: any) {
      toast({ title: "Cannot open", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-2">
      <Label>Lesson files</Label>
      <input ref={ref} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      <div className="space-y-1">
        {(files ?? []).map((f: any) => (
          <div key={f.id} className="flex items-center justify-between gap-2 rounded border border-border px-2 py-1.5 text-sm">
            <span className="truncate">{f.title}</span>
            <div className="flex gap-1 shrink-0">
              <Button size="icon" variant="ghost" onClick={() => open(f.id)}><Download className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(f)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" disabled={busy} onClick={() => ref.current?.click()}>
        {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FilePlus className="w-4 h-4 mr-2" />}
        Add file
      </Button>
      <p className="text-xs text-muted-foreground">Private. Students get a temporary link only after the lesson is published.</p>
    </div>
  );
};

export default LessonFilesManager;
