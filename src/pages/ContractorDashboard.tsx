import React, { Component } from 'react';
import {
  Clock,
  MessageSquare,
  ChevronRight,
  AlertTriangle,
  DollarSign,
  FileText,
  ArrowRight } from
'lucide-react';
import { MetricCard, AgingChart } from '../components/AnalyticsComponents';
import { ProjectCard } from '../components/Cards';
import { Timeline } from '../components/DataDisplay';
import { projects, draws, messages } from '../data/mockData';
interface ContractorDashboardProps {
  onNavigate: (page: string, id?: string) => void;
}
export function ContractorDashboard({ onNavigate }: ContractorDashboardProps) {
  const pendingDraws = draws.filter((d) => d.status === 'pending');
  const disputedDraws = draws.filter((d) => d.status === 'disputed' as any);
  const contractsAwaitingSignature = projects.filter((p) => p.status === 'sent');
  const totalActionItems =
  pendingDraws.length +
  disputedDraws.length +
  contractsAwaitingSignature.length;
  const activeProjects = projects.filter((p) => p.status === 'active');
  const pendingProjects = projects.filter(
    (p) => p.status === 'pending' || p.status === 'sent'
  );
  const unreadMessages = messages.filter(
    (m) => m.senderType === 'homeowner' && !m.isRead
  );
  const projectsWithUnread = projects.
  filter((p) => unreadMessages.some((m) => m.projectId === p.id)).
  map((p) => {
    const projectUnread = unreadMessages.filter((m) => m.projectId === p.id);
    const lastMsg = projectUnread[projectUnread.length - 1];
    return {
      ...p,
      unreadCount: projectUnread.length,
      lastMessage: lastMsg
    };
  });
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Revenue"
          value={340000}
          format="currency"
          trend={{
            direction: 'up',
            value: '15%'
          }} />

        <MetricCard
          label="Active Projects"
          value={activeProjects.length}
          subtitle={`${pendingProjects.length} pending start`} />

        <MetricCard
          label="Pending Draws"
          value={pendingDraws.reduce((sum, d) => sum + d.amount, 0)}
          format="currency"
          subtitle={`${pendingDraws.length} request${pendingDraws.length !== 1 ? 's' : ''} waiting`} />

        <MetricCard
          label="Avg Rating"
          value={4.8}
          subtitle="Based on 23 reviews" />

      </div>

      {/* Unread Messages — Full Width, Front & Center */}
      {projectsWithUnread.length > 0 &&
      <div className="bg-white rounded-xl border-2 border-red-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-red-50 border-b border-red-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-red-600" />
              <h2 className="text-sm font-bold text-red-900">
                Unread Messages
              </h2>
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadMessages.length}
              </span>
            </div>
            <button
            onClick={() => onNavigate('messages')}
            className="text-xs font-semibold text-red-700 hover:text-red-900 flex items-center gap-1">

              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {projectsWithUnread.map((p) =>
          <button
            key={p.id}
            onClick={() => onNavigate('messages')}
            className="w-full text-left px-5 py-3.5 hover:bg-gray-50 transition-colors flex items-center gap-4">

                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {p.homeownerName}
                    </p>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                      {p.lastMessage?.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {p.lastMessage?.content}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {p.address}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {p.unreadCount > 1 &&
              <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {p.unreadCount}
                    </span>
              }
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </button>
          )}
          </div>
        </div>
      }

      {/* Action Items + Active Projects — Side by Side */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Action Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Action Items</h2>
            {totalActionItems > 0 &&
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
                {totalActionItems}
              </span>
            }
          </div>

          {totalActionItems > 0 ?
          <div className="space-y-3">
              {contractsAwaitingSignature.map((project) =>
            <div
              key={`sig-${project.id}`}
              className="bg-white rounded-xl border border-blue-200 p-4 space-y-3">

                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-0.5">
                          Awaiting Signature
                        </p>
                        <p className="font-bold text-gray-900 text-sm">
                          {project.address}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {project.homeownerName}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold font-mono text-[#1e3a5f]">
                      ${project.contractAmount.toLocaleString()}
                    </span>
                  </div>
                  <button
                onClick={() => onNavigate('contract', project.id)}
                className="w-full text-sm font-semibold text-blue-600 border border-blue-200 rounded-lg py-2 hover:bg-blue-50 transition-colors">

                    View Contract →
                  </button>
                </div>
            )}

              {disputedDraws.map((draw) => {
              const project = projects.find((p) => p.id === draw.projectId);
              return (
                <div
                  key={`disp-${draw.id}`}
                  className="bg-white rounded-xl border border-red-200 p-4 space-y-3">

                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
                          <AlertTriangle className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-0.5">
                            Disputed
                          </p>
                          <p className="font-bold text-gray-900 text-sm">
                            {draw.milestoneName}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {project?.address}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold font-mono text-red-600">
                        ${draw.amount.toLocaleString()}
                      </span>
                    </div>
                    <button
                    onClick={() => onNavigate('dispute', draw.id)}
                    className="w-full text-sm font-semibold text-red-600 border border-red-200 rounded-lg py-2 hover:bg-red-50 transition-colors">

                      Resolve Dispute →
                    </button>
                  </div>);

            })}

              {pendingDraws.map((draw) => {
              const project = projects.find((p) => p.id === draw.projectId);
              return (
                <div
                  key={`draw-${draw.id}`}
                  className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">

                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                          <DollarSign className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-0.5">
                            Pending Draw
                          </p>
                          <p className="font-bold text-gray-900 text-sm">
                            {draw.milestoneName}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {project?.address}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold font-mono text-[#1e3a5f]">
                          ${draw.amount.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {draw.dateSubmitted}
                        </p>
                      </div>
                    </div>
                    {draw.hoursRemaining &&
                  <div className="flex items-center gap-2 text-xs text-amber-600 font-medium bg-amber-50 rounded-lg px-3 py-2">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Auto-releases in {draw.hoursRemaining}h</span>
                      </div>
                  }
                    <button
                    onClick={() => onNavigate('draw-detail', draw.id)}
                    className="w-full text-sm font-semibold text-[#1e3a5f] border border-[#1e3a5f]/20 rounded-lg py-2 hover:bg-[#1e3a5f]/5 transition-colors">

                      View Draw Request →
                    </button>
                  </div>);

            })}
            </div> :

          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-sm text-gray-400">No action items right now</p>
            </div>
          }
        </div>

        {/* Active Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Active Projects</h2>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-semibold text-navy-900 hover:text-navy-700 flex items-center gap-1">

              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {activeProjects.map((project) =>
            <div key={project.id} className="w-full [&>div]:max-w-none">
                <ProjectCard
                address={project.address}
                homeownerName={project.homeownerName}
                status={project.status}
                amount={project.contractAmount}
                progress={project.progress}
                onClick={() => onNavigate('project-detail', project.id)} />

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Aging + Upcoming Milestones */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Accounts Receivable Aging
          </h2>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <AgingChart
              current={15000}
              days30={5000}
              days60={2500}
              days90={0} />

          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Upcoming Milestones
          </h2>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <Timeline
              events={[
              {
                id: '1',
                title: 'Cabinets & Counters',
                timestamp: 'Due Tomorrow',
                status: 'warning',
                description: '847 Oak Street'
              },
              {
                id: '2',
                title: 'Rough Plumbing Inspection',
                timestamp: 'Fri, Feb 24',
                status: 'neutral',
                description: '1204 Maple Ave'
              },
              {
                id: '3',
                title: 'Contract Signing',
                timestamp: 'Mon, Feb 27',
                status: 'neutral',
                description: '332 Pine Lane'
              }]
              } />

          </div>
        </div>
      </div>
    </div>);

}