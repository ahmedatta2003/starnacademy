import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Clock,
  Users,
  Star,
  Calendar,
  DollarSign,
  Play,
  BookOpen,
  Award,
  Check,
  Loader2
} from 'lucide-react';

interface CourseCardProps {
  course: {
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
    instructor?: {
      id: string;
      full_name: string;
      avatar_url?: string;
      specialization?: string[];
    };
    current_students: number;
    max_students: number;
    rating?: number;
    start_date?: string;
    end_date?: string;
    tags?: string[];
    is_enrolled?: boolean;
    enrollment_status?: string;
    progress_percentage?: number;
  };
  onEnroll?: (courseId: string) => Promise<void>;
  showEnrollButton?: boolean;
  className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEnroll,
  showEnrollButton = true,
  className
}) => {
  const [enrolling, setEnrolling] = useState(false);

  const getAgeGroupLabel = (ageGroup: string) => {
    const ageMap: Record<string, string> = {
      '6-8': '6-8 سنوات',
      '9-11': '9-11 سنة',
      '12-14': '12-14 سنة',
      '15-18': '15-18 سنة'
    };
    return ageMap[ageGroup] || ageGroup;
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      'programming_basics': 'أساسيات البرمجة',
      'game_development': 'تطوير الألعاب',
      'web_development': 'تطوير الويب',
      'app_development': 'تطوير التطبيقات',
      'robotics': 'الروبوتات',
      'ai_ml': 'الذكاء الاصطناعي',
      'creative_coding': 'البرمجة الإبداعية'
    };
    return categoryMap[category] || category;
  };

  const getSkillLevelLabel = (level: string) => {
    const levelMap: Record<string, string> = {
      'beginner': 'مبتدئ',
      'intermediate': 'متوسط',
      'advanced': 'متقدم',
      'expert': 'خبير'
    };
    return levelMap[level] || level;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'programming_basics': 'bg-blue-100 text-blue-800',
      'game_development': 'bg-purple-100 text-purple-800',
      'web_development': 'bg-green-100 text-green-800',
      'app_development': 'bg-orange-100 text-orange-800',
      'robotics': 'bg-red-100 text-red-800',
      'ai_ml': 'bg-pink-100 text-pink-800',
      'creative_coding': 'bg-yellow-100 text-yellow-800'
    };
    return colorMap[category] || 'bg-gray-100 text-gray-800';
  };

  const getSkillLevelColor = (level: string) => {
    const colorMap: Record<string, string> = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-orange-100 text-orange-800',
      'expert': 'bg-red-100 text-red-800'
    };
    return colorMap[level] || 'bg-gray-100 text-gray-800';
  };

  const handleEnroll = async () => {
    if (onEnroll) {
      setEnrolling(true);
      try {
        await onEnroll(course.id);
      } finally {
        setEnrolling(false);
      }
    }
  };

  const enrollmentProgress = (course.current_students / course.max_students) * 100;

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getCategoryColor(course.category)}>
                {getCategoryLabel(course.category)}
              </Badge>
              <Badge variant="outline" className={getSkillLevelColor(course.skill_level)}>
                {getSkillLevelLabel(course.skill_level)}
              </Badge>
              {course.is_enrolled && (
                <Badge variant="default" className="gap-1">
                  <Check className="h-3 w-3" />
                  مسجل
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
            <CardDescription className="line-clamp-2">{course.description}</CardDescription>
          </div>

          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Instructor Info */}
        {course.instructor && (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={course.instructor.avatar_url} />
              <AvatarFallback>
                {course.instructor.full_name?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{course.instructor.full_name}</p>
              <p className="text-xs text-muted-foreground">
                {course.instructor.specialization?.[0] && getCategoryLabel(course.instructor.specialization[0])}
              </p>
            </div>
          </div>
        )}

        {/* Course Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{getAgeGroupLabel(course.age_group)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{course.duration_weeks} أسبوع</span>
          </div>
          {course.start_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(course.start_date).toLocaleDateString('ar-SA')}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{course.price} {course.currency}</span>
          </div>
        </div>

        {/* Rating */}
        {course.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.floor(course.rating)
                      ? 'text-yellow-500 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {course.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Enrollment Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>المسجلون</span>
            <span className="font-medium">
              {course.current_students} / {course.max_students}
            </span>
          </div>
          <Progress value={enrollmentProgress} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {Math.round(enrollmentProgress)}% ممتلئ
          </div>
        </div>

        {/* Student Progress (if enrolled) */}
        {course.is_enrolled && course.progress_percentage !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>تقدمك</span>
              <span className="font-medium">{course.progress_percentage}%</span>
            </div>
            <Progress value={course.progress_percentage} className="h-2" />
          </div>
        )}

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {course.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {course.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{course.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {course.is_enrolled ? (
            <>
              <Button variant="outline" className="flex-1" asChild>
                <Link to={`/dashboard/courses/${course.id}`}>
                  <Play className="h-4 w-4 ml-2" />
                  متابعة الدورة
                </Link>
              </Button>
              {course.enrollment_status === 'active' && (
                <Button variant="default" className="flex-1">
                  <Award className="h-4 w-4 ml-2" />
                  الشهادة
                </Button>
              )}
            </>
          ) : (
            showEnrollButton && (
              <Button
                onClick={handleEnroll}
                disabled={enrolling || enrollmentProgress >= 100}
                className="w-full"
              >
                {enrolling ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري التسجيل...
                  </>
                ) : enrollmentProgress >= 100 ? (
                  'الدورة ممتلئة'
                ) : (
                  'سجل الآن'
                )}
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;