import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShieldAlert } from "lucide-react";

const AdminGuard = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [state, setState] = useState<"checking" | "allow" | "deny">("checking");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setState("deny");
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setState(!error && data ? "allow" : "deny");
    })();
  }, [user, loading]);

  if (loading || state === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (state === "deny") {
    if (!user) return <Navigate to="/admin/login" replace state={{ from: location }} />;
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center space-y-3">
          <ShieldAlert className="w-12 h-12 mx-auto text-destructive" />
          <h1 className="text-2xl font-semibold">Access denied</h1>
          <p className="text-sm text-muted-foreground">
            Your account does not have admin privileges.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
