import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Autoplay from 'embla-carousel-autoplay';
import { Star, Trophy, GraduationCap, Users, Award, Target } from 'lucide-react';

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
  featuredCount?: number;
}

// Avatars are intentionally empty so photos can be uploaded later per student.
const realStudents: Student[] = [
  { id: '1', name: 'أياد محمود أحمد', age: 11, level: 3, total_points: 40, achievements_count: 3, current_streak: 2, bio: 'طالب نشط ومهتم بتعلم أساسيات البرمجة', interests: ['Scratch', 'أساسيات البرمجة'], rank: 8 },
  { id: '2', name: 'مروان أحمد حسن', age: 12, level: 3, total_points: 35, achievements_count: 2, current_streak: 3, bio: 'محب للألعاب ويرغب في تعلم كيفية صناعتها', interests: ['ألعاب الكمبيوتر', 'Scratch'], rank: 9 },
  { id: '3', name: 'مالك السيد نصار', age: 10, level: 3, total_points: 38, achievements_count: 3, current_streak: 4, bio: 'مبدع صغير ويحب حل المشكلات بالبرمجة', interests: ['حل المشكلات', 'البرمجة الإبداعية'], rank: 7 },
  { id: '4', name: 'ردينا السيد نصار', age: 9, level: 2, total_points: 25, achievements_count: 2, current_streak: 1, bio: 'طالبة ذكية ومتميزة في أساسيات البرمجة', interests: ['أساسيات البرمجة', 'الرسومات المتحركة'], rank: 11 },
  { id: '5', name: 'ياسين حسن محمد', age: 8, level: 1, total_points: 15, achievements_count: 1, current_streak: 2, bio: 'أصغر طلاب الأكاديمية ولكن موهوب جداً', interests: ['Scratch', 'الألعاب التعليمية'], rank: 15 },
  { id: '6', name: 'مريم نافع أحمد', age: 11, level: 1, total_points: 18, achievements_count: 1, current_streak: 1, bio: 'طالبة مجتهدة وتحب التعلم الجديد', interests: ['البرمجة للمبتدئين', 'التصميم'], rank: 14 },
  { id: '7', name: 'خالد نافع أحمد', age: 10, level: 1, total_points: 12, achievements_count: 1, current_streak: 3, bio: 'شاب طموح ويحب التحديات البرمجية', interests: ['تحديات البرمجة', 'Scratch'], rank: 16 },
  { id: '8', name: 'حبيبة عصام محمد', age: 12, level: 1, total_points: 20, achievements_count: 2, current_streak: 2, bio: 'طالبة مجتهدة وتظهر تفوقاً في الدروس', interests: ['أساسيات البرمجة', 'المنطق'], rank: 13 },
  { id: '9', name: 'محمد عصام خالد', age: 0, level: 0, total_points: 5, achievements_count: 0, current_streak: 0, bio: 'طالب جديد في الأكاديمية', interests: ['استكشاف البرمجة'], rank: 17 },
  { id: '10', name: 'محمد محمود أحمد', age: 7, level: 1, total_points: 8, achievements_count: 1, current_streak: 1, bio: 'أصغر الطلاب ولكنه يتعلم بسرعة', interests: ['Scratch Jr', 'الألعاب البسيطة'], rank: 18 },
  { id: '11', name: 'عمر السحلي محمد', age: 9, level: 0, total_points: 3, achievements_count: 0, current_streak: 0, bio: 'انضم حديثاً للأكاديمية ومتحمس جداً', interests: ['التعلم', 'الاستكشاف'], rank: 19 },
  { id: '12', name: 'حمزة السحلي محمد', age: 8, level: 0, total_points: 2, achievements_count: 0, current_streak: 0, bio: 'طالب صغير ويحب التعلم التفاعلي', interests: ['الألعاب التعليمية', 'الروبوتات'], rank: 20 },
  { id: '13', name: 'سليم أحمد عباس الفولي', age: 6, level: 1, total_points: 24, achievements_count: 2, current_streak: 1, bio: 'طالب صغير وموهوب جداً في البرمجة', interests: ['Scratch Jr', 'الألعاب التعليمية'], rank: 17 },
];

const getLevelColor = (level: number) => {
  if (level >= 8) return 'bg-golden text-primary';
  if (level >= 6) return 'bg-purple text-white';
  if (level >= 4) return 'bg-turquoise text-primary';
  return 'bg-primary text-primary-foreground';
};

const getLevelIcon = (level: number) => {
  if (level >= 8) return <Trophy className="h-3.5 w-3.5" />;
  if (level >= 6) return <Star className="h-3.5 w-3.5" />;
  if (level >= 4) return <Award className="h-3.5 w-3.5" />;
  return <GraduationCap className="h-3.5 w-3.5" />;
};

const StudentCard = ({
  student,
  onClick,
}: {
  student: Student;
  onClick: () => void;
}) => (
  <Card
    className="group h-full cursor-pointer border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    onClick={onClick}
  >
    <CardContent className="p-6 text-center">
      <div className="relative mx-auto mb-4 w-fit">
        <Avatar className="h-24 w-24 border-4 border-background shadow-md ring-2 ring-primary/15">
          {student.avatar_url ? <AvatarImage src={student.avatar_url} alt={student.name} /> : null}
          <AvatarFallback className="bg-muted text-2xl font-bold text-muted-foreground">
            {student.name.trim().charAt(0)}
          </AvatarFallback>
        </Avatar>
        <Badge className={`absolute -bottom-2 start-1/2 -translate-x-1/2 flex items-center gap-1 ${getLevelColor(student.level)}`}>
          {getLevelIcon(student.level)}
          المستوى {student.level}
        </Badge>
      </div>

      <h3 className="mt-4 text-base font-bold text-foreground transition-colors group-hover:text-primary">
        {student.name}
      </h3>
      {student.age > 0 && (
        <p className="text-sm text-muted-foreground">{student.age} سنة</p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/60 pt-4 text-center">
        <div>
          <Target className="mx-auto mb-1 h-4 w-4 text-primary" />
          <div className="text-sm font-bold">{student.total_points}</div>
          <div className="text-[11px] text-muted-foreground">نقطة</div>
        </div>
        <div>
          <Trophy className="mx-auto mb-1 h-4 w-4 text-purple" />
          <div className="text-sm font-bold">{student.achievements_count}</div>
          <div className="text-[11px] text-muted-foreground">إنجاز</div>
        </div>
        <div>
          <Star className="mx-auto mb-1 h-4 w-4 text-golden" />
          <div className="text-sm font-bold">{student.current_streak}</div>
          <div className="text-[11px] text-muted-foreground">سلسلة</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const StudentShowcase: React.FC<StudentShowcaseProps> = ({
  title = 'نجوم الأكاديمية',
  subtitle = 'تعرف على أبرز طلابنا وإنجازاتهم المذهلة في عالم البرمجة',
  featuredCount = 4,
}) => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const featured = realStudents.slice(0, featuredCount);
  const distinguished = realStudents.slice(featuredCount, featuredCount + 8);
  const open = (id: string) => navigate(`/student-profile/${id}`);

  const renderCarousel = (students: Student[], delay: number) => (
    <Carousel
      opts={{ align: 'start', loop: true, direction: 'rtl' }}
      plugins={[Autoplay({ delay, stopOnInteraction: false, stopOnMouseEnter: true })]}
      className="mx-auto w-full max-w-6xl"
      dir="rtl"
    >
      <CarouselContent className="-ml-4">
        {students.map((student) => (
          <CarouselItem key={student.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
            <StudentCard student={student} onClick={() => open(student.id)} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );

  return (
    <section id="students" className="py-20 bg-gradient-to-b from-background to-secondary/40">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold text-gradient-fun">{title}</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
        </div>

        {renderCarousel(featured, 2500)}

        <div className="mb-12 mt-20 text-center">
          <h2 className="mb-3 text-4xl font-bold text-gradient-fun">طلابنا المميزون</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            نماذج مشرفة من طلابنا الذين واصلوا التقدم وحققوا إنجازات متميزة
          </p>
        </div>

        {renderCarousel(distinguished, 3200)}

        <div className="mt-12 text-center">
          <Button size="lg" onClick={() => setShowAll(true)}>
            <Users className="ms-2 h-5 w-5" />
            عرض جميع الطلاب
          </Button>
        </div>
      </div>


      <Dialog open={showAll} onOpenChange={setShowAll}>
        <DialogContent dir="rtl" className="max-h-[85vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">جميع طلاب الأكاديمية</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {realStudents.map((student) => (
              <StudentCard key={student.id} student={student} onClick={() => open(student.id)} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default StudentShowcase;
