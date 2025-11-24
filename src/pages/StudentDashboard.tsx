import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StudentLevelBadge from '@/components/StudentLevelBadge';
import StarsCounter from '@/components/StarsCounter';
import {
  Calendar,
  Clock,
  Award,
  BookOpen,
  Code,
  Star,
  TrendingUp,
  Target,
  Users,
  Play,
  CheckCircle,
  AlertCircle,
  Gift,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';

interface StudentData {
  id: string;
  full_name: string;
  avatar_url?: string;
  email: string;
  level: number;
  total_points: number;
  current_level: number;
  achievements_count: number;
  created_at: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor_name: string;
  progress_percentage: number;
  status: string;
  start_date: string;
  next_session?: string;
  total_lessons: number;
  completed_lessons: number;
  grade?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: string;
  points: number;
  earned_date: string;
  icon: string;
  badge_color: string;
}

interface Assignment {
  id: string;
  title: string;
  course_title: string;
  due_date: string;
  status: string;
  score?: number;
  submitted_at?: string;
}

const StudentDashboard: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [pendingAssignments, setPendingAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for development
  const mockStudentData: StudentData = {
    id: '1',
    full_name: 'أحمد محمد السعيد',
    avatar_url: '/api/placeholder/100/100',
    email: 'ahmed@example.com',
    level: 7,
    total_points: 850,
    current_level: 7,
    achievements_count: 12,
    created_at: '2023-09-01'
  };

  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'أساسيات البرمجة للأطفال',
      description: 'تعلم أساسيات البرمجة باستخدام Scratch',
      category: 'programming_basics',
      instructor_name: 'أحمد محمد',
      progress_percentage: 75,
      status: 'active',
      start_date: '2024-01-01',
      next_session: '2024-01-25T14:00:00',
      total_lessons: 12,
      completed_lessons: 9,
      grade: 'A'
    },
    {
      id: '2',
      title: 'تطوير الألعاب البسيطة',
      description: 'إنشاء ألعاب تفاعلية بسيطة',
      category: 'game_development',
      instructor_name: 'فاطمة العلي',
      progress_percentage: 60,
      status: 'active',
      start_date: '2024-01-15',
      total_lessons: 10,
      completed_lessons: 6
    },
    {
      id: '3',
      title: 'مقدمة إلى الويب',
      description: 'أساسيات HTML و CSS',
      category: 'web_development',
      instructor_name: 'خالد أحمد',
      progress_percentage: 30,
      status: 'active',
      start_date: '2024-02-01',
      total_lessons: 8,
      completed_lessons: 2
    }
  ];

  const mockAchievements: Achievement[] = [
    {
      id: '1',
      title: 'برمجي ناشئ',
      description: 'أكمل أول دورة برمجة',
      type: 'milestone',
      points: 50,
      earned_date: '2024-01-15',
      icon: '🎓',
      badge_color: 'blue'
    },
    {
      id: '2',
      title: 'نجم الأسبوع',
      description: 'حصل على 5 نجوم في أسبوع',
      type: 'points',
      points: 25,
      earned_date: '2024-01-20',
      icon: '⭐',
      badge_color: 'yellow'
    },
    {
      id: '3',
      title: 'المتسلسل',
      description: 'حضر 5 دروس متتالية',
      type: 'streak',
      points: 30,
      earned_date: '2024-01-25',
      icon: '🔥',
      badge_color: 'orange'
    }
  ];

  const mockPendingAssignments: Assignment[] = [
    {
      id: '1',
      title: 'مشروع الحاسابة البسيط',
      course_title: 'أساسيات البرمجة للأطفال',
      due_date: '2024-01-28T23:59:59',
      status: 'pending'
    },
    {
      id: '2',
      title: 'تصميم شخصية لعبة',
      course_title: 'تطوير الألعاب البسيطة',
      due_date: '2024-01-26T23:59:59',
      status: 'pending'
    }
  ];

  useEffect(() => {
    if (user && profile?.role === 'child') {
      loadStudentData();
    }
  }, [user, profile]);

  const loadStudentData = async () => {
    try {
      setLoading(true);

      // Simulate API calls
      setTimeout(() => {
        setStudentData(mockStudentData);
        setCourses(mockCourses);
        setAchievements(mockAchievements);
        setPendingAssignments(mockPendingAssignments);
        setLoading(false);
      }, 1000);

      // In real implementation:
      /*
      // Load student profile
      const { data: studentProfile } = await supabase
        .from('student_profiles')
        .select(`
          *,
          profiles!student_profiles_user_id_fkey(
            full_name,
            avatar_url,
            email
          )
        `)
        .eq('user_id', user?.id)
        .single();

      // Load enrolled courses
      const { data: enrolledCourses } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses!course_enrollments_course_id_fkey(
            title,
            description,
            category,
            start_date,
            status,
            total_lessons: (select count())
          ),
          completed_lessons: (
            select count()
            .from('student_progress')
            .eq('course_id', course_enrollments.course_id)
            .eq('status', 'completed')
          ),
          instructor_profiles:profiles!courses_instructor_id_fkey(
            full_name
          )
        `)
        .eq('student_id', user?.id)
        .eq('status', 'active');

      // Load achievements
      const { data: achievements } = await supabase
        .from('student_achievements')
        .select(`
          *,
          achievements!student_achievements_achievement_id_fkey(
            title,
            description,
            type,
            points,
            icon,
            badge_color
          )
        `)
        .eq('student_id', user?.id)
        .order('earned_date', { ascending: false })
        .limit(10);

      // Load pending assignments
      const { data: assignments } = await supabase
        .from('assignment_submissions')
        .select(`
          *,
          assignments!assignment_submissions_assignment_id_fkey(
            title,
            due_date,
            courses!assignments_course_id_fkey(title)
          )
        `)
        .eq('student_id', user?.id)
        .in('status', ['pending', 'draft']);
      */
    } catch (error) {
      console.error('Error loading student data:', error);
      toast.error('حدث خطأ في تحميل بياناتك');
      setLoading(false);
    }
  };

  const getCourseProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'graded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssignmentStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'draft': return <AlertCircle className="h-4 w-4" />;
      case 'submitted': return <CheckCircle className="h-4 w-4" />;
      case 'graded': return <Award className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateRelative = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'اليوم';
    if (diffDays === 1) return 'غداً';
    if (diffDays < 7) return `${diffDays} أيام`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} أسابيع`;
    return `${Math.ceil(diffDays / 30)} شهر`;
  };

  if (!user || !profile || profile.role !== 'child') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">غير مصرح بالوصول</h2>
            <p className="text-muted-foreground">
              هذه الصفحة متاحة فقط للطلاب المسجلين في الأكاديمية
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={studentData?.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {studentData?.full_name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {studentData?.full_name}
                </h1>
                <p className="text-sm text-muted-foreground">لوحة تحكم الطالب</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="courses">دوراتي</TabsTrigger>
            <TabsTrigger value="progress">التقدم</TabsTrigger>
            <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
            <TabsTrigger value="assignments">الواجبات</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold">{studentData?.level}</div>
                  <div className="text-sm text-muted-foreground">المستوى الحالي</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold">{studentData?.total_points}</div>
                  <div className="text-sm text-muted-foreground">إجمالي النقاط</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold">{studentData?.achievements_count}</div>
                  <div className="text-sm text-muted-foreground">الإنجازات</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold">{courses.length}</div>
                  <div className="text-sm text-muted-foreground">الدورات</div>
                </CardContent>
              </Card>
            </div>

            {/* Level and Stars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StudentLevelBadge level={studentData?.level || 1} showProgress={true} size="lg" />
              <StarsCounter
                starsCount={Math.floor((studentData?.total_points || 0) / 10)}
                previousPeriod={Math.floor((studentData?.total_points || 0) / 20)}
                showComparison={true}
                size="lg"
              />
            </div>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  أحدث الإنجازات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium">{achievement.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {achievement.description}
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold text-yellow-600">+{achievement.points}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(achievement.earned_date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid gap-6">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                        <p className="text-muted-foreground mb-2">{course.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{course.category}</Badge>
                          <span className="text-sm text-muted-foreground">
                            المدرب: {course.instructor_name}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        {course.grade && (
                          <Badge className="mb-2">{course.grade}</Badge>
                        )}
                        <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                          {course.status === 'active' ? 'نشطة' : 'منتهية'}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">التقدم</span>
                          <span className="text-sm">{course.progress_percentage}%</span>
                        </div>
                        <Progress value={course.progress_percentage} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span>{course.completed_lessons}/{course.total_lessons} درس</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>بدأت: {formatDate(course.start_date)}</span>
                        </div>
                        {course.next_session && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>الجلسة: {formatDateRelative(course.next_session)}</span>
                          </div>
                        )}
                      </div>

                      <Button className="w-full">
                        <Play className="h-4 w-4 ml-2" />
                        متابعة الدورة
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>مخطط التعلم</CardTitle>
                <CardDescription>
                  تتبع تقدمك في جميع الدورات المسجلة فيها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {courses.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{course.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {course.instructor_name} • {course.category}
                          </p>
                        </div>
                        <Badge className={getCourseProgressColor(course.progress_percentage)}>
                          {course.progress_percentage}%
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>الدروس المكتملة</span>
                          <span>{course.completed_lessons} / {course.total_lessons}</span>
                        </div>
                        <Progress value={course.progress_percentage} />
                      </div>

                      <div className="grid grid-cols-7 gap-2 text-center text-xs">
                        {[...Array(7)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 rounded-full ${
                              i < course.completed_lessons
                                ? getCourseProgressColor(course.progress_percentage)
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h3 className="font-semibold mb-1">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Badge variant="outline">{achievement.type}</Badge>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        +{achievement.points} نقطة
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {formatDate(achievement.earned_date)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <div className="space-y-4">
              {pendingAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {assignment.course_title}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getAssignmentStatusColor(assignment.status)}>
                            <div className="flex items-center gap-1">
                              {getAssignmentStatusIcon(assignment.status)}
                              <span className="text-xs capitalize">{assignment.status}</span>
                            </div>
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            تاريخ التسليم: {formatDate(assignment.due_date)}
                          </span>
                        </div>
                      </div>
                      <Button size="sm">
                        <Play className="h-4 w-4 ml-1" />
                        بدء
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {pendingAssignments.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">لا توجد واجبات معلقة</h3>
                    <p className="text-muted-foreground">
                      كل واجباتك مكتمل ومصححة. رائع!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;