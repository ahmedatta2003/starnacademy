import { ReactNode, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  back?: { to: string; label: string };
}

const LearnLayout = ({ title, subtitle, children, back }: Props) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/learn" className="flex items-center gap-2 font-bold">
            <GraduationCap className="w-5 h-5 text-primary" />
            منصة التعلم
          </Link>
          <div className="flex items-center gap-2">
            {back && (
              <Button asChild variant="ghost" size="sm">
                <Link to={back.to}>{back.label}</Link>
              </Button>
            )}
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <Home className="w-4 h-4 ml-2" />
                الرئيسية
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
};

export default LearnLayout;
