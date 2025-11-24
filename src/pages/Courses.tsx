import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import CourseCard from '@/components/CourseCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Filter,
  Grid,
  List,
  Users,
  Calendar,
  Star,
  BookOpen,
  Loader2
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
  instructor_id: string;
  current_students: number;
  max_students: number;
  rating?: number;
  start_date?: string;
  end_date?: string;
  tags?: string[];
  is_featured: boolean;
  created_at: string;
}

const Courses: React.FC = () => {
  const { user, profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Mock data for development
  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'أساسيات البرمجة للأطفال',
      description: 'دورة ممتعة ومبسطة لتعليم أساسيات البرمجة للأطفال باستخدام Scratch وبيئات تفاعلية مناسبة للأعمار الصغيرة.',
      category: 'programming_basics',
      age_group: '6-8',
      skill_level: 'beginner',
      duration_weeks: 8,
      price: 299,
      currency: 'SAR',
      thumbnail_url: '/api/placeholder/400/250',
      instructor_id: '1',
      current_students: 12,
      max_students: 20,
      rating: 4.8,
      start_date: '2024-02-01',
      tags: ['Scratch', 'مبتدئ', 'أطفال', 'ممتع'],
      is_featured: true,
      created_at: '2024-01-01'
    },
    {
      id: '2',
      title: 'تطوير الألعاب بـ JavaScript',
      description: 'تعلم كيفية إنشاء ألعاب تفاعلية باستخدام JavaScript وHTML5 Canvas. دورة متقدمة للمراهقين المهتمين بتطوير الألعاب.',
      category: 'game_development',
      age_group: '12-14',
      skill_level: 'intermediate',
      duration_weeks: 12,
      price: 599,
      currency: 'SAR',
      thumbnail_url: '/api/placeholder/400/250',
      instructor_id: '2',
      current_students: 8,
      max_students: 15,
      rating: 4.9,
      start_date: '2024-02-15',
      tags: ['JavaScript', 'HTML5', 'ألعاب', 'متوسط'],
      is_featured: true,
      created_at: '2024-01-01'
    },
    {
      id: '3',
      title: 'تصميم مواقع الويب الحديثة',
      description: 'تعلم تصميم وتطوير مواقع الويب الحديثة باستخدام HTML5, CSS3, وJavaScript. دورة شاملة للمبتدئين.',
      category: 'web_development',
      age_group: '15-18',
      skill_level: 'beginner',
      duration_weeks: 10,
      price: 449,
      currency: 'SAR',
      thumbnail_url: '/api/placeholder/400/250',
      instructor_id: '1',
      current_students: 15,
      max_students: 25,
      rating: 4.7,
      start_date: '2024-03-01',
      tags: ['HTML', 'CSS', 'JavaScript', 'مبتدئ'],
      is_featured: false,
      created_at: '2024-01-01'
    },
    {
      id: '4',
      title: 'البرمجة الإبداعية',
      description: 'دورة إبداعية تجمع بين الفن والبرمجة. تعلم كيفية إنشاء رسوم متحركة ومؤثرات بصرية باستخدام البرمجة.',
      category: 'creative_coding',
      age_group: '9-11',
      skill_level: 'beginner',
      duration_weeks: 6,
      price: 349,
      currency: 'SAR',
      thumbnail_url: '/api/placeholder/400/250',
      instructor_id: '3',
      current_students: 18,
      max_students: 20,
      rating: 4.6,
      start_date: '2024-02-20',
      tags: ['إبداع', 'رسوم متحركة', 'فن', 'مبتدئ'],
      is_featured: false,
      created_at: '2024-01-01'
    }
  ];

  const categories = [
    { value: 'all', label: 'جميع الفئات' },
    { value: 'programming_basics', label: 'أساسيات البرمجة' },
    { value: 'game_development', label: 'تطوير الألعاب' },
    { value: 'web_development', label: 'تطوير الويب' },
    { value: 'app_development', label: 'تطوير التطبيقات' },
    { value: 'robotics', label: 'الروبوتات' },
    { value: 'ai_ml', label: 'الذكاء الاصطناعي' },
    { value: 'creative_coding', label: 'البرمجة الإبداعية' }
  ];

  const ageGroups = [
    { value: 'all', label: 'جميع الأعمار' },
    { value: '6-8', label: '6-8 سنوات' },
    { value: '9-11', label: '9-11 سنة' },
    { value: '12-14', label: '12-14 سنة' },
    { value: '15-18', label: '15-18 سنة' }
  ];

  const skillLevels = [
    { value: 'all', label: 'جميع المستويات' },
    { value: 'beginner', label: 'مبتدئ' },
    { value: 'intermediate', label: 'متوسط' },
    { value: 'advanced', label: 'متقدم' },
    { value: 'expert', label: 'خبير' }
  ];

  useEffect(() => {
    loadCourses();
    if (user) {
      loadEnrolledCourses();
    }
  }, [user]);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedCategory, selectedAgeGroup, selectedSkillLevel, sortBy]);

  const loadCourses = async () => {
    try {
      setLoading(true);

      // Simulate API call with mock data
      setTimeout(() => {
        setCourses(mockCourses);
        setLoading(false);
      }, 1000);

      // In real implementation:
      /*
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:profiles!courses_instructor_id_fkey(
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'published')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
      */
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('حدث خطأ في تحميل الدورات');
      setLoading(false);
    }
  };

  const loadEnrolledCourses = async () => {
    try {
      // Simulate loading enrolled courses
      const enrolled = ['1']; // Mock enrolled course IDs

      // In real implementation:
      /*
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('course_id')
        .eq('student_id', user?.id)
        .eq('status', 'active');

      if (error) throw error;
      const enrolled = data?.map(enrollment => enrollment.course_id) || [];
      */

      setEnrolledCourses(new Set(enrolled));
    } catch (error) {
      console.error('Error loading enrolled courses:', error);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Age group filter
    if (selectedAgeGroup !== 'all') {
      filtered = filtered.filter(course => course.age_group === selectedAgeGroup);
    }

    // Skill level filter
    if (selectedSkillLevel !== 'all') {
      filtered = filtered.filter(course => course.skill_level === selectedSkillLevel);
    }

    // Sort
    switch (sortBy) {
      case 'featured':
        filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    setFilteredCourses(filtered);
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    try {
      const course = courses.find(c => c.id === courseId);
      if (!course) return;

      // Check if already enrolled
      if (enrolledCourses.has(courseId)) {
        toast.error('أنت مسجل بالفعل في هذه الدورة');
        return;
      }

      // Check if course is full
      if (course.current_students >= course.max_students) {
        toast.error('الدورة ممتلئة حالياً');
        return;
      }

      // Simulate enrollment
      setEnrolledCourses(prev => new Set([...prev, courseId]));

      // Update course student count
      setCourses(prev => prev.map(c =>
        c.id === courseId
          ? { ...c, current_students: c.current_students + 1 }
          : c
      ));

      toast.success('تم تسجيلك في الدورة بنجاح!');

      // In real implementation:
      /*
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          course_id: courseId,
          student_id: user.id,
          enrolled_by: profile?.role === 'guardian' ? profile.id : user.id,
          status: 'active',
          progress_percentage: 0,
          payment_status: 'pending'
        });

      if (error) throw error;

      // Update course student count
      await supabase.rpc('increment_course_students', { p_course_id: courseId });
      */

    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('حدث خطأ أثناء التسجيل في الدورة');

      // Rollback UI changes
      setEnrolledCourses(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  const enhancedCourses = filteredCourses.map(course => ({
    ...course,
    is_enrolled: enrolledCourses.has(course.id),
    instructor: mockCourses.find(c => c.id === course.id)?.instructor_id === '1'
      ? { id: '1', full_name: 'أحمد محمد', specialization: ['programming_basics', 'web_development'] }
      : mockCourses.find(c => c.id === course.id)?.instructor_id === '2'
      ? { id: '2', full_name: 'فاطمة العلي', specialization: ['game_development', 'creative_coding'] }
      : { id: '3', full_name: 'خالد أحمد', specialization: ['creative_coding', 'robotics'] }
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
        <div className="container mx-auto">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">جاري تحميل الدورات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient-fun mb-2">
            دوراتنا التعليمية
          </h1>
          <p className="text-xl text-muted-foreground">
            اكتشف دوراتنا المصممة خصيصاً لتعليم البرمجة للأطفال والشباب
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن دورة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
              <SelectTrigger>
                <SelectValue placeholder="الفئة العمرية" />
              </SelectTrigger>
              <SelectContent>
                {ageGroups.map(age => (
                  <SelectItem key={age.value} value={age.value}>
                    {age.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSkillLevel} onValueChange={setSelectedSkillLevel}>
              <SelectTrigger>
                <SelectValue placeholder="المستوى" />
              </SelectTrigger>
              <SelectContent>
                {skillLevels.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">المميزة</SelectItem>
                <SelectItem value="rating">التقييم</SelectItem>
                <SelectItem value="price_low">السعر (الأقل)</SelectItem>
                <SelectItem value="price_high">السعر (الأعلى)</SelectItem>
                <SelectItem value="newest">الأحدث</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{filteredCourses.length}</div>
              <div className="text-sm text-muted-foreground">دورة متاحة</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">
                {filteredCourses.reduce((sum, c) => sum + c.current_students, 0)}
              </div>
              <div className="text-sm text-muted-foreground">طالب مسجل</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold">
                {filteredCourses.filter(c => c.is_featured).length}
              </div>
              <div className="text-sm text-muted-foreground">دورة مميزة</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">
                {filteredCourses.filter(c => c.start_date && new Date(c.start_date) > new Date()).length}
              </div>
              <div className="text-sm text-muted-foreground">دورة قادمة</div>
            </CardContent>
          </Card>
        </div>

        {/* Courses */}
        {enhancedCourses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">لا توجد دورات متاحة</h3>
              <p className="text-muted-foreground mb-4">
                جرب تعديل معايير البحث للعثور على دورات تناسب اهتماماتك
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedAgeGroup('all');
                setSelectedSkillLevel('all');
              }}>
                إعادة تعيين الفلاتر
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
          }>
            {enhancedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={handleEnroll}
                showEnrollButton={user?.role === 'child'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;