import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AdminLayout = () => {
  const { user } = useAuth();

  // Track admin session/device
  useEffect(() => {
    if (!user) return;
    supabase.from("admin_sessions").insert({
      user_id: user.id,
      user_agent: navigator.userAgent,
      device: navigator.platform,
    }).then(() => {}, () => {});
  }, [user?.id]);

  return (
    <div dir="ltr" className="min-h-screen flex bg-background text-foreground font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
