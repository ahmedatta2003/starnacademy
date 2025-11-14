import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Trophy, Target } from 'lucide-react';

const DashboardHome = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "الدورات المتاحة",
      value: "12",
      description: "دورة في مختلف لغات البرمجة",
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      title: "الطلاب المسجلين",
      value: "200+",
      description: "طالب نشط في الأكاديمية",
      icon: Users,
      color: "text-green-500",
    },
    {
      title: "المشاريع المنجزة",
      value: "500+",
      description: "مشروع تم إنجازه بنجاح",
      icon: Trophy,
      color: "text-yellow-500",
    },
    {
      title: "معدل النجاح",
      value: "95%",
      description: "نسبة نجاح الطلاب",
      icon: Target,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">مرحباً بك في Starn Academy</h2>
        <p className="text-muted-foreground mt-2">
          نحن سعداء بوجودك معنا في رحلة تعلم البرمجة
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>عن Starn Academy</CardTitle>
          <CardDescription>
            منصة تعليمية متخصصة في تعليم البرمجة للأطفال
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            نحن في Starn Academy نؤمن بأن كل طفل قادر على تعلم البرمجة وإنشاء مشاريع رائعة. 
            نوفر بيئة تعليمية تفاعلية وممتعة تساعد الأطفال على تطوير مهاراتهم البرمجية 
            والتفكير المنطقي.
          </p>
          <p className="text-muted-foreground">
            مع فريق من المدربين المحترفين ومنهج تعليمي متطور، نضمن حصول طلابنا على 
            أفضل تجربة تعليمية في مجال البرمجة والتكنولوجيا.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
