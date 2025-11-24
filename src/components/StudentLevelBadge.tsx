import React from 'react';
import { cn } from '@/lib/utils';

interface StudentLevelBadgeProps {
  level: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StudentLevelBadge: React.FC<StudentLevelBadgeProps> = ({
  level,
  showProgress = false,
  size = 'md',
  className
}) => {
  const maxLevel = 10;
  const progressPercentage = (level / maxLevel) * 100;

  const getLevelTitle = (lvl: number): string => {
    if (lvl <= 2) return 'مبتدئ';
    if (lvl <= 5) return 'متوسط';
    if (lvl <= 8) return 'متقدم';
    return 'خبير';
  };

  const getLevelColor = (lvl: number): string => {
    if (lvl <= 2) return 'hsl(var(--warning))';
    if (lvl <= 5) return 'hsl(var(--primary))';
    if (lvl <= 8) return 'hsl(var(--accent))';
    return 'hsl(var(--golden, 43 100% 55%))';
  };

  const sizeClasses = {
    sm: 'w-24 h-2 text-xs',
    md: 'w-32 h-3 text-sm',
    lg: 'w-40 h-4 text-base'
  };

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className={cn('bg-gray-200 rounded-full overflow-hidden', sizeClasses[size])}>
            <div
              className={cn('h-full rounded-full transition-all duration-1000 ease-out animate-gradient', sizeClasses[size])}
              style={{
                width: `${progressPercentage}%`,
                background: `linear-gradient(90deg, ${getLevelColor(level)}, ${getLevelColor(Math.min(level + 1, 10))})`,
              }}
            />
          </div>

          {/* Level markers */}
          <div className="absolute inset-0 flex items-center justify-between px-1">
            {Array.from({ length: maxLevel }, (_, i) => (
              <div
                key={i}
                className={cn(
                  'w-1 h-1 rounded-full bg-white border border-gray-300',
                  i < level - 1 && 'border-primary'
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-bold text-gradient-primary',
            size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
          )}>
            المستوى {level}
          </span>
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
            )}
            style={{
              backgroundColor: `${getLevelColor(level)}20`,
              color: getLevelColor(level)
            }}
          >
            {getLevelTitle(level)}
          </span>
        </div>

        {showProgress && (
          <p className="text-xs text-muted-foreground mt-1">
            {maxLevel - level} مستوى حتى الخبرة
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentLevelBadge;