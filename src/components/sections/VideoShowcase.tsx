import { useRef, useState } from "react";
import { Play, Pause, Sparkles, Video as VideoIcon } from "lucide-react";
import { Square, Semicircle, PlusSign } from "@/components/shapes/ShapeElements";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteContent } from "@/hooks/useSiteContent";
import introVideo from "@/assets/starn-intro.mp4.asset.json";
import introPoster from "@/assets/starn-intro-poster.jpg.asset.json";

const VideoShowcase = () => {
  const { t } = useLanguage();
  const { c } = useSiteContent();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section id="video" className="relative py-24 bg-primary overflow-hidden">
      {/* Decorative brand shapes */}
      <Square className="absolute top-16 left-10 w-8 h-8 animate-float" color="turquoise" />
      <Semicircle className="absolute bottom-24 right-16 w-12 h-12 animate-float-delayed" color="coral" />
      <PlusSign className="absolute top-1/2 left-1/3 animate-pulse" color="golden" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-primary-foreground space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 rounded-full text-sm font-semibold">
              <VideoIcon className="w-4 h-4" />
              {c("video", "tag", "شوف بنفسك", "See For Yourself")}
            </span>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              {c("video", "title", "جولة داخل أكاديمية ستارن", "Inside Starn Academy")}
            </h2>

            <p className="text-lg md:text-xl opacity-90 max-w-xl">
              {c(
                "video",
                "description",
                "دقايق قليلة تشوف فيها إزاي أطفالنا بيتعلّموا البرمجة بطريقة عملية وممتعة، مع مدربين متخصصين ومنهج مبني على التعلّم التكيفي لكل طفل حسب مستواه.",
                "A short look at how our students learn coding hands-on and joyfully, with expert trainers and an adaptive curriculum tailored to every child."
              )}
            </p>

            <ul className="space-y-3">
              {[
                [
                  "حصص تفاعلية ومشاريع حقيقية",
                  "Interactive sessions and real projects",
                ],
                ["متابعة مستمرة لولي الأمر", "Continuous parent follow-up"],
                ["مسار تعليمي مخصص لكل طالب", "A personalized path for every student"],
              ].map(([ar, en]) => (
                <li key={en} className="flex items-center gap-3 opacity-90">
                  <Sparkles className="w-5 h-5 text-golden shrink-0" />
                  <span>{t(ar, en)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-primary-foreground/10 bg-black">
              <video
                ref={videoRef}
                src={introVideo.url}
                poster={introPoster.url}
                preload="none"
                playsInline
                controls={playing}
                className="w-full h-auto"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />

              {!playing && (
                <button
                  type="button"
                  onClick={toggle}
                  aria-label={t("تشغيل الفيديو التعريفي", "Play intro video")}
                  className="absolute inset-0 flex items-center justify-center bg-primary/40 hover:bg-primary/25 transition-colors group"
                >
                  <span className="w-20 h-20 rounded-full bg-golden flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    {playing ? (
                      <Pause className="w-8 h-8 text-primary" />
                    ) : (
                      <Play className="w-8 h-8 text-primary ms-1" />
                    )}
                  </span>
                </button>
              )}
            </div>

            <Square className="absolute -top-5 -left-5 w-10 h-10 animate-float" color="golden" />
            <Semicircle className="absolute -bottom-5 -right-5 w-14 h-14 animate-pulse" color="purple" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
