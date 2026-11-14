import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSectionVisible } from "@/hooks/useSiteSections";
import SectionGate from "@/components/SectionGate";
import Hero from "@/components/Hero";
import ComingSoon from "@/components/sections/ComingSoon";
import VideoShowcase from "@/components/sections/VideoShowcase";

const HomepagePromoCarousel = () => {
  const { t, language } = useLanguage();
  const showHero = useSectionVisible("hero");
  const showAcademy = useSectionVisible("video");
  const showComingSoon = useSectionVisible("coming-soon");
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    ...(showHero ? [{ id: "hero", content: <SectionGate sectionKey="hero"><Hero /></SectionGate> }] : []),
    ...(showAcademy ? [{ id: "video", content: <VideoShowcase /> }] : []),
    ...(showComingSoon ? [{ id: "coming-soon", content: <ComingSoon /> }] : []),
  ];
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, Math.max(0, slides.length - 1)));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const duration = activeSlide?.id === "video" ? 30000 : 8000;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, duration);
    return () => window.clearInterval(timer);
  }, [activeSlide?.id, slides.length]);

  if (slides.length === 0) return null;

  const move = (direction: number) => {
    setActiveIndex((index) => (index + direction + slides.length) % slides.length);
  };

  if (!activeSlide) return null;

  return (
    <div
      className="relative overflow-hidden"
      aria-roledescription={t("عرض متتابع", "carousel")}
    >
      <div key={activeSlide.id} className="promo-slide-enter" dir={language === "ar" ? "rtl" : "ltr"} aria-live="off">
        {activeSlide.content}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-5 start-5 z-20 flex items-center gap-2 rounded-full border border-background/25 bg-foreground/70 p-2 text-background backdrop-blur-sm">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-background hover:bg-background/15 hover:text-background"
            onClick={() => move(-1)}
            aria-label={t("العرض السابق", "Previous feature")}
          >
            {language === "ar" ? (
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
          <div className="flex items-center gap-1.5 px-1" aria-label={t("اختيار العرض", "Choose feature")}>
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={`h-2 rounded-full transition-all ${index === activeIndex ? "w-6 bg-background" : "w-2 bg-background/50"}`}
                onClick={() => setActiveIndex(index)}
                aria-label={t(`العرض ${index + 1}`, `Feature ${index + 1}`)}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-background hover:bg-background/15 hover:text-background"
            onClick={() => move(1)}
            aria-label={t("العرض التالي", "Next feature")}
          >
            {language === "ar" ? (
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default HomepagePromoCarousel;