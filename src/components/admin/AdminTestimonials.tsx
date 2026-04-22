import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Testimonial = {
  id: string;
  parent_name: string;
  child_name: string | null;
  testimonial_ar: string | null;
  testimonial_en: string | null;
  rating: number | null;
  avatar_url: string | null;
  is_visible: boolean;
  display_order: number;
};

const blank = (): Partial<Testimonial> => ({
  parent_name: "",
  child_name: "",
  testimonial_ar: "",
  testimonial_en: "",
  rating: 5,
  avatar_url: "",
  is_visible: true,
  display_order: 0,
});

const AdminTestimonials = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Partial<Testimonial> | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("parent_testimonials")
      .select("*")
      .order("display_order", { ascending: true });
    setItems((data as Testimonial[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveItem = async (it: Partial<Testimonial>) => {
    if (!it.parent_name?.trim()) {
      toast({ variant: "destructive", title: "اسم ولي الأمر مطلوب" });
      return;
    }
    if (it.id) {
      const { error } = await supabase
        .from("parent_testimonials")
        .update({
          parent_name: it.parent_name,
          child_name: it.child_name,
          testimonial_ar: it.testimonial_ar,
          testimonial_en: it.testimonial_en,
          rating: it.rating ?? 5,
          avatar_url: it.avatar_url,
          is_visible: it.is_visible ?? true,
          display_order: it.display_order ?? 0,
        })
        .eq("id", it.id);
      if (error) return toast({ variant: "destructive", title: "خطأ", description: error.message });
    } else {
      const { error } = await supabase
        .from("parent_testimonials")
        .insert({
          parent_name: it.parent_name!,
          child_name: it.child_name ?? null,
          testimonial_ar: it.testimonial_ar ?? null,
          testimonial_en: it.testimonial_en ?? null,
          rating: it.rating ?? 5,
          avatar_url: it.avatar_url ?? null,
          is_visible: it.is_visible ?? true,
          display_order: it.display_order ?? 0,
        });
      if (error) return toast({ variant: "destructive", title: "خطأ", description: error.message });
      setDraft(null);
    }
    toast({ title: "تم الحفظ ✅" });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("حذف هذه الشهادة؟")) return;
    const { error } = await supabase.from("parent_testimonials").delete().eq("id", id);
    if (error) return toast({ variant: "destructive", title: "خطأ", description: error.message });
    toast({ title: "تم الحذف" });
    load();
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  const Row = ({ it, onChange }: { it: Partial<Testimonial>; onChange: (v: Partial<Testimonial>) => void }) => (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <Input placeholder="اسم ولي الأمر" value={it.parent_name ?? ""} onChange={(e) => onChange({ ...it, parent_name: e.target.value })} />
        <Input placeholder="اسم الطفل (اختياري)" value={it.child_name ?? ""} onChange={(e) => onChange({ ...it, child_name: e.target.value })} />
      </div>
      <Textarea dir="rtl" placeholder="الشهادة (عربي)" value={it.testimonial_ar ?? ""} onChange={(e) => onChange({ ...it, testimonial_ar: e.target.value })} />
      <Textarea dir="ltr" placeholder="Testimonial (English)" value={it.testimonial_en ?? ""} onChange={(e) => onChange({ ...it, testimonial_en: e.target.value })} />
      <div className="grid md:grid-cols-3 gap-3 items-center">
        <Input type="number" min={1} max={5} placeholder="التقييم 1-5" value={it.rating ?? 5} onChange={(e) => onChange({ ...it, rating: Number(e.target.value) })} />
        <Input placeholder="رابط صورة (اختياري)" value={it.avatar_url ?? ""} onChange={(e) => onChange({ ...it, avatar_url: e.target.value })} />
        <div className="flex items-center gap-2">
          <Switch checked={it.is_visible ?? true} onCheckedChange={(v) => onChange({ ...it, is_visible: v })} />
          <span className="text-sm">ظاهرة</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {!draft && (
        <Button onClick={() => setDraft(blank())}>
          <Plus className="w-4 h-4 ml-1" /> إضافة شهادة جديدة
        </Button>
      )}

      {draft && (
        <Card className="p-4 space-y-3 border-primary">
          <h3 className="font-bold">شهادة جديدة</h3>
          <Row it={draft} onChange={setDraft} />
          <div className="flex gap-2">
            <Button onClick={() => saveItem(draft)}><Save className="w-4 h-4 ml-1" />حفظ</Button>
            <Button variant="outline" onClick={() => setDraft(null)}>إلغاء</Button>
          </div>
        </Card>
      )}

      {items.map((it) => (
        <Card key={it.id} className="p-4 space-y-3">
          <Row it={it} onChange={(v) => setItems((prev) => prev.map((p) => p.id === it.id ? { ...p, ...v } : p))} />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => saveItem(it)}><Save className="w-4 h-4 ml-1" />حفظ</Button>
            <Button size="sm" variant="destructive" onClick={() => remove(it.id)}><Trash2 className="w-4 h-4 ml-1" />حذف</Button>
          </div>
        </Card>
      ))}

      {items.length === 0 && !draft && (
        <p className="text-center text-muted-foreground py-8">لا توجد شهادات بعد. أضف أول شهادة.</p>
      )}
    </div>
  );
};

export default AdminTestimonials;
