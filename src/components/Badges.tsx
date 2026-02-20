import React from 'react';
export type BadgeStatus =
'draft' |
'sent' |
'active' |
'pending' |
'approved' |
'disputed' |
'complete' |
'cancelled';
interface StatusBadgeProps {
  status: BadgeStatus;
  label?: string;
  className?: string;
}
export function StatusBadge({
  status,
  label,
  className = ''
}: StatusBadgeProps) {
  const styles = {
    draft: 'bg-gray-100 text-gray-600',
    sent: 'bg-blue-100 text-blue-700',
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    disputed: 'bg-red-100 text-red-800',
    complete: 'bg-navy-900 text-white',
    cancelled: 'bg-gray-100 text-gray-600 line-through decoration-gray-600'
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${styles[status]} ${className}`}>

      {label || status}
    </span>);

}