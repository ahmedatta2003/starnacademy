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
  BookOpen,
  DollarSign,
  TrendingUp,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Ban,
  Award,
  GraduationCap,
  Star,
  Calendar,
  Activity,
  FileText,
  Mail,
  MessageSquare,
  BarChart3,
  PieChart,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  Target,
  Zap,
  Database
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
  created_at: string;
  last_sign_in_at?: string;
  email_verified: boolean;
  status: string;
  profile?: {
    age?: number;
    specialization?: string[];
    total_students?: number;
    rating?: number;
  };
}

interface Course {
  id: string;
  title: string;
  instructor_id: string;
  instructor_name: string;
  category: string;
  age_group: string;
  skill_level: string;
  price: number;
  current_students: number;
  max_students: number;
  rating: number;
  status: string;
  created_at: string;
  revenue: number;
  completion_rate: number;
  satisfaction_rate: number;
}

interface SystemStats {
  total_users: number;
  total_students: number;
  total_guardians: number;
  total_instructors: number;
  total_courses: number;
  active_courses: number;
  total_enrollments: number;
  total_revenue: number;
  monthly_revenue: number;
  user_growth_rate: number;
  course_growth_rate: number;
  revenue_growth_rate: number;
  active_sessions: number;
  pending_applications: number;
  support_tickets: number;
  system_health: number;
}

interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  timestamp: string;
  ip_address?: string;
}

interface SupportTicket {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  category: string;
  created_at: string;
  assigned_to?: string;
  resolved_at?: string;
}

const AdminDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30d');

  // Mock data for development
  const mockSystemStats: SystemStats = {
    total_users: 1247,
    total_students: 856,
    total_guardians: 324,
    total_instructors: 67,
    total_courses: 45,
    active_courses: 32,
    total_enrollments: 2156,
    total_revenue: 285420,
    monthly_revenue: 45820,
    user_growth_rate: 12.5,
    course_growth_rate: 8.3,
    revenue_growth_rate: 15.7,
    active_sessions: 23,
    pending_applications: 8,
    support_tickets: 12,
    system_health: 98.5
  };

  const mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@starnacademy.com',
      full_name: 'مدير النظام',
      role: 'admin',
      created_at: '2024-01-01',
      last_sign_in_at: '2024-01-20',
      email_verified: true,
      status: 'active'
    },
    {
      id: '2',
      email: 'instructor@starnacademy.com',
      full_name: 'أحمد محمد',
      role: 'instructor',
      avatar_url: '/api/placeholder/40/40',
      created_at: '2024-01-02',
      last_sign_in_at: '2024-01-20',
      email_verified: true,
      status: 'active',
      profile: {
        specialization: ['programming_basics', 'web_development'],
        total_students: 45,
        rating: 4.8
      }
    },
    {
      id: '3',
      email: 'parent@starnacademy.com',
      full_name: 'فاطمة العلي',
      role: 'guardian',
      avatar_url: '/api/placeholder/40/40',
      created_at: '2024-01-03',
      last_sign_in_at: '2024-01-19',
      email_verified: true,
      status: 'active'
    },
    {
      id: '4',
      email: 'student@starnacademy.com',
      full_name: 'عبدالله خالد',
      role: 'child',
      avatar_url: '/api/placeholder/40/40',
      created_at: '2024-01-04',
      last_sign_in_at: '2024-01-20',
      email_verified: true,
      status: 'active',
      profile: {
        age: 12
      }
    }
  ];

  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'أساسيات البرمجة للأطفال',
      instructor_id: '2',
      instructor_name: 'أحمد محمد',
      category: 'programming_basics',
      age_group: '6-8',
      skill_level: 'beginner',
      price: 299,
      current_students: 18,
      max_students: 20,
      rating: 4.8,
      status: 'active',
      created_at: '2024-01-01',
      revenue: 5382,
      completion_rate: 85,
      satisfaction_rate: 92
    },
    {
      id: '2',
      title: 'تطوير الألعاب بـ JavaScript',
      instructor_id: '2',
      instructor_name: 'أحمد محمد',
      category: 'game_development',
      age_group: '12-14',
      skill_level: 'intermediate',
      price: 599,
      current_students: 12,
      max_students: 15,
      rating: 4.9,
      status: 'active',
      created_at: '2024-01-02',
      revenue: 7188,
      completion_rate: 78,
      satisfaction_rate: 94
    }
  ];

  const mockActivityLog: ActivityLog[] = [
    {
      id: '1',
      user_id: '2',
      user_name: 'أحمد محمد',
      user_role: 'instructor',
      action: 'created',
      entity_type: 'course',
      entity_id: '3',
      details: 'أنشأ دورة "تطوير تطبيقات الموبايل"',
      timestamp: '2024-01-20T10:30:00Z',
      ip_address: '192.168.1.100'
    },
    {
      id: '2',
      user_id: '4',
      user_name: 'عبدالله خالد',
      user_role: 'child',
      action: 'completed',
      entity_type: 'assignment',
      entity_id: '15',
      details: 'أكمل مهمة "مشروع لعبة Tic-Tac-Toe"',
      timestamp: '2024-01-20T09:15:00Z',
      ip_address: '192.168.1.101'
    },
    {
      id: '3',
      user_id: '3',
      user_name: 'فاطمة العلي',
      user_role: 'guardian',
      action: 'enrolled',
      entity_type: 'course',
      entity_id: '1',
      details: 'سجل ابنها في دورة "أساسيات البرمجة"',
      timestamp: '2024-01-19T14:20:00Z',
      ip_address: '192.168.1.102'
    }
  ];

  const mockSupportTickets: SupportTicket[] = [
    {
      id: '1',
      user_id: '3',
      user_name: 'فاطمة العلي',
      user_email: 'parent@starnacademy.com',
      subject: 'مشكلة في الدفع',
      description: 'لا أستطيع إتمام عملية الدفع عند تسجيل ابن في دورة جديدة',
      priority: 'high',
      status: 'open',
      category: 'payment',
      created_at: '2024-01-20T11:30:00Z'
    },
    {
      id: '2',
      user_id: '2',
      user_name: 'أحمد محمد',
      user_email: 'instructor@starnacademy.com',
      subject: 'استفسار عن تحديث المنصة',
      description: 'متى سيتم إضافة ميزات جديدة لوحة تحكم المدربين؟',
      priority: 'medium',
      status: 'in_progress',
      category: 'feature_request',
      created_at: '2024-01-19T16:45:00Z',
      assigned_to: 'admin@starnacademy.com'
    }
  ];

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadAdminData();
    }
  }, [user, profile]);

  const loadAdminData = async () => {
    try {
      setLoading(true);

      // Simulate API calls
      setTimeout(() => {
        setSystemStats(mockSystemStats);
        setUsers(mockUsers);
        setCourses(mockCourses);
        setActivityLog(mockActivityLog);
        setSupportTickets(mockSupportTickets);
        setLoading(false);
      }, 1000);

      // In real implementation:
      /*
      // Load system stats
      const { data: stats } = await supabase.rpc('get_system_stats');

      // Load users
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Load courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:profiles!courses_instructor_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      // Load activity log
      const { data: activityData } = await supabase
        .from('activity_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      // Load support tickets
      const { data: ticketsData } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });
      */
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('حدث خطأ في تحميل بيانات الإدارة');
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      let successMessage = '';

      switch (action) {
        case 'ban':
          successMessage = 'تم حظر المستخدم بنجاح';
          break;
        case 'unban':
          successMessage = 'تم إلغاء حظر المستخدم بنجاح';
          break;
        case 'verify':
          successMessage = 'تم التحقق من المستخدم بنجاح';
          break;
        case 'delete':
          successMessage = 'تم حذف المستخدم بنجاح';
          break;
      }

      toast.success(successMessage);

      // Update users list
      if (action === 'delete') {
        setUsers(prev => prev.filter(u => u.id !== userId));
      } else {
        setUsers(prev => prev.map(u =>
          u.id === userId
            ? { ...u, status: action === 'ban' ? 'banned' : action === 'unban' ? 'active' : u.status }
            : u
        ));
      }

      // In real implementation:
      /*
      await supabase
        .from('profiles')
        .update({ status: action === 'ban' ? 'banned' : 'active' })
        .eq('id', userId);

      if (action === 'verify') {
        await supabase
          .from('profiles')
          .update({ email_verified: true })
          .eq('id', userId);
      }
      */
    } catch (error) {
      console.error('Error performing user action:', error);
      toast.error('حدث خطأ في تنفيذ الإجراء');
    }
  };

  const handleCourseAction = async (courseId: string, action: string) => {
    try {
      let successMessage = '';

      switch (action) {
        case 'approve':
          successMessage = 'تم اعتماد الدورة بنجاح';
          break;
        case 'reject':
          successMessage = 'تم رفض الدورة بنجاح';
          break;
        case 'suspend':
          successMessage = 'تم إيقاف الدورة بنجاح';
          break;
        case 'delete':
          successMessage = 'تم حذف الدورة بنجاح';
          break;
      }

      toast.success(successMessage);

      // Update courses list
      if (action === 'delete') {
        setCourses(prev => prev.filter(c => c.id !== courseId));
      } else {
        setCourses(prev => prev.map(c =>
          c.id === courseId
            ? { ...c, status: action === 'approve' ? 'active' : action === 'reject' ? 'rejected' : 'suspended' }
            : c
        ));
      }

      // In real implementation:
      /*
      await supabase
        .from('courses')
        .update({ status: action === 'approve' ? 'active' : action === 'reject' ? 'rejected' : 'suspended' })
        .eq('id', courseId);
      */
    } catch (error) {
      console.error('Error performing course action:', error);
      toast.error('حدث خطأ في تنفيذ الإجراء');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'instructor': return <GraduationCap className="h-4 w-4" />;
      case 'guardian': return <Users className="h-4 w-4" />;
      case 'child': return <Star className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'instructor': return 'bg-blue-100 text-blue-800';
      case 'guardian': return 'bg-green-100 text-green-800';
      case 'child': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'banned': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  if (!user || !profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-6">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">لوحة تحكم الإدارة</h2>
            <p className="text-muted-foreground">
              هذه الصفحة متاحة فقط لمسؤولي النظام المعتمدين
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gradient-fun mb-2">
                لوحة تحكم الإدارة
              </h1>
              <p className="text-muted-foreground">
                إدارة النظام والتحكم في جميع جوانب الأكاديمية
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 أيام</SelectItem>
                  <SelectItem value="30d">30 يوم</SelectItem>
                  <SelectItem value="90d">90 يوم</SelectItem>
                  <SelectItem value="1y">سنة</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 ml-2" />
                تصدير التقرير
              </Button>
            </div>
          </div>

          {/* System Health */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-500" />
                  <span className="font-medium">صحة النظام</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    آخر تحديث: {new Date().toLocaleTimeString('ar-SA')}
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {systemStats?.system_health}% سليم
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{systemStats?.total_users}</div>
              <div className="text-sm text-muted-foreground">إجمالي المستخدمين</div>
              <div className="text-xs text-green-600 mt-1">
                +{systemStats?.user_growth_rate}% هذا الشهر
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{systemStats?.total_courses}</div>
              <div className="text-sm text-muted-foreground">إجمالي الدورات</div>
              <div className="text-xs text-green-600 mt-1">
                {systemStats?.active_courses} نشطة
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{systemStats?.total_revenue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">الإيرادات الإجمالية (ريال)</div>
              <div className="text-xs text-green-600 mt-1">
                +{systemStats?.revenue_growth_rate}% هذا الشهر
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{systemStats?.active_sessions}</div>
              <div className="text-sm text-muted-foreground">جلسات نشطة</div>
              <div className="text-xs text-muted-foreground mt-1">
                حالياً
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="users">المستخدمون</TabsTrigger>
            <TabsTrigger value="courses">الدورات</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
            <TabsTrigger value="support">الدعم الفني</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    نمو المستخدمين
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">الطلاب</span>
                      <span className="font-medium">{systemStats?.total_students}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">أولياء الأمور</span>
                      <span className="font-medium">{systemStats?.total_guardians}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">المدربون</span>
                      <span className="font-medium">{systemStats?.total_instructors}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    يتطلب الاهتمام
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {systemStats?.pending_applications! > 0 && (
                      <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                        <span className="text-sm">طلبات معلقة</span>
                        <Badge className="bg-orange-100 text-orange-800">
                          {systemStats?.pending_applications}
                        </Badge>
                      </div>
                    )}
                    {systemStats?.support_tickets! > 0 && (
                      <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <span className="text-sm">تذاكر الدعم</span>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {systemStats?.support_tickets}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    النشاط الحديث
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activityLog.slice(0, 3).map((log) => (
                      <div key={log.id} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm">{log.details}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.user_name} • {new Date(log.timestamp).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث عن مستخدم..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="فلترة حسب الدور" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأدوار</SelectItem>
                    <SelectItem value="admin">المديرون</SelectItem>
                    <SelectItem value="instructor">المدربون</SelectItem>
                    <SelectItem value="guardian">أولياء الأمور</SelectItem>
                    <SelectItem value="child">الطلاب</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                مستخدم جديد
              </Button>
            </div>

            <div className="bg-white rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-right p-4 font-medium">المستخدم</th>
                      <th className="text-right p-4 font-medium">الدور</th>
                      <th className="text-right p-4 font-medium">الحالة</th>
                      <th className="text-right p-4 font-medium">البريد الإلكتروني</th>
                      <th className="text-right p-4 font-medium">تاريخ الإنشاء</th>
                      <th className="text-right p-4 font-medium">آخر تسجيل</th>
                      <th className="text-right p-4 font-medium">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar_url} />
                              <AvatarFallback>
                                {user.full_name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.full_name}</div>
                              {user.profile?.age && (
                                <div className="text-sm text-muted-foreground">
                                  {user.profile.age} سنة
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getRoleColor(user.role)}>
                            {getRoleIcon(user.role)}
                            <span className="mr-1">
                              {user.role === 'admin' ? 'مدير' :
                               user.role === 'instructor' ? 'مدرب' :
                               user.role === 'guardian' ? 'ولي أمر' : 'طالب'}
                            </span>
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(user.status)}>
                            {user.status === 'active' ? 'نشط' :
                             user.status === 'banned' ? 'محظور' :
                             user.status === 'suspended' ? 'موقوف' : user.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{user.email}</span>
                            {user.email_verified && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-sm">
                          {new Date(user.created_at).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="p-4 text-sm">
                          {user.last_sign_in_at
                            ? new Date(user.last_sign_in_at).toLocaleDateString('ar-SA')
                            : 'لم يسجل بعد'}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {user.status === 'active' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleUserAction(user.id, 'ban')}
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => handleUserAction(user.id, 'unban')}
                              >
                                <UserCheck className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">إدارة الدورات</h2>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                دورة جديدة
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold mb-1">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">المدرب: {course.instructor_name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(course.status)}>
                          {course.status === 'active' ? 'نشطة' :
                           course.status === 'pending' ? 'معلقة' :
                           course.status === 'rejected' ? 'مرفوضة' : 'موقوفة'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">الطلاب</span>
                        <p className="font-medium">{course.current_students}/{course.max_students}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">التقييم</span>
                        <p className="font-medium">{course.rating}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">الإيرادات</span>
                        <p className="font-medium">{course.revenue} ريال</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">معدل الإكمال</span>
                        <p className="font-medium">{course.completion_rate}%</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 ml-1" />
                        عرض
                      </Button>
                      {course.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleCourseAction(course.id, 'approve')}
                          >
                            <CheckCircle className="h-4 w-4 ml-1" />
                            اعتماد
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                            onClick={() => handleCourseAction(course.id, 'reject')}
                          >
                            <XCircle className="h-4 w-4 ml-1" />
                            رفض
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    إحصائيات النمو
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">نمو المستخدمين</span>
                        <span className="text-sm font-medium">+{systemStats?.user_growth_rate}%</span>
                      </div>
                      <Progress value={systemStats?.user_growth_rate || 0} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">نمو الدورات</span>
                        <span className="text-sm font-medium">+{systemStats?.course_growth_rate}%</span>
                      </div>
                      <Progress value={systemStats?.course_growth_rate || 0} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">نمو الإيرادات</span>
                        <span className="text-sm font-medium">+{systemStats?.revenue_growth_rate}%</span>
                      </div>
                      <Progress value={systemStats?.revenue_growth_rate || 0} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    توزيع المستخدمين
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">الطلاب</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(systemStats?.total_students! / systemStats?.total_users!) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12">
                          {Math.round((systemStats?.total_students! / systemStats?.total_users!) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">أولياء الأمور</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(systemStats?.total_guardians! / systemStats?.total_users!) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12">
                          {Math.round((systemStats?.total_guardians! / systemStats?.total_users!) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">المدربون</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${(systemStats?.total_instructors! / systemStats?.total_users!) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12">
                          {Math.round((systemStats?.total_instructors! / systemStats?.total_users!) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">تذاكر الدعم الفني</h2>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                تذكرة جديدة
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportTickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{ticket.subject}</h4>
                        <p className="text-sm text-muted-foreground">{ticket.user_name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority === 'high' ? 'عالية' :
                           ticket.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                        </Badge>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status === 'open' ? 'مفتوحة' :
                           ticket.status === 'in_progress' ? 'قيد المعالجة' : 'مغلقة'}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{ticket.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">الفئة</span>
                        <p className="font-medium">
                          {ticket.category === 'payment' ? 'الدفع' :
                           ticket.category === 'technical' ? 'فني' :
                           ticket.category === 'account' ? 'الحساب' : 'ميزات'}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">التاريخ</span>
                        <p className="font-medium">
                          {new Date(ticket.created_at).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 ml-1" />
                        عرض
                      </Button>
                      <Button size="sm" className="flex-1">
                        <MessageSquare className="h-4 w-4 ml-1" />
                        رد
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    إعدادات النظام
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">الصيانة المجدولة</h4>
                      <p className="text-sm text-muted-foreground">إيقاف النظام مؤقتاً للصيانة</p>
                    </div>
                    <Button variant="outline">إعداد</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">النسخ الاحتياطي</h4>
                      <p className="text-sm text-muted-foreground">إدارة نسخ البيانات الاحتياطية</p>
                    </div>
                    <Button variant="outline">إعداد</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">التحديثات</h4>
                      <p className="text-sm text-muted-foreground">تحديث النظام والمكونات</p>
                    </div>
                    <Button variant="outline">تحقق</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    الأمان والخصوصية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">التحقق بخطوتين</h4>
                      <p className="text-sm text-muted-foreground">تفعيل المصادقة الثنائية</p>
                    </div>
                    <Button variant="outline">تفعيل</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">سياسة الخصوصية</h4>
                      <p className="text-sm text-muted-foreground">إعدادات خصوصية المستخدمين</p>
                    </div>
                    <Button variant="outline">تعديل</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">السجلات الأمنية</h4>
                      <p className="text-sm text-muted-foreground">مراقبة الأنشطة المشبوهة</p>
                    </div>
                    <Button variant="outline">عرض</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;