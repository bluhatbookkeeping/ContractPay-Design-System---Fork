import React from 'react';
import { FileText, DollarSign, Bell, Search } from 'lucide-react';
import { PrimaryButton } from './Buttons';
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-gray-400">
        {icon || <Search className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-xs mb-6">{description}</p>
      {actionLabel && onAction &&
      <PrimaryButton onClick={onAction} size="sm">
          {actionLabel}
        </PrimaryButton>
      }
    </div>);

}
export const EmptyContracts = () =>
<EmptyState
  icon={<FileText className="w-8 h-8" />}
  title="No contracts yet"
  description="Create your first contract to start protecting your payments."
  actionLabel="Create Contract"
  onAction={() => {}} />;


export const EmptyDraws = () =>
<EmptyState
  icon={<DollarSign className="w-8 h-8" />}
  title="No draw requests"
  description="When you complete a milestone, request a draw here." />;


export const EmptyNotifications = () =>
<EmptyState
  icon={<Bell className="w-8 h-8" />}
  title="All caught up"
  description="You have no new notifications at this time." />;