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
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteContent } from "@/hooks/useSiteContent";

const leadership = [
  {
    icon: Megaphone,
    titleAr: "مدير التسويق",
    titleEn: "Marketing Manager",
    descriptionAr: "يُدير سياسات الاتصال المؤسسي ويعزّز حضور الأكاديمية لدى أولياء الأمور والمجتمع التعليمي",
    descriptionEn: "Directs institutional communication policy and strengthens the academy's standing with parents and the wider education community",
    color: "coral",
    featured: false,
  },
  {
    icon: Cpu,
    titleAr: "مدير فرع التكنولوجيا",
    titleEn: "Technology Branch Manager",
    descriptionAr: "يشرف على البنية التقنية للمحتوى ويضبط معايير الجودة في كل برنامج تعليمي",
    descriptionEn: "Oversees the technical infrastructure of content and enforces quality standards across every educational programme",
    color: "purple",
    featured: false,
  },
  {
    icon: HeartHandshake,
    titleAr: "الموارد البشرية",
    titleEn: "Human Resources",
    descriptionAr: "تستقطب الكفاءات التربوية وتستثمر في التطوير المهني لبيئة العمل والتدريب",
    descriptionEn: "Attracts educational talent and invests in the professional development of the training environment",
    color: "secondary",
    featured: false,
  },
  {
    icon: Presentation,
    titleAr: "رئيس المحاضرين",
    titleEn: "Head of Instructors",
    descriptionAr: "يُقيّم الأداء التدريسي ويطوّر الاستراتيجيات التعليمية بما يراعي الفروق العمرية والمعرفية",
    descriptionEn: "Evaluates teaching performance and develops instructional strategies attuned to age and cognitive differences",
    color: "golden",
    featured: false,
  },
];

const instructors = [
  { icon: Blocks, titleAr: "محاضر سكراتش", titleEn: "Scratch Instructor", color: "primary" },
  { icon: Code2, titleAr: "محاضر بايثون", titleEn: "Python Instructor", color: "secondary" },
  { icon: Gamepad2, titleAr: "محاضر تطوير الألعاب", titleEn: "Game Dev Instructor", color: "coral" },
  { icon: Globe, titleAr: "محاضر تطوير الويب", titleEn: "Web Dev Instructor", color: "purple" },
];

const Team = () => {
  const { t } = useLanguage();
  const { c } = useSiteContent();

  return (
    <section id="team" className="relative py-24 overflow-hidden">
      {/* Soft brand backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/40 via-background to-muted/40 pointer-events-none" />

      {/* Geometric decorations */}
      <div
        className="absolute top-24 start-[6%] w-20 h-20 rounded-3xl rotate-12 opacity-10 pointer-events-none"
        style={{ backgroundColor: "hsl(var(--purple))" }}
      />
      <div
        className="absolute top-1/2 end-[8%] w-14 h-14 rounded-full opacity-10 pointer-events-none"
        style={{ backgroundColor: "hsl(var(--secondary))" }}
      />
      <div
        className="absolute bottom-16 start-[12%] w-10 h-10 rotate-45 opacity-10 pointer-events-none"
        style={{ backgroundColor: "hsl(var(--golden))" }}
      />

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-12 space-y-3">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            {c("team", "tag", "فريقنا", "Our Team")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            {c("team", "title", "تعرف على فريقنا", "Meet Our Team")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {c(
              "team",
              "description",
              "فريقٌ أكاديمي متخصص من القيادات والمدربين، يعمل وفق منظومة واحدة لضمان تجربة تعليمية آمنة ومنهجية وعالية الجودة.",
              "A specialised academic team of leaders and instructors, working within a single framework to ensure a safe, systematic, and high-quality learning experience."
            )}
          </p>
        </div>

        {/* Vision statement */}
        <Card className="relative overflow-hidden border-2 border-transparent mb-12 max-w-4xl mx-auto shadow-lg">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--purple) / 0.08))",
            }}
          />
          <div
            className="absolute inset-y-0 start-0 w-1.5"
            style={{
              background: "linear-gradient(180deg, hsl(var(--primary)), hsl(var(--golden)))",
            }}
          />
          <div className="relative p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "hsl(var(--primary) / 0.14)" }}
              >
                <GraduationCap className="w-6 h-6" style={{ color: "hsl(var(--primary))" }} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground">
                {t("رؤيتنا التربوية", "Our Educational Vision")}
              </h3>
            </div>
            <p className="text-lg leading-loose text-muted-foreground md:text-xl">
              {t(
                "تنطلق الأكاديمية من قناعةٍ راسخة بأنّ تربية الأجيال أمانةٌ علمية وتربوية قبل أن تكون نقلًا للمعرفة؛ لذلك يتّجه فريقنا إلى تطوير أساليب التدريس بصفةٍ مستمرة، وبناء مسارات تعليمية قائمة على التدرّج المعرفي والتعلّم التكيّفي والتقييم المستمر، بما يُخرّج جيلًا قادرًا على التحليل والإبداع والتعامل الواعي مع التقنية.",
                "The academy is founded on the conviction that nurturing generations is a scientific and educational trust before it is the transfer of knowledge. Our team therefore pursues the continuous development of teaching methods and builds learning pathways grounded in cognitive progression, adaptive learning, and continuous assessment, preparing a generation capable of analysis, creativity, and informed engagement with technology."
              )}
            </p>
          </div>
        </Card>

        {/* Featured leadership card */}
        <Card className="relative overflow-hidden border-0 mb-6 max-w-2xl mx-auto shadow-xl hover:shadow-2xl transition-shadow duration-500">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--purple)))",
            }}
          />
          <div className="absolute -top-8 -end-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -bottom-12 -start-6 w-32 h-32 rounded-2xl rotate-12 bg-white/10 pointer-events-none" />
          <div className="relative flex items-center gap-5 p-8">
            <div className="shrink-0 w-20 h-20 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-1">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
                {t("القيادة", "Leadership")}
              </span>
              <h3 className="text-2xl font-bold text-white">
                {t("المدير التنفيذي — باشمهندس أحمد عطا", "Chief Executive Officer — Eng. Ahmed Atta")}
              </h3>
              <p className="text-white/90 font-semibold text-sm">
                {t(
                  "معيد بكلية الحاسبات والمعلومات",
                  "Teaching Assistant, Faculty of Computers and Information"
                )}
              </p>
              <p className="text-white/85 leading-relaxed">
                {t(
                  "يتولى قيادة الرؤية التربوية والخطة الاستراتيجية للأكاديمية، مستندًا إلى خلفيته الأكاديمية المتخصصة في علوم الحاسوب، وعمله الأكاديمي في تدريس طلاب كلية الحاسبات، بما يضمن بيئة تعليمية رصينة وبرامج متطورة تُعِدّ الجيل الناشئ قياديًا ومبدعًا.",
                  "Leads the academy's educational vision and strategic plan, drawing on his specialised academic background in computer science and his teaching role with undergraduate students at the Faculty of Computers, ensuring a rigorous learning environment and advanced programmes that prepare the rising generation to lead and innovate."
                )}
              </p>
            </div>
          </div>
        </Card>

        {/* Leadership roles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {leadership.map((member, index) => {
            const Icon = member.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden p-6 pt-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent"
              >
                <div
                  className="absolute top-0 inset-x-8 h-1 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: `hsl(var(--${member.color}))` }}
                />
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `hsl(var(--${member.color}) / 0.12)`,
                  }}
                >
                  <Icon
                    className="w-8 h-8"
                    style={{ color: `hsl(var(--${member.color}))` }}
                  />
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors.map((member, index) => {
            const Icon = member.icon;
            return (
              <Card
                key={index}
                className="group flex items-center gap-4 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 border-2 border-transparent"
              >
                <div
                  className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `hsl(var(--${member.color}) / 0.12)` }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: `hsl(var(--${member.color}))` }}
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {t(member.titleAr, member.titleEn)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "كفاءة تدريبية متخصصة في تعليم الأطفال وفق أساليب مبسطة قائمة على الممارسة والتطبيق",
                      "Specialised instructional expertise in teaching children through simplified, practice-based methods"
                    )}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Team;
