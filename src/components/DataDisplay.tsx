import React from 'react';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
interface Column<T> {
  key: keyof T;
  header: string;
  render?: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
}
export function DataTable<
  T extends {
    id: string | number;
  }>(
{ columns, data, onRowClick }: DataTableProps<T>) {
  return (
    <div className="w-full overflow-hidden border border-gray-200 rounded-xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col) =>
              <th
                key={String(col.key)}
                className={`px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}>

                  {col.header}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row) =>
            <tr
              key={row.id}
              onClick={() => onRowClick && onRowClick(row)}
              className={`group transition-colors ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}>

                {columns.map((col) =>
              <td
                key={String(col.key)}
                className={`px-6 py-4 whitespace-nowrap text-gray-600 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}>

                    {col.render ? col.render(row) : String(row[col.key])}
                  </td>
              )}
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {data.length === 0 &&
      <div className="p-8 text-center text-gray-500">No data available</div>
      }
    </div>);

}
interface ListItemProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  onClick?: () => void;
}
export function ListItem({
  icon,
  title,
  subtitle,
  rightContent,
  onClick
}: ListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-4 bg-white border-b border-gray-100 last:border-0 transition-colors ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}>

      {icon &&
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
          {icon}
        </div>
      }

      <div className="flex-1 min-w-0">
        <h4 className="text-base font-semibold text-gray-900 truncate">
          {title}
        </h4>
        {subtitle &&
        <p className="text-sm text-gray-500 truncate">{subtitle}</p>
        }
      </div>

      {rightContent &&
      <div className="flex-shrink-0 flex items-center gap-2">
          {rightContent}
          {onClick && <ChevronRight className="w-5 h-5 text-gray-400" />}
        </div>
      }
    </div>);

}
interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error' | 'neutral';
}
interface TimelineProps {
  events: TimelineEvent[];
}
export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative pl-4 border-l-2 border-gray-200 space-y-8 py-2">
      {events.map((event) => {
        const statusColors = {
          success: 'bg-green-500 ring-green-100',
          warning: 'bg-yellow-500 ring-yellow-100',
          error: 'bg-red-500 ring-red-100',
          neutral: 'bg-gray-400 ring-gray-100'
        };
        const colorClass = statusColors[event.status || 'neutral'];
        return (
          <div key={event.id} className="relative pl-6">
            <div
              className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full ring-4 ${colorClass}`} />


            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
              <h4 className="text-sm font-semibold text-gray-900">
                {event.title}
              </h4>
              <span className="text-xs text-gray-500">{event.timestamp}</span>
            </div>

            {event.description &&
            <p className="mt-1 text-sm text-gray-600">{event.description}</p>
            }
          </div>);

      })}
    </div>);

}