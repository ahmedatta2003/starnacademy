import { Card } from "@/components/ui/card";
import {
  Crown,
  Megaphone,
  Cpu,
  HeartHandshake,
  Presentation,
  Code2,
  Gamepad2,
  Globe,
  Blocks,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteContent } from "@/hooks/useSiteContent";

const leadership = [
  {
    icon: Crown,
    titleAr: "المدير التنفيذي",
    titleEn: "Chief Executive Officer",
    descriptionAr: "يقود رؤية الأكاديمية وخطتها الاستراتيجية لصناعة جيل مبدع",
    descriptionEn: "Leads the academy's vision and strategy for a creative generation",
    color: "primary",
  },
  {
    icon: Megaphone,
    titleAr: "مدير التسويق",
    titleEn: "Marketing Manager",
    descriptionAr: "مسؤول عن انتشار الأكاديمية والتواصل مع أولياء الأمور",
    descriptionEn: "Drives the academy's growth and parent communication",
    color: "coral",
  },
  {
    icon: Cpu,
    titleAr: "مدير فرع التكنولوجيا",
    titleEn: "Technology Branch Manager",
    descriptionAr: "يشرف على المحتوى التقني ويراقب جودة كل درس وبرنامج",
    descriptionEn: "Oversees technical content and the quality of every program",
    color: "purple",
  },
  {
    icon: HeartHandshake,
    titleAr: "الموارد البشرية",
    titleEn: "Human Resources",
    descriptionAr: "تجمع أفضل الكفاءات وتعتني بفريق العمل وبيئة التدريب",
    descriptionEn: "Recruits top talent and cares for the team environment",
    color: "turquoise",
  },
  {
    icon: Presentation,
    titleAr: "رئيس المحاضرين",
    titleEn: "Head of Instructors",
    descriptionAr: "يراقب أداء المحاضرين ويطور أساليب الشرح لكل مرحلة عمرية",
    descriptionEn: "Supervises instructors and refines teaching methods per age group",
    color: "golden",
  },
];

const instructors = [
  {
    icon: Blocks,
    titleAr: "محاضر سكراتش",
    titleEn: "Scratch Instructor",
    color: "primary",
  },
  {
    icon: Code2,
    titleAr: "محاضر بايثون",
    titleEn: "Python Instructor",
    color: "turquoise",
  },
  {
    icon: Gamepad2,
    titleAr: "محاضر تطوير الألعاب",
    titleEn: "Game Dev Instructor",
    color: "coral",
  },
  {
    icon: Globe,
    titleAr: "محاضر تطوير الويب",
    titleEn: "Web Dev Instructor",
    color: "purple",
  },
];

const Team = () => {
  const { t } = useLanguage();
  const { c } = useSiteContent();

  return (
    <section id="team" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-3">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
            {c("team", "tag", "فريقنا", "Our Team")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            {c("team", "title", "تعرف على فريقنا", "Meet Our Team")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {c(
              "team",
              "description",
              "فريق متخصص من القيادات والمدربين يعمل معاً ليمنح طفلك تجربة تعليمية آمنة وممتعة وذات جودة عالية.",
              "A dedicated team of leaders and trainers working together to give your child a safe, fun, and high-quality learning experience."
            )}
          </p>
        </div>

        {/* Leadership roles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {leadership.map((member, index) => {
            const Icon = member.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `hsl(var(--${member.color}))` }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-1 text-foreground">
                  {t(member.titleAr, member.titleEn)}
                </h3>
                <p className="text-base text-muted-foreground">
                  {t(member.descriptionAr, member.descriptionEn)}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Instructors */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors.map((member, index) => {
            const Icon = member.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `hsl(var(--${member.color}))` }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-1 text-foreground">
                  {t(member.titleAr, member.titleEn)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(
                    "خبرة في تدريب الأطفال وتقديم المحتوى بطريقة مبسطة وممتعة",
                    "Experienced in teaching kids with simple, engaging content"
                  )}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Team;
