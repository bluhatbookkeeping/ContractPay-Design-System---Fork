import React, { Component } from 'react';
import { MetricCard, AgingChart } from '../components/AnalyticsComponents';
import { ProjectCard, DrawRequestCard } from '../components/Cards';
import { Timeline } from '../components/DataDisplay';
import { projects, draws } from '../data/mockData';
interface ContractorDashboardProps {
  onNavigate: (page: string, id?: string) => void;
}
export function ContractorDashboard({ onNavigate }: ContractorDashboardProps) {
  const pendingDraw = draws.find((d) => d.status === 'pending');
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
          value={4}
          subtitle="2 pending start" />

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
            {projects.map((project) =>
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
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Action Items
            </h2>
            {pendingDraw &&
            <DrawRequestCard
              status={pendingDraw.status}
              date={pendingDraw.dateSubmitted}
              milestoneName={pendingDraw.milestoneName}
              amount={pendingDraw.amount}
              photos={pendingDraw.photos}
              hoursRemaining={pendingDraw.hoursRemaining} />

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