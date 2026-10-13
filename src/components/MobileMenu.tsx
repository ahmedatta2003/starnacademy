import { useState } from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { publicNavigation } from "@/data/publicNavigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const { language, t } = useLanguage();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="ghost" className="xl:hidden" aria-label={t("فتح القائمة", "Open menu")}>
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side={language === "ar" ? "right" : "left"} className="w-[300px]" dir={language === "ar" ? "rtl" : "ltr"}>
        <SheetHeader>
          <SheetTitle className="text-start">{t("القائمة", "Menu")}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
          {publicNavigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium text-lg py-2"
                onClick={() => setOpen(false)}
              >
                {t(item.ar, item.en)}
              </Link>
          ))}
          <Link to="/auth" onClick={() => setOpen(false)}>
            <Button size="lg" className="w-full mt-4">
              {t("تسجيل الدخول", "Login")}
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
