import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground" dir="rtl">
            ابدأ رحلتك معنا اليوم
          </h2>
          <p className="text-lg text-foreground/70">Get Started Today</p>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" dir="rtl">
            هل أنت مستعد لبدء رحلة البرمجة؟ تواصل معنا لمعرفة المزيد عن التسجيل
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Contact us to learn more about enrollment
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-2" dir="rtl">أرسل لنا رسالة</h3>
            <p className="text-sm text-foreground/60 mb-6">Send us a message</p>
            <form className="space-y-6">
              <div>
                <Input 
                  placeholder="اسم ولي الأمر" 
                  className="h-12"
                  dir="rtl"
                />
              </div>
              <div>
                <Input 
                  type="email" 
                  placeholder="البريد الإلكتروني" 
                  className="h-12"
                  dir="rtl"
                />
              </div>
              <div>
                <Input 
                  type="tel" 
                  placeholder="رقم الهاتف" 
                  className="h-12"
                  dir="rtl"
                />
              </div>
              <div>
                <Input 
                  placeholder="عمر الطالب" 
                  className="h-12"
                  dir="rtl"
                />
              </div>
              <div>
                <Textarea 
                  placeholder="أخبرنا عن اهتمامات طفلك وما يتطلع لتعلمه"
                  className="min-h-32"
                  dir="rtl"
                />
              </div>
              <Button size="lg" className="w-full">
                اطلب معلومات
              </Button>
            </form>
          </Card>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-2" dir="rtl">معلومات التواصل</h3>
              <p className="text-sm text-foreground/60 mb-6">Contact Information</p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-turquoise flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Email</p>
                    <p className="text-muted-foreground">info@starnacademy.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Phone</p>
                    <p className="text-muted-foreground">+971 50 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-coral flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Address</p>
                    <p className="text-muted-foreground">Dubai Technology Park, Block 2A</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-6 bg-primary text-primary-foreground">
              <h4 className="text-xl font-bold mb-1" dir="rtl">ساعات العمل</h4>
              <p className="text-sm opacity-80 mb-3">Office Hours</p>
              <div className="space-y-2" dir="rtl">
                <p>السبت - الخميس: 9:00 صباحاً - 6:00 مساءً</p>
                <p className="text-sm opacity-80">Sat - Thu: 9 AM - 6 PM</p>
                <p>الجمعة: مغلق</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
