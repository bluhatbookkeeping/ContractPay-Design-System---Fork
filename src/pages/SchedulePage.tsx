import React from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight } from
'lucide-react';
import { HeaderBar } from '../components/Navigation';
import { StatusBadge } from '../components/Badges';
import { BasicCard } from '../components/Cards';
import { PrimaryButton } from '../components/Buttons';
interface SchedulePageProps {
  projectId?: string;
  onNavigate: (page: string, id?: string) => void;
  embedded?: boolean;
}
export function SchedulePage({
  projectId,
  onNavigate,
  embedded = false
}: SchedulePageProps) {
  // Mock schedule data
  const scheduleItems = [
  {
    id: '1',
    phase: 'Demolition',
    startDate: 'Jan 10, 2025',
    endDate: 'Jan 15, 2025',
    status: 'completed',
    progress: 100,
    assignee: 'Demo Crew A'
  },
  {
    id: '2',
    phase: 'Rough Plumbing',
    startDate: 'Jan 16, 2025',
    endDate: 'Jan 20, 2025',
    status: 'completed',
    progress: 100,
    assignee: 'Mike Plumber'
  },
  {
    id: '3',
    phase: 'Rough Electrical',
    startDate: 'Jan 21, 2025',
    endDate: 'Jan 25, 2025',
    status: 'completed',
    progress: 100,
    assignee: 'Sparky Electric'
  },
  {
    id: '4',
    phase: 'Insulation & Drywall',
    startDate: 'Jan 26, 2025',
    endDate: 'Feb 05, 2025',
    status: 'active',
    progress: 60,
    assignee: 'Wall Masters'
  },
  {
    id: '5',
    phase: 'Cabinet Installation',
    startDate: 'Feb 06, 2025',
    endDate: 'Feb 15, 2025',
    status: 'upcoming',
    progress: 0,
    assignee: 'Kitchen Pros'
  },
  {
    id: '6',
    phase: 'Countertops',
    startDate: 'Feb 16, 2025',
    endDate: 'Feb 18, 2025',
    status: 'upcoming',
    progress: 0,
    assignee: 'Stone Works'
  },
  {
    id: '7',
    phase: 'Final Plumbing & Electrical',
    startDate: 'Feb 19, 2025',
    endDate: 'Feb 22, 2025',
    status: 'upcoming',
    progress: 0,
    assignee: 'Mike Plumber / Sparky Electric'
  },
  {
    id: '8',
    phase: 'Final Walkthrough',
    startDate: 'Feb 25, 2025',
    endDate: 'Feb 25, 2025',
    status: 'upcoming',
    progress: 0,
    assignee: 'John Builder'
  }];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-100';
      case 'active':
        return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'upcoming':
        return 'text-gray-500 bg-gray-50 border-gray-100';
      case 'delayed':
        return 'text-red-600 bg-red-50 border-red-100';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'active':
        return <Clock className="w-5 h-5" />;
      case 'delayed':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };
  const content =
  <div className="space-y-6">
      {!embedded &&
    <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Project Schedule</h2>
          <PrimaryButton size="sm">Update Schedule</PrimaryButton>
        </div>
    }

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-gray-100">
          {scheduleItems.map((item) =>
        <div
          key={item.id}
          className="p-4 hover:bg-gray-50 transition-colors">

              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Status Icon */}
                <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border ${getStatusColor(item.status)}`}>

                  {getStatusIcon(item.status)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-semibold text-gray-900 truncate">
                      {item.phase}
                    </h3>
                    <StatusBadge status={item.status as any} />
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {item.startDate} - {item.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-700">
                        Assignee:
                      </span>
                      <span>{item.assignee}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                    <div
                  className={`h-1.5 rounded-full ${item.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{
                    width: `${item.progress}%`
                  }} />

                  </div>
                </div>
              </div>
            </div>
        )}
        </div>
      </div>
    </div>;

  if (embedded) return content;
  return (
    <div className="flex flex-col bg-gray-50 -m-4 lg:-m-8 min-h-full">
      <HeaderBar
        title="Construction Schedule"
        showBack
        onBack={() => onNavigate('project-detail', projectId)} />

      <div className="p-4 lg:p-8 max-w-4xl mx-auto w-full">{content}</div>
    </div>);

}