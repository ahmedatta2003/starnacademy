import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Star,
  Trophy,
  Code,
  Gamepad2,
  Globe,
  Smartphone,
  Film,
  Lightbulb,
  TrendingUp,
  Users,
  Award,
  Target,
  ArrowRight,
  Eye
} from 'lucide-react';

interface FeaturedStudent {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  achievements: number;
  projects: number;
  stars: number;
  badge?: string;
}

interface Achievement {
  id: string;
  type: 'star' | 'project' | 'milestone';
  title: string;
  description: string;
  studentName: string;
  date: string;
  points?: number;
}

const StudentSuccess: React.FC = () => {
  const [featuredStudents, setFeaturedStudents] = useState<FeaturedStudent[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [achievementFilter, setAchievementFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAchievements: 0,
    totalProjects: 0,
    activeStudents: 0
  });

  // Mock data for development - replace with actual API calls
  const mockFeaturedStudents: FeaturedStudent[] = [
    {
      id: '1',
      name: 'أحمد محمد',
      avatar: '/api/placeholder/100/100',
      level: 8,
      achievements: 25,
      projects: 12,
      stars: 150,
      badge: '🏆 النجم الأسبوعي'
    },
    {
      id: '2',
      name: 'فاطمة العلي',
      avatar: '/api/placeholder/100/100',
      level: 7,
      achievements: 20,
      projects: 8,
      stars: 120,
      badge: '⭐ مطور متميز'
    },
    {
      id: '3',
      name: 'عبدالله خالد',
      avatar: '/api/placeholder/100/100',
      level: 9,
      achievements: 30,
      projects: 15,
      stars: 180,
      badge: '🎮 خبير الألعاب'
    },
    {
      id: '4',
      name: 'مريم سعد',
      avatar: '/api/placeholder/100/100',
      level: 6,
      achievements: 18,
      projects: 10,
      stars: 95,
      badge: '🌟 مبتكرة'
    }
  ];

  const mockAchievements: Achievement[] = [
    {
      id: '1',
      type: 'star',
      title: 'نجمة الذهب',
      description: 'حصل على 10 نجوم في شهر واحد',
      studentName: 'أحمد محمد',
      date: '2024-01-15',
      points: 10
    },
    {
      id: '2',
      type: 'project',
      title: 'مطور الألعاب',
      description: 'أنشأ لعبة احترافية بلغة JavaScript',
      studentName: 'عبدالله خالد',
      date: '2024-01-14'
    },
    {
      id: '3',
      type: 'milestone',
      title: 'خبير البرمجة',
      description: 'وصل إلى المستوى 9 في البرمجة',
      studentName: 'فاطمة العلي',
      date: '2024-01-13'
    },
    {
      id: '4',
      type: 'star',
      title: 'نجم الأسبوع',
      description: 'أفضل طالب هذا الأسبوع',
      studentName: 'مريم سعد',
      date: '2024-01-12',
      points: 15
    },
    {
      id: '5',
      type: 'project',
      title: 'مصمم المواقع',
      description: 'أنشأ موقع ويب تفاعلي بتقنية React',
      studentName: 'خالد أحمد',
      date: '2024-01-11'
    },
    {
      id: '6',
      type: 'milestone',
      title: 'متقدم سريع',
      description: 'أتم 3 دورات في شهر واحد',
      studentName: 'نورا علي',
      date: '2024-01-10'
    }
  ];

  const mockStats = {
    totalStudents: 450,
    totalAchievements: 2850,
    totalProjects: 1200,
    activeStudents: 320
  };

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setFeaturedStudents(mockFeaturedStudents);
      setRecentAchievements(mockAchievements);
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'star':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'project':
        return <Code className="h-5 w-5 text-blue-500" />;
      case 'milestone':
        return <Trophy className="h-5 w-5 text-purple-500" />;
      default:
        return <Award className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAchievementTypeLabel = (type: string) => {
    switch (type) {
      case 'star':
        return 'نجمة';
      case 'project':
        return 'مشروع';
      case 'milestone':
        return 'إنجاز';
      default:
        return 'أخرى';
    }
  };

  const filteredAchievements = achievementFilter === 'all'
    ? recentAchievements
    : recentAchievements.filter(a => a.type === achievementFilter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-3xl font-bold text-gradient-primary">جاري تحميل نجاحات طلابنا...</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gradient-fun mb-4">
            نجاحات طلابنا
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            استكشف إنجازات طلابنا المتميزين وتابع رحلتهم في عالم البرمجة والابتكار
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center p-6 hover-lift">
            <div className="text-3xl font-bold text-primary mb-2">{stats.totalStudents}</div>
            <div className="text-sm text-muted-foreground">طالب مسجل</div>
          </Card>
          <Card className="text-center p-6 hover-lift">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.totalAchievements}</div>
            <div className="text-sm text-muted-foreground">إنجاز محقق</div>
          </Card>
          <Card className="text-center p-6 hover-lift">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalProjects}</div>
            <div className="text-sm text-muted-foreground">مشروع مكتمل</div>
          </Card>
          <Card className="text-center p-6 hover-lift">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.activeStudents}</div>
            <div className="text-sm text-muted-foreground">طالب نشط</div>
          </Card>
        </div>

        {/* Featured Students Carousel */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-foreground">الطلاب المميزون</h3>
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              عرض جميع الطلاب
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredStudents.map((student) => (
              <Card key={student.id} className="text-center hover-lift group">
                <CardContent className="pt-6">
                  <div className="relative mb-4">
                    <Avatar className="h-20 w-20 mx-auto mb-3 ring-4 ring-primary/20 group-hover:scale-110 transition-transform">
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    {student.badge && (
                      <div className="absolute -top-2 -right-2 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium border border-yellow-200">
                        {student.badge}
                      </div>
                    )}
                  </div>

                  <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                    {student.name}
                  </h4>

                  <div className="text-sm text-muted-foreground mb-4">
                    المستوى {student.level}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center mb-4">
                    <div className="p-2 bg-yellow-50 rounded">
                      <div className="text-lg font-bold text-yellow-600">{student.stars}</div>
                      <div className="text-xs text-muted-foreground">نجوم</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="text-lg font-bold text-blue-600">{student.projects}</div>
                      <div className="text-xs text-muted-foreground">مشاريع</div>
                    </div>
                    <div className="p-2 bg-purple-50 rounded">
                      <div className="text-lg font-bold text-purple-600">{student.achievements}</div>
                      <div className="text-xs text-muted-foreground">إنجازات</div>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                    عرض الملف الشخصي
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-foreground">الإنجازات الحديثة</h3>
            <Select value={achievementFilter} onValueChange={setAchievementFilter}>
              <SelectTrigger className="w-40">
                <Award className="h-4 w-4 mr-2" />
                <SelectValue placeholder="النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الإنجازات</SelectItem>
                <SelectItem value="star">النجوم</SelectItem>
                <SelectItem value="project">المشاريع</SelectItem>
                <SelectItem value="milestone">الأهداف</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAchievements.map((achievement) => (
              <Card key={achievement.id} className="hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      {getAchievementIcon(achievement.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {getAchievementTypeLabel(achievement.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>بواسطة: {achievement.studentName}</span>
                        <span>{formatDate(achievement.date)}</span>
                      </div>
                      {achievement.points && (
                        <div className="mt-2 text-sm font-medium text-yellow-600">
                          +{achievement.points} نقطة
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAchievements.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا توجد إنجازات مطابقة للفilter المحدد</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-secondary/10">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              انضم إلى مجتمع الناجحين!
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              ابدأ رحلتك في عالم البرمجة وكن أحد نجاحاتنا القادمة. سجل الآن واحصل على تجربة تعليمية مميزة.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="gap-2">
                ابدأ الآن
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Users className="h-4 w-4" />
                عرض المزيد من النجاحات
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default StudentSuccess;