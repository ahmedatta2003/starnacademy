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
import { Textarea } from '@/components/ui/textarea';
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  Star,
  Award,
  TrendingUp,
  MessageCircle,
  Video,
  FileText,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  GraduationCap,
  Target,
  Play,
  Settings,
  Upload,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  age_group: string;
  skill_level: string;
  duration_weeks: number;
  price: number;
  currency: string;
  thumbnail_url?: string;
  current_students: number;
  max_students: number;
  rating: number;
  status: string;
  start_date: string;
  end_date?: string;
  total_revenue: number;
  completion_rate: number;
  satisfaction_rate: number;
}

interface Student {
  id: string;
  full_name: string;
  avatar_url?: string;
  age: number;
  email: string;
  enrollment_date: string;
  progress_percentage: number;
  last_active: string;
  total_points: number;
  streak_days: number;
  completed_assignments: number;
  pending_assignments: number;
  average_grade: number;
  notes?: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  course_id: string;
  course_title: string;
  due_date: string;
  total_submissions: number;
  graded_submissions: number;
  pending_grading: number;
  average_score: number;
  status: string;
  type: string;
  max_score: number;
}

interface LiveSession {
  id: string;
  title: string;
  course_id: string;
  course_title: string;
  scheduled_date: string;
  duration_minutes: number;
  max_participants: number;
  registered_participants: number;
  status: string;
  recording_url?: string;
  materials_count: number;
}

const InstructorDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for development
  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'أساسيات البرمجة للأطفال',
      description: 'دورة ممتعة ومبسطة لتعليم أساسيات البرمجة للأطفال',
      category: 'programming_basics',
      age_group: '6-8',
      skill_level: 'beginner',
      duration_weeks: 8,
      price: 299,
      currency: 'SAR',
      current_students: 18,
      max_students: 20,
      rating: 4.8,
      status: 'active',
      start_date: '2024-01-01',
      end_date: '2024-02-26',
      total_revenue: 5382,
      completion_rate: 85,
      satisfaction_rate: 92
    },
    {
      id: '2',
      title: 'تطوير الألعاب بـ JavaScript',
      description: 'تعلم كيفية إنشاء ألعاب تفاعلية باستخدام JavaScript',
      category: 'game_development',
      age_group: '12-14',
      skill_level: 'intermediate',
      duration_weeks: 12,
      price: 599,
      currency: 'SAR',
      current_students: 12,
      max_students: 15,
      rating: 4.9,
      status: 'active',
      start_date: '2024-01-15',
      end_date: '2024-04-09',
      total_revenue: 7188,
      completion_rate: 78,
      satisfaction_rate: 94
    }
  ];

  const mockStudents: Student[] = [
    {
      id: '1',
      full_name: 'أحمد خالد',
      avatar_url: '/api/placeholder/40/40',
      age: 12,
      email: 'ahmed.k@email.com',
      enrollment_date: '2024-01-01',
      progress_percentage: 85,
      last_active: '2024-01-20',
      total_points: 850,
      streak_days: 5,
      completed_assignments: 12,
      pending_assignments: 2,
      average_grade: 92,
      notes: 'طالب متميز ومتحمس'
    },
    {
      id: '2',
      full_name: 'فاطمة أحمد',
      avatar_url: '/api/placeholder/40/40',
      age: 10,
      email: 'fatima.a@email.com',
      enrollment_date: '2024-01-02',
      progress_percentage: 72,
      last_active: '2024-01-19',
      total_points: 620,
      streak_days: 3,
      completed_assignments: 10,
      pending_assignments: 3,
      average_grade: 88,
      notes: 'تحسن ملحوظ في الأسبوع الماضي'
    }
  ];

  const mockAssignments: Assignment[] = [
    {
      id: '1',
      title: 'مشروع لعبة Tic-Tac-Toe',
      description: 'إنشاء لعبة تفاعلية باستخدام JavaScript',
      course_id: '2',
      course_title: 'تطوير الألعاب بـ JavaScript',
      due_date: '2024-01-25',
      total_submissions: 10,
      graded_submissions: 7,
      pending_grading: 3,
      average_score: 85,
      status: 'active',
      type: 'project',
      max_score: 100
    },
    {
      id: '2',
      title: 'تطبيق على الحلقات والمصفوفات',
      description: 'حل مجموعة من التمارين على الحلقات والمصفوفات',
      course_id: '1',
      course_title: 'أساسيات البرمجة للأطفال',
      due_date: '2024-01-22',
      total_submissions: 15,
      graded_submissions: 15,
      pending_grading: 0,
      average_score: 78,
      status: 'graded',
      type: 'exercises',
      max_score: 50
    }
  ];

  const mockLiveSessions: LiveSession[] = [
    {
      id: '1',
      title: 'جلسة أسئلة وأجوبة',
      course_id: '2',
      course_title: 'تطوير الألعاب بـ JavaScript',
      scheduled_date: '2024-01-24T15:00:00Z',
      duration_minutes: 60,
      max_participants: 20,
      registered_participants: 12,
      status: 'scheduled',
      materials_count: 3
    },
    {
      id: '2',
      title: 'مراجعة منتصف الدورة',
      course_id: '1',
      course_title: 'أساسيات البرمجة للأطفال',
      scheduled_date: '2024-01-20T14:00:00Z',
      duration_minutes: 45,
      max_participants: 25,
      registered_participants: 18,
      status: 'completed',
      recording_url: 'https://example.com/recording',
      materials_count: 5
    }
  ];

  useEffect(() => {
    if (user && profile?.role === 'instructor') {
      loadInstructorData();
    }
  }, [user, profile]);

  const loadInstructorData = async () => {
    try {
      setLoading(true);

      // Simulate API calls
      setTimeout(() => {
        setCourses(mockCourses);
        setStudents(mockStudents);
        setAssignments(mockAssignments);
        setLiveSessions(mockLiveSessions);
        setLoading(false);
      }, 1000);

      // In real implementation:
      /*
      // Load courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', user?.id);

      // Load students
      const { data: studentsData } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          student:profiles!course_enrollments_student_id_fkey(
            id,
            full_name,
            avatar_url,
            email
          ),
          student_profiles!course_enrollments_student_id_fkey(
            age,
            total_points,
            current_streak
          )
        `)
        .in('course_id', coursesData?.map(c => c.id) || []);

      // Load assignments
      const { data: assignmentsData } = await supabase
        .from('assignments')
        .select(`
          *,
          courses!inner(title)
        `)
        .eq('instructor_id', user?.id);

      // Load live sessions
      const { data: sessionsData } = await supabase
        .from('live_sessions')
        .select(`
          *,
          courses!inner(title)
        `)
        .eq('instructor_id', user?.id);
      */
    } catch (error) {
      console.error('Error loading instructor data:', error);
      toast.error('حدث خطأ في تحميل بيانات المدرب');
      setLoading(false);
    }
  };

  const handleGradeAssignment = async (assignmentId: string, studentId: string, score: number, feedback: string) => {
    try {
      toast.success('تم تسجيل التقدير بنجاح');

      // Update assignment stats
      setAssignments(prev => prev.map(a =>
        a.id === assignmentId
          ? {
              ...a,
              graded_submissions: a.graded_submissions + 1,
              pending_grading: a.pending_grading - 1
            }
          : a
      ));

      // In real implementation:
      /*
      await supabase
        .from('assignment_submissions')
        .update({
          score,
          feedback,
          graded_by: user?.id,
          graded_date: new Date().toISOString()
        })
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId);
      */
    } catch (error) {
      console.error('Error grading assignment:', error);
      toast.error('حدث خطأ في تسجيل التقدير');
    }
  };

  const handleStartLiveSession = async (sessionId: string) => {
    try {
      toast.success('تم بدء الجلسة المباشرة بنجاح');

      // In real implementation:
      /*
      await supabase
        .from('live_sessions')
        .update({
          status: 'live',
          started_at: new Date().toISOString()
        })
        .eq('id', sessionId);
      */
    } catch (error) {
      console.error('Error starting live session:', error);
      toast.error('حدث خطأ في بدء الجلسة المباشرة');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!user || !profile || profile.role !== 'instructor') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-6">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <GraduationCap className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">لوحة تحكم المدربين</h2>
            <p className="text-muted-foreground">
              هذه الصفحة متاحة فقط للمدربين المعتمدين في الأكاديمية
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

  const totalStudents = students.length;
  const totalRevenue = courses.reduce((sum, course) => sum + course.total_revenue, 0);
  const averageRating = courses.length > 0
    ? (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)
    : '0';
  const pendingGrading = assignments.reduce((sum, assignment) => sum + assignment.pending_grading, 0);

  const filteredStudents = students.filter(student =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-fun mb-2">
            لوحة تحكم المدرب
          </h1>
          <p className="text-muted-foreground">
            إدارة دوراتك وطلابك ومتابعة التقدم التعليمي
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{totalStudents}</div>
              <div className="text-sm text-muted-foreground">إجمالي الطلاب</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">الإيرادات (ريال)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{averageRating}</div>
              <div className="text-sm text-muted-foreground">متوسط التقييم</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{pendingGrading}</div>
              <div className="text-sm text-muted-foreground">مهمات في انتظار التصحيح</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="courses">الدورات</TabsTrigger>
            <TabsTrigger value="students">الطلاب</TabsTrigger>
            <TabsTrigger value="assignments">المهمات</TabsTrigger>
            <TabsTrigger value="live-sessions">الجلسات المباشرة</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    أداء الدورات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{course.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Users className="h-3 w-3" />
                            <span>{course.current_students}/{course.max_students} طالب</span>
                            <span>•</span>
                            <Star className="h-3 w-3" />
                            <span>{course.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{course.completion_rate}%</div>
                          <div className="text-xs text-muted-foreground">معدل الإنجاز</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    يتطلب اهتمامك
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingGrading > 0 && (
                      <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-red-600" />
                          <span className="font-medium">مهمات تحتاج تصحيح</span>
                        </div>
                        <Badge className="bg-red-100 text-red-800">
                          {pendingGrading}
                        </Badge>
                      </div>
                    )}
                    {liveSessions.filter(s => s.status === 'scheduled').length > 0 && (
                      <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium">جلسات مباشرة مجدولة</span>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {liveSessions.filter(s => s.status === 'scheduled').length}
                        </Badge>
                      </div>
                    )}
                    {students.filter(s => s.progress_percentage < 50).length > 0 && (
                      <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-orange-600" />
                          <span className="font-medium">طلاب يحتاجون دعم</span>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">
                          {students.filter(s => s.progress_percentage < 50).length}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">دوراتي</h2>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                دورة جديدة
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getLevelColor(course.skill_level)}>
                            {course.skill_level === 'beginner' ? 'مبتدئ' :
                             course.skill_level === 'intermediate' ? 'متوسط' : 'متقدم'}
                          </Badge>
                          <Badge variant="outline">{course.age_group} سنة</Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">الطلاب</span>
                        <span className="font-medium">{course.current_students}/{course.max_students}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">التقييم</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                          <span className="font-medium">{course.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">الإيرادات</span>
                        <span className="font-medium">{course.total_revenue} ريال</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">الإكمال</span>
                        <span className={`font-medium ${getProgressColor(course.completion_rate)}`}>
                          {course.completion_rate}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">ممتلئ</span>
                          <span className="text-sm">{(course.current_students / course.max_students * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={course.current_students / course.max_students * 100} className="h-2" />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          تفاصيل
                        </Button>
                        <Button size="sm" className="flex-1">
                          إدارة
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث عن طالب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="فلترة حسب الدورة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الدورات</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <Card key={student.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.avatar_url} />
                        <AvatarFallback>
                          {student.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{student.full_name}</h4>
                        <p className="text-sm text-muted-foreground">{student.age} سنة</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-muted-foreground">التقدم</span>
                          <span>{student.progress_percentage}%</span>
                        </div>
                        <Progress value={student.progress_percentage} className="h-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-muted-foreground">النقاط</span>
                          <p className="font-medium">{student.total_points}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">السلسلة</span>
                          <p className="font-medium">{student.streak_days} يوم</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">المهمات المكتملة</span>
                          <p className="font-medium">{student.completed_assignments}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">متوسط التقدير</span>
                          <p className="font-medium">{student.average_grade}%</p>
                        </div>
                      </div>
                      {student.pending_assignments > 0 && (
                        <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                          <span className="text-yellow-800">مهمات معلقة</span>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {student.pending_assignments}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        ملف الطالب
                      </Button>
                      <Button size="sm" className="flex-1">
                        مراسلة
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">المهمات والواجبات</h2>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                مهمة جديدة
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{assignment.title}</h4>
                        <p className="text-sm text-muted-foreground">{assignment.course_title}</p>
                      </div>
                      <Badge className={getStatusColor(assignment.status)}>
                        {getStatusIcon(assignment.status)}
                        <span className="mr-1">
                          {assignment.status === 'active' ? 'نشط' :
                           assignment.status === 'graded' ? 'مصحح' : assignment.status}
                        </span>
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">التاريخ النهائي</span>
                        <p className="font-medium">
                          {new Date(assignment.due_date).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">الدرجة القصوى</span>
                        <p className="font-medium">{assignment.max_score} درجة</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">الإجماليات</span>
                        <p className="font-medium">{assignment.total_submissions} طالب</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">متوسط التقدير</span>
                        <p className="font-medium">{assignment.average_score}%</p>
                      </div>
                    </div>

                    {assignment.pending_grading > 0 && (
                      <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <span className="text-yellow-800 font-medium">تحتاج تصحيح</span>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {assignment.pending_grading}
                        </Badge>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        تفاصيل
                      </Button>
                      <Button size="sm" className="flex-1">
                        {assignment.pending_grading > 0 ? 'تصحيح' : 'عرض'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Live Sessions Tab */}
          <TabsContent value="live-sessions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">الجلسات المباشرة</h2>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                جلسة جديدة
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveSessions.map((session) => (
                <Card key={session.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{session.title}</h4>
                        <p className="text-sm text-muted-foreground">{session.course_title}</p>
                      </div>
                      <Badge className={getStatusColor(session.status)}>
                        {getStatusIcon(session.status)}
                        <span className="mr-1">
                          {session.status === 'scheduled' ? 'مجدولة' :
                           session.status === 'live' ? 'مباشرة' :
                           session.status === 'completed' ? 'مكتملة' : session.status}
                        </span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">التاريخ والوقت</span>
                        <p className="font-medium">
                          {new Date(session.scheduled_date).toLocaleString('ar-SA')}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">المدة</span>
                        <p className="font-medium">{session.duration_minutes} دقيقة</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">المسجلون</span>
                        <p className="font-medium">{session.registered_participants}/{session.max_participants}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">المواد</span>
                        <p className="font-medium">{session.materials_count} ملف</p>
                      </div>
                    </div>

                    {session.recording_url && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-800 font-medium">تسجيل متاح</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        تفاصيل
                      </Button>
                      {session.status === 'scheduled' && (
                        <Button
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => handleStartLiveSession(session.id)}
                        >
                          <Play className="h-4 w-4" />
                          بدء الجلسة
                        </Button>
                      )}
                      {session.status === 'completed' && session.recording_url && (
                        <Button size="sm" className="flex-1 gap-2">
                          <Video className="h-4 w-4" />
                          التسجيل
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InstructorDashboard;