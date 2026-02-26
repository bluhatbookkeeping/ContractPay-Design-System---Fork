import React, { Component } from 'react';
import { Clock, MessageSquare, ChevronRight } from 'lucide-react';
import { MetricCard, AgingChart } from '../components/AnalyticsComponents';
import { ProjectCard } from '../components/Cards';
import { Timeline } from '../components/DataDisplay';
import { projects, draws, messages } from '../data/mockData';
interface ContractorDashboardProps {
  onNavigate: (page: string, id?: string) => void;
}
export function ContractorDashboard({ onNavigate }: ContractorDashboardProps) {
  const pendingDraw = draws.find((d) => d.status === 'pending');
  // Only show active projects on the dashboard (not completed or sent)
  const activeProjects = projects.filter((p) => p.status === 'active');
  const pendingProjects = projects.filter(
    (p) => p.status === 'pending' || p.status === 'sent'
  );
  // Calculate unread messages
  const unreadMessages = messages.filter(
    (m) => m.senderType === 'homeowner' && !m.isRead
  );
  // Group unread messages by project
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
    <div className="space-y-8 animate-in fade-in duration-500">
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
          value={25000}
          format="currency"
          subtitle="1 request waiting" />

        <MetricCard
          label="Avg Rating"
          value={4.8}
          subtitle="Based on 23 reviews" />

      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Column: Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Active Projects</h2>
            <button
              onClick={() => onNavigate('projects')}
              className="text-sm font-medium text-navy-900 hover:text-navy-700">

              View All
            </button>
          </div>

          <div className="grid gap-6">
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

          <div className="pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
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
        </div>

        {/* Right Column: Activity */}
        <div className="space-y-8">
          {/* Unread Messages Section */}
          {projectsWithUnread.length > 0 &&
          <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Unread Messages
                </h2>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                  {unreadMessages.length} new
                </span>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {projectsWithUnread.map((p, i) =>
              <button
                key={p.id}
                onClick={() => onNavigate('messages')}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-start gap-3 ${i !== projectsWithUnread.length - 1 ? 'border-b border-gray-100' : ''}`}>

                    <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-navy-900 flex-shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {p.address}
                        </p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                          {p.lastMessage?.timestamp.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">
                        {p.homeownerName}:{' '}
                        <span className="font-normal">
                          {p.lastMessage?.content}
                        </span>
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 self-center" />
                  </button>
              )}
              </div>
            </div>
          }

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Action Items
            </h2>
            {pendingDraw ?
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Pending Draw
                    </p>
                    <p className="font-bold text-gray-900">
                      {pendingDraw.milestoneName}
                    </p>
                    <p className="text-2xl font-bold font-mono text-[#1e3a5f] mt-1">
                      ${pendingDraw.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                      Pending
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {pendingDraw.dateSubmitted}
                    </p>
                  </div>
                </div>

                {pendingDraw.hoursRemaining &&
              <div className="flex items-center gap-2 text-sm text-amber-600 font-medium bg-amber-50 rounded-lg px-3 py-2">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Auto-releases in {pendingDraw.hoursRemaining}h if
                      homeowner takes no action
                    </span>
                  </div>
              }

                {pendingDraw.photos.length > 0 &&
              <div className="flex gap-2">
                    {pendingDraw.photos.slice(0, 3).map((photo, i) =>
                <div
                  key={i}
                  className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">

                        <img
                    src={photo}
                    alt={`Evidence ${i + 1}`}
                    className="w-full h-full object-cover" />

                      </div>
                )}
                  </div>
              }

                <button
                onClick={() => onNavigate('draw-detail', pendingDraw.id)}
                className="w-full text-sm font-semibold text-[#1e3a5f] border border-[#1e3a5f]/20 rounded-lg py-2.5 hover:bg-[#1e3a5f]/5 transition-colors">

                  View Draw Request →
                </button>
              </div> :

            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <p className="text-sm text-gray-400">
                  No pending draw requests
                </p>
              </div>
            }
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
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
      </div>
    </div>);

}