import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen, Brain, Code, Monitor, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const Courses = () => {
  const { t } = useLanguage();

  const courses = [
    {
      title: "🚀 كورس العباقرة",
      titleEn: "🚀 Genius Course",
      duration: "شهرين",
      durationEn: "2 Months",
      weeks: "٨ أسابيع",
      weeksEn: "8 weeks",
      students: "150+",
      color: "turquoise",
      description: "للأطفال ذوي الخبرة البرمجية 💡",
      descriptionEn: "For kids with programming experience 💡",
      hoverTitle: "🎯 محتوى كورس العباقرة",
      hoverTitleEn: "🎯 Genius Course Content",
      hoverDescription: "هذا الكورس مخصص للأطفال الذين لديهم خبرة ولو بسيطة في البرمجة ✨",
      hoverDescriptionEn: "This course is designed for children who have some programming experience ✨",
      contents: [
        { icon: Code, text: "M Block", textEn: "M Block" },
        { icon: Brain, text: "بايثون المتقدم", textEn: "Advanced Python" },
        { icon: Monitor, text: "فريم ورك", textEn: "Framework" },
        { icon: Sparkles, text: "جلسات تطبيقية عملية", textEn: "Practical Sessions" },
      ]
    },
    {
      title: "⭐ كورس نجوم المستقبل",
      titleEn: "⭐ Future Stars Course",
      duration: "٤ شهور",
      durationEn: "4 Months",
      weeks: "١٦ أسبوع",
      weeksEn: "16 weeks",
      students: "200+",
      color: "purple",
      description: "الانطلاقة المثالية لطفلك 🌟",
      descriptionEn: "The perfect start for your child 🌟",
      hoverTitle: "🎯 محتوى كورس نجوم المستقبل",
      hoverTitleEn: "🎯 Future Stars Course Content",
      hoverDescription: "هذا الكورس هو الأنسب للأطفال المبتدئين في عالم البرمجة 🎮",
      hoverDescriptionEn: "This is the most suitable course for children new to programming 🎮",
      contents: [
        { icon: Monitor, text: "أساسيات الكمبيوتر", textEn: "Computer Basics" },
        { icon: Code, text: "سكراتش", textEn: "Scratch" },
        { icon: Brain, text: "بايثون", textEn: "Python" },
        { icon: Sparkles, text: "أساسيات الذكاء الاصطناعي", textEn: "AI Basics" },
      ]
    },
    {
      title: "🏆 كورس الدبلومة",
      titleEn: "🏆 Diploma Course",
      duration: "٦ شهور",
      durationEn: "6 Months",
      weeks: "٢٤ أسبوع",
      weeksEn: "24 weeks",
      students: "120+",
      color: "coral",
      description: "من الصفر إلى الاحتراف 💪",
      descriptionEn: "From zero to hero 💪",
      hoverTitle: "🎯 محتوى كورس الدبلومة",
      hoverTitleEn: "🎯 Diploma Course Content",
      hoverDescription: "كورس شامل يأخذ مستوى طفلك من 0% إلى 100% 🎓 - النسخة المطولة من كورس نجوم المستقبل بتبسيط أكثر يناسب جميع المستويات",
      hoverDescriptionEn: "A comprehensive course that takes your child from 0% to 100% 🎓 - An extended version of the Future Stars course with more simplification",
      contents: [
        { icon: Monitor, text: "أساسيات الكمبيوتر", textEn: "Computer Basics" },
        { icon: Code, text: "سكراتش", textEn: "Scratch" },
        { icon: Brain, text: "بايثون", textEn: "Python" },
        { icon: Sparkles, text: "أساسيات الذكاء الاصطناعي", textEn: "AI Basics" },
      ]
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {courses.map((course, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 flex flex-col group"
            >
              <div 
                className="h-2 rounded-t-lg -mx-6 -mt-6 mb-6"
                style={{ backgroundColor: `hsl(var(--${course.color}))` }}
              />
              
              <div className="flex justify-between items-start mb-4">
                <Badge 
                  variant="secondary"
                  className="text-white font-bold px-3 py-1"
                  style={{ 
                    backgroundColor: `hsl(var(--${course.color}))`,
                  }}
                >
                  {t(course.duration, course.durationEn)}
                </Badge>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `hsl(var(--${course.color}) / 0.15)` }}
                >
                  <BookOpen 
                    className="w-5 h-5" 
                    style={{ color: `hsl(var(--${course.color}))` }}
                  />
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-2 text-foreground">
                {t(course.title, course.titleEn)}
              </h3>
              <p className="text-base text-muted-foreground mb-6 flex-grow">
                {t(course.description, course.descriptionEn)}
              </p>

              <div className="space-y-3 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: `hsl(var(--${course.color}))` }} />
                  <span>{t(course.weeks, course.weeksEn)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: `hsl(var(--${course.color}))` }} />
                  <span>{course.students} {t('طالب مسجل', 'enrolled students')}</span>
                </div>
              </div>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button 
                    className="w-full text-white font-semibold transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: `hsl(var(--${course.color}))` }}
                  >
                    {t('اعرف المزيد', 'Learn More')}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent 
                  className="w-80 p-4 border-2"
                  style={{ borderColor: `hsl(var(--${course.color}))` }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `hsl(var(--${course.color}))` }}
                      >
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-bold text-foreground">
                        {t(course.hoverTitle, course.hoverTitleEn)}
                      </h4>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(course.hoverDescription, course.hoverDescriptionEn)}
                    </p>
                    
                    <div className="border-t pt-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">
                        {t('محتويات الكورس:', 'Course Contents:')}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {course.contents.map((content, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center gap-2 text-sm p-2 rounded-lg transition-colors"
                            style={{ backgroundColor: `hsl(var(--${course.color}) / 0.1)` }}
                          >
                            <content.icon 
                              className="w-4 h-4 flex-shrink-0" 
                              style={{ color: `hsl(var(--${course.color}))` }}
                            />
                            <span className="text-foreground text-xs font-medium">
                              {t(content.text, content.textEn)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
