import React, { useState, Component } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Share2,
  Plus } from
'lucide-react';
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
import { DrawRequestPage } from './DrawRequestPage';
import { projects, draws, receipts } from '../data/mockData';
import { PrimaryButton } from '../components/Buttons';
import { BottomSheet } from '../components/Modals';
import {
  TextInput,
  SelectInput,
  CurrencyInput } from
'../components/FormElements';
import { PhotoUpload } from '../components/PhotoComponents';
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
  const [selectedDrawId, setSelectedDrawId] = useState<string | null>(null);
  const [expandedReceiptId, setExpandedReceiptId] = useState<string | null>(
    null
  );
  // Add Receipt form state
  const [isAddReceiptOpen, setAddReceiptOpen] = useState(false);
  const [newReceiptVendor, setNewReceiptVendor] = useState('');
  const [newReceiptAmount, setNewReceiptAmount] = useState('');
  const [newReceiptDate, setNewReceiptDate] = useState('');
  const [newReceiptCategory, setNewReceiptCategory] = useState('materials');
  const [newReceiptPhotos, setNewReceiptPhotos] = useState<string[]>([]);
  const project = projects.find((p) => p.id === projectId) || projects[0];
  const projectDraws = draws.filter((d) => d.projectId === project.id);
  const projectReceipts = receipts.filter((r) => r.projectId === project.id);
  const totalReceipts = projectReceipts.reduce((sum, r) => sum + r.amount, 0);
  // Sort draws: pending first, then disputed, then approved
  const sortedDraws = [...projectDraws].sort((a, b) => {
    const order: Record<string, number> = {
      pending: 0,
      disputed: 1,
      approved: 2
    };
    const aOrder = order[a.status] ?? 1;
    const bOrder = order[b.status] ?? 1;
    return aOrder - bOrder;
  });
  // Compute real disputed amount from draws
  const disputedAmount = projectDraws.
  filter((d) => d.status === 'disputed' as any).
  reduce((sum, d) => sum + d.amount, 0);
  // Find draw for a given milestone and open inline
  const handleMilestoneClick = (milestoneId: string) => {
    const draw = projectDraws.find((d) => d.milestoneId === milestoneId);
    if (draw) {
      setSelectedDrawId(draw.id);
      setActiveTab('draws');
    }
  };
  // Handle navigation from embedded DrawRequestPage — keep it within the project
  const handleDrawNavigate = (page: string, id?: string) => {
    if (page === 'project-detail') {
      // Going back to project — just clear the selected draw
      setSelectedDrawId(null);
    } else if (page === 'dispute') {
      // For disputes, stay inline — we could handle this differently later
      // For now, navigate to the dispute page
      onNavigate(page, id);
    } else {
      onNavigate(page, id);
    }
  };
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

  const categoryOptions = [
  {
    value: 'materials',
    label: 'Materials'
  },
  {
    value: 'labor',
    label: 'Labor'
  },
  {
    value: 'equipment',
    label: 'Equipment'
  },
  {
    value: 'permits',
    label: 'Permits'
  },
  {
    value: 'delivery',
    label: 'Delivery'
  },
  {
    value: 'misc',
    label: 'Misc'
  }];

  const handleAddReceipt = () => {
    // In a real app, this would save to the backend
    setAddReceiptOpen(false);
    setNewReceiptVendor('');
    setNewReceiptAmount('');
    setNewReceiptDate('');
    setNewReceiptCategory('materials');
    setNewReceiptPhotos([]);
  };
  const handleReceiptPhotoUpload = (files: FileList) => {
    const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file));
    setNewReceiptPhotos((prev) => [...prev, ...newPhotos].slice(0, 1));
  };
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
          <MilestoneProgress
            milestones={project.milestones}
            onMilestoneClick={handleMilestoneClick} />

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
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900">
              Financial Status
            </h3>
            <div className="grid lg:grid-cols-2 gap-6 items-start">
              <EscrowBalanceCard
              totalBalance={project.escrow.total}
              available={project.escrow.available}
              holdback={project.escrow.holdback}
              disputed={disputedAmount}
              userType={userRole} />

              <div className="bg-white rounded-xl border border-gray-200 p-6 h-full">
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
          embedded
          userRole={userRole} />

        }

        {activeTab === 'daily-log' &&
        <DailyLogPage
          projectId={projectId}
          onNavigate={onNavigate}
          embedded
          userRole={userRole} />

        }

        {activeTab === 'draws' &&
        <div className="max-w-3xl mx-auto space-y-3">
            {selectedDrawId ?
          <>
                {/* Back to draws list */}
                <button
              onClick={() => setSelectedDrawId(null)}
              className="flex items-center gap-1.5 text-sm font-medium text-navy-900 hover:text-navy-700 mb-4 transition-colors">

                  <ChevronLeft className="w-4 h-4" />
                  Back to All Draws
                </button>
                {/* Inline draw detail */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <DrawRequestPage
                drawId={selectedDrawId}
                onNavigate={handleDrawNavigate}
                userRole={userRole}
                addToast={() => {}} />

                </div>
              </> :

          <>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    Draw Requests
                  </h3>
                  <span className="text-sm text-gray-500">
                    {sortedDraws.length} total
                  </span>
                </div>
                {sortedDraws.length === 0 ?
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
                    <p className="text-gray-400 text-sm">
                      No draw requests yet for this project.
                    </p>
                  </div> :

            sortedDraws.map((draw) => {
              const isDisputed = draw.status === 'disputed' as any;
              const isApproved = draw.status === 'approved';
              const isPending = draw.status === 'pending';
              return (
                <button
                  key={draw.id}
                  onClick={() => setSelectedDrawId(draw.id)}
                  className={`w-full text-left bg-white rounded-xl border p-4 flex items-center gap-4 hover:shadow-sm transition-all ${isDisputed ? 'border-red-200 hover:border-red-300' : draw.type === 'change-order' ? 'border-amber-200 hover:border-amber-300' : 'border-gray-200 hover:border-[#1e3a5f]/30'}`}>

                        {/* Status icon */}
                        <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isDisputed ? 'bg-red-100 text-red-600' : isApproved ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>

                          {isDisputed ?
                    <AlertTriangle className="w-5 h-5" /> :
                    isApproved ?
                    <CheckCircle className="w-5 h-5" /> :

                    <Clock className="w-5 h-5" />
                    }
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <p className="font-semibold text-gray-900 truncate">
                              {draw.milestoneName}
                            </p>
                            {draw.type === 'change-order' &&
                      <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex-shrink-0">
                                Change Order
                              </span>
                      }
                            {isDisputed &&
                      <span className="text-[10px] font-bold uppercase tracking-wide text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full flex-shrink-0">
                                Disputed
                              </span>
                      }
                            {isPending &&
                      <span className="text-[10px] font-bold uppercase tracking-wide text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex-shrink-0">
                                Pending
                              </span>
                      }
                            {isApproved &&
                      <span className="text-[10px] font-bold uppercase tracking-wide text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full flex-shrink-0">
                                Approved
                              </span>
                      }
                          </div>
                          <p className="text-xs text-gray-500">
                            {draw.dateSubmitted}
                          </p>
                        </div>

                        {/* Amount */}
                        <div className="text-right flex-shrink-0">
                          <p
                      className={`font-bold font-mono text-lg ${isDisputed ? 'text-red-600' : isApproved ? 'text-green-600' : draw.type === 'change-order' ? 'text-amber-700' : 'text-[#1e3a5f]'}`}>

                            ${draw.amount.toLocaleString()}
                          </p>
                        </div>

                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </button>);

            })
            }
              </>
          }
          </div>
        }

        {activeTab === 'receipts' &&
        <div className="space-y-6 max-w-3xl mx-auto">
            {userRole === 'homeowner' ?
          // Homeowner view: only shared receipts
          <>
                <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <Share2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      Shared Receipts
                    </p>
                    <p className="text-sm text-blue-700 mt-0.5">
                      Your contractor has shared these receipts with you as
                      proof of materials and expenses for your project.
                    </p>
                  </div>
                </div>

                {projectReceipts.filter((r) => r.isShared).length === 0 ?
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
                    <EyeOff className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      No receipts shared yet
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Your contractor hasn't shared any receipts with you yet.
                    </p>
                  </div> :

            <>
                    <CostSummaryCard
                totalReceipts={projectReceipts.
                filter((r) => r.isShared).
                reduce((sum, r) => sum + r.amount, 0)}
                contractAmount={project.contractAmount}
                categoryBreakdown={[
                {
                  category: 'materials',
                  amount: 8000,
                  color: 'bg-blue-500'
                },
                {
                  category: 'equipment',
                  amount: 1500,
                  color: 'bg-teal-500'
                }]
                } />

                    <div className="space-y-3">
                      {projectReceipts.
                filter((r) => r.isShared).
                map((receipt) =>
                <ReceiptCard
                  key={receipt.id}
                  receipt={receipt}
                  viewOnly
                  isExpanded={expandedReceiptId === receipt.id}
                  onToggleExpand={() =>
                  setExpandedReceiptId(
                    expandedReceiptId === receipt.id ?
                    null :
                    receipt.id
                  )
                  } />

                )}
                    </div>
                  </>
            }
              </> :

          // Contractor view: all receipts, shared/hidden visible
          <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold text-green-700">
                        {projectReceipts.filter((r) => r.isShared).length}{' '}
                        shared
                      </span>
                      <span className="mx-1.5 text-gray-300">·</span>
                      <span className="text-gray-500">
                        {projectReceipts.filter((r) => !r.isShared).length}{' '}
                        hidden from homeowner
                      </span>
                    </p>
                  </div>
                  <PrimaryButton
                size="sm"
                onClick={() => setAddReceiptOpen(true)}>

                    <Plus className="w-4 h-4 mr-2" />
                    Add Receipt
                  </PrimaryButton>
                </div>
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
              <ReceiptCard
                key={receipt.id}
                receipt={receipt}
                isExpanded={expandedReceiptId === receipt.id}
                onToggleExpand={() =>
                setExpandedReceiptId(
                  expandedReceiptId === receipt.id ? null : receipt.id
                )
                } />

              )}
                </div>
              </>
          }
          </div>
        }

        {activeTab === 'messages' &&
        <div className="h-[600px] bg-white rounded-xl border border-gray-200 overflow-hidden">
            <MessagingPage
            userRole={userRole}
            embedded
            projectId={project.id} />

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

      {/* Add Receipt Bottom Sheet */}
      <BottomSheet
        isOpen={isAddReceiptOpen}
        onClose={() => setAddReceiptOpen(false)}
        title="Add Receipt">

        <div className="space-y-6">
          <TextInput
            label="Vendor Name"
            placeholder="e.g. Home Depot"
            value={newReceiptVendor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewReceiptVendor(e.target.value)
            } />

          <div className="grid grid-cols-2 gap-4">
            <CurrencyInput
              label="Amount"
              placeholder="0.00"
              value={newReceiptAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewReceiptAmount(e.target.value)
              } />

            <TextInput
              label="Date"
              type="date"
              value={newReceiptDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewReceiptDate(e.target.value)
              } />

          </div>
          <SelectInput
            label="Category"
            value={newReceiptCategory}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setNewReceiptCategory(e.target.value)
            }
            options={categoryOptions} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receipt Photo
            </label>
            <PhotoUpload
              photos={newReceiptPhotos}
              onUpload={handleReceiptPhotoUpload}
              onRemove={(index) =>
              setNewReceiptPhotos((prev) =>
              prev.filter((_, i) => i !== index)
              )
              }
              maxPhotos={1} />

          </div>
          <PrimaryButton fullWidth onClick={handleAddReceipt}>
            Save Receipt
          </PrimaryButton>
        </div>
      </BottomSheet>
    </div>);

}