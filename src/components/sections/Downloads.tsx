import { Download, FileImage, FileVideo, Award } from "lucide-react";
import { Square, Semicircle, PlusSign } from "@/components/shapes/ShapeElements";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteContent } from "@/hooks/useSiteContent";
import certificateTemplate from "@/assets/certificate-template-new.png";

type Item = {
  icon: typeof Download;
  ar: string;
  en: string;
  descAr: string;
  descEn: string;
  href: string;
  fileName: string;
  color: string;
};

const items: Item[] = [
  {
    icon: FileVideo,
    ar: "الفيديو التعريفي للأكاديمية",
    en: "Academy Intro Video",
    descAr: "جولة قصيرة جوّه حصصنا ومشاريع الأطفال.",
    descEn: "A short tour inside our sessions and student projects.",
    href: "/media/starn-intro.mp4",
    fileName: "starn-academy-intro.mp4",
    color: "turquoise",
  },
  {
    icon: Award,
    ar: "نموذج شهادة الإتمام",
    en: "Completion Certificate Sample",
    descAr: "شكل الشهادة اللي بيستلمها الطالب بعد إنهاء المسار.",
    descEn: "The certificate students receive after finishing their track.",
    href: certificateTemplate,
    fileName: "starn-academy-certificate.png",
    color: "golden",
  },
  {
    icon: FileImage,
    ar: "بوستر آخر أعمالنا",
    en: "Latest Work Poster",
    descAr: "صورة عالية الجودة من أحدث أعمال طلابنا.",
    descEn: "A high-quality shot from our students' latest work.",
    href: "/media/starn-intro-poster.jpg",
    fileName: "starn-academy-latest-work.jpg",
    color: "coral",
  },
];

const Downloads = () => {
  const { t } = useLanguage();
  const { c } = useSiteContent();

  return (
    <section id="downloads" className="relative py-24 bg-muted/40 overflow-hidden">
      <Square className="absolute top-12 end-10 w-8 h-8 animate-float opacity-70" color="purple" />
      <Semicircle className="absolute bottom-16 start-12 w-12 h-12 animate-float-delayed opacity-70" color="turquoise" />
      <PlusSign className="absolute top-1/2 end-1/4 animate-pulse opacity-60" color="golden" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
            <Download className="w-4 h-4" />
            {c("downloads", "tag", "تحميل", "Downloads")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {c("downloads", "title", "حمّل آخر أعمالنا", "Download Our Latest Work")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {c(
              "downloads",
              "description",
              "ملفات جاهزة تقدر تحمّلها وتشوفها في أي وقت: الفيديو التعريفي، نموذج الشهادة، وصور من مشاريع طلابنا.",
              "Ready-to-download files you can view anytime: the intro video, certificate sample, and shots of our students' projects."
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.en}
                className="group bg-card rounded-3xl border border-border p-6 flex flex-col gap-4 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <span
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `hsl(var(--${item.color}) / 0.15)` }}
                >
                  <Icon className="w-7 h-7" style={{ color: `hsl(var(--${item.color}))` }} />
                </span>

                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-bold text-foreground">{t(item.ar, item.en)}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t(item.descAr, item.descEn)}
                  </p>
                </div>

                <a
                  href={item.href}
                  download={item.fileName}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 font-semibold hover:opacity-90 transition-opacity"
                >
                  <Download className="w-4 h-4" />
                  {t("تحميل الملف", "Download file")}
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Downloads;
