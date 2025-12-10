import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import StudentLevelBadge from "@/components/StudentLevelBadge";
import StarsCounter from "@/components/StarsCounter";
import {
  User,
  Calendar,
  Award,
  Star,
  TrendingUp,
  BookOpen,
  Code,
  Gamepad2,
  Target,
  Clock
} from "lucide-react";

// Mock data types
interface Course {
  id: string;
  title: string;
  progress: number;
  total_lessons: number;
  completed_lessons: number;
  category: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned_date: string;
  points: number;
}

const StudentProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<any>(null);
  const [currentLevel, setCurrentLevel] = useState(5);
  const [starsCount, setStarsCount] = useState(125);

  // Mock data
  const [courses] = useState<Course[]>([
    { id: '1', title: 'أساسيات البرمجة', progress: 75, total_lessons: 20, completed_lessons: 15, category: 'programming' },
    { id: '2', title: 'تطوير الألعاب', progress: 45, total_lessons: 30, completed_lessons: 14, category: 'games' },
    { id: '3', title: 'تصميم المواقع', progress: 90, total_lessons: 25, completed_lessons: 23, category: 'web' },
  ]);

  const [achievements] = useState<Achievement[]>([
    { id: '1', title: 'البداية المشرقة', description: 'أكمل أول درس', icon: '🌟', earned_date: '2024-01-15', points: 50 },
    { id: '2', title: 'المثابر', description: 'أكمل 10 دروس متتالية', icon: '🔥', earned_date: '2024-02-01', points: 100 },
    { id: '3', title: 'المبرمج الصغير', description: 'اكتب أول كود', icon: '💻', earned_date: '2024-02-10', points: 75 },
  ]);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setStudentData(profile);
      } catch (error) {
        console.error('Error fetching student data:', error);
        toast.error('حدث خطأ في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'programming': return <Code className="h-4 w-4" />;
      case 'games': return <Gamepad2 className="h-4 w-4" />;
      case 'web': return <BookOpen className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">ملف الطالب</h1>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Star className="h-4 w-4 ml-2 text-yellow-500" />
          {starsCount} نجمة
        </Badge>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={studentData?.avatar_url} />
              <AvatarFallback className="text-2xl">
                {studentData?.full_name?.charAt(0) || 'ط'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{studentData?.full_name || 'طالب'}</h2>
              <p className="text-muted-foreground">{studentData?.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <StudentLevelBadge level={currentLevel} />
                <StarsCounter starsCount={starsCount} showComparison={false} size="sm" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">الدورات</TabsTrigger>
          <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
          <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(course.category)}
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={course.progress} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {course.completed_lessons} من {course.total_lessons} درس
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h3 className="font-bold">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  <Badge variant="secondary" className="mt-2">
                    +{achievement.points} نقطة
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="text-2xl font-bold">{currentLevel}</h3>
                <p className="text-muted-foreground">المستوى الحالي</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <h3 className="text-2xl font-bold">{starsCount}</h3>
                <p className="text-muted-foreground">النجوم المكتسبة</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <h3 className="text-2xl font-bold">{courses.length}</h3>
                <p className="text-muted-foreground">الدورات المسجلة</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <h3 className="text-2xl font-bold">{achievements.length}</h3>
                <p className="text-muted-foreground">الإنجازات</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentProfile;
