import React, { useState } from 'react';
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  MapPin,
  Plus,
  AlertCircle } from
'lucide-react';
import { draws, projects } from '../data/mockData';
import { StatusBadge } from '../components/Badges';
import { PrimaryButton } from '../components/Buttons';
interface DrawsListPageProps {
  onNavigate: (page: string, id?: string) => void;
  userRole: 'contractor' | 'homeowner';
}
const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock className="w-4 h-4 text-amber-500" />,
  approved: <CheckCircle className="w-4 h-4 text-green-500" />,
  disputed: <AlertCircle className="w-4 h-4 text-red-500" />,
  rejected: <XCircle className="w-4 h-4 text-red-400" />
};
export function DrawsListPage({ onNavigate, userRole }: DrawsListPageProps) {
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'approved' | 'disputed'>(
    'all');
  // Group draws by project
  const projectsWithDraws = projects.
  map((project) => ({
    project,
    draws: draws.filter((d) => d.projectId === project.id)
  })).
  filter((g) => g.draws.length > 0);
  const filteredGroups = projectsWithDraws.
  map((g) => ({
    ...g,
    draws:
    filter === 'all' ? g.draws : g.draws.filter((d) => d.status === filter)
  })).
  filter((g) => g.draws.length > 0);
  const totalPending = draws.filter((d) => d.status === 'pending').length;
  const totalApproved = draws.filter((d) => d.status === 'approved').length;
  const totalValue = draws.reduce((sum, d) => sum + d.amount, 0);
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Draw Requests</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {userRole === 'contractor' ?
            'Track payment requests across all your projects' :
            'Review and approve payment requests from your contractors'}
          </p>
        </div>
        {userRole === 'contractor' &&
        <PrimaryButton size="sm" onClick={() => onNavigate('projects')}>
            <Plus className="w-4 h-4 mr-2" />
            New Draw
          </PrimaryButton>
        }
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Pending
          </p>
          <p className="text-2xl font-bold font-mono text-amber-600">
            {totalPending}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">awaiting action</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Approved
          </p>
          <p className="text-2xl font-bold font-mono text-green-600">
            {totalApproved}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">released</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Total Value
          </p>
          <p className="text-2xl font-bold font-mono text-[#1e3a5f]">
            ${totalValue.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">across all draws</p>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'pending', 'approved', 'disputed'] as const).map((f) =>
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors capitalize ${filter === f ? 'bg-[#1e3a5f] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>

            {f === 'all' ? 'All Draws' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        )}
      </div>

      {/* Draws grouped by project */}
      {filteredGroups.length === 0 ?
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <DollarSign className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="font-medium text-gray-500">No draw requests found</p>
          <p className="text-sm text-gray-400 mt-1">
            {filter !== 'all' ?
          'Try changing the filter above' :
          'Draw requests will appear here once submitted'}
          </p>
        </div> :

      <div className="space-y-6">
          {filteredGroups.map(({ project, draws: projectDraws }) =>
        <div key={project.id}>
              {/* Project header */}
              <button
            onClick={() => onNavigate('project-detail', project.id)}
            className="flex items-center gap-2 mb-3 group">

                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-bold text-gray-700 group-hover:text-[#1e3a5f] transition-colors">
                  {project.address}
                </span>
                <span className="text-xs text-gray-400">
                  · {project.homeownerName}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#1e3a5f] transition-colors" />
              </button>

              {/* Draw cards for this project */}
              <div className="space-y-2">
                {projectDraws.map((draw) =>
            <button
              key={draw.id}
              onClick={() =>
              draw.status === 'disputed' as any ?
              onNavigate('dispute', draw.id) :
              onNavigate('draw-detail', draw.id)
              }
              className="w-full bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:border-[#1e3a5f]/30 hover:shadow-sm transition-all text-left">

                    <div className="flex items-center gap-4">
                      <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${draw.status === 'pending' ? 'bg-amber-50' : draw.status === 'approved' ? 'bg-green-50' : 'bg-red-50'}`}>

                        <DollarSign
                    className={`w-5 h-5 ${draw.status === 'pending' ? 'text-amber-600' : draw.status === 'approved' ? 'text-green-600' : 'text-red-500'}`} />

                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {draw.milestoneName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">
                            Submitted {draw.dateSubmitted}
                          </span>
                          {draw.hoursRemaining && draw.status === 'pending' &&
                    <>
                              <span className="text-gray-200">·</span>
                              <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {draw.hoursRemaining}h remaining
                              </span>
                            </>
                    }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <p className="font-bold font-mono text-[#1e3a5f]">
                          ${draw.amount.toLocaleString()}
                        </p>
                        <StatusBadge status={draw.status as any} />
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </button>
            )}
              </div>
            </div>
        )}
        </div>
      }
    </div>);

}