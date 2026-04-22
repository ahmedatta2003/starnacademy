import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Trash2, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const BUCKET = "uploads";

const AdminMedia = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from(BUCKET).list("cms", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });
    if (!error && data) {
      const list = data
        .filter((f) => f.name && !f.name.endsWith("/"))
        .map((f) => {
          const path = `cms/${f.name}`;
          const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
          return { name: f.name, url: pub.publicUrl };
        });
      setFiles(list);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `cms/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    setUploading(false);
    e.target.value = "";
    if (error) {
      toast({ variant: "destructive", title: "خطأ في الرفع", description: error.message });
    } else {
      toast({ title: "تم الرفع ✅" });
      load();
    }
  };

  const remove = async (name: string) => {
    if (!confirm("حذف هذا الملف؟")) return;
    const { error } = await supabase.storage.from(BUCKET).remove([`cms/${name}`]);
    if (error) {
      toast({ variant: "destructive", title: "خطأ", description: error.message });
    } else {
      toast({ title: "تم الحذف" });
      load();
    }
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <Button asChild disabled={uploading}>
            <span>
              {uploading ? <Loader2 className="w-4 h-4 animate-spin ml-1" /> : <Upload className="w-4 h-4 ml-1" />}
              رفع صورة أو فيديو
            </span>
          </Button>
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={onUpload}
            disabled={uploading}
          />
          <span className="text-sm text-muted-foreground">
            انسخ رابط الملف بعد الرفع لاستخدامه في النصوص أو الشهادات.
          </span>
        </label>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {files.map((f) => {
            const isVideo = /\.(mp4|webm|mov)$/i.test(f.name);
            return (
              <Card key={f.name} className="p-2 space-y-2">
                <div className="aspect-video bg-muted rounded overflow-hidden flex items-center justify-center">
                  {isVideo ? (
                    <video src={f.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => copyUrl(f.url)}>
                    {copied === f.url ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    نسخ الرابط
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(f.name)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            );
          })}
          {files.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-8">
              لا توجد ملفات بعد. ابدأ برفع أول صورة أو فيديو.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminMedia;
