import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import StudentLevelBadge from '@/components/StudentLevelBadge';
import StarsCounter from '@/components/StarsCounter';
import ProjectCard from '@/components/ProjectCard';
import {
  User,
  Calendar,
  Award,
  Star,
  Code,
  Gamepad2,
  Globe,
  Smartphone,
  Film,
  Lightbulb,
  BookOpen,
  TrendingUp,
  Share2,
  Eye,
  Shield
} from 'lucide-react';

interface PublicStudentData {
  id: string;
  full_name: string;
  avatar_url?: string;
  level: number;
  total_stars: number;
  completed_courses: number;
  active_courses: number;
  total_projects: number;
  achievements_count: number;
  join_date: string;
}

interface PublicProject {
  id: string;
  project_title: string;
  project_description?: string;
  project_type: 'game' | 'website' | 'app' | 'animation' | 'other';
  completion_date: string;
  instructor_rating: number;
  technologies: string[];
  public: boolean;
}

interface PublicAchievement {
  id: string;
  title: string;
  description?: string;
  type: 'star' | 'project' | 'milestone';
  points?: number;
  earned_date: string;
}

const StudentPublicProfile: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [studentData, setStudentData] = useState<PublicStudentData | null>(null);
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [achievements, setAchievements] = useState<PublicAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development - replace with actual API calls
  const mockStudentData: PublicStudentData = {
    id: studentId || '1',
    full_name: 'أحمد محمد السعيد',
    avatar_url: '/api/placeholder/150/150',
    level: 7,
    total_stars: 85,
    completed_courses: 5,
    active_courses: 2,
    total_projects: 12,
    achievements_count: 25,
    join_date: '2023-03-15'
  };

  const mockProjects: PublicProject[] = [
    {
      id: '1',
      project_title: 'مغامرة الفضاء',
      project_description: 'لعبة تعليمية ممتعة تستكشف الفضاء الخارجي وتعلم الأطفال عن الكواكب',
      project_type: 'game',
      completion_date: '2024-01-15',
      instructor_rating: 5,
      technologies: ['JavaScript', 'HTML5 Canvas', 'Phaser.js'],
      public: true
    },
    {
      id: '2',
      project_title: 'حاسبة ذكية',
      project_description: 'آلة حاسبة متطورة مع تاريخ العمليات الحسابية ورسوم بيانية',
      project_type: 'app',
      completion_date: '2024-01-10',
      instructor_rating: 4,
      technologies: ['React Native', 'JavaScript'],
      public: true
    },
    {
      id: '3',
      project_title: 'موقع تعليمي',
      project_description: 'موقع ويب لتعليم البرمجة للأطفال مع دروس تفاعلية',
      project_type: 'website',
      completion_date: '2023-12-20',
      instructor_rating: 5,
      technologies: ['React', 'HTML', 'CSS'],
      public: true
    }
  ];

  const mockAchievements: PublicAchievement[] = [
    {
      id: '1',
      title: 'نجمة الذهب',
      description: 'حصل على 10 نجوم في شهر واحد',
      type: 'star',
      points: 10,
      earned_date: '2024-01-15'
    },
    {
      id: '2',
      title: 'مطور الألعاب',
      description: 'أنشأ أول لعبة احترافية',
      type: 'project',
      points: 15,
      earned_date: '2024-01-12'
    },
    {
      id: '3',
      title: 'خبير البرمجة',
      description: 'وصل إلى المستوى 7',
      type: 'milestone',
      points: 20,
      earned_date: '2024-01-10'
    }
  ];

  useEffect(() => {
    loadStudentProfile();
  }, [studentId]);

  const loadStudentProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      setTimeout(() => {
        setStudentData(mockStudentData);
        setProjects(mockProjects);
        setAchievements(mockAchievements);
        setLoading(false);
      }, 1000);

      // In real implementation, this would be:
      /*
      const { data: profile } = await supabase
        .from('profiles')
        .select('*, children(*)')
        .eq('id', studentId)
        .single();

      if (!profile || profile.role !== 'child') {
        setError('الملف الشخصي غير متاح للعامة');
        return;
      }

      // Load public projects
      const { data: projectsData } = await supabase
        .from('student_projects')
        .select('*')
        .eq('student_id', studentId)
        .eq('shared_publicly', true);

      // Load public achievements
      const { data: achievementsData } = await supabase
        .from('student_achievements')
        .select('*')
        .eq('student_id', studentId)
        .order('earned_date', { ascending: false })
        .limit(10);
      */

    } catch (error) {
      console.error('Error loading student profile:', error);
      setError('حدث خطأ في تحميل الملف الشخصي');
      setLoading(false);
    }
  };

  const getProjectTypeIcon = (type: string) => {
    const iconMap = {
      game: Gamepad2,
      website: Globe,
      app: Smartphone,
      animation: Film,
      other: Lightbulb
    };
    return iconMap[type as keyof typeof iconMap] || Code;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `ملف ${studentData?.full_name} - أكاديمية ستارن`,
        text: `شاهد إنجازات ${studentData?.full_name} في أكاديمية ستارن`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل الملف الشخصي...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">الملف الشخصي غير متاح</h2>
              <p className="text-muted-foreground">
                {error || 'عذراً، هذا الملف الشخصي غير متاح للعامة'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
              <Avatar className="h-32 w-32">
                <AvatarImage src={studentData.avatar_url} alt={studentData.full_name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-4xl font-bold">
                  {studentData.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center lg:text-right">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{studentData.full_name}</h1>
                  <Badge variant="secondary" className="gap-2">
                    <User className="h-3 w-3" />
                    طالب
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-4">
                  <Badge variant="outline" className="gap-2">
                    <Calendar className="h-3 w-3" />
                    انضم: {formatDate(studentData.join_date)}
                  </Badge>
                  <Badge variant="outline" className="gap-2">
                    <BookOpen className="h-3 w-3" />
                    {studentData.completed_courses} دورة مكتملة
                  </Badge>
                  <Badge variant="outline" className="gap-2">
                    <Award className="h-3 w-3" />
                    {studentData.achievements_count} إنجاز
                  </Badge>
                </div>

                <div className="flex gap-3 justify-center lg:justify-start">
                  <Button onClick={handleShare} variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    مشاركة الملف
                  </Button>
                </div>
              </div>

              {/* Level and Stats */}
              <div className="flex flex-col sm:flex-row gap-4">
                <StudentLevelBadge level={studentData.level} showProgress={false} size="lg" />
                <StarsCounter
                  starsCount={studentData.total_stars}
                  timeRange="allTime"
                  size="lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-primary mb-1">{studentData.level}</div>
            <div className="text-sm text-muted-foreground">المستوى الحالي</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{studentData.total_stars}</div>
            <div className="text-sm text-muted-foreground">إجمالي النجوم</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-green-600 mb-1">{studentData.total_projects}</div>
            <div className="text-sm text-muted-foreground">المشاريع</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-purple-600 mb-1">{studentData.achievements_count}</div>
            <div className="text-sm text-muted-foreground">الإنجازات</div>
          </Card>
        </div>

        {/* Public Projects */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    المشاريع العامة
                  </CardTitle>
                  <CardDescription>
                    مشاريع {studentData.full_name} التي تمت مشاركتها مع العامة
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  {projects.length} مشروع
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Card key={project.id} className="hover-lift">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        {React.createElement(getProjectTypeIcon(project.project_type), {
                          className: "h-5 w-5 text-primary"
                        })}
                        <Badge variant="secondary" className="text-xs">
                          {project.project_type === 'game' && 'لعبة'}
                          {project.project_type === 'website' && 'موقع'}
                          {project.project_type === 'app' && 'تطبيق'}
                          {project.project_type === 'animation' && 'رسوم متحركة'}
                          {project.project_type === 'other' && 'أخرى'}
                        </Badge>
                      </div>

                      <h3 className="font-semibold mb-2">{project.project_title}</h3>

                      {project.project_description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {project.project_description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= project.instructor_rating
                                  ? 'text-yellow-500 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(project.completion_date)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {projects.length === 0 && (
                <div className="text-center py-8">
                  <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد مشاريع عامة حالياً</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              أحدث الإنجازات
            </CardTitle>
            <CardDescription>
              الإنجازات الحديثة لـ {studentData.full_name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {achievement.type === 'star' && <Star className="h-5 w-5 text-yellow-600" />}
                    {achievement.type === 'project' && <Code className="h-5 w-5 text-blue-600" />}
                    {achievement.type === 'milestone' && <Award className="h-5 w-5 text-purple-600" />}
                  </div>

                  <div className="flex-1">
                    <div className="font-medium">{achievement.title}</div>
                    {achievement.description && (
                      <div className="text-sm text-muted-foreground">{achievement.description}</div>
                    )}
                  </div>

                  <div className="text-left">
                    {achievement.points && (
                      <div className="text-lg font-bold text-yellow-600">+{achievement.points}</div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {formatDate(achievement.earned_date)}
                    </div>
                  </div>
                </div>
              ))}

              {achievements.length === 0 && (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد إنجازات معروضة</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentPublicProfile;