import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageSquare,
  Users,
  Video,
 Quote,
  Heart
} from 'lucide-react';

interface ParentReview {
  id: string;
  parent_name: string;
  student_name: string;
  student_level: number;
  avatar?: string;
  rating: number;
  written_review?: string;
  video_url?: string;
  video_thumbnail?: string;
  review_date: string;
  featured: boolean;
  review_type: 'teaching_methods' | 'instructor' | 'overall_experience';
}

const ParentTestimonials: React.FC = () => {
  const [reviews, setReviews] = useState<ParentReview[]>([]);
  const [featuredReviews, setFeaturedReviews] = useState<ParentReview[]>([]);
  const [writtenReviews, setWrittenReviews] = useState<ParentReview[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock data for development - replace with actual API calls
  const mockReviews: ParentReview[] = [
    {
      id: '1',
      parent_name: 'الأم سارة محمد',
      student_name: 'أحمد سارة',
      student_level: 7,
      avatar: '/api/placeholder/80/80',
      rating: 5,
      written_review: 'تجربة ممتازة مع أكاديمية ستارن! مستوى التدريب عالي والمدربين متخصصون. لاحظت تطوراً كبيراً في مهارات ابني البرمجية في فترة قصيرة. شكراً للفريق العامل على جهودهم.',
      review_date: '2024-01-10',
      featured: true,
      review_type: 'overall_experience'
    },
    {
      id: '2',
      parent_name: 'الأب خالد العلي',
      student_name: 'فاطمة خالد',
      student_level: 5,
      avatar: '/api/placeholder/80/80',
      rating: 5,
      video_url: '/api/mock-video/review1.mp4',
      video_thumbnail: '/api/placeholder/400/225',
      review_date: '2024-01-08',
      featured: true,
      review_type: 'teaching_methods'
    },
    {
      id: '3',
      parent_name: 'الأم نورة أحمد',
      student_name: 'عبدالله نورة',
      student_level: 8,
      avatar: '/api/placeholder/80/80',
      rating: 5,
      written_review: 'طرق التدريس مبتكرة ومشوقة. ابني كان ينتظر كل درس بشغف كبير! المنهج مصمم بشكل ممتاز يناسب الأطفال والشباب.',
      review_date: '2024-01-05',
      featured: false,
      review_type: 'teaching_methods'
    },
    {
      id: '4',
      parent_name: 'الأب محمد سعد',
      student_name: 'مريم محمد',
      student_level: 6,
      avatar: '/api/placeholder/80/80',
      rating: 5,
      video_url: '/api/mock-video/review2.mp4',
      video_thumbnail: '/api/placeholder/400/225',
      review_date: '2024-01-03',
      featured: true,
      review_type: 'instructor'
    },
    {
      id: '5',
      parent_name: 'الأم ليلى حسن',
      student_name: 'عمر ليلى',
      student_level: 4,
      avatar: '/api/placeholder/80/80',
      rating: 4,
      written_review: 'بيئة تعليمية آمنة ومحفزة. المدربون متفهمون لاحتياجات الأطفال ويعاملونهم بصبر. أنصح الأكاديمية بقوة لجميع الأهالي.',
      review_date: '2024-01-01',
      featured: false,
      review_type: 'overall_experience'
    },
    {
      id: '6',
      parent_name: 'الأب راشد الماجد',
      student_name: 'نور راشد',
      student_level: 9,
      avatar: '/api/placeholder/80/80',
      rating: 5,
      written_review: 'استثمار ممتاز في مستقبل الطفل! المهارات التي يكتسبها الأبناء في الأكاديمية ستساعدهم في حياتهم المهنية والشخصية.',
      review_date: '2023-12-28',
      featured: false,
      review_type: 'instructor'
    }
  ];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setReviews(mockReviews);
      setFeaturedReviews(mockReviews.filter(review => review.featured));
      setWrittenReviews(mockReviews.filter(review => review.written_review));
    }, 1000);
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePreviousVideo = () => {
    setCurrentVideoIndex((prev) =>
      prev === 0 ? featuredReviews.length - 1 : prev - 1
    );
    setIsPlaying(false);
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prev) =>
      prev === featuredReviews.length - 1 ? 0 : prev + 1
    );
    setIsPlaying(false);
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReviewTypeLabel = (type: string) => {
    switch (type) {
      case 'teaching_methods':
        return 'طرق التدريس';
      case 'instructor':
        return 'المدرب';
      case 'overall_experience':
        return 'التجربة العامة';
      default:
        return 'مراجعة';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-500 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gradient-fun mb-4">
            آراء أولياء الأمور
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            استمع إلى تجارب أولياء الأمور الذين اختاروا أكاديمية ستارن لأبنائهم
          </p>
        </div>

        {/* Featured Video Reviews */}
        {featuredReviews.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Video className="h-6 w-6 text-primary" />
                المراجعات المميزة بالفيديو
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousVideo}
                  disabled={featuredReviews.length <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentVideoIndex + 1} / {featuredReviews.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextVideo}
                  disabled={featuredReviews.length <= 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Video Player */}
              <Card className="overflow-hidden">
                <div className="relative aspect-video bg-black">
                  {featuredReviews[currentVideoIndex]?.video_url ? (
                    <>
                      <video
                        ref={videoRef}
                        src={featuredReviews[currentVideoIndex].video_url}
                        className="w-full h-full object-contain"
                        onEnded={() => setIsPlaying(false)}
                      />

                      {/* Video Controls Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none">
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
                          <Button
                            onClick={handlePlayPause}
                            size="sm"
                            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                          >
                            {isPlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4 ml-1" />
                            )}
                          </Button>

                          <Button
                            onClick={handleMuteToggle}
                            size="sm"
                            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                          >
                            {isMuted ? (
                              <VolumeX className="h-4 w-4" />
                            ) : (
                              <Volume2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-white/60">
                        <Video className="h-12 w-12 mx-auto mb-4" />
                        <p>فيديو غير متوفر</p>
                      </div>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={featuredReviews[currentVideoIndex]?.avatar} />
                      <AvatarFallback>
                        {featuredReviews[currentVideoIndex]?.parent_name?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{featuredReviews[currentVideoIndex]?.parent_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ولي أمر: {featuredReviews[currentVideoIndex]?.student_name} (مستوى {featuredReviews[currentVideoIndex]?.student_level})
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {getReviewTypeLabel(featuredReviews[currentVideoIndex]?.review_type)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(featuredReviews[currentVideoIndex]?.rating || 5)}
                    <span className="text-sm text-muted-foreground">
                      {formatDate(featuredReviews[currentVideoIndex]?.review_date)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Video Description */}
              <div className="flex flex-col justify-center">
                <Card className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Quote className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-bold">تجربة عائلية رائعة</h3>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    تشجع هذه المراجعات الأسر الأخرى على الانضمام إلى مجتمعنا التعليمي. كل قصة نجاح
                    تدل على جودة التعليم والاهتمام الذي نقدمه لكل طالب في أكاديمية ستارن.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">95%</div>
                      <div className="text-sm text-muted-foreground">رضا الأولياء</div>
                    </div>
                    <div className="text-center p-4 bg-green-100 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">200+</div>
                      <div className="text-sm text-muted-foreground">مراجعة فيديو</div>
                    </div>
                  </div>

                  <Button className="w-full gap-2">
                    <MessageSquare className="h-4 w-4" />
                    شاركنا رأيك
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Written Reviews Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              المراجعات المكتوبة
            </h3>
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              عرض جميع المراجعات
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {writtenReviews.map((review) => (
              <Card key={review.id} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.avatar} />
                        <AvatarFallback>
                          {review.parent_name?.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{review.parent_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ولي أمر: {review.student_name} (مستوى {review.student_level})
                        </p>
                      </div>
                    </div>
                    {review.featured && (
                      <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                        مميزة
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {getReviewTypeLabel(review.review_type)}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {review.written_review}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formatDate(review.review_date)}</span>
                    <Button variant="ghost" size="sm" className="gap-1 h-auto p-0">
                      <Heart className="h-3 w-3" />
                      مفيد
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-green-100">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              شاركنا تجربتك!
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              تجربتك تهمنا وتساعدنا في تحسين خدماتنا. شاركنا رأيك في أكاديمية ستارن وساعد
              الأسر الأخرى في اتخاذ القرار المناسب لأبنائهم.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                اكتب مراجعة
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Video className="h-4 w-4" />
                سجل فيديو
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ParentTestimonials;