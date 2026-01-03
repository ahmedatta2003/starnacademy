import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import logo from "@/assets/starn-logo.png";
import MobileMenu from "@/components/MobileMenu";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src={logo} alt="Starn Academy Logo" className="h-12 w-12" />
          <div>
            <h1 className="text-2xl font-bold text-primary">starn academy</h1>
            <p className="text-xs text-muted-foreground">Build Minds for Tomorrow</p>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
            {t('من نحن', 'About Us')}
          </a>
          <a href="#courses" className="text-foreground hover:text-primary transition-colors font-medium">
            {t('الدورات', 'Courses')}
          </a>
          <a href="#why-us" className="text-foreground hover:text-primary transition-colors font-medium">
            {t('لماذا نحن', 'Why Us')}
          </a>
          <Link to="/booking" className="text-foreground hover:text-primary transition-colors font-medium">
            {t('احجز الآن', 'Book Now')}
          </Link>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium">
            {t('تواصل معنا', 'Contact Us')}
          </a>
          <Link to="/community" className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-1">
            🌟 {t('المجتمع', 'Community')}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="relative group"
            title={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
          >
            <Globe className="h-5 w-5" />
            <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center">
              {language === 'ar' ? 'EN' : 'ع'}
            </span>
          </Button>
          
          <Link to="/auth" className="hidden md:block">
            <Button size="lg">
              {t('تسجيل الدخول', 'Login')}
            </Button>
          </Link>
          
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
};

export default Header;
