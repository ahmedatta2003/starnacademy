import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { invalidateSiteContent } from "@/hooks/useSiteContent";

type Field = {
  section: string;
  key: string;
  label: string;
  fallback_ar: string;
  fallback_en: string;
  multiline?: boolean;
};

const FIELDS: Field[] = [
  // Hero
  { section: "hero", key: "title", label: "Hero — العنوان الرئيسي", fallback_ar: "نصنع عقول الغد", fallback_en: "Build Minds for Tomorrow" },
  { section: "hero", key: "tagline", label: "Hero — السطر التحت العنوان", fallback_ar: "Build Minds for Tomorrow", fallback_en: "نصنع عقول الغد" },
  { section: "hero", key: "subtitle", label: "Hero — الوصف", fallback_ar: "نُمكّن الأطفال من سن 6-18 عاماً من إتقان البرمجة من خلال تجارب تعليمية تفاعلية وممتعة — استثمر في مستقبل طفلك الآن.", fallback_en: "Empowering kids aged 6-18 to master coding through fun, interactive learning experiences — invest in your child's future today.", multiline: true },
  // About
  { section: "about", key: "tag", label: "About — الشارة", fallback_ar: "من نحن", fallback_en: "About Us" },
  { section: "about", key: "title", label: "About — العنوان", fallback_ar: "مرحباً بك في أكاديمية ستارن", fallback_en: "Welcome to Starn Academy" },
  { section: "about", key: "description", label: "About — الوصف", fallback_ar: "نحن في مهمة لتمكين الجيل القادم بمهارات البرمجة التي ستشكل مستقبلهم.", fallback_en: "We are on a mission to empower the next generation with coding skills that will shape their future.", multiline: true },
  // Testimonials
  { section: "testimonials", key: "tag", label: "Testimonials — الشارة", fallback_ar: "آراء أولياء الأمور", fallback_en: "Parents Reviews" },
  { section: "testimonials", key: "title", label: "Testimonials — العنوان", fallback_ar: "ماذا يقول أولياء الأمور", fallback_en: "What Parents Say" },
  { section: "testimonials", key: "subtitle", label: "Testimonials — الوصف", fallback_ar: "تجارب حقيقية من عائلات اختارت أكاديمية ستارن لأبنائهم", fallback_en: "Real experiences from families who chose Starn Academy for their kids", multiline: true },
  // Contact
  { section: "contact", key: "tag", label: "Contact — الشارة", fallback_ar: "تواصل معنا", fallback_en: "Contact Us" },
  { section: "contact", key: "title", label: "Contact — العنوان", fallback_ar: "ابدأ رحلتك معنا اليوم", fallback_en: "Start Your Journey Today" },
  { section: "contact", key: "subtitle", label: "Contact — الوصف", fallback_ar: "هل أنت مستعد لبدء رحلة البرمجة؟ تواصل معنا لمعرفة المزيد عن التسجيل", fallback_en: "Ready to start your coding journey? Contact us to learn more about enrollment", multiline: true },
];

type Values = Record<string, { ar: string; en: string }>;

const AdminTexts = () => {
  const { toast } = useToast();
  const [values, setValues] = useState<Values>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_content")
        .select("section, content_key, value_ar, value_en");
      const map: Values = {};
      data?.forEach((r) => {
        map[`${r.section}.${r.content_key}`] = {
          ar: r.value_ar ?? "",
          en: r.value_en ?? "",
        };
      });
      setValues(map);
      setLoading(false);
    })();
  }, []);

  const update = (id: string, lang: "ar" | "en", v: string) => {
    setValues((prev) => ({
      ...prev,
      [id]: { ar: prev[id]?.ar ?? "", en: prev[id]?.en ?? "", [lang]: v },
    }));
  };

  const save = async (f: Field) => {
    const id = `${f.section}.${f.key}`;
    setSaving(id);
    const v = values[id] ?? { ar: "", en: "" };
    const { error } = await supabase
      .from("site_content")
      .upsert(
        {
          section: f.section,
          content_key: f.key,
          value_ar: v.ar,
          value_en: v.en,
        },
        { onConflict: "section,content_key" }
      );
    setSaving(null);
    if (error) {
      toast({ variant: "destructive", title: "خطأ في الحفظ", description: error.message });
    } else {
      invalidateSiteContent();
      toast({ title: "تم الحفظ ✅" });
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
    <div className="space-y-4">
      {FIELDS.map((f) => {
        const id = `${f.section}.${f.key}`;
        const v = values[id] ?? { ar: "", en: "" };
        const Field = f.multiline ? Textarea : Input;
        return (
          <Card key={id} className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold">{f.label}</h3>
              <Button
                size="sm"
                onClick={() => save(f)}
                disabled={saving === id}
              >
                {saving === id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 ml-1" />
                )}
                حفظ
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">العربية</label>
                <Field
                  dir="rtl"
                  value={v.ar}
                  placeholder={f.fallback_ar}
                  onChange={(e: any) => update(id, "ar", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">English</label>
                <Field
                  dir="ltr"
                  value={v.en}
                  placeholder={f.fallback_en}
                  onChange={(e: any) => update(id, "en", e.target.value)}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminTexts;
