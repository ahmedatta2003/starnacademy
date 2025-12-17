import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BarChart } from "lucide-react";

const Courses = () => {
  const courses = [
    {
      title: "Introduction to Scratch",
      titleAr: "مقدمة في سكراتش",
      age: "٦-٩ سنوات",
      level: "مبتدئ",
      duration: "١٢ أسبوع",
      students: "150+",
      color: "turquoise",
      description: "Start coding journey with visual programming blocks",
      descriptionAr: "ابدأ رحلة البرمجة بقوالب برمجية مرئية"
    },
    {
      title: "Python for Kids",
      titleAr: "بايثون للأطفال",
      age: "١٠-١٣ سنة",
      level: "مبتدئ",
      duration: "١٦ أسبوع",
      students: "200+",
      color: "purple",
      description: "Learn Python basics through games and animations",
      descriptionAr: "تعلم أساسيات بايثون من خلال الألعاب والرسوم المتحركة"
    },
    {
      title: "Web Development",
      titleAr: "تطوير المواقع",
      age: "١٢-١٥ سنة",
      level: "متوسط",
      duration: "٢٠ أسبوع",
      students: "120+",
      color: "coral",
      description: "Build websites with HTML, CSS, and JavaScript",
      descriptionAr: "بناء مواقع ويب باستخدام HTML و CSS و JavaScript"
    },
    {
      title: "Mobile App Development",
      titleAr: "تطوير تطبيقات الجوال",
      age: "١٤-١٨ سنة",
      level: "متقدم",
      duration: "٢٤ أسبوع",
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
          <h2 className="text-4xl md:text-5xl font-bold text-foreground" dir="rtl">
            دوراتنا التعليمية
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" dir="rtl">
            مسارات تعليمية منظمة مصممة لكل فئة عمرية ومستوى مهارة
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
                  {course.level}
                </Badge>
                <span className="text-sm font-medium text-muted-foreground">{course.age}</span>
              </div>

              <h3 className="text-2xl font-bold mb-1 text-foreground" dir="rtl">{course.titleAr}</h3>
              <p className="text-sm text-foreground/60 mb-3">{course.title}</p>
              <p className="text-base text-muted-foreground mb-6 flex-grow" dir="rtl">{course.descriptionAr}</p>

              <div className="space-y-3 mb-6 text-sm text-muted-foreground" dir="rtl">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.age}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{course.students}+ طالب مسجل</span>
                </div>
              </div>

              <Button 
                className="w-full"
                style={{ backgroundColor: `hsl(var(--${course.color}))` }}
              >
                اعرف المزيد
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
