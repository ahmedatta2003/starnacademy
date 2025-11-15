import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Award, Target, TrendingUp, Star, BookOpen } from "lucide-react";

const GradingSystem = () => {
  const gradingLevels = [
    {
      level: "ممتاز",
      range: "90-100%",
      color: "bg-green-500",
      description: "إتقان ممتاز للمفاهيم والمهارات المطلوبة",
      icon: Star,
    },
    {
      level: "جيد جداً",
      range: "80-89%",
      color: "bg-blue-500",
      description: "فهم قوي وتطبيق جيد للمهارات",
      icon: Award,
    },
    {
      level: "جيد",
      range: "70-79%",
      color: "bg-yellow-500",
      description: "فهم مقبول مع حاجة لمزيد من التطبيق",
      icon: Target,
    },
    {
      level: "مقبول",
      range: "60-69%",
      color: "bg-orange-500",
      description: "الحد الأدنى من الفهم، يحتاج لمزيد من المراجعة",
      icon: TrendingUp,
    },
  ];

  const evaluationCriteria = [
    {
      title: "المشاريع العملية",
      weight: "40%",
      description: "تقييم المشاريع البرمجية التي ينفذها الطالب",
    },
    {
      title: "الاختبارات النظرية",
      weight: "30%",
      description: "اختبارات دورية لقياس فهم المفاهيم الأساسية",
    },
    {
      title: "المشاركة والحضور",
      weight: "15%",
      description: "التفاعل في الصف والالتزام بالحضور",
    },
    {
      title: "الواجبات المنزلية",
      weight: "15%",
      description: "إنجاز التمارين والمهام المطلوبة",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">النظام التقييمي</h1>
        <p className="text-muted-foreground">
          نظام تقييم شامل وعادل لقياس تقدم الطلاب في أكاديمية ستارن
        </p>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle>فلسفة التقييم</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm leading-relaxed">
            نؤمن في أكاديمية ستارن بأن التقييم يجب أن يكون أداة لتحفيز التعلم وليس مجرد رقم.
            نظامنا التقييمي مصمم لقياس الفهم العميق والمهارات العملية، مع التركيز على التقدم
            المستمر لكل طالب.
          </p>
          <p className="text-sm leading-relaxed">
            نستخدم مزيجاً من التقييم المستمر والمشاريع العملية لضمان تقييم شامل لقدرات الطالب
            البرمجية والإبداعية.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">مستويات التقييم</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {gradingLevels.map((level, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${level.color} bg-opacity-10`}>
                      <level.icon className={`h-5 w-5 ${level.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{level.level}</CardTitle>
                      <CardDescription>{level.range}</CardDescription>
                    </div>
                  </div>
                  <div className={`h-3 w-3 rounded-full ${level.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{level.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">معايير التقييم</h2>
        <div className="grid gap-4">
          {evaluationCriteria.map((criterion, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">{criterion.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{criterion.description}</p>
                  </div>
                  <Badge variant="secondary" className="text-lg font-bold px-4 py-1">
                    {criterion.weight}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            الشهادات والإنجازات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <strong>شهادة الإتمام:</strong> يحصل الطالب على شهادة معتمدة عند إتمام الدورة بنجاح
            (60% فأكثر).
          </p>
          <p>
            <strong>شهادة التميز:</strong> للطلاب الذين يحققون تقدير "ممتاز" (90% فأكثر).
          </p>
          <p>
            <strong>شارات الإنجاز:</strong> شارات رقمية للإنجازات الخاصة مثل إكمال مشروع معقد أو
            مساعدة زملائهم.
          </p>
          <p>
            <strong>التقارير الدورية:</strong> يتلقى أولياء الأمور تقارير شهرية مفصلة عن تقدم
            أبنائهم.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GradingSystem;
