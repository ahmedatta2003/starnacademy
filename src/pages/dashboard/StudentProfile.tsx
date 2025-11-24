import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import StudentLevelBadge from "@/components/StudentLevelBadge";
import StarsCounter from "@/components/StarsCounter";
import ProjectCard from "@/components/ProjectCard";
import {
  User,
  Calendar,
  Award,
  Star,
  TrendingUp,
  BookOpen,
  Code,
  Gamepad2,
  Globe,
  Smartphone,
  Film,
  Lightbulb,
  MessageSquare,
  Target,
  Clock,
  Filter,
  Grid,
  List
} from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type StudentCourse = Database["public"]["Tables"]["student_courses"]["Row"];
type StudentAchievement = Database["public"]["Tables"]["student_achievements"]["Row"];
type StudentProject = Database["public"]["Tables"]["student_projects"]["Row"];
type StudentFeedback = Database["public"]["Tables"]["student_feedback"]["Row"];

const StudentProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<any>(null);
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [achievements, setAchievements] = useState<StudentAchievement[]>([]);
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [feedback, setFeedback] = useState<StudentFeedback[]>([]);
  const [currentLevel, setCurrentLevel] = useState(5);
  const [starsCount, setStarsCount] = useState(0);
  const [previousStarsCount, setPreviousStarsCount] = useState(0);

  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    course_id: '',
    rating: 5,
    written_feedback: '',
    would_recommend: true
  });

  // Filter states
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      loadStudentData();
    }
  }, [user]);

  const loadStudentData = async () => {
    try {
      setLoading(true);

      // Load student profile data
      const { data: profile } = await supabase
        .from("profiles")
        .select("*, children(*)")
        .eq("id", user?.id)
        .single();

      if (profile) {
        setStudentData(profile);
      }

      // Load courses data
      const { data: coursesData } = await supabase
        .from("student_courses")
        .select("*")
        .eq("student_id", user?.id)
        .order("created_at", { ascending: false });

      if (coursesData) {
        setCourses(coursesData);
      }

      // Load achievements data
      const { data: achievementsData } = await supabase
        .from("student_achievements")
        .select("*")
        .eq("student_id", user?.id)
        .eq("achievement_type", "star")
        .order("earned_date", { ascending: false });

      if (achievementsData) {
        setAchievements(achievementsData);

        // Calculate stars from last 4 months
        const fourMonthsAgo = new Date();
        fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

        const recentStars = achievementsData
          .filter(a => new Date(a.earned_date) >= fourMonthsAgo)
          .reduce((sum, a) => sum + a.points, 0);

        setStarsCount(recentStars);

        // Previous period for comparison
        const eightMonthsAgo = new Date();
        eightMonthsAgo.setMonth(eightMonthsAgo.getMonth() - 8);

        const previousStars = achievementsData
          .filter(a => {
            const date = new Date(a.earned_date);
            return date >= eightMonthsAgo && date < fourMonthsAgo;
          })
          .reduce((sum, a) => sum + a.points, 0);

        setPreviousStarsCount(previousStars);
      }

      // Load projects data
      const { data: projectsData } = await supabase
        .from("student_projects")
        .select("*")
        .eq("student_id", user?.id)
        .order("created_at", { ascending: false });

      if (projectsData) {
        setProjects(projectsData);
      }

      // Load feedback data
      const { data: feedbackData } = await supabase
        .from("student_feedback")
        .select("*")
        .eq("student_id", user?.id)
        .order("created_at", { ascending: false });

      if (feedbackData) {
        setFeedback(feedbackData);
      }

      // Calculate student level based on completed courses and achievements
      calculateStudentLevel(coursesData || [], achievementsData || []);

    } catch (error) {
      console.error("Error loading student data:", error);
      toast.error("حدث خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const calculateStudentLevel = (coursesData: StudentCourse[], achievementsData: StudentAchievement[]) => {
    const completedCourses = coursesData.filter(c => c.status === 'completed').length;
    const totalStars = achievementsData.reduce((sum, a) => sum + a.points, 0);

    // Level calculation logic (1-10 scale)
    let level = 1;

    // Based on completed courses
    level += Math.floor(completedCourses / 2);

    // Based on stars
    level += Math.floor(totalStars / 10);

    // Cap at level 10
    level = Math.min(level, 10);

    setCurrentLevel(level);
  };

  const handleSubmitFeedback = async () => {
    try {
      if (!feedbackForm.course_id) {
        toast.error("يرجى اختيار الدورة");
        return;
      }

      const { error } = await supabase
        .from("student_feedback")
        .insert({
          student_id: user?.id,
          course_id: feedbackForm.course_id,
          instructor_id: courses.find(c => c.id === feedbackForm.course_id)?.instructor_id || '',
          rating: feedbackForm.rating,
          written_feedback: feedbackForm.written_feedback,
          would_recommend: feedbackForm.would_recommend,
          feedback_date: new Date().toISOString()
        });

      if (error) throw error;

      toast.success("تم إرسال ملاحظاتك بنجاح");

      // Reset form
      setFeedbackForm({
        course_id: '',
        rating: 5,
        written_feedback: '',
        would_recommend: true
      });

      // Reload feedback data
      loadStudentData();

    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("حدث خطأ في إرسال الملاحظات");
    }
  };

  const getProjectTypeStats = () => {
    const stats = projects.reduce((acc, project) => {
      acc[project.project_type] = (acc[project.project_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return stats;
  };

  const getCompletedCourses = () => {
    return courses.filter(course => course.status === 'completed');
  };

  const getActiveCourses = () => {
    return courses.filter(course => course.status === 'in_progress');
  };

  const filteredProjects = projectFilter === 'all'
    ? projects
    : projects.filter(p => p.project_type === projectFilter);

  const filteredCourses = courseFilter === 'all'
    ? courses
    : courses.filter(c => c.status === courseFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل بيانات الطالب...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={studentData?.avatar_url} alt={studentData?.full_name} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {studentData?.full_name?.split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center lg:text-right">
              <h1 className="text-3xl font-bold text-foreground">{studentData?.full_name}</h1>
              <p className="text-muted-foreground mt-1">طالب في أكاديمية ستارن</p>

              <div className="flex flex-wrap gap-3 mt-4 justify-center lg:justify-start">
                <Badge variant="secondary" className="gap-2">
                  <BookOpen className="h-3 w-3" />
                  {getActiveCourses().length} دورات نشطة
                </Badge>
                <Badge variant="secondary" className="gap-2">
                  <Award className="h-3 w-3" />
                  {getCompletedCourses().length} دورة مكتملة
                </Badge>
                <Badge variant="secondary" className="gap-2">
                  <Code className="h-3 w-3" />
                  {projects.length} مشروع
                </Badge>
              </div>
            </div>

            {/* Level and Stars Display */}
            <div className="flex flex-col sm:flex-row gap-4">
              <StudentLevelBadge level={currentLevel} showProgress={true} size="md" />
              <StarsCounter
                starsCount={starsCount}
                previousPeriod={previousStarsCount}
                timeRange="4months"
                size="md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">التقدم الأكاديمي</TabsTrigger>
          <TabsTrigger value="projects">المشاريع</TabsTrigger>
          <TabsTrigger value="feedback">ملاحظاتي</TabsTrigger>
          <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
        </TabsList>

        {/* Academic Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          {/* Courses Completed Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    الدورات المكتملة
                  </CardTitle>
                  <CardDescription>الدورات التي أكملتها بنجاح</CardDescription>
                </div>
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="تصفية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الدورات</SelectItem>
                    <SelectItem value="completed">مكتملة</SelectItem>
                    <SelectItem value="in_progress">جارية</SelectItem>
                    <SelectItem value="not_started">لم تبدأ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{course.course_name}</CardTitle>
                        <Badge variant={course.status === 'completed' ? 'default' : 'secondary'}>
                          {course.status === 'completed' ? 'مكتملة' :
                           course.status === 'in_progress' ? 'جارية' : 'لم تبدأ'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>المستوى</span>
                            <span className="font-medium">{course.course_level}/10</span>
                          </div>
                          <Progress value={course.course_level * 10} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span>نسبة الإنجاز</span>
                          <span className="font-medium">{course.progress_percentage}%</span>
                        </div>

                        <Progress value={course.progress_percentage} className="h-2" />

                        {course.completion_date && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(course.completion_date).toLocaleDateString('ar-SA')}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد دورات مطابقة للفلاتر المحددة</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Student Level Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                مستواك الحالي
              </CardTitle>
              <CardDescription>مستواك وتقدمك في الأكاديمية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <StudentLevelBadge level={currentLevel} showProgress={true} size="lg" />

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{getCompletedCourses().length}</div>
                        <div className="text-sm text-muted-foreground">دورات مكتملة</div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{starsCount}</div>
                        <div className="text-sm text-muted-foreground">نجوم هذا الشهر</div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{projects.length}</div>
                        <div className="text-sm text-muted-foreground">مشاريع مكتملة</div>
                      </div>
                    </Card>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-primary" />
                      <span className="font-medium">الهدف التالي</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      تحتاج إلى {Math.max(0, (10 - currentLevel) * 10 - achievements.length)} نقطة إضافية للوصول إلى المستوى {Math.min(currentLevel + 1, 10)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Portfolio Tab */}
        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    معرض المشاريع
                  </CardTitle>
                  <CardDescription>المشاريع التي قمت بإنجازها</CardDescription>
                </div>
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="نوع المشروع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المشاريع</SelectItem>
                    <SelectItem value="game">ألعاب</SelectItem>
                    <SelectItem value="website">مواقع</SelectItem>
                    <SelectItem value="app">تطبيقات</SelectItem>
                    <SelectItem value="animation">رسوم متحركة</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={{
                      ...project,
                      student_name: studentData?.full_name,
                      student_level: currentLevel
                    }}
                    showInstructorFeedback={true}
                    onClick={() => {
                      // Handle project click - could open modal with project details
                      toast.info(`تفاصيل مشروع: ${project.project_title}`);
                    }}
                  />
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="text-center py-8">
                  <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {projectFilter === 'all' ? 'لا توجد مشاريع بعد' : 'لا توجد مشاريع من هذا النوع'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Type Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات المشاريع</CardTitle>
              <CardDescription>توزيع مشاريعك حسب النوع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(getProjectTypeStats()).map(([type, count]) => (
                  <div key={type} className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl mb-1">
                      {type === 'game' && <Gamepad2 className="h-8 w-8 mx-auto text-purple-500" />}
                      {type === 'website' && <Globe className="h-8 w-8 mx-auto text-blue-500" />}
                      {type === 'app' && <Smartphone className="h-8 w-8 mx-auto text-green-500" />}
                      {type === 'animation' && <Film className="h-8 w-8 mx-auto text-orange-500" />}
                      {type === 'other' && <Lightbulb className="h-8 w-8 mx-auto text-gray-500" />}
                    </div>
                    <div className="text-lg font-bold">{count}</div>
                    <div className="text-xs text-muted-foreground">
                      {type === 'game' && 'ألعاب'}
                      {type === 'website' && 'مواقع'}
                      {type === 'app' && 'تطبيقات'}
                      {type === 'animation' && 'رسوم متحركة'}
                      {type === 'other' && 'أخرى'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Course Feedback Tab */}
        <TabsContent value="feedback" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Submit New Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  إرسال ملاحظات جديدة
                </CardTitle>
                <CardDescription>شاركنا رأيك في الدورات والمدربين</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">الدورة</label>
                  <Select
                    value={feedbackForm.course_id}
                    onValueChange={(value) => setFeedbackForm(prev => ({ ...prev, course_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الدورة" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.course_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">التقييم</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFeedbackForm(prev => ({ ...prev, rating }))}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            rating <= feedbackForm.rating
                              ? 'text-yellow-500 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">ملاحظاتك</label>
                  <Textarea
                    placeholder="اكتب ملاحظاتك عن الدورة..."
                    value={feedbackForm.written_feedback}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, written_feedback: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="recommend"
                    checked={feedbackForm.would_recommend}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, would_recommend: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="recommend" className="text-sm">
                    أنصح بهذه الدورة لغيري
                  </label>
                </div>

                <Button
                  onClick={handleSubmitFeedback}
                  disabled={!feedbackForm.course_id}
                  className="w-full"
                >
                  إرسال الملاحظات
                </Button>
              </CardContent>
            </Card>

            {/* Feedback History */}
            <Card>
              <CardHeader>
                <CardTitle>سجل الملاحظات</CardTitle>
                <CardDescription>ملاحظاتك السابقة على الدورات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {feedback.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          {courses.find(c => c.id === item.course_id)?.course_name}
                        </span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <Star
                              key={rating}
                              className={`h-4 w-4 ${
                                rating <= item.rating
                                  ? 'text-yellow-500 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {item.written_feedback && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.written_feedback}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className={item.would_recommend ? 'text-green-600' : 'text-red-600'}>
                          {item.would_recommend ? 'يوصي بالدورة' : 'لا يوصي بالدورة'}
                        </span>
                        <span>
                          {new Date(item.feedback_date).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                  ))}

                  {feedback.length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">لا توجد ملاحظات سابقة</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                النجوم المكتسبة
              </CardTitle>
              <CardDescription>النجوم التي حصلت عليها خلال الأشهر الأربعة الماضية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                <StarsCounter
                  starsCount={starsCount}
                  previousPeriod={previousStarsCount}
                  showComparison={true}
                  size="lg"
                />
              </div>

              <div className="space-y-3">
                {achievements
                  .filter(a => a.achievement_type === 'star')
                  .slice(0, 10)
                  .map((achievement) => (
                    <div key={achievement.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                          <Star className="h-5 w-5 text-yellow-600 fill-yellow-400" />
                        </div>
                        <div>
                          <div className="font-medium">{achievement.title}</div>
                          {achievement.description && (
                            <div className="text-sm text-muted-foreground">{achievement.description}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold text-yellow-600">+{achievement.points}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(achievement.earned_date).toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                    </div>
                  ))}

                {achievements.length === 0 && (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">لم تحصل على نجوم بعد</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentProfile;