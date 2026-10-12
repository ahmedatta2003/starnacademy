import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const items = [
  { ar: "كورس العباقرة", en: "Genius Course", dAr: "شهران · برمجة متقدمة", dEn: "2 months · Advanced coding", tone: "bg-turquoise/10 border-turquoise/30" },
  { ar: "كورس نجوم المستقبل", en: "Future Stars Course", dAr: "٤ شهور · بداية مثالية", dEn: "4 months · Perfect start", tone: "bg-purple/10 border-purple/30" },
  { ar: "كورس الدبلومة", en: "Diploma Course", dAr: "٦ شهور · من الصفر للاحتراف", dEn: "6 months · Zero to pro", tone: "bg-coral/10 border-coral/30" },
];

const Courses = () => {
  const { t } = useLanguage();
  return (
    <section id="courses" className="py-16 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          {t("دوراتنا التعليمية", "Our Courses")}
        </h2>
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {items.map((c) => (
            <div key={c.en} className={`rounded-2xl border p-6 ${c.tone}`}>
              <h3 className="text-xl font-bold text-foreground">{t(c.ar, c.en)}</h3>
              <p className="mt-2 text-muted-foreground">{t(c.dAr, c.dEn)}</p>
            </div>
          ))}
        </div>
        <Button asChild variant="outline" className="mt-8 gap-2">
          <Link to="/booking">
            {t("احجز الآن", "Book now")}
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Courses;
