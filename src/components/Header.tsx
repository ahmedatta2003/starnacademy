import { Button } from "@/components/ui/button";
import logo from "@/assets/starn-logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Starn Academy Logo" className="h-12 w-12" />
          <div>
            <h1 className="text-2xl font-bold text-primary">starn academy</h1>
            <p className="text-xs text-muted-foreground">Build Minds for Tomorrow</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
            About | من نحن
          </a>
          <a href="#courses" className="text-foreground hover:text-primary transition-colors font-medium">
            Courses | الدورات
          </a>
          <a href="#why-us" className="text-foreground hover:text-primary transition-colors font-medium">
            Why Us | لماذا نحن
          </a>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium">
            Contact | تواصل معنا
          </a>
        </div>

        <Button size="lg" className="hidden md:inline-flex">
          Enroll Now | سجل الآن
        </Button>

        <Button size="sm" className="md:hidden">
          Menu
        </Button>
      </nav>
    </header>
  );
};

export default Header;
