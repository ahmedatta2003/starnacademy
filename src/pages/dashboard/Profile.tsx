import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  Trophy, 
  BookOpen,
  Edit,
  Save,
  GraduationCap,
  School,
  Upload,
  Camera
} from "lucide-react";

interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
}

interface ChildData {
  date_of_birth: string;
  grade_level: string;
  school_name: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: "",
    email: "",
    phone: "",
    avatar_url: "",
  });
  const [childData, setChildData] = useState<ChildData>({
    date_of_birth: "",
    grade_level: "",
    school_name: "",
  });

  // بيانات تجريبية للتقدم الدراسي
  const courseProgress = [
    { name: "Python للمبتدئين", progress: 75, status: "جاري" },
    { name: "تطوير الألعاب", progress: 45, status: "جاري" },
    { name: "Scratch للأطفال", progress: 100, status: "مكتمل" },
  ];

  // بيانات تجريبية للشهادات
  const certificates = [
    {
      id: 1,
      title: "إتمام دورة Scratch",
      date: "2024-03-15",
      grade: "ممتاز",
    },
    {
      id: 2,
      title: "أساسيات البرمجة",
      date: "2024-02-10",
      grade: "جيد جداً",
    },
  ];

  // بيانات تجريبية للإنجازات
  const achievements = [
    {
      id: 1,
      title: "أول مشروع",
      description: "إكمال أول مشروع برمجي",
      icon: Trophy,
      earned: true,
    },
    {
      id: 2,
      title: "متعلم نشط",
      description: "حضور 10 دروس متتالية",
      icon: Award,
      earned: true,
    },
    {
      id: 3,
      title: "مبرمج متقدم",
      description: "إتمام 5 دورات",
      icon: GraduationCap,
      earned: false,
    },
  ];

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      setLoading(true);

      // جلب بيانات الملف الشخصي
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (profileError) throw profileError;

      if (profile) {
        setProfileData({
          full_name: profile.full_name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          avatar_url: profile.avatar_url || "",
        });
      }

      // جلب بيانات الطفل إذا كان الدور child
      if (profile?.role === "child") {
        const { data: child, error: childError } = await supabase
          .from("children")
          .select("*")
          .eq("user_id", user?.id)
          .maybeSingle();

        if (!childError && child) {
          setChildData({
            date_of_birth: child.date_of_birth || "",
            grade_level: child.grade_level || "",
            school_name: child.school_name || "",
          });
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("حدث خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    if (editing) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // التحقق من نوع الملف
      if (!file.type.startsWith("image/")) {
        toast.error("يرجى اختيار صورة صالحة");
        return;
      }

      // التحقق من حجم الملف (أقل من 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن يكون أقل من 2 ميجابايت");
        return;
      }

      setUploading(true);

      // رفع الصورة (مؤقتاً نستخدم base64 حتى يتم إنشاء storage bucket)
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        // تحديث الصورة في قاعدة البيانات
        const { error } = await supabase
          .from("profiles")
          .update({ avatar_url: base64String })
          .eq("id", user?.id);

        if (error) throw error;

        setProfileData({ ...profileData, avatar_url: base64String });
        toast.success("تم تحديث الصورة الشخصية بنجاح");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("حدث خطأ في رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      // تحديث بيانات الملف الشخصي
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
        })
        .eq("id", user?.id);

      if (profileError) throw profileError;

      // تحديث بيانات الطفل
      const { data: existingChild } = await supabase
        .from("children")
        .select("id")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (existingChild) {
        const { error: childError } = await supabase
          .from("children")
          .update({
            date_of_birth: childData.date_of_birth,
            grade_level: childData.grade_level,
            school_name: childData.school_name,
          })
          .eq("user_id", user?.id);

        if (childError) throw childError;
      }

      toast.success("تم حفظ التغييرات بنجاح");
      setEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("حدث خطأ في حفظ البيانات");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData.full_name) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar 
                className="h-24 w-24 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleAvatarClick}
              >
                <AvatarImage src={profileData.avatar_url} alt={profileData.full_name} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {profileData.full_name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              {editing && (
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                  ) : (
                    <Camera className="h-6 w-6 text-white" />
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div className="flex-1 text-center md:text-right">
              <h1 className="text-3xl font-bold text-foreground">{profileData.full_name}</h1>
              <p className="text-muted-foreground mt-1">طالب في أكاديمية ستارن</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                <Badge variant="secondary">
                  <GraduationCap className="h-3 w-3 ml-1" />
                  {childData.grade_level || "غير محدد"}
                </Badge>
                <Badge variant="secondary">
                  <BookOpen className="h-3 w-3 ml-1" />
                  {courseProgress.filter(c => c.status === "جاري").length} دورات نشطة
                </Badge>
              </div>
            </div>
            <Button
              variant={editing ? "default" : "outline"}
              onClick={() => editing ? handleSaveProfile() : setEditing(true)}
              disabled={loading}
            >
              {editing ? (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  حفظ التغييرات
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 ml-2" />
                  تعديل الملف
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">المعلومات</TabsTrigger>
          <TabsTrigger value="progress">التقدم</TabsTrigger>
          <TabsTrigger value="certificates">الشهادات</TabsTrigger>
          <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
        </TabsList>

        {/* المعلومات الشخصية */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الشخصية</CardTitle>
              <CardDescription>معلوماتك الأساسية في الأكاديمية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">الاسم الكامل</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="full_name"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={profileData.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">تاريخ الميلاد</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dob"
                      type="date"
                      value={childData.date_of_birth}
                      onChange={(e) => setChildData({ ...childData, date_of_birth: e.target.value })}
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">المرحلة الدراسية</Label>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="grade"
                      value={childData.grade_level}
                      onChange={(e) => setChildData({ ...childData, grade_level: e.target.value })}
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">المدرسة</Label>
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="school"
                      value={childData.school_name}
                      onChange={(e) => setChildData({ ...childData, school_name: e.target.value })}
                      disabled={!editing}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* التقدم الدراسي */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>التقدم الدراسي</CardTitle>
              <CardDescription>تقدمك في الدورات الحالية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseProgress.map((course, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="font-medium">{course.name}</span>
                    </div>
                    <Badge variant={course.status === "مكتمل" ? "default" : "secondary"}>
                      {course.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <Progress value={course.progress} className="h-2" />
                    <p className="text-sm text-muted-foreground text-left">{course.progress}%</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* الشهادات */}
        <TabsContent value="certificates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {certificates.map((cert) => (
              <Card key={cert.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Award className="h-8 w-8 text-primary" />
                    <Badge variant="secondary">{cert.grade}</Badge>
                  </div>
                  <CardTitle className="text-lg">{cert.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(cert.date).toLocaleDateString("ar-SA")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    تحميل الشهادة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* الإنجازات */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <Card 
                  key={achievement.id}
                  className={!achievement.earned ? "opacity-50" : ""}
                >
                  <CardHeader className="text-center">
                    <div className={`mx-auto p-3 rounded-full w-fit ${
                      achievement.earned ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    {achievement.earned ? (
                      <Badge variant="default" className="gap-1">
                        <Trophy className="h-3 w-3" />
                        تم الحصول عليه
                      </Badge>
                    ) : (
                      <Badge variant="secondary">مغلق</Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
