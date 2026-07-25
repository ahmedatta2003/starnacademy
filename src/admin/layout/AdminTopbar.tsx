import { Moon, Sun, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminTheme } from "../lib/theme";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { logAdminAction } from "../lib/audit";

const AdminTopbar = () => {
  const { theme, toggle } = useAdminTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logAdminAction("admin.logout");
    await signOut();
    navigate("/admin/login");
  };

  return (
    <header className="h-14 border-b border-border bg-background/60 backdrop-blur flex items-center gap-3 px-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search…"
          className="pl-8 h-9 bg-muted/40 border-transparent focus-visible:bg-background"
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <div className="hidden sm:flex flex-col text-right leading-tight mr-1">
          <span className="text-xs font-medium truncate max-w-[160px]">{user?.email}</span>
          <span className="text-[10px] text-muted-foreground">Administrator</span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};

export default AdminTopbar;
