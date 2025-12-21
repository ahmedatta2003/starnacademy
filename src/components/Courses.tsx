import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Courses = () => {
  const { t } = useLanguage();

  const courses = [
    {
      title: "Introduction to Scratch",
      titleAr: "مقدمة في سكراتش",
      age: "6-9",
      ageAr: "٦-٩ سنوات",
      level: "Beginner",
      levelAr: "مبتدئ",
      duration: "12 weeks",
      durationAr: "١٢ أسبوع",
      students: "150+",
      color: "turquoise",
      description: "Start coding journey with visual programming blocks",
      descriptionAr: "ابدأ رحلة البرمجة بقوالب برمجية مرئية"
    },
    {
      title: "Python for Kids",
      titleAr: "بايثون للأطفال",
      age: "10-13",
      ageAr: "١٠-١٣ سنة",
      level: "Beginner",
      levelAr: "مبتدئ",
      duration: "16 weeks",
      durationAr: "١٦ أسبوع",
      students: "200+",
      color: "purple",
      description: "Learn Python basics through games and animations",
      descriptionAr: "تعلم أساسيات بايثون من خلال الألعاب والرسوم المتحركة"
    },
    {
      title: "Web Development",
      titleAr: "تطوير المواقع",
      age: "12-15",
      ageAr: "١٢-١٥ سنة",
      level: "Intermediate",
      levelAr: "متوسط",
      duration: "20 weeks",
      durationAr: "٢٠ أسبوع",
      students: "120+",
      color: "coral",
      description: "Build websites with HTML, CSS, and JavaScript",
      descriptionAr: "بناء مواقع ويب باستخدام HTML و CSS و JavaScript"
    },
    {
      title: "Mobile App Development",
      titleAr: "تطوير تطبيقات الجوال",
      age: "14-18",
      ageAr: "١٤-١٨ سنة",
      level: "Advanced",
      levelAr: "متقدم",
      duration: "24 weeks",
      durationAr: "٢٤ أسبوع",
      students: "80+",
      color: "golden",
      description: "Create mobile apps and publish to app stores",
      descriptionAr: "إنشاء تطبيقات جوال ونشرها في متاجر التطبيقات"
    }
  ];

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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 flex flex-col"
            >
              <div 
                className="h-2 rounded-t-lg -mx-6 -mt-6 mb-6"
                style={{ backgroundColor: `hsl(var(--${course.color}))` }}
              />
              
              <div className="flex justify-between items-start mb-4">
                <Badge 
                  variant="secondary"
                  style={{ 
                    backgroundColor: `hsl(var(--${course.color}))`,
                    color: 'white'
                  }}
                >
                  {t(course.levelAr, course.level)}
                </Badge>
                <span className="text-sm font-medium text-muted-foreground">
                  {t(course.ageAr, `${course.age} years`)}
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-1 text-foreground">
                {t(course.titleAr, course.title)}
              </h3>
              <p className="text-base text-muted-foreground mb-6 flex-grow">
                {t(course.descriptionAr, course.description)}
              </p>

              <div className="space-y-3 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{t(course.durationAr, course.duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{course.students} {t('طالب مسجل', 'enrolled students')}</span>
                </div>
              </div>

              <Button 
                className="w-full"
                style={{ backgroundColor: `hsl(var(--${course.color}))` }}
              >
                {t('اعرف المزيد', 'Learn More')}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
