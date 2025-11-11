import logo from "@/assets/starn-logo.png";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Starn Academy" className="h-10 w-10" />
              <span className="text-xl font-bold">starn academy</span>
            </div>
            <p className="text-sm opacity-80">
              Building minds for tomorrow through innovative coding education for kids aged 6-18.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4" dir="rtl">روابط سريعة</h4>
            <ul className="space-y-2 text-sm" dir="rtl">
              <li><a href="#about" className="opacity-80 hover:opacity-100 transition-opacity">من نحن</a></li>
              <li><a href="#courses" className="opacity-80 hover:opacity-100 transition-opacity">دوراتنا</a></li>
              <li><a href="#why-us" className="opacity-80 hover:opacity-100 transition-opacity">لماذا نحن</a></li>
              <li><a href="#contact" className="opacity-80 hover:opacity-100 transition-opacity">تواصل معنا</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4" dir="rtl">البرامج</h4>
            <ul className="space-y-2 text-sm" dir="rtl">
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">برمجة سكراتش</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">بايثون للأطفال</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">تطوير المواقع</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">تطبيقات الجوال</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4" dir="rtl">تواصل معنا</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-sm opacity-80">
          <p dir="rtl">© 2024 أكاديمية ستارن. جميع الحقوق محفوظة | نصنع عقول الغد</p>
          <p className="text-xs mt-1 opacity-60">Starn Academy - Building Minds for Tomorrow</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
