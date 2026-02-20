import React from 'react';
import { Check, Loader2 } from 'lucide-react';
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
  status: 'completed' | 'current' | 'upcoming';
}
interface MilestoneProgressProps {
  milestones: Milestone[];
}
export function MilestoneProgress({ milestones }: MilestoneProgressProps) {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex items-start min-w-max px-4">
        {milestones.map((milestone, index) => {
          const isLast = index === milestones.length - 1;
          const isCompleted = milestone.status === 'completed';
          const isCurrent = milestone.status === 'current';
          return (
            <div
              key={milestone.id}
              className="flex flex-col items-center relative group">

              {/* Connector Line */}
              {!isLast &&
              <div
                className={`absolute top-4 left-[50%] w-full h-0.5 -z-10 ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />

              }

              {/* Node */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white transition-colors ${isCompleted ? 'border-green-600 bg-green-600 text-white' : isCurrent ? 'border-navy-900 text-navy-900' : 'border-gray-300 text-gray-300'}`}>

                {isCompleted ?
                <Check className="w-5 h-5" /> :

                <span className="text-xs font-bold">{index + 1}</span>
                }
              </div>

              {/* Label */}
              <div className="mt-2 text-center w-32">
                <p
                  className={`text-sm font-medium ${isCurrent ? 'text-navy-900' : 'text-gray-500'}`}>

                  {milestone.name}
                </p>
                <p className="text-xs font-mono text-gray-400 mt-0.5">
                  ${milestone.amount.toLocaleString()}
                </p>
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