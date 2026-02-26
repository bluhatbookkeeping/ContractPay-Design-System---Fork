import React, { useState, Component } from 'react';
import { HeaderBar } from '../components/Navigation';
import { StatusBadge } from '../components/Badges';
import { PhotoGallery, PhotoUpload } from '../components/PhotoComponents';
import { Timeline } from '../components/DataDisplay';
import { ConfirmationModal } from '../components/Modals';
import {
  SuccessButton,
  DangerButton,
  PrimaryButton,
  SecondaryButton } from
'../components/Buttons';
import { draws, projects } from '../data/mockData';
import {
  Camera,
  CheckCircle2,
  MapPin,
  User,
  Clock,
  ChevronRight,
  DollarSign,
  Layers,
  AlertTriangle,
  MessageCircle,
  Send,
  CheckCircle,
  XCircle,
  Info,
  FileText } from
'lucide-react';
interface DrawRequestPageProps {
  drawId?: string;
  onNavigate: (page: string, id?: string) => void;
  userRole: 'contractor' | 'homeowner';
  addToast: (variant: 'success' | 'error') => void;
}
const DISPUTE_REASONS = [
{
  label: 'Work incomplete',
  icon: '🔨'
},
{
  label: 'Quality issues',
  icon: '⚠️'
},
{
  label: 'Wrong milestone',
  icon: '📋'
},
{
  label: "Photos don't match",
  icon: '📷'
},
{
  label: 'Wrong materials',
  icon: '🧱'
},
{
  label: 'Other',
  icon: '💬'
}];

export function DrawRequestPage({
  drawId,
  onNavigate,
  userRole,
  addToast
}: DrawRequestPageProps) {
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  // Dispute flow state
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeNotes, setDisputeNotes] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);
  // Contractor dispute response
  const [disputeResponse, setDisputeResponse] = useState('');
  const [responseSubmitted, setResponseSubmitted] = useState(false);
  const draw = draws.find((d) => d.id === drawId) || draws[0];
  const project = projects.find((p) => p.id === draw.projectId);
  const milestoneIndex =
  project?.milestones.findIndex((m) => m.id === draw.milestoneId) ?? -1;
  const milestoneNumber = milestoneIndex + 1;
  const totalMilestones = project?.milestones.length ?? 0;
  const completedMilestones =
  project?.milestones.filter((m) => m.status === 'completed').length ?? 0;
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(draw.photos);
  const [photosSaved, setPhotosSaved] = useState(draw.photos.length > 0);
  const handleUpload = (files: FileList) => {
    const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file));
    setUploadedPhotos((prev) => [...prev, ...newPhotos].slice(0, 10));
    setPhotosSaved(false);
  };
  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotosSaved(false);
  };
  const handleSavePhotos = () => {
    setPhotosSaved(true);
    addToast('success');
  };
  const handleSubmitDraw = () => {
    setSubmitModalOpen(false);
    addToast('success');
    onNavigate('project-detail', draw.projectId);
  };
  const handleApproveDraw = () => {
    setApproveModalOpen(false);
    addToast('success');
    onNavigate('dashboard');
  };
  const handleSubmitDispute = () => {
    if (!disputeReason) return;
    setDisputeSubmitted(true);
    setShowDisputeForm(false);
    addToast('error');
    // Go straight to the dispute thread — no intermediate confirmation card
    setTimeout(() => onNavigate('dispute', draw.id), 800);
  };
  const handleSubmitResponse = () => {
    if (!disputeResponse.trim()) return;
    setResponseSubmitted(true);
    addToast('success');
  };
  // Mock disputed draw state for demo
  const isDisputed = draw.status === 'disputed' as any;
  return (
    <div className="flex flex-col bg-gray-50 -m-4 lg:-m-8 min-h-full">
      {/* Submit Draw Confirmation */}
      <ConfirmationModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onConfirm={handleSubmitDraw}
        title="Submit Draw Request"
        message={`Submit a draw request for $${draw.amount.toLocaleString()} for "${draw.milestoneName}"? The homeowner will have ${draw.hoursRemaining ?? 48} hours to review before funds are automatically released.`}
        confirmText="Submit Request"
        icon="success" />


      {/* Approve Confirmation */}
      <ConfirmationModal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        onConfirm={handleApproveDraw}
        title="Approve Payment"
        message={`Release $${draw.amount.toLocaleString()} from escrow to ${project?.contractorName}? This confirms the milestone "${draw.milestoneName}" is complete.`}
        confirmText="Approve & Release Funds"
        icon="success" />


      <div className="p-4 lg:p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* ── HOMEOWNER: Auto-release countdown banner ── */}
          {userRole === 'homeowner' &&
          draw.status === 'pending' &&
          draw.hoursRemaining &&
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-amber-900">
                    Action needed within {draw.hoursRemaining} hours
                  </p>
                  <p className="text-xs text-amber-700">
                    If no action is taken, funds will be automatically released
                    to the contractor.
                  </p>
                </div>
              </div>
          }

          {/* ── CONTRACTOR: Disputed notice ── */}
          {userRole === 'contractor' && isDisputed &&
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-900">
                  This draw has been disputed
                </p>
                <p className="text-xs text-red-700 mt-0.5">
                  The homeowner has raised a concern. Review their reason below
                  and respond or message them directly.
                </p>
              </div>
            </div>
          }

          {/* Draw Summary Card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Amount header */}
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {draw.milestoneName}
                  </h2>
                  {draw.type === 'change-order' &&
                  <span className="text-xs font-bold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      Change Order
                    </span>
                  }
                </div>
                {draw.type === 'change-order' ?
                <p className="text-sm text-amber-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Approved change order — draw request for additional work
                  </p> :

                milestoneNumber > 0 &&
                <div className="flex items-center gap-1.5 mt-1">
                      <Layers className="w-3.5 h-3.5 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        Milestone {milestoneNumber} of {totalMilestones}
                        <span className="mx-1.5 text-gray-300">·</span>
                        {completedMilestones} of {totalMilestones} completed
                      </p>
                    </div>

                }
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Amount</p>
                <p
                  className={`text-3xl font-bold font-mono ${draw.type === 'change-order' ? 'text-amber-700' : 'text-[#1e3a5f]'}`}>

                  ${draw.amount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Meta row */}
            <div className="px-6 py-3 border-b border-gray-100 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-gray-600">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span>Submitted {draw.dateSubmitted}</span>
              </div>
              {draw.hoursRemaining &&
              draw.status === 'pending' &&
              userRole === 'contractor' &&
              <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                    <Clock className="w-4 h-4" />
                    <span>
                      Auto-releases in {draw.hoursRemaining}h if homeowner takes
                      no action
                    </span>
                  </div>
              }
            </div>

            {/* Milestone progress bar */}
            {project && totalMilestones > 0 &&
            <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>Project Milestone Progress</span>
                  <span>
                    {Math.round(completedMilestones / totalMilestones * 100)}%
                    complete
                  </span>
                </div>
                <div className="flex gap-1">
                  {project.milestones.map((m) =>
                <div
                  key={m.id}
                  title={m.name}
                  className={`h-2 flex-1 rounded-full transition-colors ${m.status === 'completed' ? 'bg-green-500' : m.id === draw.milestoneId ? 'bg-amber-400' : 'bg-gray-200'}`} />

                )}
                </div>
              </div>
            }

            <div className="p-6 space-y-6">
              {/* Work Description */}
              <div>
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-3">
                  Work Completed
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {draw.description}
                </p>
              </div>

              {/* Evidence Photos */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold uppercase text-gray-500">
                    {userRole === 'contractor' ?
                    'Evidence Photos' :
                    'Work Photos'}
                  </h3>
                  {userRole === 'contractor' &&
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5" />
                      {uploadedPhotos.length} photo
                      {uploadedPhotos.length !== 1 ? 's' : ''} attached
                    </span>
                  }
                </div>

                {userRole === 'contractor' ?
                <div className="space-y-4">
                    <PhotoUpload
                    photos={uploadedPhotos}
                    onUpload={handleUpload}
                    onRemove={handleRemovePhoto}
                    maxPhotos={10} />

                    {uploadedPhotos.length === 0 &&
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700">
                          Adding clear photos of completed work significantly
                          increases approval speed. Homeowners are 3× more
                          likely to approve requests with photo evidence.
                        </p>
                      </div>
                  }
                    {!photosSaved && uploadedPhotos.length > 0 &&
                  <div className="flex items-center gap-3 pt-1">
                        <PrimaryButton size="sm" onClick={handleSavePhotos}>
                          Save Photos
                        </PrimaryButton>
                        <p className="text-xs text-amber-600 font-medium">
                          Unsaved changes
                        </p>
                      </div>
                  }
                    {photosSaved && uploadedPhotos.length > 0 &&
                  <div className="flex items-center gap-1.5 text-green-600 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-medium">Photos saved</span>
                      </div>
                  }
                  </div> :
                uploadedPhotos.length > 0 ?
                <PhotoGallery photos={uploadedPhotos} /> :

                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                    <Camera className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">
                      No photos attached to this request
                    </p>
                  </div>
                }
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════
            CONTRACTOR ACTIONS
            ══════════════════════════════════════════ */}
          {userRole === 'contractor' && draw.status === 'pending' &&
          <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Send className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    Ready to Request Payment?
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Once submitted, {project?.homeownerName} will have{' '}
                    {draw.hoursRemaining ?? 48} hours to review and approve. If
                    no action is taken, funds release automatically.
                  </p>
                </div>
              </div>
              <PrimaryButton fullWidth onClick={() => setSubmitModalOpen(true)}>
                <Send className="w-4 h-4 mr-2" />
                Request Draw — ${draw.amount.toLocaleString()}
              </PrimaryButton>
            </div>
          }

          {/* Contractor: Dispute Response */}
          {userRole === 'contractor' && isDisputed &&
          <div className="bg-white rounded-xl border border-red-200 p-6 space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                This Draw Has Been Disputed
              </h3>
              <p className="text-sm text-gray-600">
                The homeowner has filed a dispute. View the full dispute thread,
                respond, and track the resolution — all communications are
                recorded for legal purposes.
              </p>
              <PrimaryButton
              fullWidth
              onClick={() => onNavigate('dispute', draw.id)}>

                <MessageCircle className="w-4 h-4 mr-2" />
                Open Dispute Thread
              </PrimaryButton>
            </div>
          }

          {/* Contractor: Approved state */}
          {userRole === 'contractor' && draw.status === 'approved' &&
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-green-900">Payment Approved</p>
                <p className="text-sm text-green-700">
                  ${draw.amount.toLocaleString()} has been released from escrow.
                  Funds will arrive within 1–2 business days.
                </p>
              </div>
            </div>
          }

          {/* ══════════════════════════════════════════
            HOMEOWNER ACTIONS
            ══════════════════════════════════════════ */}
          {userRole === 'homeowner' &&
          draw.status === 'pending' &&
          !showDisputeForm &&
          !disputeSubmitted &&
          <div className="grid grid-cols-2 gap-4">
                <DangerButton
              size="lg"
              fullWidth
              onClick={() => setShowDisputeForm(true)}>

                  <XCircle className="w-4 h-4 mr-2" />
                  Dispute
                </DangerButton>
                <SuccessButton
              size="lg"
              fullWidth
              onClick={() => setApproveModalOpen(true)}>

                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Payment
                </SuccessButton>
              </div>
          }

          {/* Homeowner: Dispute Form */}
          {userRole === 'homeowner' && showDisputeForm &&
          <div className="bg-white rounded-xl border border-red-100 p-6 space-y-5 shadow-sm">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  What's the issue?
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Funds stay in escrow until this is resolved. The contractor
                  will be notified and can respond.
                </p>
              </div>

              {/* Tap-to-select reason chips */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Select a reason
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {DISPUTE_REASONS.map(({ label, icon }) =>
                <button
                  key={label}
                  type="button"
                  onClick={() => setDisputeReason(label)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all ${disputeReason === label ? 'border-red-400 bg-red-50 text-red-800 shadow-sm' : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}>

                      <span className="text-base leading-none">{icon}</span>
                      <span>{label}</span>
                    </button>
                )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Add details{' '}
                  <span className="font-normal normal-case text-gray-400">
                    (optional)
                  </span>
                </p>
                <textarea
                value={disputeNotes}
                onChange={(e) => setDisputeNotes(e.target.value)}
                placeholder="Describe what you're seeing — the more specific, the faster this gets resolved..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-300 resize-none transition-all" />

              </div>

              <div className="flex gap-3 pt-1">
                <DangerButton
                fullWidth
                onClick={handleSubmitDispute}
                disabled={!disputeReason}>

                  Submit Dispute
                </DangerButton>
                <SecondaryButton onClick={() => setShowDisputeForm(false)}>
                  Cancel
                </SecondaryButton>
              </div>
            </div>
          }

          {/* Homeowner: Dispute submitted — brief confirmation before redirect */}
          {userRole === 'homeowner' && disputeSubmitted &&
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-orange-900">
                  Dispute filed — opening thread…
                </p>
                <p className="text-xs text-orange-700 mt-0.5">
                  Funds are held in escrow. Taking you to the dispute record.
                </p>
              </div>
            </div>
          }

          {/* History */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">History</h3>
            <Timeline
              events={[
              {
                id: '1',
                title: 'Draw Request Submitted',
                timestamp: draw.dateSubmitted,
                status: 'neutral',
                description: `${draw.milestoneName} · $${draw.amount.toLocaleString()}`
              },
              {
                id: '2',
                title: 'Milestone Started',
                timestamp: 'Feb 01, 2025',
                status: 'success',
                description: project ? project.address : undefined
              }]
              } />

          </div>
        </div>
      </div>
    </div>);

}