import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Users,
  Star,
  Trophy,
  BookOpen,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Target,
  Heart,
  MessageCircle,
  Settings,
  Plus,
  ChevronRight,
  Activity,
  DollarSign,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  BarChart3,
  UserPlus,
  Video,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface Child {
  id: string;
  full_name: string;
  avatar_url?: string;
  age: number;
  level: number;
  total_points: number;
  total_stars: number;
  courses_count: number;
  achievements_count: number;
  current_streak: number;
  progress_percentage: number;
  last_active: string;
  enrollment_status: string;
}

interface ChildDetails {
  child: Child;
  courses: Array<{
    id: string;
    title: string;
    progress: number;
    instructor: string;
    next_class: string;
    status: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    earned_date: string;
    points: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    points?: number;
  }>;
  monthlyProgress: Array<{
    month: string;
    stars: number;
    courses_completed: number;
    points_earned: number;
  }>;
}

const ParentDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [childDetails, setChildDetails] = useState<ChildDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddChildModal, setShowAddChildModal] = useState(false);

  // Mock data for development
  const mockChildren: Child[] = [
    {
      id: '1',
      full_name: 'أحمد خالد',
      avatar_url: '/api/placeholder/40/40',
      age: 12,
      level: 7,
      total_points: 850,
      total_stars: 45,
      courses_count: 3,
      achievements_count: 12,
      current_streak: 5,
      progress_percentage: 75,
      last_active: '2024-01-20',
      enrollment_status: 'active'
    },
    {
      id: '2',
      full_name: 'فاطمة أحمد',
      avatar_url: '/api/placeholder/40/40',
      age: 9,
      level: 4,
      total_points: 420,
      total_stars: 23,
      courses_count: 2,
      achievements_count: 7,
      current_streak: 3,
      progress_percentage: 60,
      last_active: '2024-01-19',
      enrollment_status: 'active'
    }
  ];

  const mockChildDetails: ChildDetails = {
    child: mockChildren[0],
    courses: [
      {
        id: '1',
        title: 'أساسيات البرمجة للأطفال',
        progress: 85,
        instructor: 'أحمد محمد',
        next_class: '2024-01-25',
        status: 'active'
      },
      {
        id: '2',
        title: 'تطوير الألعاب بـ JavaScript',
        progress: 60,
        instructor: 'فاطمة العلي',
        next_class: '2024-01-24',
        status: 'active'
      },
      {
        id: '3',
        title: 'تصميم مواقع الويب',
        progress: 45,
        instructor: 'خالد أحمد',
        next_class: '2024-01-26',
        status: 'active'
      }
    ],
    achievements: [
      {
        id: '1',
        title: 'برمجي ناشئ',
        description: 'أكمل دورة البرمجة الأولى',
        icon: '🎓',
        earned_date: '2024-01-15',
        points: 50
      },
      {
        id: '2',
        title: 'نجم الأسبوع',
        description: 'حصل على 5 نجوم في أسبوع واحد',
        icon: '⭐',
        earned_date: '2024-01-20',
        points: 25
      },
      {
        id: '3',
        title: 'المتسلسل',
        description: 'حضر 5 دروس متتالية',
        icon: '🔥',
        earned_date: '2024-01-25',
        points: 30
      }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'course_completion',
        description: 'أكمل درس الحلقات والمصفوفات في دورة JavaScript',
        timestamp: '2024-01-20T10:30:00Z',
        points: 15
      },
      {
        id: '2',
        type: 'achievement',
        description: 'حصل على إنجاز "نجم الأسبوع"',
        timestamp: '2024-01-20T09:15:00Z',
        points: 25
      },
      {
        id: '3',
        type: 'assignment',
        description: 'سلم مشروع لعبة Tic-Tac-Toe',
        timestamp: '2024-01-19T14:20:00Z',
        points: 20
      }
    ],
    monthlyProgress: [
      { month: 'أغسطس', stars: 8, courses_completed: 0, points_earned: 120 },
      { month: 'سبتمبر', stars: 12, courses_completed: 1, points_earned: 200 },
      { month: 'أكتوبر', stars: 15, courses_completed: 0, points_earned: 180 },
      { month: 'نوفمبر', stars: 10, courses_completed: 0, points_earned: 150 }
    ]
  };

  useEffect(() => {
    if (user && profile?.role === 'guardian') {
      loadChildren();
    }
  }, [user, profile]);

  useEffect(() => {
    if (selectedChildId) {
      loadChildDetails(selectedChildId);
    }
  }, [selectedChildId]);

  const loadChildren = async () => {
    try {
      setLoading(true);

      // Simulate API call
      setTimeout(() => {
        setChildren(mockChildren);
        if (mockChildren.length > 0) {
          setSelectedChildId(mockChildren[0].id);
        }
        setLoading(false);
      }, 1000);

      // In real implementation:
      /*
      const { data, error } = await supabase
        .from('guardian_student_relationships')
        .select(`
          student_id,
          student_profiles!inner(
            id,
            full_name,
            avatar_url,
            age,
            level,
            total_points,
            current_streak
          )
        `)
        .eq('guardian_id', user?.id)
        .eq('is_active', true);

      if (error) throw error;

      const childrenWithStats = await Promise.all(
        data?.map(async (rel) => {
          const { data: stats } = await supabase.rpc('get_student_stats', {
            p_student_id: rel.student_id
          });
          return { ...rel.student_profiles, ...stats };
        }) || []
      );

      setChildren(childrenWithStats);
      */
    } catch (error) {
      console.error('Error loading children:', error);
      toast.error('حدث خطأ في تحميل بيانات الأبناء');
      setLoading(false);
    }
  };

  const loadChildDetails = async (childId: string) => {
    try {
      const child = children.find(c => c.id === childId);
      if (!child) return;

      // Simulate API call with mock data
      setTimeout(() => {
        setChildDetails({
          ...mockChildDetails,
          child: child
        });
      }, 500);

      // In real implementation:
      /*
      // Load courses
      const { data: courses } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses!inner(
            title,
            instructor:profiles!courses_instructor_id_fkey(full_name)
          )
        `)
        .eq('student_id', childId)
        .eq('status', 'active');

      // Load achievements
      const { data: achievements } = await supabase
        .from('student_achievements')
        .select(`
          *,
          achievements!student_achievements_achievement_id_fkey(*)
        `)
        .eq('student_id', childId)
        .order('unlocked_date', { ascending: false })
        .limit(10);

      // Load recent activity
      const { data: activity } = await supabase
        .from('student_activity_log')
        .select('*')
        .eq('student_id', childId)
        .order('timestamp', { ascending: false })
        .limit(10);
      */
    } catch (error) {
      console.error('Error loading child details:', error);
      toast.error('حدث خطأ في تحميل تفاصيل الطفل');
    }
  };

  const handleSendMessage = async (childId: string, message: string) => {
    try {
      toast.success('تم إرسال الرسالة بنجاح');

      // In real implementation:
      /*
      await supabase
        .from('family_messages')
        .insert({
          sender_id: user?.id,
          receiver_id: childId,
          message,
          message_type: 'parent_to_child'
        });
      */
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('حدث خطأ في إرسال الرسالة');
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLevelIcon = (level: number) => {
    if (level >= 10) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (level >= 7) return <Star className="h-5 w-5 text-blue-500" />;
    if (level >= 5) return <Award className="h-5 w-5 text-green-500" />;
    return <GraduationCap className="h-5 w-5 text-gray-500" />;
  };

  if (!user || !profile || profile.role !== 'guardian') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-6">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <Users className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">لوحة تحكم أولياء الأمور</h2>
            <p className="text-muted-foreground">
              هذه الصفحة متاحة فقط لأولياء الأمور المسجلين في الأكاديمية
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

  const selectedChild = children.find(c => c.id === selectedChildId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gradient-fun mb-2">
                لوحة تحكم أولياء الأمور
              </h1>
              <p className="text-muted-foreground">
                تقدم أطفالك وتحكم في حساباتهم التعليمية
              </p>
            </div>
            <Button onClick={() => setShowAddChildModal(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة طفل
            </Button>
          </div>

          {/* Child Selector */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {children.map((child) => (
              <Card
                key={child.id}
                className={`cursor-pointer transition-all ${
                  selectedChildId === child.id
                    ? 'ring-2 ring-primary shadow-lg'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedChildId(child.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={child.avatar_url} />
                      <AvatarFallback>
                        {child.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{child.full_name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{child.age} سنة</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {getLevelIcon(child.level)}
                          <span>المستوى {child.level}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {selectedChild && childDetails && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold">{selectedChild.total_stars}</div>
                  <div className="text-sm text-muted-foreground">إجمالي النجوم</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">{selectedChild.total_points}</div>
                  <div className="text-sm text-muted-foreground">النقاط</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{selectedChild.courses_count}</div>
                  <div className="text-sm text-muted-foreground">الدورات</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{selectedChild.achievements_count}</div>
                  <div className="text-sm text-muted-foreground">الإنجازات</div>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="progress">التقدم</TabsTrigger>
                <TabsTrigger value="courses">الدورات</TabsTrigger>
                <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
                <TabsTrigger value="communication">التواصل</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        النشاط الحديث
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {childDetails.recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm">{activity.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(activity.timestamp).toLocaleDateString('ar-SA')}
                                </span>
                                {activity.points && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{activity.points} نقطة
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        ملخص التقدم
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">التقدم العام</span>
                            <span className="text-sm text-muted-foreground">
                              {selectedChild.progress_percentage}%
                            </span>
                          </div>
                          <Progress value={selectedChild.progress_percentage} className="h-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">السلسلة الحالية</span>
                            <p className="font-semibold">{selectedChild.current_streak} أيام</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">آخر نشاط</span>
                            <p className="font-semibold">
                              {new Date(selectedChild.last_active).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Progress Tab */}
              <TabsContent value="progress" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      التقدم الشهري
                    </CardTitle>
                    <CardDescription>
                      تطور أداء الطفل خلال الأشهر الماضية
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-between gap-2">
                      {childDetails.monthlyProgress.map((month, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div className="relative w-full h-full flex flex-col justify-end">
                            <div
                              className="w-full bg-gradient-to-t from-primary/80 to-primary/40 rounded-t-lg flex items-center justify-center text-white font-medium"
                              style={{ height: `${(month.stars / Math.max(...childDetails.monthlyProgress.map(m => m.stars))) * 100}%` }}
                            >
                              {month.stars}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground text-center">
                            {month.month}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {childDetails.monthlyProgress.map((month, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 text-center">
                        <h4 className="font-semibold mb-2">{month.month}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">النجوم</span>
                            <span className="font-medium">{month.stars}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">الدورات</span>
                            <span className="font-medium">{month.courses_completed}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">النقاط</span>
                            <span className="font-medium">{month.points_earned}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Courses Tab */}
              <TabsContent value="courses" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {childDetails.courses.map((course) => (
                    <Card key={course.id}>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{course.title}</h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-muted-foreground">التقدم</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{course.instructor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              الدرس القادم: {new Date(course.next_class).toLocaleDateString('ar-SA')}
                            </span>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              تفاصيل
                            </Button>
                            <Button size="sm" className="flex-1">
                              متابعة
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      إنجازات الطفل
                    </CardTitle>
                    <CardDescription>
                      أحدث الإنجازات التي حصل عليها الطفل
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {childDetails.achievements.map((achievement) => (
                        <Card key={achievement.id} className="text-center">
                          <CardContent className="p-4">
                            <div className="text-4xl mb-3">{achievement.icon}</div>
                            <h4 className="font-semibold mb-1">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {achievement.description}
                            </p>
                            <Badge className="bg-yellow-100 text-yellow-800 mb-2">
                              +{achievement.points} نقطة
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {new Date(achievement.earned_date).toLocaleDateString('ar-SA')}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Communication Tab */}
              <TabsContent value="communication" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        إرسال رسالة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Input placeholder="اكتب رسالة لطفلك..." />
                        <Button className="w-full gap-2">
                          <MessageCircle className="h-4 w-4" />
                          إرسال رسالة
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        اجتماعات أولياء الأمور
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">اجتماع مراجعة الأداء</h4>
                            <Badge variant="outline">قادم</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            مع المدربين لمناقشة تقدم الطفل
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>25 يناير 2024</span>
                          </div>
                        </div>
                        <Button className="w-full gap-2">
                          <Plus className="h-4 w-4" />
                          جدولة اجتماع جديد
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      التقارير والشهادات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button variant="outline" className="gap-2">
                        <FileText className="h-4 w-4" />
                        تقرير الأداء الشهري
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Award className="h-4 w-4" />
                        الشهادات المكتسبة
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <BarChart3 className="h-4 w-4" />
                        تحليل المهارات
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;