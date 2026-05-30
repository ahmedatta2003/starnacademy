import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Q = {
  id?: string;
  course: string;
  difficulty: string;
  min_age: number;
  max_age: number;
  question_ar: string;
  option_1_ar: string;
  option_2_ar: string;
  option_3_ar: string;
  option_4_ar: string;
  correct_option: number;
  explanation_ar: string | null;
  is_visible: boolean;
  display_order: number;
};

const blank = (): Q => ({
  course: "genius",
  difficulty: "easy",
  min_age: 6,
  max_age: 18,
  question_ar: "",
  option_1_ar: "",
  option_2_ar: "",
  option_3_ar: "",
  option_4_ar: "",
  correct_option: 1,
  explanation_ar: "",
  is_visible: true,
  display_order: 0,
});

const COURSES = [
  { v: "genius", l: "Genius (شهرين)" },
  { v: "stars", l: "Stars (4 شهور)" },
  { v: "diploma", l: "Diploma (6 شهور)" },
];

const DIFFS = [
  { v: "easy", l: "سهل" },
  { v: "medium", l: "متوسط" },
  { v: "hard", l: "صعب" },
];

const AdminQuiz = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Q[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Q | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    const { data } = await supabase
      .from("quiz_questions")
      .select("*")
      .order("course")
      .order("difficulty")
      .order("display_order");
    setItems((data as Q[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async (it: Q) => {
    if (!it.question_ar.trim() || !it.option_1_ar.trim()) {
      toast({ variant: "destructive", title: "السؤال و الخيار الأول مطلوبان" });
      return;
    }
    const payload = { ...it };
    delete (payload as any).id;
    const { error } = it.id
      ? await supabase.from("quiz_questions").update(payload).eq("id", it.id)
      : await supabase.from("quiz_questions").insert(payload);
    if (error) return toast({ variant: "destructive", title: "خطأ", description: error.message });
    toast({ title: "تم الحفظ ✅" });
    setDraft(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("حذف هذا السؤال؟")) return;
    const { error } = await supabase.from("quiz_questions").delete().eq("id", id);
    if (error) return toast({ variant: "destructive", title: "خطأ", description: error.message });
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  const filtered = filter === "all" ? items : items.filter((i) => i.course === filter);

  const Row = ({ it, onChange }: { it: Q; onChange: (v: Q) => void }) => (
    <div className="space-y-3">
      <div className="grid md:grid-cols-4 gap-3">
        <Select value={it.course} onValueChange={(v) => onChange({ ...it, course: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{COURSES.map((c) => <SelectItem key={c.v} value={c.v}>{c.l}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={it.difficulty} onValueChange={(v) => onChange({ ...it, difficulty: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{DIFFS.map((c) => <SelectItem key={c.v} value={c.v}>{c.l}</SelectItem>)}</SelectContent>
        </Select>
        <Input type="number" placeholder="أقل سن" value={it.min_age} onChange={(e) => onChange({ ...it, min_age: +e.target.value })} />
        <Input type="number" placeholder="أكبر سن" value={it.max_age} onChange={(e) => onChange({ ...it, max_age: +e.target.value })} />
      </div>
      <Textarea dir="rtl" placeholder="نص السؤال" value={it.question_ar} onChange={(e) => onChange({ ...it, question_ar: e.target.value })} />
      <div className="grid md:grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Badge
              variant={it.correct_option === i ? "default" : "outline"}
              className="cursor-pointer min-w-[32px] justify-center"
              onClick={() => onChange({ ...it, correct_option: i })}
            >
              {i}
            </Badge>
            <Input
              dir="rtl"
              placeholder={`الخيار ${i}${it.correct_option === i ? " (الإجابة الصحيحة)" : ""}`}
              value={(it as any)[`option_${i}_ar`]}
              onChange={(e) => onChange({ ...it, [`option_${i}_ar`]: e.target.value } as any)}
            />
          </div>
        ))}
      </div>
      <Textarea dir="rtl" placeholder="شرح الإجابة (اختياري)" value={it.explanation_ar ?? ""} onChange={(e) => onChange({ ...it, explanation_ar: e.target.value })} />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch checked={it.is_visible} onCheckedChange={(v) => onChange({ ...it, is_visible: v })} />
          <span className="text-sm">ظاهر</span>
        </div>
        <Input className="max-w-[120px]" type="number" placeholder="الترتيب" value={it.display_order} onChange={(e) => onChange({ ...it, display_order: +e.target.value })} />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        أسئلة الاختبار التكيفي. يتم اختيار الأسئلة بناءً على الكورس والسن، ويرتفع/ينخفض المستوى تلقائياً حسب إجابات الممتحن.
      </p>

      <div className="flex items-center gap-3 flex-wrap">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="max-w-[220px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الكورسات</SelectItem>
            {COURSES.map((c) => <SelectItem key={c.v} value={c.v}>{c.l}</SelectItem>)}
          </SelectContent>
        </Select>
        {!draft && <Button onClick={() => setDraft(blank())}><Plus className="w-4 h-4 ml-1" />إضافة سؤال</Button>}
      </div>

      {draft && (
        <Card className="p-4 space-y-3 border-primary">
          <h3 className="font-bold">سؤال جديد</h3>
          <Row it={draft} onChange={setDraft} />
          <div className="flex gap-2">
            <Button onClick={() => save(draft)}><Save className="w-4 h-4 ml-1" />حفظ</Button>
            <Button variant="outline" onClick={() => setDraft(null)}>إلغاء</Button>
          </div>
        </Card>
      )}

      {filtered.map((it) => (
        <Card key={it.id} className="p-4 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge>{COURSES.find((c) => c.v === it.course)?.l ?? it.course}</Badge>
            <Badge variant="outline">{DIFFS.find((c) => c.v === it.difficulty)?.l ?? it.difficulty}</Badge>
            <Badge variant="secondary">{it.min_age}-{it.max_age} سنة</Badge>
            {!it.is_visible && <Badge variant="destructive">مخفي</Badge>}
          </div>
          <Row it={it} onChange={(v) => setItems((prev) => prev.map((p) => p.id === it.id ? v : p))} />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => save(it)}><Save className="w-4 h-4 ml-1" />حفظ</Button>
            <Button size="sm" variant="destructive" onClick={() => remove(it.id!)}><Trash2 className="w-4 h-4 ml-1" />حذف</Button>
          </div>
        </Card>
      ))}

      {filtered.length === 0 && !draft && (
        <div className="text-center text-muted-foreground py-8">لا توجد أسئلة بعد. اضغط "إضافة سؤال" للبدء.</div>
      )}
    </div>
  );
};

export default AdminQuiz;
