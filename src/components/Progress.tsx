import React, { useState } from 'react';
import { Check, Loader2, AlertTriangle, ChevronRight } from 'lucide-react';
interface ProgressBarProps {
  value: number;
  color?: 'navy' | 'green';
  showLabel?: boolean;
  className?: string;
}
export function ProgressBar({
  value,
  color = 'navy',
  showLabel,
  className = ''
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  return (
    <div className={`w-full ${className}`}>
      {showLabel &&
      <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
          <span>Progress</span>
          <span>{Math.round(clampedValue)}%</span>
        </div>
      }
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${color === 'navy' ? 'bg-navy-900' : 'bg-green-600'}`}
          style={{
            width: `${clampedValue}%`
          }} />

      </div>
    </div>);

}
interface Milestone {
  id: string;
  name: string;
  amount: number;
  status: 'completed' | 'current' | 'upcoming' | 'disputed';
}
interface MilestoneProgressProps {
  milestones: Milestone[];
  onMilestoneClick?: (milestoneId: string) => void;
}
export function MilestoneProgress({
  milestones,
  onMilestoneClick
}: MilestoneProgressProps) {
  const completedCount = milestones.filter(
    (m) => m.status === 'completed'
  ).length;
  const currentIndex = milestones.findIndex((m) => m.status === 'current');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const statusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-navy-900';
      case 'disputed':
        return 'bg-red-500';
      default:
        return 'bg-gray-200';
    }
  };
  const statusColorHover = (status: string) => {
    switch (status) {
      case 'completed':
        return 'hover:bg-green-600';
      case 'current':
        return 'hover:bg-navy-800';
      case 'disputed':
        return 'hover:bg-red-600';
      default:
        return 'hover:bg-gray-300';
    }
  };
  return (
    <>
      {/* Summary bar - always visible */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs font-medium text-gray-500">
          <span className="text-green-600 font-bold">{completedCount}</span> of{' '}
          <span className="font-bold">{milestones.length}</span> milestones
          complete
        </p>
        {currentIndex >= 0 &&
        <p className="text-xs font-medium text-navy-900">
            Current:{' '}
            <span className="font-bold">{milestones[currentIndex].name}</span>
          </p>
        }
      </div>

      {/* MOBILE: Vertical compact list */}
      <div className="lg:hidden">
        <div className="relative pl-6">
          {/* Vertical connector line */}
          <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gray-200" />
          {/* Filled portion of connector */}
          {completedCount > 0 &&
          <div
            className="absolute left-[11px] top-0 w-0.5 bg-green-600 transition-all duration-500"
            style={{
              height: `${(completedCount - (currentIndex >= 0 ? 0.5 : 0)) / Math.max(milestones.length - 1, 1) * 100}%`
            }} />

          }

          <div className="space-y-1">
            {milestones.map((milestone, index) => {
              const isCompleted = milestone.status === 'completed';
              const isCurrent = milestone.status === 'current';
              const isDisputed = milestone.status === 'disputed';
              const isClickable =
              !!onMilestoneClick && (isCompleted || isCurrent || isDisputed);
              return (
                <button
                  key={milestone.id}
                  onClick={() =>
                  isClickable && onMilestoneClick?.(milestone.id)
                  }
                  disabled={!isClickable}
                  className={`relative flex items-center gap-3 w-full text-left py-2 pr-2 rounded-lg transition-colors ${isCurrent ? 'bg-navy-50/50' : isDisputed ? 'bg-red-50/50' : isClickable ? 'hover:bg-gray-50' : ''}`}>

                  {/* Node */}
                  <div
                    className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 flex-shrink-0 ${isDisputed ? 'border-red-500 bg-red-500 text-white' : isCompleted ? 'border-green-600 bg-green-600 text-white' : isCurrent ? 'border-navy-900 text-navy-900 bg-white' : 'border-gray-300 text-gray-300 bg-white'}`}>

                    {isDisputed ?
                    <AlertTriangle className="w-3 h-3" /> :
                    isCompleted ?
                    <Check className="w-3.5 h-3.5" /> :

                    <span className="text-[10px] font-bold">{index + 1}</span>
                    }
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${isDisputed ? 'text-red-600' : isCurrent ? 'text-navy-900 font-semibold' : isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>

                        {milestone.name}
                      </p>
                      {isDisputed &&
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">
                          Disputed
                        </span>
                      }
                    </div>
                    <span
                      className={`text-xs font-mono flex-shrink-0 ${isDisputed ? 'text-red-400' : isCurrent ? 'text-navy-900 font-semibold' : 'text-gray-400'}`}>

                      ${milestone.amount.toLocaleString()}
                    </span>
                  </div>
                </button>);

            })}
          </div>
        </div>
      </div>

      {/* DESKTOP: Segmented progress bar + milestone grid */}
      <div className="hidden lg:block">
        {/* Segmented progress bar */}
        <div className="relative mb-2">
          <div className="flex h-3 rounded-full overflow-hidden gap-px bg-gray-100">
            {milestones.map((milestone, index) =>
            <button
              key={milestone.id}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                const isClickable =
                !!onMilestoneClick && (
                milestone.status === 'completed' ||
                milestone.status === 'current' ||
                milestone.status === 'disputed');
                if (isClickable) onMilestoneClick?.(milestone.id);
              }}
              className={`flex-1 transition-all duration-200 ${statusColor(milestone.status)} ${statusColorHover(milestone.status)} ${hoveredIndex === index ? 'opacity-100 scale-y-125' : 'opacity-90'} ${(milestone.status === 'completed' || milestone.status === 'current' || milestone.status === 'disputed') && onMilestoneClick ? 'cursor-pointer' : 'cursor-default'}`}
              style={{
                flexGrow: milestone.amount
              }} />

            )}
          </div>

          {/* Hover tooltip */}
          {hoveredIndex !== null &&
          <div className="absolute top-5 left-0 right-0 flex justify-center pointer-events-none z-30">
              <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
                <span
                className={`w-2 h-2 rounded-full ${statusColor(milestones[hoveredIndex].status)}`} />

                <span className="font-medium">
                  {milestones[hoveredIndex].name}
                </span>
                <span className="text-gray-400">·</span>
                <span className="font-mono">
                  ${milestones[hoveredIndex].amount.toLocaleString()}
                </span>
                <span className="text-gray-400">·</span>
                <span
                className={`capitalize ${milestones[hoveredIndex].status === 'completed' ? 'text-green-400' : milestones[hoveredIndex].status === 'current' ? 'text-blue-400' : milestones[hoveredIndex].status === 'disputed' ? 'text-red-400' : 'text-gray-400'}`}>

                  {milestones[hoveredIndex].status}
                </span>
              </div>
            </div>
          }
        </div>

        {/* Milestone grid */}
        <div
          className={`grid gap-1.5 mt-6 ${milestones.length > 6 ? 'grid-cols-2 xl:grid-cols-3' : 'grid-cols-2'}`}>

          {milestones.map((milestone, index) => {
            const isCompleted = milestone.status === 'completed';
            const isCurrent = milestone.status === 'current';
            const isDisputed = milestone.status === 'disputed';
            const isClickable =
            !!onMilestoneClick && (isCompleted || isCurrent || isDisputed);
            return (
              <button
                key={milestone.id}
                onClick={() => isClickable && onMilestoneClick?.(milestone.id)}
                disabled={!isClickable}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${isCurrent ? 'bg-navy-50 ring-1 ring-navy-200' : isDisputed ? 'bg-red-50 ring-1 ring-red-200' : hoveredIndex === index ? 'bg-gray-50' : ''} ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}>

                {/* Small status dot/icon */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${isDisputed ? 'bg-red-500 text-white' : isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-navy-900 text-white' : 'bg-gray-200 text-gray-400'}`}>

                  {isDisputed ?
                  <AlertTriangle className="w-2.5 h-2.5" /> :
                  isCompleted ?
                  <Check className="w-3 h-3" /> :

                  <span>{index + 1}</span>
                  }
                </div>

                {/* Name + amount */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-medium truncate ${isDisputed ? 'text-red-700' : isCurrent ? 'text-navy-900 font-semibold' : isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>

                    {milestone.name}
                  </p>
                </div>

                <span
                  className={`text-[11px] font-mono flex-shrink-0 ${isDisputed ? 'text-red-500' : isCurrent ? 'text-navy-900 font-semibold' : 'text-gray-400'}`}>

                  ${milestone.amount.toLocaleString()}
                </span>

                {isClickable &&
                <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
                }
              </button>);

          })}
        </div>
      </div>
    </>);

}
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export function LoadingSpinner({
  size = 'md',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  };
  return (
    <Loader2
      className={`animate-spin text-navy-900 ${sizeClasses[size]} ${className}`} />);


}
interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}
export function SkeletonLoader({
  variant = 'text',
  width,
  height,
  className = ''
}: SkeletonLoaderProps) {
  const baseClasses = 'animate-pulse bg-gray-200';
  const variantClasses = {
    text: 'rounded h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };
  const style = {
    width: width,
    height: height
  };
  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style} />);


}