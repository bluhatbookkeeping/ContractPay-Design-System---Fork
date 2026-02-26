import React from 'react';
import { Check, Loader2, AlertTriangle } from 'lucide-react';
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
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex items-start min-w-max px-4">
        {milestones.map((milestone, index) => {
          const isLast = index === milestones.length - 1;
          const isCompleted = milestone.status === 'completed';
          const isCurrent = milestone.status === 'current';
          const isDisputed = milestone.status === 'disputed';
          const isClickable =
          !!onMilestoneClick && (isCompleted || isCurrent || isDisputed);
          return (
            <div
              key={milestone.id}
              className="flex flex-col items-center relative group">

              {/* Connector Line */}
              {!isLast &&
              <div
                className={`absolute top-4 left-[50%] w-full h-0.5 -z-10 ${isCompleted ? 'bg-green-600' : isDisputed ? 'bg-red-400' : 'bg-gray-200'}`} />

              }

              {/* Node */}
              <button
                onClick={() => isClickable && onMilestoneClick?.(milestone.id)}
                disabled={!isClickable}
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all ${isDisputed ? 'border-red-500 bg-red-500 text-white hover:bg-red-600 cursor-pointer shadow-sm' : isCompleted ? 'border-green-600 bg-green-600 text-white hover:bg-green-700 cursor-pointer' : isCurrent ? 'border-navy-900 text-navy-900 bg-white hover:bg-navy-50 cursor-pointer' : 'border-gray-300 text-gray-300 bg-white cursor-default'}`}>

                {isDisputed ?
                <AlertTriangle className="w-4 h-4" /> :
                isCompleted ?
                <Check className="w-5 h-5" /> :

                <span className="text-xs font-bold">{index + 1}</span>
                }
              </button>

              {/* Label */}
              <div className="mt-2 text-center w-32">
                <p
                  className={`text-sm font-medium ${isDisputed ? 'text-red-600' : isCurrent ? 'text-navy-900' : 'text-gray-500'}`}>

                  {milestone.name}
                </p>
                <p
                  className={`text-xs font-mono mt-0.5 ${isDisputed ? 'text-red-400' : 'text-gray-400'}`}>

                  ${milestone.amount.toLocaleString()}
                </p>
                {isDisputed &&
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">
                    Disputed
                  </span>
                }
              </div>
            </div>);

        })}
      </div>
    </div>);

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