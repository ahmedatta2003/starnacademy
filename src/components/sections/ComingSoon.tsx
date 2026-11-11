import { ArrowLeft, Code2, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const ComingSoon = () => {
  const { t } = useLanguage();

  return (
    <section
      id="coming-soon"
      aria-labelledby="coming-soon-title"
      className="relative isolate overflow-hidden bg-foreground py-20 text-background md:py-28"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
        <img
          src="/media/starn-intro-poster.jpg"
          alt=""
          loading="lazy"
          className="h-full w-full scale-110 object-cover opacity-30 blur-xl"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-foreground/80" />

      <div className="container mx-auto grid items-center gap-12 px-4 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 border-b border-background/30 pb-2 text-sm font-semibold text-secondary">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>{t("قريبًا في أكاديمية ستارن", "Coming soon at Starn Academy")}</span>
          </div>
          <h2 id="coming-soon-title" className="text-5xl font-extrabold leading-tight md:text-7xl">
            {t("قريبًا", "Coming Soon")}
          </h2>
          <p className="max-w-xl text-xl leading-relaxed text-background/85 md:text-2xl">
            {t(
              "كورس كامل جديد في الطريق — رحلة تعليمية متكاملة من أول خطوة حتى تنفيذ المشروعات.",
              "A complete new course is on the way — a guided learning journey from the first step to real projects."
            )}
          </p>
          <Button asChild variant="secondary" className="gap-2">
            <Link to="/booking">
              {t("اكتشف دوراتنا الحالية", "Explore current courses")}
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="relative mx-auto w-full max-w-2xl">
          <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-secondary/20 blur-2xl motion-safe:animate-pulse" />
          <div className="relative aspect-video overflow-hidden rounded-xl border border-background/25 bg-background/10 shadow-2xl">
            <img
              src="/media/starn-intro-poster.jpg"
              alt={t("لمحة مرئية عن أجواء أكاديمية ستارن", "A glimpse of the Starn Academy experience")}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-55 blur-[2px]"
            />
            <div className="absolute inset-0 bg-foreground/55" />

            <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 border border-background/30 bg-foreground/65 px-3 py-2 text-xs font-semibold text-background backdrop-blur-sm sm:text-sm">
                  <Code2 className="h-4 w-4 text-secondary" aria-hidden="true" />
                  {t("معاينة الكورس", "Course preview")}
                </span>
                <span className="border border-background/30 bg-foreground/65 px-3 py-2 text-xs font-bold text-background backdrop-blur-sm sm:text-sm">
                  {t("قريبًا", "Coming soon")}
                </span>
              </div>

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-background/60 bg-background/15 text-background backdrop-blur-md sm:h-20 sm:w-20">
                <Play className="ms-1 h-6 w-6 sm:h-8 sm:w-8" aria-hidden="true" />
              </div>

              <div>
                <p className="text-lg font-bold text-background sm:text-2xl">
                  {t("الكورس الكامل قادم", "The full course is coming")}
                </p>
                <div className="mt-4 h-1 overflow-hidden bg-background/30" aria-hidden="true">
                  <div className="h-full w-1/3 bg-secondary motion-safe:animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;