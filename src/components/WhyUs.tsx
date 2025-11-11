import { Square, Semicircle, SprocketStar } from "./shapes/ShapeElements";

const WhyUs = () => {
  const reasons = [
    {
      title: "Age-Appropriate Curriculum",
      titleAr: "منهج مناسب للعمر",
      description: "Tailored learning paths for every developmental stage from 6 to 18 years",
      descriptionAr: "مسارات تعليمية مخصصة لكل مرحلة تطوير من 6 إلى 18 عاماً"
    },
    {
      title: "Small Class Sizes",
      titleAr: "فصول صغيرة",
      description: "Maximum 10 students per class ensures personalized attention",
      descriptionAr: "حد أقصى 10 طلاب لكل فصل لضمان اهتمام شخصي"
    },
    {
      title: "Project-Based Learning",
      titleAr: "تعلم قائم على المشاريع",
      description: "Build real projects and showcase your work in our student gallery",
      descriptionAr: "بناء مشاريع حقيقية وعرض أعمالك في معرض الطلاب"
    },
    {
      title: "Flexible Scheduling",
      titleAr: "جدولة مرنة",
      description: "Weekend and weekday classes available to fit your family's schedule",
      descriptionAr: "حصص نهاية الأسبوع وأيام الأسبوع متاحة لتناسب جدول عائلتك"
    },
    {
      title: "Industry-Standard Tools",
      titleAr: "أدوات احترافية",
      description: "Learn with the same tools used by professional developers",
      descriptionAr: "تعلم باستخدام نفس الأدوات التي يستخدمها المطورون المحترفون"
    },
    {
      title: "Progress Tracking",
      titleAr: "تتبع التقدم",
      description: "Parents receive regular updates on student progress and achievements",
      descriptionAr: "يتلقى أولياء الأمور تحديثات منتظمة عن تقدم الطالب وإنجازاته"
    }
  ];

  return (
    <section id="why-us" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative Elements */}
      <Square className="absolute top-10 left-10 w-12 h-12 opacity-20" color="turquoise" />
      <Semicircle className="absolute top-20 right-20 w-16 h-16 opacity-20" color="coral" />
      <SprocketStar className="absolute bottom-20 left-1/4 opacity-20" color="golden" />
      <Square className="absolute bottom-32 right-1/3 w-8 h-8 opacity-20" color="purple" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-4xl md:text-5xl font-bold" dir="rtl">
            لماذا تختار أكاديمية ستارن؟
          </h2>
          <p className="text-lg opacity-80">
            Why Choose Starn Academy?
          </p>
          <p className="text-xl opacity-95 max-w-2xl mx-auto" dir="rtl">
            نحن لا نُعلّم البرمجة فقط، بل نبني مبتكري الغد
          </p>
          <p className="text-sm opacity-80 max-w-2xl mx-auto">
            Building tomorrow's innovators
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reasons.map((reason, index) => (
            <div 
              key={index}
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-primary-foreground/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                  style={{ 
                    backgroundColor: `hsl(var(--${
                      index % 4 === 0 ? 'turquoise' : 
                      index % 4 === 1 ? 'purple' : 
                      index % 4 === 2 ? 'coral' : 'golden'
                    }))` 
                  }}
                />
                <div>
                  <h3 className="text-xl font-bold mb-2" dir="rtl">{reason.titleAr}</h3>
                  <p className="opacity-90 text-base" dir="rtl">{reason.descriptionAr}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
