import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Star, ExternalLink, Calendar, Tag, Eye, MessageSquare } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: string;
    project_title: string;
    project_description?: string;
    project_url?: string;
    project_type: 'game' | 'website' | 'app' | 'animation' | 'other';
    completion_date?: string;
    instructor_feedback?: string;
    instructor_rating?: number;
    shared_publicly: boolean;
    student_name?: string;
    student_level?: number;
  };
  onClick?: (project: any) => void;
  showInstructorFeedback?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  showInstructorFeedback = true,
  size = 'md',
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getProjectTypeIcon = (type: string) => {
    const icons = {
      game: '🎮',
      website: '🌐',
      app: '📱',
      animation: '🎬',
      other: '💡'
    };
    return icons[type as keyof typeof icons] || icons.other;
  };

  const getProjectTypeName = (type: string) => {
    const names = {
      game: 'لعبة',
      website: 'موقع إلكتروني',
      app: 'تطبيق',
      animation: 'رسوم متحركة',
      other: 'مشروع آخر'
    };
    return names[type as keyof typeof names] || names.other;
  };

  const getProjectTypeColor = (type: string) => {
    const colors = {
      game: 'bg-purple-100 text-purple-700 border-purple-200',
      website: 'bg-blue-100 text-blue-700 border-blue-200',
      app: 'bg-green-100 text-green-700 border-green-200',
      animation: 'bg-orange-100 text-orange-700 border-orange-200',
      other: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  return (
    <div
      className={cn(
        'card-playful bg-white cursor-pointer group',
        'hover:shadow-colored transition-all duration-300',
        currentSize.container,
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(project)}
    >
      {/* Project Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-2xl">{getProjectTypeIcon(project.project_type)}</span>
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'text-foreground truncate',
              currentSize.title
            )}>
              {project.project_title}
            </h3>
            {project.student_name && (
              <p className="text-xs text-muted-foreground">
                بواسطة: {project.student_name}
                {project.student_level && ` (مستوى ${project.student_level})`}
              </p>
            )}
          </div>
        </div>

        {/* Project Type Badge */}
        <span className={cn(
          'rounded-full border font-medium whitespace-nowrap',
          getProjectTypeColor(project.project_type),
          currentSize.badge
        )}>
          {getProjectTypeName(project.project_type)}
        </span>
      </div>

      {/* Project Description */}
      {project.project_description && (
        <p className={cn(
          'text-muted-foreground mb-3 line-clamp-2',
          currentSize.description
        )}>
          {project.project_description}
        </p>
      )}

      {/* Instructor Rating */}
      {showInstructorFeedback && project.instructor_rating && (
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={cn(
                  currentSize.icon,
                  i < project.instructor_rating
                    ? 'text-yellow-500 fill-yellow-400'
                    : 'text-gray-300'
                )}
              />
            ))}
          </div>
          <span className={cn(
            'text-muted-foreground',
            currentSize.description
          )}>
            ({project.instructor_rating}/5)
          </span>
        </div>
      )}

      {/* Instructor Feedback Snippet */}
      {showInstructorFeedback && project.instructor_feedback && (
        <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-1 mb-1">
            <MessageSquare className={cn('text-blue-600', currentSize.icon)} />
            <span className={cn('text-blue-700 font-medium', currentSize.description)}>
              ملاحظات المدرب
            </span>
          </div>
          <p className={cn('text-blue-600 line-clamp-2', currentSize.description)}>
            {project.instructor_feedback}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className={cn(currentSize.icon)} />
          <span className={cn(currentSize.description)}>
            {formatDate(project.completion_date)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Public Indicator */}
          {project.shared_publicly && (
            <div className="flex items-center gap-1 text-green-600">
              <Eye className={cn(currentSize.icon)} />
              <span className={cn(currentSize.description)}>عام</span>
            </div>
          )}

          {/* External Link */}
          {project.project_url && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className={cn(
                'text-primary hover:text-primary/80',
                currentSize.icon
              )} />
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect Overlay */}
      {isHovered && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 pointer-events-none" />
      )}
    </div>
  );
};

export default ProjectCard;