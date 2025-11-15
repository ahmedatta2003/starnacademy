import { Home, HelpCircle, Users, BookOpen, MessageCircle, Phone, Bot, GraduationCap, Info } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "الرئيسية", url: "/dashboard", icon: Home },
  { title: "الدورات", url: "/dashboard/courses", icon: GraduationCap },
  { title: "المدربين", url: "/dashboard/trainers", icon: Users },
];

const resourceItems = [
  { title: "الأسئلة الشائعة", url: "/dashboard/faq", icon: HelpCircle },
  { title: "من نحن", url: "/", hash: "#about", icon: Info },
  { title: "لماذا نحن", url: "/", hash: "#why-us", icon: BookOpen },
];

const helpItems = [
  { title: "تواصل معنا", url: "/dashboard/contact", icon: Phone },
  { title: "خدمة العملاء", url: "/dashboard/support", icon: MessageCircle },
  { title: "المساعد الذكي", url: "/dashboard/ai-tutor", icon: Bot },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { signOut } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const collapsed = state === "collapsed";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-2">
          <img src="/src/assets/starn-logo.png" alt="Starn Academy" className="h-8 w-8" />
          {!collapsed && (
            <h2 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
              Starn Academy
            </h2>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* القائمة الرئيسية */}
        <SidebarGroup>
          <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className="hover:bg-muted/50 transition-colors" 
                      activeClassName="bg-primary/10 text-primary font-medium border-r-2 border-primary"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* الموارد والمعلومات */}
        <SidebarGroup>
          <SidebarGroupLabel>الموارد والمعلومات</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resourceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url + (item.hash || '')}
                      className="hover:bg-muted/50 transition-colors" 
                      activeClassName="bg-primary/10 text-primary font-medium border-r-2 border-primary"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* قسم المساعدة */}
        <SidebarGroup>
          <SidebarGroupLabel>المساعدة والدعم</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {helpItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className="hover:bg-muted/50 transition-colors" 
                      activeClassName="bg-primary/10 text-primary font-medium border-r-2 border-primary"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        {!collapsed && (
          <Button 
            variant="outline" 
            onClick={signOut}
            className="w-full"
          >
            تسجيل الخروج
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
