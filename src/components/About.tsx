import { Card } from "@/components/ui/card";
import { Code2, Users, Rocket, Award } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Code2,
      title: "Interactive Coding",
      titleAr: "برمجة تفاعلية",
      description: "Learn through hands-on projects and real-world applications",
      descriptionAr: "تعلم من خلال مشاريع عملية وتطبيقات واقعية",
      color: "turquoise"
    },
    {
      icon: Users,
      title: "Expert Instructors",
      titleAr: "مدربون خبراء",
      description: "Learn from experienced programming professionals",
      descriptionAr: "تعلم من محترفين ذوي خبرة في البرمجة",
      color: "purple"
    },
    {
      icon: Rocket,
      title: "Future-Ready Skills",
      titleAr: "مهارات المستقبل",
      description: "Master technologies that matter in tomorrow's world",
      descriptionAr: "أتقن التقنيات المهمة في عالم الغد",
      color: "coral"
    },
    {
      icon: Award,
      title: "Certified Programs",
      titleAr: "برامج معتمدة",
      description: "Earn certificates as you progress through courses",
      descriptionAr: "احصل على شهادات مع تقدمك في الدورات",
      color: "golden"
    }
  ];

  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground" dir="rtl">
            مرحباً بك في أكاديمية ستارن
          </h2>
          <p className="text-lg text-foreground/70 mb-2">
            Welcome to Starn Academy
          </p>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-2" dir="rtl">
            نحن في مهمة لتمكين الجيل القادم بمهارات البرمجة التي ستشكل مستقبلهم. منهجنا المبتكر يجعل تعلم البرمجة ممتعاً وجذاباً ومتاحاً لجميع الأعمار
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
            Empowering the next generation with coding skills through innovative curriculum
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2"
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `hsl(var(--${feature.color}))` }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-1 text-foreground" dir="rtl">{feature.titleAr}</h3>
                <p className="text-sm text-foreground/60 mb-2">{feature.title}</p>
                <p className="text-base text-muted-foreground" dir="rtl">{feature.descriptionAr}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
