import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BarChart } from "lucide-react";

const Courses = () => {
  const courses = [
    {
      title: "Introduction to Scratch",
      titleAr: "مقدمة في سكراتش",
      age: "6-9 years | 6-9 سنوات",
      level: "Beginner | مبتدئ",
      duration: "12 weeks | 12 أسبوع",
      students: "150+",
      color: "turquoise",
      description: "Start coding journey with visual programming blocks",
      descriptionAr: "ابدأ رحلة البرمجة بقوالب برمجية مرئية"
    },
    {
      title: "Python for Kids",
      titleAr: "بايثون للأطفال",
      age: "10-13 years | 10-13 سنة",
      level: "Beginner | مبتدئ",
      duration: "16 weeks | 16 أسبوع",
      students: "200+",
      color: "purple",
      description: "Learn Python basics through games and animations",
      descriptionAr: "تعلم أساسيات بايثون من خلال الألعاب والرسوم المتحركة"
    },
    {
      title: "Web Development",
      titleAr: "تطوير المواقع",
      age: "12-15 years | 12-15 سنة",
      level: "Intermediate | متوسط",
      duration: "20 weeks | 20 أسبوع",
      students: "120+",
      color: "coral",
      description: "Build websites with HTML, CSS, and JavaScript",
      descriptionAr: "بناء مواقع ويب باستخدام HTML و CSS و JavaScript"
    },
    {
      title: "Mobile App Development",
      titleAr: "تطوير تطبيقات الجوال",
      age: "14-18 years | 14-18 سنة",
      level: "Advanced | متقدم",
      duration: "24 weeks | 24 أسبوع",
      students: "80+",
      color: "golden",
      description: "Create mobile apps and publish to app stores",
      descriptionAr: "إنشاء تطبيقات جوال ونشرها في متاجر التطبيقات"
    }
  ];

  return (
    <section id="courses" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Our Courses | دوراتنا
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-1">
            Structured learning paths designed for every age group and skill level
          </p>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto" dir="rtl">
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

              <h3 className="text-2xl font-bold mb-1 text-foreground">{course.title}</h3>
              <p className="text-lg font-semibold text-foreground/80 mb-3" dir="rtl">{course.titleAr}</p>
              <p className="text-muted-foreground mb-1 flex-grow">{course.description}</p>
              <p className="text-sm text-muted-foreground mb-6" dir="rtl">{course.descriptionAr}</p>

              <div className="space-y-3 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{course.students} enrolled | طالب مسجل</span>
                </div>
              </div>

              <Button 
                className="w-full"
                style={{ backgroundColor: `hsl(var(--${course.color}))` }}
              >
                Learn More | اعرف المزيد
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
