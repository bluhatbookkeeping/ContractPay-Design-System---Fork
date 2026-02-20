import React, { useState, Component } from 'react';
import { FileText } from 'lucide-react';
import { HeaderBar } from '../components/Navigation';
import { StatusBadge } from '../components/Badges';
import { MilestoneProgress } from '../components/Progress';
import { EscrowBalanceCard } from '../components/MoneyComponents';
import { DrawRequestCard } from '../components/Cards';
import { ReceiptCard, CostSummaryCard } from '../components/ReceiptComponents';
import { Timeline } from '../components/DataDisplay';
import { MessagingPage } from './MessagingPage';
import { ContractPage } from './ContractPage';
import { SchedulePage } from './SchedulePage';
import { ChangeOrderPage } from './ChangeOrderPage';
import { DailyLogPage } from './DailyLogPage';
import { projects, draws, receipts } from '../data/mockData';
interface ProjectDetailPageProps {
  projectId?: string;
  onNavigate: (page: string, id?: string) => void;
  userRole: 'contractor' | 'homeowner';
}
export function ProjectDetailPage({
  projectId,
  onNavigate,
  userRole
}: ProjectDetailPageProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' |
    'contract' |
    'schedule' |
    'draws' |
    'change-orders' |
    'daily-log' |
    'receipts' |
    'messages' |
    'timeline'>(
    'overview');
  const project = projects.find((p) => p.id === projectId) || projects[0];
  const projectDraws = draws.filter((d) => d.projectId === project.id);
  const projectReceipts = receipts.filter((r) => r.projectId === project.id);
  const totalReceipts = projectReceipts.reduce((sum, r) => sum + r.amount, 0);
  const tabs = [
  {
    id: 'overview',
    label: 'Overview'
  },
  {
    id: 'contract',
    label: 'Contract'
  },
  {
    id: 'schedule',
    label: 'Schedule'
  },
  {
    id: 'draws',
    label: 'Draws'
  },
  {
    id: 'change-orders',
    label: 'Change Orders'
  },
  {
    id: 'daily-log',
    label: 'Daily Log'
  },
  {
    id: 'receipts',
    label: 'Receipts'
  },
  {
    id: 'messages',
    label: 'Messages'
  },
  {
    id: 'timeline',
    label: 'Timeline'
  }];

  return (
    <div className="flex flex-col bg-gray-50 -m-4 lg:-m-8 min-h-full">
      <HeaderBar
        title={project.address}
        showBack
        onBack={() =>
        onNavigate(userRole === 'contractor' ? 'projects' : 'dashboard')
        }
        rightAction={<StatusBadge status={project.status} />} />


      <div className="bg-white border-b border-gray-200 px-6 pt-6 pb-0">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">Contract Total</p>
          <h2 className="text-3xl font-bold font-mono text-navy-900">
            ${project.contractAmount.toLocaleString()}
          </h2>
        </div>

        <div className="mb-8">
          <MilestoneProgress milestones={project.milestones} />
        </div>

        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-navy-900 text-navy-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>

              {tab.label}
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'overview' &&
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">
                Financial Status
              </h3>
              <EscrowBalanceCard
              totalBalance={project.escrow.total}
              available={project.escrow.available}
              holdback={project.escrow.holdback}
              disputed={project.escrow.disputed}
              userType={userRole} />

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold uppercase text-gray-500">
                    Project Details
                  </h3>
                  <button
                  onClick={() => onNavigate('contract', project.id)}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1">

                    <FileText className="w-4 h-4" /> View Contract
                  </button>
                </div>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Start Date</dt>
                    <dd className="font-medium text-gray-900">
                      {project.startDate}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Est. Completion</dt>
                    <dd className="font-medium text-gray-900">
                      {project.estimatedCompletion}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Contractor</dt>
                    <dd className="font-medium text-gray-900">
                      {project.contractorName}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Homeowner</dt>
                    <dd className="font-medium text-gray-900">
                      {project.homeownerName}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        }

        {activeTab === 'contract' &&
        <div className="bg-white rounded-xl border border-gray-200 overflow-y-auto">
            <ContractPage
            projectId={projectId}
            onNavigate={onNavigate}
            userRole={userRole}
            addToast={() => {}} />

          </div>
        }

        {activeTab === 'schedule' &&
        <SchedulePage
          projectId={projectId}
          onNavigate={onNavigate}
          embedded />

        }

        {activeTab === 'change-orders' &&
        <ChangeOrderPage
          projectId={projectId}
          onNavigate={onNavigate}
          embedded />

        }

        {activeTab === 'daily-log' &&
        <DailyLogPage
          projectId={projectId}
          onNavigate={onNavigate}
          embedded />

        }

        {activeTab === 'draws' &&
        <div className="space-y-6 max-w-3xl mx-auto">
            {projectDraws.map((draw) =>
          <DrawRequestCard
            key={draw.id}
            status={draw.status}
            date={draw.dateSubmitted}
            milestoneName={draw.milestoneName}
            amount={draw.amount}
            photos={draw.photos}
            hoursRemaining={draw.hoursRemaining}
            onApprove={() => onNavigate('draw-detail', draw.id)} />

          )}
          </div>
        }

        {activeTab === 'receipts' &&
        <div className="space-y-6 max-w-3xl mx-auto">
            <CostSummaryCard
            totalReceipts={totalReceipts}
            contractAmount={project.contractAmount}
            categoryBreakdown={[
            {
              category: 'materials',
              amount: 8000,
              color: 'bg-blue-500'
            },
            {
              category: 'labor',
              amount: 3000,
              color: 'bg-purple-500'
            },
            {
              category: 'equipment',
              amount: 1500,
              color: 'bg-teal-500'
            }]
            } />

            <div className="space-y-3">
              {projectReceipts.map((receipt) =>
            <ReceiptCard key={receipt.id} receipt={receipt} />
            )}
            </div>
          </div>
        }

        {activeTab === 'messages' &&
        <div className="h-[600px] bg-white rounded-xl border border-gray-200 overflow-hidden">
            <MessagingPage userRole={userRole} embedded />
          </div>
        }

        {activeTab === 'timeline' &&
        <div className="bg-white p-6 rounded-xl border border-gray-200 max-w-3xl mx-auto">
            <Timeline
            events={[
            {
              id: '1',
              title: 'Draw Request Submitted',
              timestamp: 'Today 9:00 AM',
              status: 'warning',
              description: 'Cabinets & Counters - $25,000'
            },
            {
              id: '2',
              title: 'Rough Electrical Completed',
              timestamp: 'Feb 15, 2025',
              status: 'success'
            },
            {
              id: '3',
              title: 'Project Started',
              timestamp: 'Jan 10, 2025',
              status: 'neutral'
            }]
            } />

          </div>
        }
      </div>
    </div>);

}