import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { title: "من نحن", href: "#about" },
    { title: "الدورات", href: "#courses" },
    { title: "لماذا نحن", href: "#why-us" },
    { title: "تواصل معنا", href: "#contact" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="ghost" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px]">
        <SheetHeader>
          <SheetTitle className="text-right">القائمة</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-foreground hover:text-primary transition-colors font-medium text-lg py-2"
              onClick={() => setOpen(false)}
            >
              {item.title}
            </a>
          ))}
          <Link to="/auth" onClick={() => setOpen(false)}>
            <Button size="lg" className="w-full mt-4">
              تسجيل الدخول
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
