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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ReviewCard from "@/components/ReviewCard";
import VideoUploader from "@/components/VideoUploader";
import {
  User,
  Users,
  Calendar,
  Star,
  Edit,
  Trash2,
  Plus,
  Play,
  Award,
  MessageSquare,
  GraduationCap,
  Target,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle
} from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type ParentReview = Database["public"]["Tables"]["parent_reviews"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Child = Database["public"]["Tables"]["children"]["Row"];

interface ChildWithProfile extends Child {
  profile?: Profile;
  courses?: any[];
  achievements?: any[];
}

const ParentProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [parentData, setParentData] = useState<any>(null);
  const [children, setChildren] = useState<ChildWithProfile[]>([]);
  const [reviews, setReviews] = useState<ParentReview[]>([]);
  const [instructors, setInstructors] = useState<Profile[]>([]);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    student_id: '',
    instructor_id: '',
    review_type: 'teaching_methods' as const,
    written_review: '',
    rating: 5,
    video_url: '',
    video_thumbnail: ''
  });

  // UI states
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadParentData();
    }
  }, [user]);

  const loadParentData = async () => {
    try {
      setLoading(true);

      // Load parent profile data
      const { data: profile } = await supabase
        .from("profiles")
        .select("*, guardians(*)")
        .eq("id", user?.id)
        .single();

      if (profile) {
        setParentData(profile);
      }

      // Load associated children
      const { data: childrenData } = await supabase
        .from("children")
        .select(`
          *,
          profiles:profiles(*)
        `)
        .or(`primary_guardian_id.eq.${user?.id},backup_guardian_id.eq.${user?.id}`);

      if (childrenData) {
        // Load additional data for each child
        const childrenWithDetails = await Promise.all(
          childrenData.map(async (child) => {
            const [coursesData, achievementsData] = await Promise.all([
              supabase
                .from("student_courses")
                .select("*")
                .eq("student_id", child.user_id),
              supabase
                .from("student_achievements")
                .select("*")
                .eq("student_id", child.user_id)
                .eq("achievement_type", "star")
            ]);

            return {
              ...child,
              profile: child.profiles as Profile,
              courses: coursesData.data || [],
              achievements: achievementsData.data || []
            };
          })
        );

        setChildren(childrenWithDetails);
      }

      // Load parent's reviews
      const { data: reviewsData } = await supabase
        .from("parent_reviews")
        .select(`
          *,
          parent_profile:profiles!parent_reviews_parent_id_fkey(full_name),
          student_profile:profiles!parent_reviews_student_id_fkey(full_name),
          instructor_profile:profiles!parent_reviews_instructor_id_fkey(full_name)
        `)
        .eq("parent_id", user?.id)
        .order("created_at", { ascending: false });

      if (reviewsData) {
        const formattedReviews = reviewsData.map(review => ({
          ...review,
          parent_name: review.parent_profile?.full_name,
          student_name: review.student_profile?.full_name,
          instructor_name: review.instructor_profile?.full_name
        }));

        setReviews(formattedReviews);
      }

      // Load instructors for dropdown
      const { data: instructorsData } = await supabase
        .from("profiles")
        .select("*, trainers(*)")
        .eq("role", "trainer");

      if (instructorsData) {
        setInstructors(instructorsData);
      }

    } catch (error) {
      console.error("Error loading parent data:", error);
      toast.error("حدث خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    try {
      if (!reviewForm.student_id) {
        toast.error("يرجى اختيار الطالب");
        return;
      }

      if (reviewForm.review_type === 'instructor' && !reviewForm.instructor_id) {
        toast.error("يرجى اختيار المدرب");
        return;
      }

      if (!reviewForm.written_review && !reviewForm.video_url) {
        toast.error("يرجى كتابة مراجعة أو رفع فيديو");
        return;
      }

      setSubmittingReview(true);

      const reviewData = {
        parent_id: user?.id,
        student_id: reviewForm.student_id,
        instructor_id: reviewForm.review_type === 'instructor' ? reviewForm.instructor_id : null,
        review_type: reviewForm.review_type,
        written_review: reviewForm.written_review || null,
        video_url: reviewForm.video_url || null,
        video_thumbnail: reviewForm.video_thumbnail || null,
        rating: reviewForm.rating,
        review_date: new Date().toISOString(),
        approved: false, // Reviews need admin approval
        featured: false
      };

      let error;
      if (editingReview) {
        const result = await supabase
          .from("parent_reviews")
          .update(reviewData)
          .eq("id", editingReview);
        error = result.error;
      } else {
        const result = await supabase
          .from("parent_reviews")
          .insert(reviewData);
        error = result.error;
      }

      if (error) throw error;

      toast.success(editingReview ? "تم تحديث المراجعة بنجاح" : "تم إرسال المراجعة بنجاح");

      // Reset form
      setReviewForm({
        student_id: '',
        instructor_id: '',
        review_type: 'teaching_methods',
        written_review: '',
        rating: 5,
        video_url: '',
        video_thumbnail: ''
      });
      setEditingReview(null);

      // Reload reviews
      loadParentData();

    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("حدث خطأ في إرسال المراجعة");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = (review: any) => {
    setReviewForm({
      student_id: review.student_id,
      instructor_id: review.instructor_id || '',
      review_type: review.review_type,
      written_review: review.written_review || '',
      rating: review.rating,
      video_url: review.video_url || '',
      video_thumbnail: review.video_thumbnail || ''
    });
    setEditingReview(review.id);
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from("parent_reviews")
        .delete()
        .eq("id", reviewId);

      if (error) throw error;

      toast.success("تم حذف المراجعة بنجاح");
      loadParentData();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("حدث خطأ في حذف المراجعة");
    }
  };

  const handleVideoUploadComplete = (videoData: { url: string; thumbnail: string }) => {
    setReviewForm(prev => ({
      ...prev,
      video_url: videoData.url,
      video_thumbnail: videoData.thumbnail
    }));
  };

  const getChildStats = (child: ChildWithProfile) => {
    const completedCourses = child.courses?.filter(c => c.status === 'completed').length || 0;
    const totalStars = child.achievements?.reduce((sum, a) => sum + a.points, 0) || 0;
    const activeCourses = child.courses?.filter(c => c.status === 'in_progress').length || 0;

    return { completedCourses, totalStars, activeCourses };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل بيانات ولي الأمر...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Parent Information Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={parentData?.avatar_url} alt={parentData?.full_name} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {parentData?.full_name?.split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-right">
              <h1 className="text-3xl font-bold text-foreground">{parentData?.full_name}</h1>
              <p className="text-muted-foreground mt-1">ولي أمر في أكاديمية ستارن</p>

              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                <Badge variant="secondary" className="gap-2">
                  <Users className="h-3 w-3" />
                  {children.length} أبناء
                </Badge>
                <Badge variant="secondary" className="gap-2">
                  <MessageSquare className="h-3 w-3" />
                  {reviews.length} مراجعة
                </Badge>
                <Badge variant="secondary" className="gap-2">
                  <Star className="h-3 w-3" />
                  {reviews.filter(r => r.featured).length} مراجعة مميزة
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="children" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="children">أبنائي</TabsTrigger>
          <TabsTrigger value="reviews">مراجعاتي</TabsTrigger>
          <TabsTrigger value="write-review">كتابة مراجعة</TabsTrigger>
        </TabsList>

        {/* My Children Tab */}
        <TabsContent value="children" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => {
              const stats = getChildStats(child);
              return (
                <Card key={child.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={child.profile?.avatar_url} alt={child.profile?.full_name} />
                        <AvatarFallback>
                          {child.profile?.full_name?.split(" ").map((n: string) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{child.profile?.full_name}</CardTitle>
                        <CardDescription>{child.grade_level} • {child.school_name}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-primary/10 rounded">
                          <div className="text-lg font-bold text-primary">{stats.completedCourses}</div>
                          <div className="text-xs text-muted-foreground">دورات</div>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded">
                          <div className="text-lg font-bold text-yellow-600">{stats.totalStars}</div>
                          <div className="text-xs text-muted-foreground">نجوم</div>
                        </div>
                        <div className="p-2 bg-green-100 rounded">
                          <div className="text-lg font-bold text-green-600">{stats.activeCourses}</div>
                          <div className="text-xs text-muted-foreground">نشط</div>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-3 w-3" />
                          تاريخ الميلاد: {new Date(child.date_of_birth || '').toLocaleDateString('ar-SA')}
                        </div>
                        {child.school_name && (
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-3 w-3" />
                            {child.school_name}
                          </div>
                        )}
                      </div>

                      <Button variant="outline" size="sm" className="w-full">
                        عرض التفاصيل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {children.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا يوجد أبناء مسجلين حالياً</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* My Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                مراجعاتي
              </CardTitle>
              <CardDescription>جميع مراجعاتك التي كتبتها عن الأكاديمية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={{
                      ...review,
                      parent_name: parentData?.full_name
                    }}
                    isOwnReview={true}
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
                    onViewVideo={(videoUrl) => {
                      // Handle video viewing - could open modal
                      window.open(videoUrl, '_blank');
                    }}
                  />
                ))}

                {reviews.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">لم تكتب أي مراجعات بعد</p>
                    <Button
                      onClick={() => {
                        // Switch to write-review tab
                        const writeTab = document.querySelector('[value="write-review"]') as HTMLElement;
                        writeTab?.click();
                      }}
                      className="mt-4"
                    >
                      كتابة أول مراجعة
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Write New Review Tab */}
        <TabsContent value="write-review" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Review Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {editingReview ? 'تعديل المراجعة' : 'كتابة مراجعة جديدة'}
                </CardTitle>
                <CardDescription>
                  شاركنا رأيك في طرق التدريس أو المدربين أو التجربة العامة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>الطالب</Label>
                  <Select
                    value={reviewForm.student_id}
                    onValueChange={(value) => setReviewForm(prev => ({ ...prev, student_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الطالب" />
                    </SelectTrigger>
                    <SelectContent>
                      {children.map((child) => (
                        <SelectItem key={child.user_id} value={child.user_id}>
                          {child.profile?.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>نوع المراجعة</Label>
                  <Select
                    value={reviewForm.review_type}
                    onValueChange={(value: any) => setReviewForm(prev => ({ ...prev, review_type: value, instructor_id: '' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teaching_methods">طرق التدريس</SelectItem>
                      <SelectItem value="instructor">مدرب معين</SelectItem>
                      <SelectItem value="overall_experience">التجربة العامة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {reviewForm.review_type === 'instructor' && (
                  <div className="space-y-2">
                    <Label>المدرب</Label>
                    <Select
                      value={reviewForm.instructor_id}
                      onValueChange={(value) => setReviewForm(prev => ({ ...prev, instructor_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المدرب" />
                      </SelectTrigger>
                      <SelectContent>
                        {instructors.map((instructor) => (
                          <SelectItem key={instructor.id} value={instructor.id}>
                            {instructor.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>التقييم</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setReviewForm(prev => ({ ...prev, rating }))}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            rating <= reviewForm.rating
                              ? 'text-yellow-500 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>مراجعة مكتوبة</Label>
                  <Textarea
                    placeholder="اكتب تجربتك وتقييمك..."
                    value={reviewForm.written_review}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, written_review: e.target.value }))}
                    rows={6}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setEditingReview(null)}
                    variant="outline"
                    disabled={submittingReview}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleSubmitReview}
                    disabled={submittingReview || !reviewForm.student_id || (!reviewForm.written_review && !reviewForm.video_url)}
                    className="flex-1"
                  >
                    {submittingReview ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2" />
                        {editingReview ? 'جاري التحديث...' : 'جاري الإرسال...'}
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 ml-2" />
                        {editingReview ? 'تحديث المراجعة' : 'إرسال المراجعة'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Video Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  مراجعة بالفيديو (اختياري)
                </CardTitle>
                <CardDescription>
                  يمكنك إضافة مراجعة بالفيديو لتجربتك (حد أقصى 100MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VideoUploader
                  onUploadComplete={handleVideoUploadComplete}
                  maxFileSize={100 * 1024 * 1024}
                  acceptFormats={['video/mp4', 'video/mov', 'video/webm', 'video/avi']}
                />

                {reviewForm.video_url && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">تم رفع الفيديو بنجاح</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentProfile;