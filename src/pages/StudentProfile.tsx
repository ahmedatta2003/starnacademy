import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Trophy,
  Star,
  BookOpen,
  Target,
  Calendar,
  Clock,
  Award,
  Zap,
  Heart,
  MessageCircle,
  Settings,
  ChevronLeft,
  GraduationCap,
  Code,
  Gamepad2,
  Palette,
  Bot,
  Send,
  User,
  Home,
  BarChart3,
  Users,
  FileText,
  Video,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';
import { getPersonalization } from '@/data/studentPersonalization';
import PersonalizedInsightCard from '@/components/student/PersonalizedInsightCard';

interface Student {
  id: string;
  full_name: string;
  age: number;
  email: string;
  avatar_url?: string;
  level: number;
  total_points: number;
  total_stars: number;
  current_streak: number;
  longest_streak: number;
  rank: number;
  join_date: string;
  bio: string;
  interests: string[];
  learning_style: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge_color: string;
  points: number;
  unlocked_date: string;
  category: string;
}

interface Parent {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  relationship: string;
  occupation: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  project_name: string;
  members: Array<{
    id: string;
    name: string;
    avatar_url?: string;
    role: string;
  }>;
  created_at: string;
}

interface EnrolledCourse {
  id: string;
  title: string;
  progress: number;
  instructor: string;
  start_date: string;
  estimated_completion: string;
  next_class: string;
  category: string;
  thumbnail_url?: string;
}

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

const StudentProfile: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [parent, setParent] = useState<Parent | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [aiInput, setAiInput] = useState('');

  // Real student data from Star Academy
  const realStudents: { [key: string]: Student } = {
    '1': {
      id: '1',
      full_name: 'أياد محمود',
      age: 11,
      email: 'ayyad@example.com',
      avatar_url: '/api/placeholder/200/200',
      level: 3,
      total_points: 40,
      total_stars: 12,
      current_streak: 2,
      longest_streak: 5,
      rank: 8,
      join_date: '2023-06-15',
      bio: 'أنا طالب نشط ومهتم بتعلم أساسيات البرمجة. أحب حل المشكلات واستخدام المنطق في بناء المشاريع البسيطة.',
      interests: ['Scratch', 'أساسيات البرمجة', 'المنطق', 'حل المشكلات'],
      learning_style: 'مرئي وتفاعلي'
    },
    '2': {
      id: '2',
      full_name: 'مروان أحمد حسن',
      age: 12,
      email: 'marwan@example.com',
      avatar_url: '/api/placeholder/200/200',
      level: 3,
      total_points: 35,
      total_stars: 10,
      current_streak: 3,
      longest_streak: 4,
      rank: 9,
      join_date: '2023-07-01',
      bio: 'محب للألعاب ويرغب في تعلم كيفية صناعتها. طموحي أن أصنع لعبة خاصة بي يوماً ما.',
      interests: ['ألعاب الكمبيوتر', 'Scratch', 'تصميم الألعاب'],
      learning_style: 'عملي'
    },
    '3': {
      id: '3',
      full_name: 'مالك السيد نصار',
      age: 10,
      email: 'malek@example.com',
      avatar_url: '/api/placeholder/200/200',
      level: 3,
      total_points: 38,
      total_stars: 11,
      current_streak: 4,
      longest_streak: 7,
      rank: 7,
      join_date: '2023-06-20',
      bio: 'مبدع صغير ويحب حل المشكلات بالبرمجة. دائماً أبحث عن طرق جديدة لجعل البرمجة ممتعة.',
      interests: ['حل المشكلات', 'البرمجة الإبداعية', 'المنطق'],
      learning_style: 'إبداعي'
    },
    '13': {
      id: '13',
      full_name: 'سليم أحمد عباس الفولي',
      age: 6,
      email: 'sulaiman.foly@example.com',
      avatar_url: '/api/placeholder/200/200',
      level: 1,
      total_points: 24,
      total_stars: 8,
      current_streak: 1,
      longest_streak: 2,
      rank: 17,
      join_date: '2024-01-15',
      bio: 'أنا أصغر طالب في الأكاديمية وأحب البرمجة جداً. طموحي أن أصبح مطور ألعاب محترف.',
      interests: ['Scratch Jr', 'الألعاب التعليمية', 'البرمجة للأطفال', 'الرسومات'],
      learning_style: 'مرئي وتفاعلي'
    }
  };

  // Real parent data for each student
  const realParents: { [key: string]: Parent } = {
    '1': {
      id: '1',
      full_name: 'محمود أحمد',
      email: 'mohoud.ahmad@email.com',
      phone: '+966 50 123 4567',
      avatar_url: '/api/placeholder/150/150',
      relationship: 'الأب',
      occupation: 'مهندس'
    },
    '2': {
      id: '2',
      full_name: 'هبه عبد العال',
      email: 'heba.abdelal@email.com',
      phone: '+966 51 234 5678',
      avatar_url: '/api/placeholder/150/150',
      relationship: 'الأم',
      occupation: 'معلمة'
    },
    '3': {
      id: '3',
      full_name: 'السيد أحمد ناصر',
      email: 'sayed.ahmed@email.com',
      phone: '+966 52 345 6789',
      avatar_url: '/api/placeholder/150/150',
      relationship: 'الأب',
      occupation: 'طبيب'
    },
    '4': {
      id: '4',
      full_name: 'السيد أحمد ناصر',
      email: 'sayed.ahmed@email.com',
      phone: '+966 52 345 6789',
      avatar_url: '/api/placeholder/150/150',
      relationship: 'الأب',
      occupation: 'طبيب'
    },
    '5': {
      id: '5',
      full_name: 'أحمد حسن',
      email: 'ahmed.hassan@email.com',
      phone: '+966 53 456 7890',
      avatar_url: '/api/placeholder/150/150',
      relationship: 'الأب',
      occupation: 'محاسب'
    },
    '6': {
      id: '6',
      full_name: 'حنان السيد',
      email: 'hanan.sayed@email.com',
      phone: '+966 54 567 8901',
      avatar_url: '/api/placeholder/150/150',
      relationship: 'الأم',
      occupation: 'مدرسة'
    },
    '7': {
      id: '7',
      full_name: 'حنان السيد',
      email: 'hanan.sayed@email.com',
      phone: '+966 54 567 8901',
      avatar_url: '/api/placeholder/150/150',
      relationship: 'الأم',
      occupation: 'مدرسة'
    },
    '8': {
      id: '8',
      full_name: 'عصام عبدالله ماهر',
      email: 'esam.abdullah@email.com',
      phone: '+966 55 678 9012',
      avatar_url: '/api/placeholder/150/150',
      relationship: 'الأب',
      occupation: 'مدير شركة'
    },
    '9': {
      id: '9',
      full_name: 'عصام عبدالله ماهر',
      email: 'esam.abdullah@email.com',
      phone: '+966 55 678 9012',
      avatar_url: '/api/placeholder/150/150',
      relationship: 'الأب',
      occupation: 'مدير شركة'
    },
    '10': {
      id: '10',
      full_name: 'محمود الليبي',
      email: 'mahmoud.liby@email.com',
      phone: '+966 56 789 0123',
      avatar_url: '/api/placeholder/150/150',
      relationship: 'الأب',
      occupation: 'مهندس مدني'
    },
    '11': {
      id: '11',
      full_name: 'محمد السحالي',
      email: 'mohammed.sahly@email.com',
      phone: '+966 57 890 1234',
      avatar_url: '/api/placeholder/150/150',
      relationship: 'الأب',
      occupation: 'موظف حكومي'
    },
    '12': {
      id: '12',
      full_name: 'محمد السحالي',
      email: 'mohammed.sahly@email.com',
      phone: '+966 57 890 1234',
      avatar_url: '/api/placeholder/150/150',
      relationship: 'الأب',
      occupation: 'موظف حكومي'
    },
    '13': {
      id: '13',
      full_name: 'أحمد عباس الفولي',
      email: 'ahmed.abdul@foly.com',
      phone: '+966 58 901 2345',
      avatar_url: '/api/placeholder/150/150',
      relationship: 'الأب',
      occupation: 'طبيب'
    }
  };

  // Real team data with Star Academy students
  const realTeams: { [key: string]: Team } = {
    '1': {
      id: '1',
      name: 'فريق المبتكرين الصغار',
      description: 'فريق يعمل على تطوير لعبة تعليمية تفاعلية للأطفال',
      project_name: 'مغامرات البرمجة',
      members: [
        { id: '1', name: 'أياد محمود', avatar_url: '/api/placeholder/40/40', role: 'قائد الفريق' },
        { id: '2', name: 'مروان أحمد حسن', avatar_url: '/api/placeholder/40/40', role: 'مصمم ألعاب' },
        { id: '3', name: 'مالك السيد نصار', avatar_url: '/api/placeholder/40/40', role: 'مبرمج' },
        { id: '4', name: 'ردينا السيد نصار', avatar_url: '/api/placeholder/40/40', role: 'مختبر' }
      ],
      created_at: '2024-01-10'
    },
    '2': {
      id: '2',
      name: 'فريق المستقبل',
      description: 'فريق يعمل على مشروع روبوتات بسيط',
      project_name: 'الروبوت المساعد',
      members: [
        { id: '5', name: 'ياسين حسن', avatar_url: '/api/placeholder/40/40', role: 'قائد الفريق' },
        { id: '6', name: 'مريم نافع', avatar_url: '/api/placeholder/40/40', role: 'مصممة' },
        { id: '7', name: 'خالد نافع', avatar_url: '/api/placeholder/40/40', role: 'مبرمج' }
      ],
      created_at: '2024-02-01'
    }
  };

  const mockAchievements: Achievement[] = [
    {
      id: '1',
      title: 'برمجي ناشئ',
      description: 'أكمل أول دورة برمجة بنجاح',
      icon: '🎓',
      badge_color: 'blue',
      points: 50,
      unlocked_date: '2023-07-20',
      category: 'milestone'
    },
    {
      id: '2',
      title: 'نجم الأسبوع',
      description: 'حصل على 10 نجوم في أسبوع واحد',
      icon: '⭐',
      badge_color: 'yellow',
      points: 25,
      unlocked_date: '2023-08-15',
      category: 'streak'
    },
    {
      id: '3',
      title: 'المتسلسل',
      description: 'حضر 15 درساً متتالياً',
      icon: '🔥',
      badge_color: 'orange',
      points: 40,
      unlocked_date: '2023-09-01',
      category: 'streak'
    }
  ];

  const mockCourses: EnrolledCourse[] = [
    {
      id: '1',
      title: 'أساسيات البرمجة للأطفال',
      progress: 100,
      instructor: 'أحمد محمد',
      start_date: '2023-06-15',
      estimated_completion: '2023-08-15',
      next_class: 'مكتملة',
      category: 'programming_basics',
      thumbnail_url: '/api/placeholder/400/250'
    },
    {
      id: '2',
      title: 'تطوير الألعاب بـ JavaScript',
      progress: 75,
      instructor: 'فاطمة العلي',
      start_date: '2023-09-01',
      estimated_completion: '2024-03-01',
      next_class: '2024-01-25',
      category: 'game_development',
      thumbnail_url: '/api/placeholder/400/250'
    }
  ];

  useEffect(() => {
    if (studentId) {
      loadStudentData();
    }
  }, [studentId]);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        const studentData = realStudents[studentId!] || realStudents['1'];
        setStudent(studentData);
        setAchievements(mockAchievements);
        setParent(realParents[studentId!] || realParents['1']);
        setTeam(realTeams[studentId!] || realTeams['1']);
        setCourses(mockCourses);
        setAiMessages([
          {
            id: '1',
            type: 'ai',
            content: `مرحباً ${studentData.full_name}! أنا مساعدك الذكي في أكاديمية ستار. كيف يمكنني مساعدتك اليوم؟`,
            timestamp: new Date().toISOString()
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading student data:', error);
      toast.error('حدث خطأ في تحميل بيانات الطالب');
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!aiInput.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: aiInput,
      timestamp: new Date().toISOString()
    };

    setAiMessages(prev => [...prev, userMessage]);
    setAiInput('');

    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'فكرة ممتازة! يمكنك البدء بتعلم أساسيات JavaScript.',
        timestamp: new Date().toISOString()
      };
      setAiMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل ملف الطالب...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <User className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">الطالب غير موجود</h2>
            <Button onClick={() => navigate('/dashboard')}>
              العودة للرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-white border-l border-gray-200 min-h-screen sticky top-0">
          <div className="p-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="mb-4"
            >
              <ChevronLeft className="h-4 w-4 ml-2" />
              العودة
            </Button>

            <nav className="space-y-2">
              <Button
                variant={activeSection === 'overview' ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => setActiveSection('overview')}
              >
                <Home className="h-4 w-4" />
                نظرة عامة
              </Button>
              <Button
                variant={activeSection === 'achievements' ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => setActiveSection('achievements')}
              >
                <Trophy className="h-4 w-4" />
                الإنجازات
              </Button>
              <Button
                variant={activeSection === 'courses' ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => setActiveSection('courses')}
              >
                <BookOpen className="h-4 w-4" />
                الدورات
              </Button>
              <Button
                variant={activeSection === 'team' ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => setActiveSection('team')}
              >
                <Users className="h-4 w-4" />
                الفريق
              </Button>
              <Button
                variant={activeSection === 'parent' ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => setActiveSection('parent')}
              >
                <Users className="h-4 w-4" />
                ولي الأمر
              </Button>
              <Button
                variant={activeSection === 'ai-assistant' ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => setActiveSection('ai-assistant')}
              >
                <Bot className="h-4 w-4" />
                المساعد الذكي
              </Button>
            </nav>
          </div>

          {/* AI Assistant in Sidebar */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-sm">المساعد الذكي</h3>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {aiMessages.slice(-2).map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded-lg text-xs ${
                    msg.type === 'user'
                      ? 'bg-primary text-primary-foreground mr-8'
                      : 'bg-muted ml-8'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>
            <div className="flex gap-1 mt-2">
              <Input
                placeholder="اسألني..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 h-8 text-xs"
              />
              <Button size="sm" className="h-8 w-8 p-0" onClick={handleSendMessage}>
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Mobile Header */}
          <div className="lg:hidden mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="mb-4"
            >
              <ChevronLeft className="h-4 w-4 ml-2" />
              العودة
            </Button>
            <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="achievements">إنجازات</TabsTrigger>
                <TabsTrigger value="courses">دورات</TabsTrigger>
                <TabsTrigger value="ai-assistant">مساعد</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {(() => {
            const personalization = getPersonalization(student.id);
            return (
              <>
                {/* Student Header */}
                <div className={`bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 ${personalization.theme.ring.replace('ring-', 'border-')}`}>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <Avatar className={`h-24 w-24 ring-4 ${personalization.theme.ring}`}>
                      <AvatarImage src={student.avatar_url} />
                      <AvatarFallback className={`text-2xl text-white bg-gradient-to-br ${personalization.theme.gradient}`}>
                        {student.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gradient-fun mb-2">
                        {student.full_name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>{student.age} سنة</span>
                        <span>•</span>
                        <span>انضم في {new Date(student.join_date).toLocaleDateString('ar-SA')}</span>
                        <span>•</span>
                        <span>الترتيب #{student.rank}</span>
                      </div>
                      <p className="mt-3 text-gray-700">{student.bio}</p>
                    </div>
                  </div>
                </div>

                {/* AI-personalized insight + adaptive path */}
                <PersonalizedInsightCard
                  studentName={student.full_name}
                  personalization={personalization}
                />
              </>
            );
          })()}

          {/* Content Sections */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <div className="text-2xl font-bold">{student.total_stars}</div>
                    <div className="text-sm text-muted-foreground">إجمالي النجوم</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Trophy className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">{student.total_points}</div>
                    <div className="text-sm text-muted-foreground">النقاط</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                    <div className="text-2xl font-bold">{student.current_streak}</div>
                    <div className="text-sm text-muted-foreground">السلسلة الحالية</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">{achievements.length}</div>
                    <div className="text-sm text-muted-foreground">الإنجازات</div>
                  </CardContent>
                </Card>
              </div>

              {/* Interests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    الاهتمامات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {student.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'achievements' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">الإنجازات</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className="hover:shadow-lg transition-all">
                    <CardContent className="p-4 text-center">
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h3 className="font-semibold mb-2">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {achievement.description}
                      </p>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        +{achievement.points} نقطة
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'courses' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">الدورات المسجل بها</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center">
                        <Code className="h-8 w-8" />
                      </div>
                      <h3 className="font-semibold mb-2">{course.title}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">التقدم:</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">المدرب:</span>
                          <span>{course.instructor}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'team' && team && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">فريقك</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
                    <p className="text-gray-600">{team.description}</p>
                    <Badge variant="secondary" className="mt-2">
                      المشروع: {team.project_name}
                    </Badge>
                  </div>
                  <h4 className="font-semibold mb-4">أعضاء الفريق</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {team.members.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar_url} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h5 className="font-medium">{member.name}</h5>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'parent' && parent && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">ولي الأمر</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={parent.avatar_url} />
                      <AvatarFallback className="text-xl">
                        {parent.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{parent.full_name}</h3>
                      <Badge variant="outline">{parent.relationship}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground">البريد الإلكتروني:</span>
                      <p className="font-medium">{parent.email}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">رقم الهاتف:</span>
                      <p className="font-medium">{parent.phone}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">الوظيفة:</span>
                      <p className="font-medium">{parent.occupation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'ai-assistant' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">المساعد الذكي</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                    {aiMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.type === 'user' ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <div
                          className={`max-w-xs p-3 rounded-lg ${
                            msg.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="اكتب سؤالك هنا..."
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;