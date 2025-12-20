import { Button } from "@/components/ui/button";
import { CodeBracket, PlusSign, Square, Semicircle } from "./shapes/ShapeElements";
import heroImage from "@/assets/hero-kids-coding.jpg";
import { Link } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CalendarDays, Users, Sparkles, Gift } from "lucide-react";

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
            <div className="space-y-3">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight" dir="rtl">
                نصنع عقول الغد
              </h1>
              <p className="text-xl md:text-2xl opacity-85">
                Build Minds for Tomorrow
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xl md:text-2xl opacity-90 max-w-xl" dir="rtl">
                نُمكّن الأطفال من سن 6-18 عاماً من إتقان البرمجة من خلال تجارب تعليمية تفاعلية وممتعة
              </p>
              <p className="text-base md:text-lg opacity-70 max-w-xl">
                Empowering kids aged 6-18 to master coding through fun, interactive learning
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <HoverCard openDelay={100} closeDelay={200}>
                <HoverCardTrigger asChild>
                  <Link to="/free-session">
                    <Button size="lg" variant="secondary" className="text-lg px-8 group relative overflow-hidden">
                      <Gift className="w-5 h-5 ml-2 group-hover:animate-bounce" />
                      احجز حصتك المجانية
                    </Button>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent 
                  className="w-80 bg-card border-2 border-golden/30 shadow-2xl animate-scale-in" 
                  side="bottom"
                  dir="rtl"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-golden/20">
                        <Sparkles className="w-6 h-6 text-golden" />
                      </div>
                      <h4 className="text-lg font-bold text-foreground">🎉 فرصة ذهبية!</h4>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        <span>الحصة المجانية يوم <strong className="text-primary">1 من كل شهر</strong></span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4 text-coral" />
                        <span>الأعداد <strong className="text-coral">محدودة جداً</strong> - سجل الآن!</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-foreground font-medium">
                        ✨ امنح طفلك فرصة اكتشاف عالم البرمجة مجاناً! جلسة تفاعلية مع مدربين محترفين.
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>

            <div className="flex gap-8 pt-4" dir="rtl">
              <div>
                <p className="text-3xl font-bold text-golden">500+</p>
                <p className="text-sm opacity-80">طالب</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-golden">50+</p>
                <p className="text-sm opacity-80">دورة</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-golden">98%</p>
                <p className="text-sm opacity-80">رضا</p>
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
