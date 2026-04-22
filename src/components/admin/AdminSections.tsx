import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { invalidateSiteSections } from "@/hooks/useSiteSections";

type Section = {
  id: string;
  section_key: string;
  label_ar: string;
  label_en: string;
  is_visible: boolean;
  display_order: number;
};

const AdminSections = () => {
  const { toast } = useToast();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_sections")
        .select("*")
        .order("display_order", { ascending: true });
      setSections((data as Section[]) || []);
      setLoading(false);
    })();
  }, []);

  const toggle = async (s: Section, value: boolean) => {
    setSections((prev) =>
      prev.map((p) => (p.id === s.id ? { ...p, is_visible: value } : p))
    );
    const { error } = await supabase
      .from("site_sections")
      .update({ is_visible: value })
      .eq("id", s.id);
    if (error) {
      toast({ variant: "destructive", title: "خطأ", description: error.message });
      // revert
      setSections((prev) =>
        prev.map((p) => (p.id === s.id ? { ...p, is_visible: !value } : p))
      );
    } else {
      invalidateSiteSections();
      toast({ title: value ? "تم الإظهار ✅" : "تم الإخفاء" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        تحكم في إظهار/إخفاء الأقسام الرئيسية في الصفحة الأساسية.
      </p>
      {sections.map((s) => (
        <Card key={s.id} className="p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{s.label_ar}</h3>
            <p className="text-xs text-muted-foreground">{s.label_en} · {s.section_key}</p>
          </div>
          <Switch
            checked={s.is_visible}
            onCheckedChange={(v) => toggle(s, v)}
          />
        </Card>
      ))}
    </div>
  );
};

export default AdminSections;
