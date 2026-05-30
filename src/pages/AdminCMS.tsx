import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Loader2, Shield } from "lucide-react";
import AdminTexts from "@/components/admin/AdminTexts";
import AdminSections from "@/components/admin/AdminSections";
import AdminTestimonials from "@/components/admin/AdminTestimonials";
import AdminCourses from "@/components/admin/AdminCourses";
import AdminMedia from "@/components/admin/AdminMedia";
import AdminQuiz from "@/components/admin/AdminQuiz";

const AdminCMS = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!error && !!data);
    })();
  }, [user, loading, navigate]);

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="p-8 max-w-md text-center space-y-3">
          <Shield className="w-12 h-12 mx-auto text-destructive" />
          <h1 className="text-2xl font-bold">صلاحيات غير كافية</h1>
          <p className="text-muted-foreground">
            هذه الصفحة متاحة لمديري الموقع فقط.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">لوحة إدارة المحتوى</h1>
            <p className="text-muted-foreground text-sm">
              تحكم في نصوص الموقع، الكورسات، شهادات الأهل، إظهار/إخفاء الأقسام،
              والوسائط.
            </p>
          </div>
        </div>

        <Tabs defaultValue="texts" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full h-auto">
            <TabsTrigger value="texts">النصوص</TabsTrigger>
            <TabsTrigger value="sections">الأقسام</TabsTrigger>
            <TabsTrigger value="testimonials">آراء الأهل</TabsTrigger>
            <TabsTrigger value="courses">الكورسات</TabsTrigger>
            <TabsTrigger value="media">الوسائط</TabsTrigger>
            <TabsTrigger value="quiz">الاختبار التكيفي</TabsTrigger>
          </TabsList>

          <TabsContent value="texts" className="mt-6">
            <AdminTexts />
          </TabsContent>
          <TabsContent value="sections" className="mt-6">
            <AdminSections />
          </TabsContent>
          <TabsContent value="testimonials" className="mt-6">
            <AdminTestimonials />
          </TabsContent>
          <TabsContent value="courses" className="mt-6">
            <AdminCourses />
          </TabsContent>
          <TabsContent value="media" className="mt-6">
            <AdminMedia />
          </TabsContent>
          <TabsContent value="quiz" className="mt-6">
            <AdminQuiz />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminCMS;
