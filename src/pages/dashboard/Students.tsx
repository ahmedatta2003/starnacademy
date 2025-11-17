import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GraduationCap, Mail, Phone, Calendar, Search, Users } from "lucide-react";
import { toast } from "sonner";

interface Student {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  created_at: string;
  child?: {
    date_of_birth: string;
    grade_level: string;
    school_name: string;
  };
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      
      // جلب جميع الطلاب من قاعدة البيانات
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "child");

      if (profilesError) throw profilesError;

      // جلب بيانات الأطفال
      const studentsWithDetails = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: childData } = await supabase
            .from("children")
            .select("*")
            .eq("user_id", profile.id)
            .maybeSingle();

          return {
            ...profile,
            child: childData || undefined,
          };
        })
      );

      setStudents(studentsWithDetails);
    } catch (error) {
      console.error("Error loading students:", error);
      toast.error("حدث خطأ في تحميل بيانات الطلاب");
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredStudents = students.filter((student) =>
    student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.child?.grade_level?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل بيانات الطلاب...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">الطلاب</h1>
          <p className="text-muted-foreground">
            تعرف على طلابنا المتميزين في أكاديمية ستارن
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-lg">
          <Users className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">
            {students.length} طالب مسجل
          </span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ابحث عن طالب بالاسم أو البريد أو المرحلة الدراسية..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      {filteredStudents.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد نتائج</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "لم يتم العثور على طلاب مطابقين للبحث" : "لا يوجد طلاب مسجلين حالياً"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => {
            const age = student.child?.date_of_birth ? calculateAge(student.child.date_of_birth) : null;
            return (
              <Card key={student.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={student.avatar_url} alt={student.full_name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {student.full_name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{student.full_name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <GraduationCap className="h-4 w-4" />
                        {student.child?.grade_level || "غير محدد"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-2">
                    {student.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{student.email}</span>
                      </div>
                    )}
                    {student.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{student.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>انضم في: {new Date(student.created_at).toLocaleDateString("ar-SA")}</span>
                    </div>
                  </div>

                  {student.child?.school_name && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium mb-1">المدرسة:</p>
                      <p className="text-sm text-muted-foreground">{student.child.school_name}</p>
                    </div>
                  )}

                  {age && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">العمر:</span>
                        <span className="font-medium">{age} سنة</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            معلومات عن برنامج الطلاب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <strong>نظام التعليم:</strong> نستخدم منهجية تعليمية تفاعلية تركز على التطبيق العملي
            والمشاريع الواقعية.
          </p>
          <p>
            <strong>الفئات العمرية:</strong> نقبل الطلاب من عمر 8 سنوات حتى 18 سنة، مع تقسيمهم
            إلى مجموعات حسب العمر والمستوى.
          </p>
          <p>
            <strong>متابعة الأداء:</strong> يتم متابعة تقدم كل طالب بشكل فردي مع تقارير دورية
            لأولياء الأمور.
          </p>
          <p>
            <strong>الشهادات:</strong> يحصل الطلاب على شهادات معتمدة عند إتمام كل دورة بنجاح.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;
