import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Trophy,
  Star,
  Gift,
  Target,
  Flame,
  Zap,
  Award,
  Crown,
  Rocket,
  Heart,
  Gem,
  Medal,
  Diamond
} from 'lucide-react';
import { toast } from 'sonner';

interface StudentStats {
  total_points: number;
  current_level: number;
  next_level_points: number;
  level_progress: number;
  total_achievements: number;
  current_streak: number;
  longest_streak: number;
  rank: number;
  total_students: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: string;
  icon: string;
  badge_color: string;
  points: number;
  unlock_conditions: any;
  is_unlocked: boolean;
  unlocked_date?: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  type: string;
  icon: string;
  is_available: boolean;
  is_redeemed: boolean;
  redeemed_date?: string;
}

interface LeaderboardEntry {
  rank: number;
  student_id: string;
  student_name: string;
  avatar_url?: string;
  total_points: number;
  level: number;
  achievements_count: number;
}

const GamificationSystem: React.FC = () => {
  const { user, profile } = useAuth();
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for development
  const mockStudentStats: StudentStats = {
    total_points: 850,
    current_level: 7,
    next_level_points: 1000,
    level_progress: 85,
    total_achievements: 12,
    current_streak: 5,
    longest_streak: 15,
    rank: 3,
    total_students: 45
  };

  const mockAchievements: Achievement[] = [
    {
      id: '1',
      title: 'برمجي ناشئ',
      description: 'أكمل دورة البرمجة الأولى',
      type: 'milestone',
      icon: '🎓',
      badge_color: 'blue',
      points: 50,
      unlock_conditions: { completed_courses: 1 },
      is_unlocked: true,
      unlocked_date: '2024-01-15'
    },
    {
      id: '2',
      title: 'نجم الأسبوع',
      description: 'حصل على 5 نجوم في أسبوع واحد',
      type: 'streak',
      icon: '⭐',
      badge_color: 'yellow',
      points: 25,
      unlock_conditions: { weekly_stars: 5 },
      is_unlocked: true,
      unlocked_date: '2024-01-20'
    },
    {
      id: '3',
      title: 'المتسلسل',
      description: 'حضر 5 دروس متتالية',
      type: 'streak',
      icon: '🔥',
      badge_color: 'orange',
      points: 30,
      unlock_conditions: { attendance_streak: 5 },
      is_unlocked: true,
      unlocked_date: '2024-01-25'
    },
    {
      id: '4',
      'title': 'خبير الأسبوع',
      description: 'حصل على 10 نجوم في أسبوع واحد',
      type: 'points',
      icon: '🌟',
      badge_color: 'purple',
      points: 50,
      unlock_conditions: { weekly_stars: 10 },
      is_unlocked: false
    },
    {
      id: '5',
      title: 'مطور الألعاب',
      description: 'أنشئ أول لعبة تفاعلية',
      type: 'skill',
      icon: '🎮',
      badge_color: 'green',
      points: 100,
      unlock_conditions: { completed_project_type: 'game' },
      is_unlocked: false
    }
  ];

  const mockRewards: Reward[] = [
    {
      id: '1',
      title: 'شارة برمجي مميزة',
      description: 'شارة رمزية تعرض في ملفك الشخصي',
      cost: 200,
      type: 'badge',
      icon: '🏅',
      is_available: true,
      is_redeemed: false
    },
    {
      id: '2',
      title: 'وصول مبكر لدرس جديد',
      description: 'احصل على وصول مبكر للدروس القادمة قبل 24 ساعة',
      cost: 150,
      type: 'access',
      icon: '⏰',
      is_available: true,
      is_redeemed: false
    },
    {
      id: '3',
      title: 'اشتراك مجاني لشهر',
      description: 'اشترك في جميع الدورات لشهر واحد مجاناً',
      cost: 1000,
      type: 'subscription',
      icon: '🎫',
      is_available: false,
      is_redeemed: false
    },
    {
      id: '4',
      'title': 'استشارة تخفيض 20%',
      description: 'احصل على خصم 20% على دورة واحدة',
      cost: 300,
      type: 'discount',
      icon: '💰',
      is_available: true,
      is_redeemed: false
    }
  ];

  const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, student_id: '1', student_name: 'فاطمة العلي', avatar_url: '/api/placeholder/40/40', total_points: 1200, level: 8, achievements_count: 15 },
    { rank: 2, student_id: '2', student_name: 'عبدالله خالد', avatar_url: '/api/placeholder/40/40', total_points: 950, level: 7, achievements_count: 12 },
    { rank: 3, student_id: '3', student_name: 'أحمد محمد', avatar_url: '/api/placeholder/40/40', total_points: 850, level: 7, achievements_count: 10 },
    { rank: 4, student_id: '4', student_name: 'مريم سعد', avatar_url: '/api/placeholder/40/40', total_points: 720, level: 6, achievements_count: 8 },
    { rank: 5, student_id: '5', student_name: 'خالد أحمد', avatar_url: '/api/placeholder/40/40', total_points: 680, level: 6, achievements_count: 7 }
  ];

  useEffect(() => {
    if (user && profile?.role === 'child') {
      loadGamificationData();
    }
  }, [user, profile]);

  const loadGamificationData = async () => {
    try {
      setLoading(true);

      // Simulate API calls
      setTimeout(() => {
        setStudentStats(mockStudentStats);
        setAchievements(mockAchievements);
        setRewards(mockRewards);
        setLeaderboard(mockLeaderboard);
        setLoading(false);
      }, 1000);

      // In real implementation:
      /*
      // Calculate student stats
      const { data: stats } = await supabase.rpc('calculate_student_points', {
        p_student_id: user?.id
      });

      // Load achievements
      const { data: achievementsData } = await supabase
        .from('student_achievements')
        .select(`
          *,
          achievements!student_achievements_achievement_id_fkey(*)
        `)
        .eq('student_id', user?.id);

      // Load rewards
      const { data: rewardsData } = await supabase
        .from('rewards')
        .select('*')
        .eq('is_active', true);

      // Load leaderboard
      const { data: leaderboardData } = await supabase
        .from('student_stats_view')
        .select('*')
        .order('total_points', { ascending: false })
        .limit(10);
      */
    } catch (error) {
      console.error('Error loading gamification data:', error);
      toast.error('حدث خطأ في تحميل بيانات اللعب');
      setLoading(false);
    }
  };

  const handleRedeemReward = async (reward: Reward) => {
    if (!studentStats || studentStats.total_points < reward.cost) {
      toast.error('نقاطك غير كافية لاستبدال هذا المكافأة');
      return;
    }

    try {
      // Update student points
      const newPoints = studentStats.total_points - reward.cost;
      setStudentStats({ ...studentStats, total_points: newPoints });

      // Mark reward as redeemed
      setRewards(prev => prev.map(r =>
        r.id === reward.id ? { ...r, is_redeemed: true, redeemed_date: new Date().toISOString() } : r
      ));

      toast.success(`تم استبدال "${reward.title}" بنجاح!`);

      // In real implementation:
      /*
      // Deduct points
      await supabase
        .from('points_transactions')
        .insert({
          student_id: user?.id,
          points: -reward.cost,
          transaction_type: 'spent',
          source: 'reward_redemption',
          description: `استبدال مكافأة: ${reward.title}`,
          related_entity_id: reward.id
        });

      // Mark reward as redeemed
      await supabase
        .from('student_rewards')
        .insert({
          student_id: user?.id,
          reward_id: reward.id,
          redeemed_date: new Date().toISOString(),
          points_spent: reward.cost
        });
      */
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error('حدث خطأ أثناء استبدال المكافأة');
    }
  };

  const getLevelIcon = (level: number) => {
    if (level >= 20) return <Crown className="h-8 w-8 text-yellow-500" />;
    if (level >= 15) return <Diamond className="h-8 w-8 text-purple-500" />;
    if (level >= 10) return <Gem className="h-8 w-8 text-blue-500" />;
    if (level >= 5) return <Medal className="h-8 w-8 text-green-500" />;
    return <Rocket className="h-8 w-8 text-gray-500" />;
  };

  const getLevelTitle = (level: number) => {
    if (level >= 20) return 'خبير الأساطي';
    if (level >= 15) return 'نجم محترف';
    if (level >= 10) return 'نجم ذهبي';
    if (level >= 5) return 'متميز';
    return 'مبتدئ';
  };

  const getLevelColor = (level: number) => {
    if (level >= 20) return 'bg-gradient-to-br from-yellow-400 to-orange-500';
    if (level >= 15) return 'bg-gradient-to-br from-purple-400 to-pink-500';
    if (level >= 10) return 'bg-gradient-to-br from-blue-400 to-cyan-500';
    if (level >= 5) return 'bg-gradient-to-br from-green-400 to-emerald-500';
    return 'bg-gradient-to-br from-gray-400 to-gray-500';
  };

  if (!user || !profile || profile.role !== 'child') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-6">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <Trophy className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">نظام اللعب</h2>
            <p className="text-muted-foreground">
              نظام النقاط والمكافآت متاح فقط للطلاب المسجلين في الأكاديمية
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
          <p className="text-muted-foreground">جاري تحميل نظام اللعب...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="container mx-auto">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${getLevelColor(studentStats?.current_level || 0)}`}>
                {getLevelIcon(studentStats?.current_level || 0)}
              </div>
              <div className="text-2xl font-bold">{getLevelTitle(studentStats?.current_level || 0)}</div>
              <div className="text-sm text-muted-foreground">المستوى</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-3 text-yellow-500" />
              <div className="text-2xl font-bold">{studentStats?.total_points}</div>
              <div className="text-sm text-muted-foreground">إجمالي النقاط</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-3 text-purple-500" />
              <div className="text-2xl font-bold">{studentStats?.total_achievements}</div>
              <div className="text-2xl font-bold text-muted-foreground">الإنجازات</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Flame className="h-8 w-8 mx-auto mb-3 text-orange-500" />
              <div className="text-2xl font-bold">{studentStats?.current_streak}</div>
              <div className="text-sm text-muted-foreground">السلسلة الحالية</div>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              تقدم المستوى
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">المستوى {studentStats?.current_level}</span>
                  <span className="text-sm text-muted-foreground">
                    {studentStats?.next_level_points} نقطة للمستوى التالي
                  </span>
                </div>
                <Progress value={studentStats?.level_progress || 0} className="h-3" />
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {studentStats?.level_progress}% من الطريق إلى المستوى {((studentStats?.current_level || 0) + 1)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
            <TabsTrigger value="rewards">المكافآت</TabsTrigger>
            <TabsTrigger value="leaderboard">لوحة الصدارة</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    المكافآت المتاحة
                  </CardTitle>
                  <CardDescription>
                    استخدم نقاطك لاستبدال مكافآت مميزة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {rewards.filter(r => r.is_available && !r.is_redeemed).slice(0, 4).map((reward) => (
                      <div key={reward.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{reward.icon}</div>
                          <div>
                            <h4 className="font-medium">{reward.title}</h4>
                            <p className="text-sm text-muted-foreground">{reward.description}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleRedeemReward(reward)}
                          disabled={studentStats!.total_points < reward.cost}
                          className="gap-1"
                        >
                          <Gem className="h-4 w-4" />
                          {reward.cost}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    الإحصائيات
                  </CardTitle>
                  <CardDescription>
                    ملخص إحصائياتك في النظام
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">الترتيب بين الطلاب</span>
                      <span className="font-medium">#{studentStats?.rank} من {studentStats?.total_students}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">أطول سلسلة دروس</span>
                      <span className="font-medium">{studentStats?.longest_streak} درس</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">معدد الطلاب</span>
                      <span className="font-medium">{studentStats?.total_students}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  الإنجازات الحديثة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.filter(a => a.is_unlocked).slice(0, 4).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{achievement.type}</Badge>
                          <Badge className="bg-yellow-100 text-yellow-800">+{achievement.points} نقطة</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  جميع الإنجازات
                </CardTitle>
                <CardDescription>
                  {achievements.filter(a => a.is_unlocked).length} من {achievements.length} إنجاز مفتوح
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <Card
                      key={achievement.id}
                      className={`${achievement.is_unlocked ? 'opacity-100' : 'opacity-50 grayscale'} hover:shadow-lg transition-all`}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-4xl mb-3">{achievement.icon}</div>
                        <h3 className="font-semibold mb-1">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <Badge variant={achievement.is_unlocked ? 'default' : 'secondary'}>
                            {achievement.is_unlocked ? 'مكتسب' : 'مقفل'}
                          </Badge>
                          {achievement.is_unlocked && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              +{achievement.points} نقطة
                            </Badge>
                          )}
                        </div>
                        {achievement.is_unlocked && achievement.unlocked_date && (
                          <div className="text-xs text-muted-foreground mt-2">
                            {new Date(achievement.unlocked_date).toLocaleDateString('ar-SA')}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward) => (
                <Card
                  key={reward.id}
                  className={`${reward.is_available && !reward.is_redeemed ? 'hover:shadow-lg' : 'opacity-50 grayscale'} transition-all`}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-3">{reward.icon}</div>
                    <h3 className="font-semibold mb-1">{reward.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {reward.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant="outline">{reward.type}</Badge>
                        {reward.is_redeemed && (
                          <Badge className="bg-green-100 text-green-800">مستبدل</Badge>
                        )}
                      </div>
                      <Button
                        onClick={() => handleRedeemReward(reward)}
                        disabled={!reward.is_available || reward.is_redeemed || (studentStats!.total_points < reward.cost)}
                        className="w-full gap-1"
                      >
                        <Gem className="h-4 w-4" />
                        {reward.is_redeemed ? 'مستبدل' : `استبدال (${reward.cost})`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  لوحة المتصدرين
                </CardTitle>
                <CardDescription>
                  أفضل 10 طلاب في الأكاديمية حسب النقاط
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.student_id}
                      className={`flex items-center gap-4 p-3 rounded-lg ${
                        entry.student_id === user?.id ? 'bg-primary/10 border-2 border-primary' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="text-lg font-bold w-12">
                        #{entry.rank}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={entry.avatar_url} />
                        <AvatarFallback>
                          {entry.student_name?.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{entry.student_name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>المستوى {entry.level}</span>
                          <span>•</span>
                          <span>{entry.achievements_count} إنجاز</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-600">{entry.total_points}</div>
                        <div className="text-xs text-muted-foreground">نقطة</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GamificationSystem;