import certificateTemplate from "@/assets/certificate-template.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useState } from "react";
import Autoplay from "embla-carousel-autoplay";

// Partner logos
import gdgLogo from "@/assets/partners/gdg-logo.png";
import byteForceLogo from "@/assets/partners/byteforce-logo.png";
import aplusLogo from "@/assets/partners/aplus-logo.jpg";
import businessPartnersLogo from "@/assets/partners/business-partners-logo.png";
import trackuLogo from "@/assets/partners/tracku-logo.png";
import partner6Logo from "@/assets/partners/partner6-logo.png";
import partner7Logo from "@/assets/partners/partner7-logo.jpeg";

const partners = [
  { name: "Google Developer Groups", logo: gdgLogo },
  { name: "Byte Force", logo: byteForceLogo },
  { name: "A+", logo: aplusLogo },
  { name: "بيزنيس بارتنر", logo: businessPartnersLogo },
  { name: "تراكي نشاط طلابي", logo: trackuLogo },
  { name: "Partner 6", logo: partner6Logo },
  { name: "Partner 7", logo: partner7Logo },
];

const Certificate = () => {
  const [api, setApi] = useState<any>();

  return (
    <section id="certificate" className="py-20 bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-2" dir="rtl">
            شهادتنا المعتمدة
          </h2>
          <p className="text-lg text-muted-foreground/70 mb-2">Our Certificate</p>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" dir="rtl">
            عند إتمام الدورة، يحصل كل طالب على شهادة إتمام معتمدة
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Certified completion certificate upon finishing
          </p>
        </div>

        {/* Certificate Image - Constrained Size */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative group animate-fade-in">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-turquoise to-purple rounded-lg blur-lg opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-background p-4 md:p-6 rounded-lg shadow-2xl">
              <img 
                src={certificateTemplate} 
                alt="Starn Academy Certificate of Completion - شهادة إتمام من أكاديمية ستارن" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Certificate Features */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-card rounded-lg shadow-md animate-fade-in">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-xl font-bold mb-1" dir="rtl">معتمدة رسمياً</h3>
              <p className="text-sm text-foreground/60 mb-2">Certified</p>
              <p className="text-base text-muted-foreground" dir="rtl">
                شهادة رسمية معترف بها
              </p>
            </div>

            <div className="p-6 bg-card rounded-lg shadow-md animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-xl font-bold mb-1" dir="rtl">تصميم احترافي</h3>
              <p className="text-sm text-foreground/60 mb-2">Professional Design</p>
              <p className="text-base text-muted-foreground" dir="rtl">
                تصميم مميز يناسب الأطفال
              </p>
            </div>

            <div className="p-6 bg-card rounded-lg shadow-md animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="text-4xl mb-3">📜</div>
              <h3 className="text-xl font-bold mb-1" dir="rtl">إنجاز دائم</h3>
              <p className="text-sm text-foreground/60 mb-2">Achievement</p>
              <p className="text-base text-muted-foreground" dir="rtl">
                وثيقة تُثبت المهارات المكتسبة
              </p>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h3 className="text-2xl md:text-3xl font-bold mb-2" dir="rtl">
              شركاؤنا
            </h3>
            <p className="text-lg text-muted-foreground/70">Our Partners</p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
              direction: "rtl",
            }}
            plugins={[
              Autoplay({
                delay: 2000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
            dir="rtl"
            setApi={setApi}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {partners.map((partner, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                  <div className="p-4 h-24 flex items-center justify-center bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-500">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-14 max-w-full object-contain hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Certificate;
