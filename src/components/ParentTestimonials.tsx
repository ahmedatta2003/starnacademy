import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageSquare, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteContent } from "@/hooks/useSiteContent";

type Testimonial = {
  id: string;
  parent_name: string;
  child_name: string | null;
  testimonial_ar: string | null;
  testimonial_en: string | null;
  rating: number | null;
  avatar_url: string | null;
  display_order: number;
};

const FALLBACK: Testimonial[] = [
  {
    id: "f1",
    parent_name: "أحمد محمد",
    child_name: "يوسف",
    testimonial_ar:
      "تجربة ممتازة مع أكاديمية ستارن! المدربون متخصصون ولاحظت تطوراً كبيراً في مهارات ابني البرمجية في فترة قصيرة.",
    testimonial_en:
      "Excellent experience with Starn Academy! The trainers are professional and I noticed a big improvement in my son's programming skills.",
    rating: 5,
    avatar_url: null,
    display_order: 1,
  },
  {
    id: "f2",
    parent_name: "محمد أحمد",
    child_name: "عبدالله",
    testimonial_ar:
      "طرق التدريس مبتكرة ومشوقة. ابني كان ينتظر كل درس بشغف! المنهج مصمم بشكل ممتاز يناسب الأطفال.",
    testimonial_en:
      "Innovative and engaging teaching methods. My son was looking forward to every lesson! The curriculum is excellently designed for kids.",
    rating: 5,
    avatar_url: null,
    display_order: 2,
  },
  {
    id: "f3",
    parent_name: "حسن علي",
    child_name: "عمر",
    testimonial_ar:
      "بيئة تعليمية آمنة ومحفزة. المدربون متفهمون لاحتياجات الأطفال ويعاملونهم بصبر. أنصح الأكاديمية بقوة.",
    testimonial_en:
      "A safe and motivating learning environment. The trainers are understanding and patient. I highly recommend the academy.",
    rating: 5,
    avatar_url: null,
    display_order: 3,
  },
];

const ParentTestimonials = () => {
  const { language } = useLanguage();
  const { c } = useSiteContent();
  const [items, setItems] = useState<Testimonial[]>(FALLBACK);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("parent_testimonials")
        .select(
          "id, parent_name, child_name, testimonial_ar, testimonial_en, rating, avatar_url, display_order"
        )
        .eq("is_visible", true)
        .order("display_order", { ascending: true });
      if (!active) return;
      if (!error && data && data.length > 0) {
        setItems(data as Testimonial[]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const renderStars = (rating: number | null) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < (rating ?? 5) ? "text-golden fill-golden" : "text-muted"
        }`}
      />
    ));

  return (
    <section
      id="testimonials"
      className="py-20 bg-gradient-to-br from-muted/30 to-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-3">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
            {c("testimonials", "tag", "آراء أولياء الأمور", "Parents Reviews")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground flex items-center justify-center gap-3">
            <Quote className="w-8 h-8 text-primary" />
            {c(
              "testimonials",
              "title",
              "ماذا يقول أولياء الأمور",
              "What Parents Say"
            )}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {c(
              "testimonials",
              "subtitle",
              "تجارب حقيقية من عائلات اختارت أكاديمية ستارن لأبنائهم",
              "Real experiences from families who chose Starn Academy for their kids"
            )}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {items.map((review) => {
            const text =
              (language === "ar" ? review.testimonial_ar : review.testimonial_en) ||
              review.testimonial_ar ||
              review.testimonial_en ||
              "";
            return (
              <Card key={review.id} className="hover-lift border-2">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={review.avatar_url ?? undefined} />
                      <AvatarFallback>
                        {review.parent_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground">
                        {review.parent_name}
                      </h4>
                      {review.child_name && (
                        <p className="text-sm text-muted-foreground">
                          {language === "ar" ? "ولي أمر: " : "Parent of: "}
                          {review.child_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {renderStars(review.rating)}
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {text}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>{language === "ar" ? "لا توجد آراء حالياً" : "No reviews yet"}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ParentTestimonials;
