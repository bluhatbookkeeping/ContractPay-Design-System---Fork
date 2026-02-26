import React, { useState } from 'react';
import {
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  FileText,
  Mail,
  Phone,
  MapPin,
  User } from
'lucide-react';
import { StatCard, BasicCard } from '../components/Cards';
import { StatusBadge } from '../components/Badges';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { BottomSheet } from '../components/Modals';
import { projects, draws, messages } from '../data/mockData';
interface HomeownerDashboardProps {
  onNavigate: (page: string, id?: string) => void;
  addToast: (variant: 'success' | 'error', title?: string) => void;
}
export function HomeownerDashboard({
  onNavigate,
  addToast
}: HomeownerDashboardProps) {
  const [showDocuments, setShowDocuments] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  // Get all projects for the homeowner (using all mock projects for demo)
  const myProjects = projects;
  // Aggregate data across all projects
  const totalEscrow = myProjects.reduce((sum, p) => sum + p.escrow.available, 0);
  const totalFunded = myProjects.reduce((sum, p) => sum + p.escrow.total, 0);
  const allPendingDraws = draws.filter((d) => d.status === 'pending');
  const allUnreadMessages = messages.filter((m) => !m.isRead);
  const pendingContracts = myProjects.filter((p) => p.status === 'sent');
  const activeProjects = myProjects.filter((p) => p.status === 'active');
  const completedProjects = myProjects.filter((p) => p.status === 'complete');
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, Sarah
          </h1>
          <p className="text-gray-500">
            You have {activeProjects.length} active project
            {activeProjects.length !== 1 ? 's' : ''} and{' '}
            {pendingContracts.length + allPendingDraws.length} item
            {pendingContracts.length + allPendingDraws.length !== 1 ?
            's' :
            ''}{' '}
            needing attention.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="Pending Approvals"
          value={allPendingDraws.length + pendingContracts.length}
          color="yellow" />

        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          label="Active Projects"
          value={activeProjects.length}
          color="blue" />

        <StatCard
          icon={<AlertCircle className="w-6 h-6" />}
          label="Unread Messages"
          value={allUnreadMessages.length}
          color="navy" />

      </div>

      {/* Needs Attention Section */}
      {(pendingContracts.length > 0 || allPendingDraws.length > 0) &&
      <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Needs Attention
          </h2>
          {pendingContracts.map((contract) =>
        <div
          key={contract.id}
          className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Contract Waiting for Review
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Project: <strong>{contract.address}</strong>
                    <br />
                    Contractor: {contract.contractorName}
                  </p>
                </div>
              </div>
              <PrimaryButton
            onClick={() =>
            onNavigate('homeowner-contract-review', contract.id)
            }
            className="whitespace-nowrap">

                Review Contract
              </PrimaryButton>
            </div>
        )}
          {allPendingDraws.map((draw) => {
          const project = myProjects.find((p) => p.id === draw.projectId);
          return (
            <div
              key={draw.id}
              className="bg-amber-50 border border-amber-100 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 flex-shrink-0">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Draw Request: {draw.milestoneName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Project: <strong>{project?.address}</strong>
                      <br />
                      Amount: <strong>${draw.amount.toLocaleString()}</strong>
                    </p>
                  </div>
                </div>
                <PrimaryButton
                onClick={() => onNavigate('draw-detail', draw.id)}
                className="whitespace-nowrap bg-amber-600 hover:bg-amber-700 focus:ring-amber-600">

                  Review Request
                </PrimaryButton>
              </div>);

        })}
        </div>
      }

      {/* Active Projects */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Your Projects</h2>
        <div className="grid gap-4">
          {activeProjects.map((project) =>
          <BasicCard
            key={project.id}
            className="group cursor-pointer hover:border-navy-200 transition-colors"
            onClick={() => onNavigate('project-detail', project.id)}>

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center text-navy-900 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-0.5">
                      {project.address}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="w-3.5 h-3.5" />
                      <span>{project.contractorName}</span>
                    </div>
                  </div>
                </div>
                <StatusBadge status={project.status} />
              </div>
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Completion</span>
                  <span className="font-bold">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                  className="bg-navy-900 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${project.progress}%`
                  }} />

                </div>
                <div className="flex justify-between text-xs text-gray-400 pt-1">
                  <span>Started: {project.startDate}</span>
                  <span>Est. End: {project.estimatedCompletion}</span>
                </div>
              </div>
            </BasicCard>
          )}

          {/* Pending signature projects */}
          {pendingContracts.map((project) =>
          <BasicCard
            key={project.id}
            className="group cursor-pointer hover:border-blue-200 transition-colors border-blue-100 bg-blue-50/30"
            onClick={() =>
            onNavigate('homeowner-contract-review', project.id)
            }>

              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-0.5">
                      {project.address}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="w-3.5 h-3.5" />
                      <span>{project.contractorName}</span>
                    </div>
                    <p className="text-xs text-blue-600 font-medium mt-1">
                      Waiting for your signature
                    </p>
                  </div>
                </div>
                <StatusBadge status="sent" />
              </div>
            </BasicCard>
          )}

          {activeProjects.length === 0 && pendingContracts.length === 0 &&
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No active projects yet.</p>
            </div>
          }
        </div>
      </div>

      {/* Completed Projects */}
      {completedProjects.length > 0 &&
      <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Completed</h2>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {completedProjects.length}
            </span>
          </div>
          <div className="grid gap-3">
            {completedProjects.map((project) =>
          <BasicCard
            key={project.id}
            className="group cursor-pointer hover:border-green-200 transition-colors"
            onClick={() => onNavigate('project-detail', project.id)}>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {project.address}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {project.contractorName}
                        </span>
                        <span>•</span>
                        <span className="font-mono font-semibold text-gray-700">
                          ${project.contractAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Complete
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              </BasicCard>
          )}
          </div>
        </div>
      }

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="space-y-6">
            {allPendingDraws.map((draw) => {
              const project = myProjects.find((p) => p.id === draw.projectId);
              return (
                <div
                  key={draw.id}
                  className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">

                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 flex-shrink-0">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      New Draw Request
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      {project?.contractorName} requested{' '}
                      <strong>${draw.amount.toLocaleString()}</strong> for{' '}
                      {draw.milestoneName}
                    </p>
                    <p className="text-xs text-gray-400 mb-2">
                      {project?.address}
                    </p>
                    <button
                      onClick={() => onNavigate('draw-detail', draw.id)}
                      className="text-sm font-bold text-navy-900 hover:underline">

                      Review Request
                    </button>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    Today
                  </span>
                </div>);

            })}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Milestone Completed</p>
                <p className="text-sm text-gray-500 mb-1">
                  Rough Electrical has been marked as complete.
                </p>
                <p className="text-xs text-gray-400">847 Oak Street</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                Yesterday
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Documents BottomSheet */}
      <BottomSheet
        isOpen={showDocuments}
        onClose={() => setShowDocuments(false)}
        title="Project Documents">

        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-4">
            Select a project to view its documents.
          </p>
          {activeProjects.map((project) =>
          <button
            key={project.id}
            onClick={() => {
              setShowDocuments(false);
              onNavigate('project-detail', project.id);
            }}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-navy-300 hover:bg-navy-50 transition-all text-left">

              <div className="w-10 h-10 rounded-lg bg-navy-100 flex items-center justify-center text-navy-900 flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">
                  {project.address}
                </p>
                <p className="text-xs text-gray-500">
                  Contractor: {project.contractorName}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </button>
          )}
          <SecondaryButton fullWidth onClick={() => setShowDocuments(false)}>
            Close
          </SecondaryButton>
        </div>
      </BottomSheet>

      {/* Support BottomSheet */}
      <BottomSheet
        isOpen={showSupport}
        onClose={() => setShowSupport(false)}
        title="Contact Support">

        <div className="space-y-5">
          <p className="text-sm text-gray-500">
            Our team is here to help. Reach out any time — we typically respond
            within a few hours.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                addToast('success', 'Opening email client...');
                setShowSupport(false);
              }}
              className="w-full flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-navy-300 hover:bg-navy-50 transition-all text-left">

              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">
                  Email Support
                </p>
                <p className="text-xs text-gray-500">
                  support@contractpay.com · Replies within 2 hours
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => {
                addToast('success', 'Calling support...');
                setShowSupport(false);
              }}
              className="w-full flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-navy-300 hover:bg-navy-50 transition-all text-left">

              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Call Us</p>
                <p className="text-xs text-gray-500">
                  (800) 555-0199 · Mon–Fri, 8am–6pm PT
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <SecondaryButton fullWidth onClick={() => setShowSupport(false)}>
            Close
          </SecondaryButton>
        </div>
      </BottomSheet>
    </div>);

}