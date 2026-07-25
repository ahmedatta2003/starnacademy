import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck } from "lucide-react";
import { logAdminAction } from "../lib/audit";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in as admin, redirect
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user.id;
      if (!uid) return;
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      if (role) navigate("/admin", { replace: true });
    })();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setLoading(false);
      toast({ variant: "destructive", title: "Login failed", description: error?.message ?? "Invalid credentials" });
      return;
    }
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) {
      await supabase.auth.signOut();
      setLoading(false);
      toast({ variant: "destructive", title: "Not an admin", description: "This account has no admin privileges." });
      return;
    }
    await logAdminAction("admin.login", { metadata: { email } });
    setLoading(false);
    navigate("/admin", { replace: true });
  };

  return (
    <div dir="ltr" className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 font-sans">
      <Card className="w-full max-w-md p-8 space-y-6 border-border">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold">Starn EduOS</h1>
          <p className="text-sm text-muted-foreground">Administrator sign-in</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
          </Button>
        </form>
        <p className="text-[11px] text-center text-muted-foreground">
          Restricted area. All access is logged.
        </p>
      </Card>
    </div>
  );
};

export default AdminLogin;
