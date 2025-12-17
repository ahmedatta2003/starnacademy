import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Star,
  Trophy,
  GraduationCap,
  Users,
  ArrowRight,
  Award,
  Target
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  age: number;
  level: number;
  avatar_url?: string;
  total_points: number;
  achievements_count: number;
  current_streak: number;
  bio: string;
  interests: string[];
  rank: number;
}

interface StudentShowcaseProps {
  title?: string;
  subtitle?: string;
  students?: Student[];
  maxDisplay?: number;
  showViewAll?: boolean;
}

const StudentShowcase: React.FC<StudentShowcaseProps> = ({
  title = "نجوم الأكاديمية",
  subtitle = "تعرف على أبرز طلابنا وم إنجازاتهم المذهلة في عالم البرمجة",
  maxDisplay = 8,
  showViewAll = true
}) => {
  const navigate = useNavigate();

  // Real student data from Star Academy
  const realStudents: Student[] = [
    {
      id: '1',
      name: 'أياد محمود أحمد',
      age: 11,
      level: 3,
      avatar_url: '/api/placeholder/200/200',
      total_points: 40,
      achievements_count: 3,
      current_streak: 2,
      bio: 'طالب نشط ومهتم بتعلم أساسيات البرمجة',
      interests: ['Scratch', 'أساسيات البرمجة'],
      rank: 8
    },
    {
      id: '2',
      name: 'مروان أحمد حسن',
      age: 12,
      level: 3,
      avatar_url: '/api/placeholder/200/200',
      total_points: 35,
      achievements_count: 2,
      current_streak: 3,
      bio: 'محب للألعاب ويرغب في تعلم كيفية صناعتها',
      interests: ['ألعاب الكمبيوتر', 'Scratch'],
      rank: 9
    },
    {
      id: '3',
      name: 'مالك السيد نصار',
      age: 10,
      level: 3,
      avatar_url: '/api/placeholder/200/200',
      total_points: 38,
      achievements_count: 3,
      current_streak: 4,
      bio: 'مبدع صغير ويحب حل المشكلات بالبرمجة',
      interests: ['حل المشكلات', 'البرمجة الإبداعية'],
      rank: 7
    },
    {
      id: '4',
      name: 'ردينا السيد نصار',
      age: 9,
      level: 2,
      avatar_url: '/api/placeholder/200/200',
      total_points: 25,
      achievements_count: 2,
      current_streak: 1,
      bio: 'طالبة ذكية ومتميزة في أساسيات البرمجة',
      interests: ['أساسيات البرمجة', 'الرسومات المتحركة'],
      rank: 11
    },
    {
      id: '5',
      name: 'ياسين حسن محمد',
      age: 8,
      level: 1,
      avatar_url: '/api/placeholder/200/200',
      total_points: 15,
      achievements_count: 1,
      current_streak: 2,
      bio: 'أصغر طلاب الأكاديمية ولكن موهوب جداً',
      interests: ['Scratch', 'الألعاب التعليمية'],
      rank: 15
    },
    {
      id: '6',
      name: 'مريم نافع أحمد',
      age: 11,
      level: 1,
      avatar_url: '/api/placeholder/200/200',
      total_points: 18,
      achievements_count: 1,
      current_streak: 1,
      bio: 'طالبة مجتهدة وتحب التعلم الجديد',
      interests: ['البرمجة للمبتدئين', 'التصميم'],
      rank: 14
    },
    {
      id: '7',
      name: 'خالد نافع أحمد',
      age: 10,
      level: 1,
      avatar_url: '/api/placeholder/200/200',
      total_points: 12,
      achievements_count: 1,
      current_streak: 3,
      bio: 'شاب طموح ويحب التحديات البرمجية',
      interests: ['تحديات البرمجة', 'Scratch'],
      rank: 16
    },
    {
      id: '8',
      name: 'حبيبة عصام محمد',
      age: 12,
      level: 1,
      avatar_url: '/api/placeholder/200/200',
      total_points: 20,
      achievements_count: 2,
      current_streak: 2,
      bio: 'طالبة مجتهدة وتظهر تفوقاً في الدروس',
      interests: ['أساسيات البرمجة', 'المنطق'],
      rank: 13
    },
    {
      id: '9',
      name: 'محمد عصام خالد',
      age: 0,
      level: 0,
      avatar_url: '/api/placeholder/200/200',
      total_points: 5,
      achievements_count: 0,
      current_streak: 0,
      bio: 'طالب جديد في الأكاديمية',
      interests: ['استكشاف البرمجة'],
      rank: 17
    },
    {
      id: '10',
      name: 'محمد محمود أحمد',
      age: 7,
      level: 1,
      avatar_url: '/api/placeholder/200/200',
      total_points: 8,
      achievements_count: 1,
      current_streak: 1,
      bio: 'أصغر الطلاب ولكنه يتعلم بسرعة',
      interests: ['Scratch Jr', 'الألعاب البسيطة'],
      rank: 18
    },
    {
      id: '11',
      name: 'عمر السحلي محمد',
      age: 9,
      level: 0,
      avatar_url: '/api/placeholder/200/200',
      total_points: 3,
      achievements_count: 0,
      current_streak: 0,
      bio: 'انضم حديثاً للأكاديمية ومتحمس جداً',
      interests: ['التعلم', 'الاستكشاف'],
      rank: 19
    },
    {
      id: '12',
      name: 'حمزة السحلي محمد',
      age: 8,
      level: 0,
      avatar_url: '/api/placeholder/200/200',
      total_points: 2,
      achievements_count: 0,
      current_streak: 0,
      bio: 'طالب صغير ويحب التعلم التفاعلي',
      interests: ['الألعاب التعليمية', 'الروبوتات'],
      rank: 20
    },
    {
      id: '13',
      name: 'سليم أحمد عباس الفولي',
      age: 6,
      level: 1,
      avatar_url: '/api/placeholder/200/200',
      total_points: 24,
      achievements_count: 2,
      current_streak: 1,
      bio: 'طالب صغير وموهوب جداً في البرمجة وأصغر أعضاء الأكاديمية نشاطاً',
      interests: ['Scratch Jr', 'الألعاب التعليمية', 'البرمجة للأطفال'],
      rank: 17
    }
  ];

  const students = realStudents.slice(0, maxDisplay);

  const getLevelColor = (level: number) => {
    if (level >= 8) return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
    if (level >= 6) return 'bg-gradient-to-r from-purple-400 to-pink-500 text-white';
    if (level >= 4) return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white';
    return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
  };

  const getLevelIcon = (level: number) => {
    if (level >= 8) return <Trophy className="h-4 w-4" />;
    if (level >= 6) return <Star className="h-4 w-4" />;
    if (level >= 4) return <Award className="h-4 w-4" />;
    return <GraduationCap className="h-4 w-4" />;
  };

  const handleStudentClick = (studentId: string) => {
    navigate(`/student-profile/${studentId}`);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gradient-fun mb-4">
            {title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {students.map((student, index) => (
            <Card
              key={student.id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white hover:scale-105"
              onClick={() => handleStudentClick(student.id)}
            >
              <CardContent className="p-6">
                <div className="relative mb-4">
                  <div className="absolute -top-2 -right-2">
                    <Badge className={`text-white ${getLevelColor(student.level)} flex items-center gap-1`}>
                      {getLevelIcon(student.level)}
                      المستوى {student.level}
                    </Badge>
                  </div>
                  <Avatar className="h-20 w-20 mx-auto mb-3 border-4 border-white shadow-lg">
                    <AvatarImage src={student.avatar_url} />
                    <AvatarFallback className="text-xl bg-gradient-to-br from-primary to-secondary text-white">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors">
                      {student.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{student.age} سنة</p>
                    <Badge variant="secondary" className="mt-2">
                      الترتيب #{student.rank}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center line-clamp-2">
                    {student.bio}
                  </p>

                  <div className="flex flex-wrap gap-1 justify-center">
                    {student.interests.slice(0, 2).map((interest, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                    {student.interests.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{student.interests.length - 2}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-yellow-50 rounded-lg p-2">
                      <Target className="h-4 w-4 mx-auto mb-1 text-yellow-600" />
                      <div className="text-xs font-bold text-yellow-800">{student.total_points}</div>
                      <div className="text-xs text-yellow-600">نقطة</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2">
                      <Trophy className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                      <div className="text-xs font-bold text-purple-800">{student.achievements_count}</div>
                      <div className="text-xs text-purple-600">إنجاز</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-2">
                      <Star className="h-4 w-4 mx-auto mb-1 text-orange-600" />
                      <div className="text-xs font-bold text-orange-800">{student.current_streak}</div>
                      <div className="text-xs text-orange-600">سلسلة</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center pt-2">
                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                      عرض الملف الشخصي
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {showViewAll && (
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="group"
              onClick={() => navigate('/dashboard')}
            >
              <Users className="h-5 w-5 ml-2" />
              عرض جميع الطلاب
              <ArrowRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudentShowcase;