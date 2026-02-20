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
  MessageCircle,
  HelpCircle,
  Download,
  Receipt,
  GitBranch,
  Camera,
  ExternalLink,
  X } from
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
  const myProject =
  projects.find((p) => p.homeownerName.includes('Sarah')) || projects[0];
  const pendingDraws = draws.filter(
    (d) => d.projectId === myProject.id && d.status === 'pending'
  );
  const unreadMessages = messages.filter(
    (m) => m.projectId === myProject.id && !m.isRead
  );
  const pendingContract = projects.find((p) => p.status === 'sent');
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, Sarah
          </h1>
          <p className="text-gray-500">
            Here's what's happening with your project today.
          </p>
        </div>
      </div>

      {/* Action Required Banner for Contract */}
      {pendingContract &&
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Contract Waiting for Review
              </h3>
              <p className="text-gray-600">
                A new contract for <strong>{pendingContract.address}</strong>{' '}
                has been sent by {pendingContract.contractorName}. Please review
                and sign to begin the project.
              </p>
            </div>
          </div>
          <PrimaryButton
          onClick={() =>
          onNavigate('homeowner-contract-review', pendingContract.id)
          }
          className="whitespace-nowrap">

            Review Contract
          </PrimaryButton>
        </div>
      }

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign className="w-6 h-6" />}
          label="Escrow Balance"
          value={`$${myProject.escrow.available.toLocaleString()}`}
          color="green" />

        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="Pending Approvals"
          value={pendingDraws.length}
          color="yellow" />

        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          label="Project Progress"
          value={`${myProject.progress}%`}
          color="blue" />

        <StatCard
          icon={<AlertCircle className="w-6 h-6" />}
          label="Unread Messages"
          value={unreadMessages.length}
          color="navy" />

      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Project Card */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Current Project</h2>
          <BasicCard
            className="group cursor-pointer"
            onClick={() => onNavigate('project-detail', myProject.id)}>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {myProject.address}
                </h3>
                <p className="text-gray-500">
                  Contractor: {myProject.contractorName}
                </p>
              </div>
              <StatusBadge status={myProject.status} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Completion Progress</span>
                <span className="font-bold">{myProject.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-navy-900 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${myProject.progress}%`
                  }} />

              </div>
              <div className="flex justify-between text-xs text-gray-400 pt-2">
                <span>Started: {myProject.startDate}</span>
                <span>Est. Completion: {myProject.estimatedCompletion}</span>
              </div>
            </div>
          </BasicCard>

          {/* Recent Activity / Timeline Preview */}
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="space-y-6">
              {pendingDraws.length > 0 &&
              <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 flex-shrink-0">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      New Draw Request
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      {myProject.contractorName} requested $
                      {pendingDraws[0].amount.toLocaleString()} for{' '}
                      {pendingDraws[0].milestoneName}
                    </p>
                    <button
                    onClick={() =>
                    onNavigate('draw-detail', pendingDraws[0].id)
                    }
                    className="text-sm font-bold text-navy-900 hover:underline">

                      Review Request
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">Today</span>
                </div>
              }
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Milestone Completed
                  </p>
                  <p className="text-sm text-gray-500">
                    Rough Electrical has been marked as complete.
                  </p>
                </div>
                <span className="text-xs text-gray-400">Yesterday</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="bg-navy-900 rounded-xl p-6 text-white">
            <h3 className="font-bold text-lg mb-1">Escrow Status</h3>
            <p className="text-navy-200 text-sm mb-6">Your funds are secure</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-navy-200">Total Funded</span>
                <span className="font-mono font-bold">
                  ${myProject.escrow.total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-navy-200">Released</span>
                <span className="font-mono font-bold">
                  $
                  {(
                  myProject.escrow.total - myProject.escrow.available).
                  toLocaleString()}
                </span>
              </div>
              <div className="h-px bg-white/10 my-2" />
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold">Available</span>
                <span className="font-mono font-bold text-green-400">
                  ${myProject.escrow.available.toLocaleString()}
                </span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('transaction-history')}
              className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-medium transition-colors text-sm">

              View Transaction History
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('messages')}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">

                <span className="text-sm font-medium text-gray-700">
                  Message Contractor
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => setShowDocuments(true)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">

                <span className="text-sm font-medium text-gray-700">
                  View Documents
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => setShowSupport(true)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">

                <span className="text-sm font-medium text-gray-700">
                  Contact Support
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
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
          <p className="text-sm text-gray-500">
            All documents related to your project at{' '}
            <strong>{myProject.address}</strong>.
          </p>

          {/* Contract */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Contract
            </p>
            <button
              onClick={() => {
                setShowDocuments(false);
                onNavigate('contract', myProject.id);
              }}
              className="w-full flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-navy-300 hover:bg-navy-50 transition-all text-left">

              <div className="w-10 h-10 rounded-lg bg-navy-100 flex items-center justify-center text-navy-900 flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">
                  Construction Agreement
                </p>
                <p className="text-xs text-gray-500">
                  Signed · {myProject.startDate}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </button>
          </div>

          {/* Change Orders */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Change Orders
            </p>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    No change orders yet
                  </p>
                  <p className="text-xs text-gray-500">
                    Any approved changes to scope will appear here
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Receipts */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Shared Receipts
            </p>
            <button
              onClick={() => {
                setShowDocuments(false);
                onNavigate('project-detail', myProject.id);
              }}
              className="w-full flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-navy-300 hover:bg-navy-50 transition-all text-left">

              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                <Receipt className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">
                  2 receipts shared
                </p>
                <p className="text-xs text-gray-500">
                  Home Depot, Ferguson Plumbing
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </button>
          </div>

          {/* Project Photos */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Progress Photos
            </p>
            <button
              onClick={() => {
                setShowDocuments(false);
                onNavigate('project-detail', myProject.id);
              }}
              className="w-full flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-navy-300 hover:bg-navy-50 transition-all text-left">

              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">
                  3 photos from latest draw
                </p>
                <p className="text-xs text-gray-500">
                  Cabinets & Counters · Uploaded today
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </button>
          </div>

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

          {/* Contact options */}
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

            <button
              onClick={() => {
                onNavigate('messages');
                setShowSupport(false);
              }}
              className="w-full flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-navy-300 hover:bg-navy-50 transition-all text-left">

              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Live Chat</p>
                <p className="text-xs text-gray-500">
                  Chat with a support agent now
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* FAQ */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Common Questions
            </p>
            <div className="space-y-2">
              {[
              {
                q: 'How does escrow protection work?',
                a: 'Your funds are held securely and only released when you approve each completed milestone.'
              },
              {
                q: 'How do I approve a draw request?',
                a: "When your contractor submits a draw, you'll receive a notification to review photos and approve payment."
              },
              {
                q: 'What if I have a dispute?',
                a: 'ContractPay offers mediation services. Funds remain protected in escrow during any dispute.'
              }].
              map((item, i) =>
              <div
                key={i}
                className="bg-gray-50 border border-gray-100 rounded-lg p-3">

                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-navy-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.q}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <SecondaryButton fullWidth onClick={() => setShowSupport(false)}>
            Close
          </SecondaryButton>
        </div>
      </BottomSheet>
    </div>);

}