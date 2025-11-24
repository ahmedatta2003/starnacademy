import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Star, Calendar, Play, Edit, Trash2, User, CheckCircle, Clock, Eye } from 'lucide-react';

interface ReviewCardProps {
  review: {
    id: string;
    parent_name?: string;
    student_name?: string;
    instructor_name?: string;
    review_type: 'teaching_methods' | 'instructor' | 'overall_experience';
    written_review?: string;
    video_url?: string;
    video_thumbnail?: string;
    rating: number;
    review_date: string;
    approved: boolean;
    featured: boolean;
  };
  isOwnReview?: boolean;
  onEdit?: (review: any) => void;
  onDelete?: (reviewId: string) => void;
  onViewVideo?: (videoUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  isOwnReview = false,
  onEdit,
  onDelete,
  onViewVideo,
  size = 'md',
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getReviewTypeIcon = (type: string) => {
    const icons = {
      teaching_methods: '🎯',
      instructor: '👨‍🏫',
      overall_experience: '⭐'
    };
    return icons[type as keyof typeof icons] || '⭐';
  };

  const getReviewTypeName = (type: string) => {
    const names = {
      teaching_methods: 'طرق التدريس',
      instructor: 'المدرب',
      overall_experience: 'التجربة العامة'
    };
    return names[type as keyof typeof names] || names.overall_experience;
  };

  const getReviewTypeColor = (type: string) => {
    const colors = {
      teaching_methods: 'bg-blue-100 text-blue-700 border-blue-200',
      instructor: 'bg-green-100 text-green-700 border-green-200',
      overall_experience: 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colors[type as keyof typeof colors] || colors.overall_experience;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = () => {
    if (review.featured) {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200">
          <Eye className="w-3 h-3" />
          مميز
        </div>
      );
    }

    if (review.approved) {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">
          <CheckCircle className="w-3 h-3" />
          معتمد
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200">
        <Clock className="w-3 h-3" />
        قيد المراجعة
      </div>
    );
  };

  const sizeClasses = {
    sm: {
      container: 'p-3',
      title: 'text-sm font-semibold',
      description: 'text-xs',
      icon: 'w-4 h-4',
      badge: 'text-xs px-2 py-1'
    },
    md: {
      container: 'p-4',
      title: 'text-base font-semibold',
      description: 'text-sm',
      icon: 'w-5 h-5',
      badge: 'text-sm px-3 py-1'
    },
    lg: {
      container: 'p-6',
      title: 'text-lg font-semibold',
      description: 'text-base',
      icon: 'w-6 h-6',
      badge: 'text-base px-4 py-2'
    }
  };

  const currentSize = sizeClasses[size];

  const shouldTruncate = review.written_review && review.written_review.length > 150;
  const displayText = shouldTruncate && !isExpanded
    ? review.written_review.substring(0, 150) + '...'
    : review.written_review;

  return (
    <div className={cn(
      'card-playful bg-white relative',
      currentSize.container,
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          {/* Parent Info */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className={cn('text-foreground', currentSize.title)}>
                {review.parent_name || 'أولياء الأمور'}
              </h4>
              {review.student_name && (
                <p className="text-xs text-muted-foreground">
                  ولي أمر: {review.student_name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          {isOwnReview && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit?.(review)}
                className="p-1 text-muted-foreground hover:text-primary transition-colors"
                title="تعديل"
              >
                <Edit className={cn(currentSize.icon)} />
              </button>
              <button
                onClick={() => onDelete?.(review.id)}
                className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                title="حذف"
              >
                <Trash2 className={cn(currentSize.icon)} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        {/* Review Type */}
        <span className={cn(
          'rounded-full border font-medium',
          getReviewTypeColor(review.review_type),
          currentSize.badge
        )}>
          <span className="ml-1">{getReviewTypeIcon(review.review_type)}</span>
          {getReviewTypeName(review.review_type)}
        </span>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={cn(
                currentSize.icon,
                i < review.rating
                  ? 'text-yellow-500 fill-yellow-400'
                  : 'text-gray-300'
              )}
            />
          ))}
        </div>

        {/* Date */}
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className={cn(currentSize.icon)} />
          <span className={cn(currentSize.description)}>
            {formatDate(review.review_date)}
          </span>
        </div>
      </div>

      {/* Video Preview */}
      {review.video_url && review.video_thumbnail && (
        <div className="mb-3">
          <div
            className="relative rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => onViewVideo?.(review.video_url!)}
          >
            <img
              src={imageError ? '/api/placeholder/400/225' : review.video_thumbnail}
              alt="فيديو المراجعة"
              className="w-full h-32 object-cover"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-primary ml-1" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Written Review */}
      {review.written_review && (
        <div className={cn('text-muted-foreground', currentSize.description)}>
          <p>{displayText}</p>
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary/80 font-medium mt-1"
            >
              {isExpanded ? 'عرض أقل' : 'قراءة المزيد'}
            </button>
          )}
        </div>
      )}

      {/* Instructor Info (if applicable) */}
      {review.instructor_name && review.review_type === 'instructor' && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            عن المدرب: <span className="font-medium text-foreground">{review.instructor_name}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;