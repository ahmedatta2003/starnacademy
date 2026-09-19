import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen, Brain, Code, Monitor, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useCourses } from "@/hooks/useCourses";
import type { PublicCourse } from "@/hooks/useCourses";

type CourseVisual = {
  accent: "turquoise" | "purple" | "coral";
  Icon: typeof BookOpen;
};

const visuals: CourseVisual[] = [
  { accent: "turquoise", Icon: Code },
  { accent: "purple", Icon: Brain },
  { accent: "coral", Icon: Monitor },
];

const fallbackCourses: PublicCourse[] = [
  {
    id: "genius",
    title_ar: "كورس العباقرة",
    title_en: "Genius Course",
    duration: "شهران",
    age_range: "للأطفال ذوي الخبرة البرمجية",
    level: "متقدم",
    price: null,
    icon: null,
    description_ar: "مسار تطبيقي يطوّر مهارات البرمجة وحل المشكلات بصورة عملية.",
    description_en: "A practical track that advances coding and problem-solving skills.",
    features_ar: ["M Block", "بايثون المتقدم", "Framework", "مشروعات تطبيقية"],
    features_en: ["M Block", "Advanced Python", "Framework", "Practical projects"],
    image_url: null,
    display_order: 1,
  },
  {
    id: "future-stars",
    title_ar: "كورس نجوم المستقبل",
    title_en: "Future Stars Course",
    duration: "٤ شهور",
    age_range: "الانطلاقة المثالية للمبتدئين",
    level: "مبتدئ",
    price: null,
    icon: null,
    description_ar: "بداية منظمة وممتعة من أساسيات الكمبيوتر إلى البرمجة والذكاء الاصطناعي.",
    description_en: "A structured start from computer basics to coding and AI.",
    features_ar: ["أساسيات الكمبيوتر", "Scratch", "Python", "أساسيات الذكاء الاصطناعي"],
    features_en: ["Computer Basics", "Scratch", "Python", "AI Basics"],
    image_url: null,
    display_order: 2,
  },
  {
    id: "diploma",
    title_ar: "كورس الدبلومة",
    title_en: "Diploma Course",
    duration: "٦ شهور",
    age_range: "من الصفر إلى الاحتراف",
    level: "شامل",
    price: null,
    icon: null,
    description_ar: "مسار شامل ومتدرج يبني أساسًا قويًا وينقل الطالب إلى تنفيذ مشروعات متكاملة.",
    description_en: "A complete progressive track from strong foundations to full projects.",
    features_ar: ["أساسيات الكمبيوتر", "Scratch", "Python", "مشروعات وذكاء اصطناعي"],
    features_en: ["Computer Basics", "Scratch", "Python", "Projects and AI"],
    image_url: null,
    display_order: 3,
  },
];

const Courses = () => {
  const { language, t } = useLanguage();
  const { data, isLoading } = useCourses();
  const courses = data && data.length > 0 ? data : fallbackCourses;

  return (
    <section id="courses" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-3">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
            {t('الدورات', 'Courses')}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            {t('دوراتنا التعليمية', 'Our Educational Courses')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t(
              'مسارات تعليمية منظمة مصممة لكل فئة عمرية ومستوى مهارة',
              'Structured learning paths designed for every age group and skill level'
            )}
          </p>
        </div>

        {isLoading && (
          <div className="mb-8 flex items-center justify-center gap-2 text-muted-foreground" role="status">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{t("جاري تحميل الدورات...", "Loading courses...")}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {courses.map((course, index) => (
            <CourseTile key={course.id} course={course} index={index} language={language} t={t} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline" size="lg" className="gap-2 border-primary/30">
            <Link to="/courses">
              {t("عرض صفحة كل الدورات", "View all courses")}
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const CourseTile = ({
  course,
  index,
  language,
  t,
}: {
  course: PublicCourse;
  index: number;
  language: string;
  t: (ar: string, en: string) => string;
}) => {
  const visual = visuals[index % visuals.length];
  const Icon = visual.Icon;
  const features = language === "ar" ? course.features_ar : course.features_en;
  const title = language === "ar" ? course.title_ar : course.title_en || course.title_ar;
  const description = language === "ar"
    ? course.description_ar
    : course.description_en || course.description_ar;
  const accentClasses = {
    turquoise: "bg-secondary text-secondary-foreground border-secondary/30",
    purple: "bg-primary text-primary-foreground border-primary/30",
    coral: "bg-accent text-accent-foreground border-accent/30",
  }[visual.accent];
  const softAccentClasses = {
    turquoise: "bg-secondary/10 text-secondary",
    purple: "bg-primary/10 text-primary",
    coral: "bg-accent/10 text-accent",
  }[visual.accent];

  return (
    <Card className="relative overflow-hidden border-2 p-6 flex min-h-[34rem] flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-playful-lg group">
      <div className={`absolute inset-x-0 top-0 h-2 ${accentClasses}`} />
      <div className={`absolute -start-10 -top-10 h-28 w-28 rotate-12 rounded-[2rem] opacity-10 ${accentClasses}`} aria-hidden="true" />
      <div className={`absolute end-7 top-24 h-10 w-10 rotate-45 rounded-md opacity-10 ${accentClasses}`} aria-hidden="true" />

      <div className="relative mb-6 flex items-start justify-between gap-4">
        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${softAccentClasses}`}>
          {course.image_url ? (
            <img src={course.image_url} alt="" className="h-full w-full rounded-2xl object-cover" />
          ) : (
            <Icon className="h-8 w-8" />
          )}
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {course.duration && <Badge variant="secondary"><Clock className="me-1 h-3 w-3" />{course.duration}</Badge>}
          {course.level && <Badge variant="outline">{course.level}</Badge>}
        </div>
      </div>

      <h3 className="relative mb-3 text-2xl font-bold text-foreground">{title}</h3>
      {course.age_range && (
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
          <Users className="h-4 w-4" />
          {course.age_range}
        </p>
      )}
      <p className="mb-6 leading-7 text-muted-foreground">{description}</p>

      <div className="mb-6 flex-1 border-t border-border pt-5">
        <p className="mb-3 text-sm font-bold text-foreground">{t("محتويات الكورس", "Course contents")}</p>
        <div className="grid gap-2">
          {(features ?? []).slice(0, 5).map((feature) => (
            <div key={feature} className="flex items-center gap-2 rounded-lg bg-muted p-2.5 text-sm text-foreground">
              <Sparkles className={`h-4 w-4 shrink-0 ${softAccentClasses}`} />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {course.price && <p className="mb-4 text-lg font-bold text-foreground">{course.price}</p>}
      <Button asChild className={`w-full font-semibold ${accentClasses}`}>
        <Link to="/booking">{t("احجز هذا الكورس", "Book this course")}</Link>
      </Button>
    </Card>
  );
};

export default Courses;
