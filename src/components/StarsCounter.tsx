import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Star, TrendingUp, Trophy } from 'lucide-react';

interface StarsCounterProps {
  starsCount: number;
  timeRange?: '4months' | 'allTime';
  previousPeriod?: number;
  showComparison?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StarsCounter: React.FC<StarsCounterProps> = ({
  starsCount,
  timeRange = '4months',
  previousPeriod = 0,
  showComparison = true,
  size = 'md',
  className
}) => {
  const [displayedStars, setDisplayedStars] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const duration = 2000;
    const steps = 60;
    const increment = starsCount / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= starsCount) {
        setDisplayedStars(starsCount);
        setIsAnimating(false);
        clearInterval(timer);
      } else {
        setDisplayedStars(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [starsCount]);

  const getPercentageChange = () => {
    if (previousPeriod === 0) return 0;
    return ((starsCount - previousPeriod) / previousPeriod) * 100;
  };

  const percentageChange = getPercentageChange();
  const isPositive = percentageChange >= 0;

  const getMilestoneForStars = (count: number): string | null => {
    if (count >= 100) return '🏆 نجم المئة';
    if (count >= 50) return '⭐ نجم الخمسين';
    if (count >= 25) return '🌟 نجم الخمسة والعشرين';
    if (count >= 10) return '✨ نجم العشرة';
    return null;
  };

  const milestone = getMilestoneForStars(starsCount);

  const sizeClasses = {
    sm: {
      container: 'p-3',
      icon: 'w-4 h-4',
      number: 'text-2xl',
      label: 'text-xs',
      star: 'w-6 h-6'
    },
    md: {
      container: 'p-4',
      icon: 'w-5 h-5',
      number: 'text-3xl',
      label: 'text-sm',
      star: 'w-8 h-8'
    },
    lg: {
      container: 'p-6',
      icon: 'w-6 h-6',
      number: 'text-4xl',
      label: 'text-base',
      star: 'w-10 h-10'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={cn(
      'card-playful bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200',
      'relative overflow-hidden',
      currentSize.container,
      className
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-yellow-200/20 to-orange-200/20 rounded-full -ml-8 -mb-8" />

      <div className="relative flex items-center gap-4">
        {/* Star Icon */}
        <div className={cn(
          'relative',
          isAnimating && 'animate-pulse-glow'
        )}>
          <div className="absolute inset-0 bg-yellow-400 rounded-full animate-pulse opacity-30" />
          <Star
            className={cn(
              'text-yellow-500 fill-yellow-400 drop-shadow-md',
              currentSize.star
            )}
          />
        </div>

        <div className="flex-1">
          {/* Stars Count */}
          <div className="flex items-baseline gap-2">
            <span className={cn(
              'font-bold text-gradient-fun',
              currentSize.number
            )}>
              {displayedStars}
            </span>
            <span className={cn(
              'text-muted-foreground font-medium',
              currentSize.label
            )}>
              نجمة
            </span>
          </div>

          {/* Time Range */}
          <p className={cn(
            'text-muted-foreground',
            currentSize.label
          )}>
            {timeRange === '4months' ? 'خلال 4 أشهر' : 'إجمالي النجوم'}
          </p>

          {/* Comparison */}
          {showComparison && previousPeriod > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className={cn(
                currentSize.icon,
                isPositive ? 'text-green-500' : 'text-red-500'
              )} />
              <span className={cn(
                currentSize.label,
                isPositive ? 'text-green-600' : 'text-red-600'
              )}>
                {isPositive ? '+' : ''}{percentageChange.toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        {/* Milestone Badge */}
        {milestone && (
          <div className="flex flex-col items-center gap-1 animate-bounce-gentle">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="text-xs font-medium text-yellow-700 text-center">
              {milestone}
            </span>
          </div>
        )}
      </div>

      {/* Progress indicator for animation */}
      {isAnimating && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-200">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default StarsCounter;