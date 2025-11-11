import { Button } from "@/components/ui/button";
import { CodeBracket, PlusSign, Square, Semicircle } from "./shapes/ShapeElements";
import heroImage from "@/assets/hero-kids-coding.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary pt-20">
      {/* Code Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10">
          <CodeBracket />
        </div>
        <div className="absolute top-20 right-20">
          <CodeBracket />
        </div>
        <div className="absolute bottom-20 left-1/4">
          <CodeBracket />
        </div>
        <div className="absolute top-1/3 right-1/3">
          <CodeBracket />
        </div>
      </div>

      {/* Decorative Shapes */}
      <Square className="absolute top-20 left-10 w-8 h-8 animate-float" color="turquoise" />
      <Semicircle className="absolute top-40 right-20 w-10 h-10 animate-float-delayed" color="purple" />
      <PlusSign className="absolute bottom-32 left-1/4 animate-pulse" color="golden" />
      <Square className="absolute bottom-20 right-1/4 w-6 h-6 animate-float" color="coral" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-primary-foreground space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Build Minds for Tomorrow
              </h1>
              <p className="text-2xl md:text-3xl font-semibold opacity-95">
                نصنع عقول الغد
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-lg md:text-xl opacity-80 max-w-xl">
                Empowering kids aged 6-18 to master coding and programming through fun, 
                interactive learning experiences.
              </p>
              <p className="text-base md:text-lg opacity-75 max-w-xl" dir="rtl">
                نُمكّن الأطفال من سن 6-18 عاماً من إتقان البرمجة من خلال تجارب تعليمية تفاعلية وممتعة
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Learning | ابدأ التعلم
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                View Courses | الدورات
              </Button>
            </div>

            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-golden">500+</p>
                <p className="text-sm opacity-80">Students | طالب</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-golden">50+</p>
                <p className="text-sm opacity-80">Courses | دورة</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-golden">98%</p>
                <p className="text-sm opacity-80">Satisfaction | رضا</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Kids learning to code at Starn Academy" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
            </div>
            
            {/* Floating shapes around image */}
            <Square className="absolute -top-6 -left-6 w-12 h-12 animate-bounce" color="golden" />
            <Semicircle className="absolute -bottom-6 -right-6 w-16 h-16 animate-pulse" color="coral" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
