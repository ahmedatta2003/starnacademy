import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Course = {
  id: string;
  title_ar: string;
  title_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  age_range: string | null;
  level: string | null;
  duration: string | null;
  price: string | null;
  is_visible: boolean;
  display_order: number;
};

const blank = (): Partial<Course> => ({
  title_ar: "",
  title_en: "",
  description_ar: "",
  description_en: "",
  age_range: "",
  level: "",
  duration: "",
  price: "",
  is_visible: true,
  display_order: 0,
});

const AdminCourses = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Partial<Course> | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("dynamic_courses")
      .select("*")
      .order("display_order", { ascending: true });
    setItems((data as Course[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async (it: Partial<Course>) => {
    if (!it.title_ar?.trim()) {
      toast({ variant: "destructive", title: "العنوان بالعربية مطلوب" });
      return;
    }
    const payload = {
      title_ar: it.title_ar!,
      title_en: it.title_en ?? null,
      description_ar: it.description_ar ?? null,
      description_en: it.description_en ?? null,
      age_range: it.age_range ?? null,
      level: it.level ?? null,
      duration: it.duration ?? null,
      price: it.price ?? null,
      is_visible: it.is_visible ?? true,
      display_order: it.display_order ?? 0,
    };
    const { error } = it.id
      ? await supabase.from("dynamic_courses").update(payload).eq("id", it.id)
      : await supabase.from("dynamic_courses").insert(payload);
    if (error) return toast({ variant: "destructive", title: "خطأ", description: error.message });
    toast({ title: "تم الحفظ ✅" });
    setDraft(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("حذف هذا الكورس؟")) return;
    const { error } = await supabase.from("dynamic_courses").delete().eq("id", id);
    if (error) return toast({ variant: "destructive", title: "خطأ", description: error.message });
    toast({ title: "تم الحذف" });
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  const Row = ({ it, onChange }: { it: Partial<Course>; onChange: (v: Partial<Course>) => void }) => (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <Input dir="rtl" placeholder="عنوان الكورس (عربي)" value={it.title_ar ?? ""} onChange={(e) => onChange({ ...it, title_ar: e.target.value })} />
        <Input dir="ltr" placeholder="Title (English)" value={it.title_en ?? ""} onChange={(e) => onChange({ ...it, title_en: e.target.value })} />
      </div>
      <Textarea dir="rtl" placeholder="الوصف (عربي)" value={it.description_ar ?? ""} onChange={(e) => onChange({ ...it, description_ar: e.target.value })} />
      <Textarea dir="ltr" placeholder="Description (English)" value={it.description_en ?? ""} onChange={(e) => onChange({ ...it, description_en: e.target.value })} />
      <div className="grid md:grid-cols-4 gap-3">
        <Input placeholder="الفئة العمرية: 6-9" value={it.age_range ?? ""} onChange={(e) => onChange({ ...it, age_range: e.target.value })} />
        <Input placeholder="المستوى: مبتدئ/متقدم" value={it.level ?? ""} onChange={(e) => onChange({ ...it, level: e.target.value })} />
        <Input placeholder="المدة: 8 أسابيع" value={it.duration ?? ""} onChange={(e) => onChange({ ...it, duration: e.target.value })} />
        <Input placeholder="السعر" value={it.price ?? ""} onChange={(e) => onChange({ ...it, price: e.target.value })} />
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={it.is_visible ?? true} onCheckedChange={(v) => onChange({ ...it, is_visible: v })} />
        <span className="text-sm">ظاهر</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        كورسات إضافية تظهر في لوحة الأدمن. الكورسات الأساسية الحالية تظل ظاهرة في الموقع.
      </p>
      {!draft && <Button onClick={() => setDraft(blank())}><Plus className="w-4 h-4 ml-1" />إضافة كورس</Button>}
      {draft && (
        <Card className="p-4 space-y-3 border-primary">
          <h3 className="font-bold">كورس جديد</h3>
          <Row it={draft} onChange={setDraft} />
          <div className="flex gap-2">
            <Button onClick={() => save(draft)}><Save className="w-4 h-4 ml-1" />حفظ</Button>
            <Button variant="outline" onClick={() => setDraft(null)}>إلغاء</Button>
          </div>
        </Card>
      )}
      {items.map((it) => (
        <Card key={it.id} className="p-4 space-y-3">
          <Row it={it} onChange={(v) => setItems((prev) => prev.map((p) => p.id === it.id ? { ...p, ...v } : p))} />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => save(it)}><Save className="w-4 h-4 ml-1" />حفظ</Button>
            <Button size="sm" variant="destructive" onClick={() => remove(it.id)}><Trash2 className="w-4 h-4 ml-1" />حذف</Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AdminCourses;
