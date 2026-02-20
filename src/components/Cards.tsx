import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { StatusBadge, BadgeStatus } from './Badges';
import { SuccessButton, DangerButton } from './Buttons';
interface BasicCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}
export function BasicCard({
  children,
  onClick,
  className = ''
}: BasicCardProps) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-card ${onClick ? 'cursor-pointer hover:shadow-elevated transition-shadow' : ''} ${className}`}
      onClick={onClick}>

      {children}
    </div>);

}
interface ProjectCardProps {
  address: string;
  homeownerName: string;
  status: BadgeStatus;
  amount: number;
  progress: number;
  onClick?: () => void;
}
export function ProjectCard({
  address,
  homeownerName,
  status,
  amount,
  progress,
  onClick
}: ProjectCardProps) {
  const initials = homeownerName.
  split(' ').
  map((n) => n[0]).
  join('').
  substring(0, 2).
  toUpperCase();
  return (
    <BasicCard
      onClick={onClick}
      className="w-full max-w-[400px] flex flex-col gap-4">

      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-navy-900 text-white flex items-center justify-center text-sm font-bold">
            {initials}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {address}
            </h3>
            <p className="text-sm text-gray-500">{homeownerName}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-navy-900 rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`
            }} />

        </div>
      </div>

      <div className="flex justify-between items-end pt-2 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            Contract Total
          </p>
          <p className="text-xl font-bold font-mono text-green-600">
            ${amount.toLocaleString()}
          </p>
        </div>
        <div className="text-gray-400">
          <ChevronRight className="w-6 h-6" />
        </div>
      </div>
    </BasicCard>);

}
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
  color?: 'navy' | 'green' | 'blue' | 'yellow';
}
export function StatCard({
  icon,
  label,
  value,
  trend,
  color = 'navy'
}: StatCardProps) {
  const colorStyles = {
    navy: 'bg-navy-900 text-white',
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-700'
  };
  return (
    <BasicCard className="min-w-[160px] flex flex-col gap-3">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${colorStyles[color]}`}>

        {icon}
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold font-mono text-gray-900">{value}</p>
          {trend &&
          <span
            className={`text-xs font-medium ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>

              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
            </span>
          }
        </div>
      </div>
    </BasicCard>);

}
interface DrawRequestCardProps {
  status: BadgeStatus;
  date: string;
  milestoneName: string;
  amount: number;
  photos: string[];
  hoursRemaining?: number;
  onApprove?: () => void;
  onDispute?: () => void;
}
export function DrawRequestCard({
  status,
  date,
  milestoneName,
  amount,
  photos,
  hoursRemaining,
  onApprove,
  onDispute
}: DrawRequestCardProps) {
  return (
    <BasicCard className="w-full max-w-md">
      <div className="flex justify-between items-start mb-4">
        <StatusBadge status={status} />
        <span className="text-sm text-gray-500">{date}</span>
      </div>

      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          {milestoneName}
        </h3>
        <p className="text-2xl font-bold font-mono text-green-600">
          ${amount.toLocaleString()}
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        {photos.map((photo, i) =>
        <div
          key={i}
          className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">

            <img
            src={photo}
            alt={`Evidence ${i + 1}`}
            className="w-full h-full object-cover" />

          </div>
        )}
        {photos.length < 3 &&
        Array.from({
          length: 3 - photos.length
        }).map((_, i) =>
        <div
          key={`empty-${i}`}
          className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 border-dashed" />

        )}
      </div>

      {status === 'pending' && hoursRemaining !== undefined &&
      <div
        className={`flex items-center gap-2 mb-6 text-sm font-medium ${hoursRemaining < 12 ? 'text-red-600' : 'text-gray-600'}`}>

          <Clock className="w-4 h-4" />
          <span>{hoursRemaining} hours remaining to auto-release</span>
        </div>
      }

      {status === 'pending' &&
      <div className="grid grid-cols-2 gap-3">
          <SuccessButton onClick={onApprove} fullWidth size="sm">
            Approve
          </SuccessButton>
          <DangerButton onClick={onDispute} fullWidth size="sm">
            Dispute
          </DangerButton>
        </div>
      }
    </BasicCard>);

}