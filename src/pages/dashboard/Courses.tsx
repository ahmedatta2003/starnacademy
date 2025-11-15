import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Award } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "أساسيات البرمجة مع Python",
    description: "تعلم أساسيات البرمجة باستخدام لغة Python الممتعة والسهلة",
    level: "مبتدئ",
    duration: "8 أسابيع",
    students: 150,
    image: "🐍",
  },
  {
    id: 2,
    title: "تصميم المواقع بـ HTML & CSS",
    description: "اصنع موقعك الأول باستخدام HTML و CSS",
    level: "مبتدئ",
    duration: "6 أسابيع",
    students: 120,
    image: "🌐",
  },
  {
    id: 3,
    title: "برمجة الألعاب مع Scratch",
    description: "تعلم البرمجة من خلال صنع الألعاب الممتعة",
    level: "مبتدئ",
    duration: "4 أسابيع",
    students: 200,
    image: "🎮",
  },
  {
    id: 4,
    title: "JavaScript للمبتدئين",
    description: "أضف التفاعلية لمواقعك باستخدام JavaScript",
    level: "متوسط",
    duration: "10 أسابيع",
    students: 90,
    image: "⚡",
  },
];

const Courses = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">الدورات المتاحة</h1>
        <p className="text-muted-foreground">استكشف دوراتنا البرمجية المصممة خصيصاً للأطفال</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-6xl mb-4">{course.image}</div>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <Badge variant={course.level === "مبتدئ" ? "secondary" : "default"}>
                  {course.level}
                </Badge>
              </div>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{course.students}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span>شهادة</span>
                </div>
              </div>
              <Button className="w-full">التسجيل في الدورة</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;
