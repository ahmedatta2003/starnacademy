import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Mail, Phone, Calendar, MapPin } from "lucide-react";

const Students = () => {
  // بيانات تجريبية للطلاب
  const students = [
    {
      id: 1,
      name: "أحمد محمد",
      age: 12,
      grade: "الصف السادس",
      courses: ["Python للمبتدئين", "تطوير الألعاب"],
      email: "ahmad@example.com",
      phone: "+966 50 123 4567",
      joinDate: "2024-01-15",
      avatar: "",
    },
    {
      id: 2,
      name: "فاطمة علي",
      age: 14,
      grade: "الصف الثامن",
      courses: ["تطوير المواقع", "JavaScript المتقدم"],
      email: "fatima@example.com",
      phone: "+966 50 234 5678",
      joinDate: "2024-02-20",
      avatar: "",
    },
    {
      id: 3,
      name: "خالد عبدالله",
      age: 10,
      grade: "الصف الرابع",
      courses: ["Scratch للأطفال"],
      email: "khaled@example.com",
      phone: "+966 50 345 6789",
      joinDate: "2024-03-10",
      avatar: "",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">الطلاب</h1>
        <p className="text-muted-foreground">
          تعرف على طلابنا المتميزين في أكاديمية ستارن
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {students.map((student) => (
          <Card key={student.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {student.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-xl">{student.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <GraduationCap className="h-4 w-4" />
                    {student.grade}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>انضم في: {new Date(student.joinDate).toLocaleDateString("ar-SA")}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">الدورات المسجلة:</p>
                <div className="flex flex-wrap gap-2">
                  {student.courses.map((course, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {course}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">العمر:</span>
                  <span className="font-medium">{student.age} سنة</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
