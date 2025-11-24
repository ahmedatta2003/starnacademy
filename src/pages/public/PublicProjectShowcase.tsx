import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Code,
  Gamepad2,
  Globe,
  Smartphone,
  Film,
  Lightbulb,
  Star,
  Calendar,
  User,
  ExternalLink,
  Share2,
  Heart,
  Eye,
  MessageSquare,
  Target,
  Clock
} from 'lucide-react';

interface PublicProjectData {
  id: string;
  title: string;
  description: string;
  project_url?: string;
  demo_url?: string;
  project_type: 'game' | 'website' | 'app' | 'animation' | 'other';
  screenshot?: string;
  completion_date: string;
  technologies: string[];
  instructor_rating: number;
  instructor_feedback?: string;
  public: boolean;
  views: number;
  likes: number;
}

interface StudentInfo {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  age?: number;
}

interface InstructorInfo {
  id: string;
  name: string;
  avatar?: string;
  specialization?: string[];
}

const PublicProjectShowcase: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [projectData, setProjectData] = useState<PublicProjectData | null>(null);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [instructorInfo, setInstructorInfo] = useState<InstructorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  // Mock data for development - replace with actual API calls
  const mockProjectData: PublicProjectData = {
    id: projectId || '1',
    title: 'مغامرة الفضاء التعليمية',
    description: 'لعبة تعليمية ممتعة ومبتكرة مصممة لتعليم الأطفال عن الفضاء الخارجي والكواكب والنجوم. اللعبة تحتوي على مستويات متعددة، شخصيات كرتونية جذابة، وأنشطة تفاعلية تعزز التعلم بطريقة ممتعة. تم تطوير اللعبة باستخدام أحدث تقنيات تطوير الألعاب لتجربة سلسة وممتعة.',
    project_url: 'https://example.com/space-adventure',
    demo_url: 'https://demo.example.com/space-adventure',
    project_type: 'game',
    screenshot: '/api/placeholder/800/450',
    completion_date: '2024-01-15',
    technologies: ['JavaScript', 'HTML5 Canvas', 'Phaser.js', 'Web Audio API', 'CSS3'],
    instructor_rating: 5,
    instructor_feedback: 'مشروع استثنائي! الإبداع والجودة في التنفيذ يظهران بوضوح. اللعبة تعليمية وتفاعلية في نفس الوقت، وهو ما يجعلها مثالية للفئة العمرية المستهدفة. الطالب أظهر مهارات متقدمة في تطوير الألعاب وحل المشكلات.',
    public: true,
    views: 1250,
    likes: 89
  };

  const mockStudentInfo: StudentInfo = {
    id: '1',
    name: 'أحمد محمد السعيد',
    avatar: '/api/placeholder/60/60',
    level: 7,
    age: 12
  };

  const mockInstructorInfo: InstructorInfo = {
    id: '1',
    name: 'أستاد خالد العلي',
    avatar: '/api/placeholder/60/60',
    specialization: ['تطوير الألعاب', 'JavaScript', 'الرسومات']
  };

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      setTimeout(() => {
        setProjectData(mockProjectData);
        setStudentInfo(mockStudentInfo);
        setInstructorInfo(mockInstructorInfo);
        setLoading(false);
      }, 1000);

      // In real implementation, this would be:
      /*
      const { data: project } = await supabase
        .from('student_projects')
        .select(`
          *,
          student:profiles!student_projects_student_id_fkey(full_name, avatar_url, role),
          instructor:profiles!student_projects_instructor_id_fkey(full_name, avatar_url, trainers)
        `)
        .eq('id', projectId)
        .eq('shared_publicly', true)
        .single();

      if (!project) {
        setError('المشروع غير متاح للعامة');
        return;
      }
      */

    } catch (error) {
      console.error('Error loading project data:', error);
      setError('حدث خطأ في تحميل بيانات المشروع');
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

  const getProjectTypeName = (type: string) => {
    const nameMap = {
      game: 'لعبة',
      website: 'موقع ويب',
      app: 'تطبيق موبايل',
      animation: 'رسوم متحركة',
      other: 'مشروع آخر'
    };
    return nameMap[type as keyof typeof nameMap] || 'مشروع';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = () => {
    setLiked(!liked);
    // In real implementation, this would update the likes count in the database
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: projectData?.title,
        text: `شاهد مشروع ${projectData?.title} في أكاديمية ستارن`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification here
    }
  };

  const handleViewDemo = () => {
    if (projectData?.demo_url) {
      window.open(projectData.demo_url, '_blank');
    }
  };

  const handleViewProject = () => {
    if (projectData?.project_url) {
      window.open(projectData.project_url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل المشروع...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !projectData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <Code className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">المشروع غير متاح</h2>
              <p className="text-muted-foreground">
                {error || 'عذراً، هذا المشروع غير متاح للعامة'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {React.createElement(getProjectTypeIcon(projectData.project_type), {
                  className: "h-6 w-6 text-primary"
                })}
                <Badge variant="secondary" className="gap-2">
                  {getProjectTypeName(projectData.project_type)}
                </Badge>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= projectData.instructor_rating
                          ? 'text-yellow-500 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{projectData.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(projectData.completion_date)}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {projectData.views} مشاهدة
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {projectData.likes + (liked ? 1 : 0)} إعجاب
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={liked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                className="gap-2"
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                إعجاب
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="h-4 w-4" />
                مشاركة
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center lg:justify-start">
            {projectData.demo_url && (
              <Button size="lg" onClick={handleViewDemo} className="gap-2">
                <Target className="h-4 w-4" />
                معاينة المشروع
              </Button>
            )}
            {projectData.project_url && (
              <Button variant="outline" size="lg" onClick={handleViewProject} className="gap-2">
                <ExternalLink className="h-4 w-4" />
                زيارة المشروع
              </Button>
            )}
          </div>
        </div>

        {/* Project Screenshot */}
        {projectData.screenshot && (
          <Card className="mb-8 overflow-hidden">
            <div className="aspect-video bg-gray-100">
              <img
                src={projectData.screenshot}
                alt={projectData.title}
                className="w-full h-full object-cover"
              />
            </div>
          </Card>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  وصف المشروع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {projectData.description}
                </p>
              </CardContent>
            </Card>

            {/* Technologies Used */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  التقنيات المستخدمة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {projectData.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructor Feedback */}
            {projectData.instructor_feedback && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    ملاحظات المدرب
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 leading-relaxed">
                      {projectData.instructor_feedback}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Student Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  معلومات الطالب
                </CardTitle>
              </CardHeader>
              <CardContent>
                {studentInfo && (
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={studentInfo.avatar} />
                      <AvatarFallback>
                        {studentInfo.name?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{studentInfo.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        مستوى {studentInfo.level}
                        {studentInfo.age && ` • عمر ${studentInfo.age}`}
                      </p>
                    </div>
                  </div>
                )}
                <Button variant="outline" className="w-full">
                  عرض الملف الشخصي
                </Button>
              </CardContent>
            </Card>

            {/* Instructor Info */}
            {instructorInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    المدرب المشرف
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={instructorInfo.avatar} />
                      <AvatarFallback>
                        {instructorInfo.name?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{instructorInfo.name}</h3>
                      {instructorInfo.specialization && (
                        <p className="text-sm text-muted-foreground">
                          {instructorInfo.specialization.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    التواصل مع المدرب
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Project Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  إحصائيات المشروع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">المشاهدات</span>
                    <span className="font-medium">{projectData.views}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">الإعجابات</span>
                    <span className="font-medium">{projectData.likes + (liked ? 1 : 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">التقييم</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= projectData.instructor_rating
                              ? 'text-yellow-500 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProjectShowcase;