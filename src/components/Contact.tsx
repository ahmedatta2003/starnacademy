import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const socialLinks = [
  {
    name: 'X',
    url: 'https://x.com/StarnAcademy',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    bgColor: 'bg-black hover:bg-gray-800'
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/starn_academy/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    bgColor: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500'
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61578169890101',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    bgColor: 'bg-[#1877F2] hover:bg-[#166FE5]'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/starnacademy',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    bgColor: 'bg-[#0A66C2] hover:bg-[#004182]'
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@starnacademy',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
    bgColor: 'bg-black hover:bg-gray-800'
  }
];

const Contact = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-turquoise/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
            {t('تواصل معنا', 'Contact Us')}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            {t('ابدأ رحلتك معنا اليوم', 'Start Your Journey Today')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('هل أنت مستعد لبدء رحلة البرمجة؟ تواصل معنا لمعرفة المزيد عن التسجيل', 'Ready to start your coding journey? Contact us to learn more about enrollment')}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {/* Contact Form */}
          <Card className="lg:col-span-3 p-8 shadow-xl border-0 bg-card/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Send className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{t('أرسل لنا رسالة', 'Send us a message')}</h3>
                <p className="text-muted-foreground text-sm">{t('سنرد عليك في أقرب وقت', 'We will respond as soon as possible')}</p>
              </div>
            </div>
            
            <form className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t('اسم ولي الأمر', 'Parent Name')}</label>
                  <Input 
                    placeholder={t('أدخل اسمك الكامل', 'Enter your full name')}
                    className="h-12 bg-background/50"
                    dir={t('rtl', 'ltr')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t('البريد الإلكتروني', 'Email')}</label>
                  <Input 
                    type="email" 
                    placeholder={t('example@email.com', 'example@email.com')}
                    className="h-12 bg-background/50"
                    dir="ltr"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t('رقم الهاتف', 'Phone Number')}</label>
                  <Input 
                    type="tel" 
                    placeholder="01XXXXXXXXX"
                    className="h-12 bg-background/50"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t('عمر الطالب', 'Student Age')}</label>
                  <Input 
                    placeholder={t('مثال: 10 سنوات', 'Example: 10 years')}
                    className="h-12 bg-background/50"
                    dir={t('rtl', 'ltr')}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t('رسالتك', 'Your Message')}</label>
                <Textarea 
                  placeholder={t('أخبرنا عن اهتمامات طفلك وما يتطلع لتعلمه...', 'Tell us about your child\'s interests and what they want to learn...')}
                  className="min-h-32 bg-background/50"
                  dir={t('rtl', 'ltr')}
                />
              </div>
              
              <Button size="lg" className="w-full h-14 text-lg font-semibold">
                <Send className="w-5 h-5 mr-2" />
                {t('إرسال الرسالة', 'Send Message')}
              </Button>
            </form>
          </Card>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Details Card */}
            <Card className="p-6 shadow-xl border-0 bg-card/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-6">{t('معلومات التواصل', 'Contact Information')}</h3>
              
              <div className="space-y-5">
                <a 
                  href="mailto:starnacademy42@gmail.com" 
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-turquoise/10 flex items-center justify-center group-hover:bg-turquoise group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5 text-turquoise group-hover:text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t('البريد الإلكتروني', 'Email')}</p>
                    <p className="text-muted-foreground text-sm">starnacademy42@gmail.com</p>
                  </div>
                </a>

                <a 
                  href="https://wa.me/201142965661" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366] transition-colors">
                    <Phone className="w-5 h-5 text-[#25D366] group-hover:text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t('واتساب / هاتف', 'WhatsApp / Phone')}</p>
                    <p className="text-muted-foreground text-sm" dir="ltr">+20 114 296 5661</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-3 rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-coral/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-coral" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t('الموقع', 'Location')}</p>
                    <p className="text-muted-foreground text-sm">{t('القاهرة، مصر', 'Cairo, Egypt')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t('ساعات العمل', 'Working Hours')}</p>
                    <p className="text-muted-foreground text-sm">{t('السبت - الخميس: 9 ص - 6 م', 'Sat - Thu: 9 AM - 6 PM')}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Social Media Card */}
            <Card className="p-6 shadow-xl border-0 bg-card/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">{t('تابعنا على', 'Follow Us')}</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-xl ${social.bgColor} flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
