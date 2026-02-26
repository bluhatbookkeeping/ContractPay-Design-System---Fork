import React, { useEffect, useState, createElement } from 'react';
import {
  AlertTriangle,
  Send,
  Download,
  Shield,
  Clock,
  User,
  MapPin,
  DollarSign,
  FileText,
  CheckCircle,
  MessageCircle,
  ChevronUp,
  Lock } from
'lucide-react';
import {
  PrimaryButton,
  SecondaryButton,
  DangerButton } from
'../components/Buttons';
import { StatusBadge } from '../components/Badges';
import { ConfirmationModal } from '../components/Modals';
import { draws, projects } from '../data/mockData';
interface DisputeMessage {
  id: string;
  author: string;
  role: 'contractor' | 'homeowner' | 'system' | 'mediator';
  content: string;
  timestamp: string;
  isOfficial?: boolean;
}
interface DisputePageProps {
  drawId?: string;
  onNavigate: (page: string, id?: string) => void;
  userRole: 'contractor' | 'homeowner';
  addToast: (variant: 'success' | 'error', title?: string) => void;
}
// Mock dispute thread
const mockDisputeThread: DisputeMessage[] = [
{
  id: 'dm1',
  author: 'Sarah Jenkins',
  role: 'homeowner',
  content:
  "The plumbing work doesn't look right to me. The drain line under the sink is visibly lower on one side and there's a small drip at the new shut-off valve under the kitchen sink. I don't think this should be approved until these issues are corrected.",
  timestamp: 'Feb 10, 2025 · 3:22 PM',
  isOfficial: true
},
{
  id: 'dm2',
  author: 'ContractPay',
  role: 'system',
  content:
  'Dispute filed. $12,000 is held in escrow pending resolution. ABC Construction has been notified and has 72 hours to respond. All communications are recorded.',
  timestamp: 'Feb 10, 2025 · 3:22 PM'
},
{
  id: 'dm3',
  author: 'John Builder',
  role: 'contractor',
  content:
  'Hi Sarah — I understand your concern. The slight angle on the drain line is intentional; code requires a minimum 1/4" per foot slope toward the drain for proper flow. I can bring the inspection report that confirms this passed. Regarding the drip at the shut-off valve: that\'s a minor packing nut issue that takes about 5 minutes to tighten. I can be there tomorrow morning to fix it and walk you through both items in person.',
  timestamp: 'Feb 11, 2025 · 9:15 AM'
},
{
  id: 'dm4',
  author: 'Sarah Jenkins',
  role: 'homeowner',
  content:
  "Thank you for explaining the slope — I wasn't aware of that code requirement. The drip is my main concern. If you can fix that and show me the inspection report, I'm willing to approve the draw.",
  timestamp: 'Feb 11, 2025 · 11:40 AM'
},
{
  id: 'dm5',
  author: 'John Builder',
  role: 'contractor',
  content:
  "Perfect. I'll be there tomorrow at 8am. I'll bring the signed inspection report from the city and fix the valve. Should take less than 30 minutes total. I'll send you a photo of the completed fix as well.",
  timestamp: 'Feb 11, 2025 · 12:05 PM'
},
{
  id: 'dm6',
  author: 'ContractPay',
  role: 'system',
  content:
  'Reminder: This dispute will auto-escalate to ContractPay Mediation if not resolved within 5 days (by Feb 15, 2025).',
  timestamp: 'Feb 12, 2025 · 9:00 AM'
},
{
  id: 'dm7',
  author: 'Sarah Jenkins',
  role: 'homeowner',
  content:
  "John came by this morning, fixed the valve, and showed me the inspection paperwork. Everything looks good now. I'm ready to approve the draw.",
  timestamp: 'Feb 12, 2025 · 10:55 AM'
}];

export function DisputePage({
  drawId,
  onNavigate,
  userRole,
  addToast
}: DisputePageProps) {
  const [messages, setMessages] = useState<DisputeMessage[]>(mockDisputeThread);
  const [newMessage, setNewMessage] = useState('');
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const draw =
  draws.find((d) => d.id === drawId) ||
  draws.find((d) => d.status === 'disputed' as any) ||
  draws[0];
  const project = projects.find((p) => p.id === draw.projectId);
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'dispute-print-styles';
    style.innerHTML = `
      @media print {
        body { margin: 0 !important; padding: 0 !important; background: white !important; }
        body * { visibility: hidden !important; }
        #dispute-printable, #dispute-printable * { visibility: visible !important; }
        #dispute-printable {
          position: absolute !important;
          top: 0 !important; left: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important; padding: 0 !important;
          box-shadow: none !important;
          border: none !important;
          border-radius: 0 !important;
          overflow: visible !important;
          background: white !important;
        }
        #dispute-printable .print-header {
          background-color: #7f1d1d !important;
          color: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        #dispute-printable .print-header * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        #dispute-printable section { page-break-inside: avoid; }
        #dispute-printable .message-block { page-break-inside: avoid; }
        @page { margin: 0.6in 0.7in; size: letter portrait; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById('dispute-print-styles');
      if (el) el.remove();
    };
  }, []);
  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: DisputeMessage = {
      id: `dm${Date.now()}`,
      author: userRole === 'contractor' ? 'John Builder' : 'Sarah Jenkins',
      role: userRole,
      content: newMessage.trim(),
      timestamp:
      new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) +
      ' · ' +
      new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      })
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
    addToast('success', 'Response recorded');
  };
  const handleEscalate = () => {
    setEscalateModalOpen(false);
    setIsEscalated(true);
    const sysMsg: DisputeMessage = {
      id: `dm${Date.now()}`,
      author: 'ContractPay',
      role: 'mediator',
      content:
      'This dispute has been escalated to ContractPay Mediation. A licensed mediator will review all communications, evidence, and contract terms within 2 business days. All parties will be contacted via email. This record is now locked for legal purposes.',
      timestamp:
      new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) +
      ' · ' +
      new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      }),
      isOfficial: true
    };
    setMessages((prev) => [...prev, sysMsg]);
    addToast('success', 'Escalated to ContractPay Mediation');
  };
  const handleResolve = () => {
    setResolveModalOpen(false);
    addToast('success', 'Dispute resolved — funds released');
    onNavigate('draws');
  };
  const roleColors: Record<string, string> = {
    contractor: 'bg-[#1e3a5f] text-white',
    homeowner: 'bg-gray-100 text-gray-900',
    system: 'bg-amber-50 text-amber-900 border border-amber-200',
    mediator: 'bg-purple-50 text-purple-900 border border-purple-200'
  };
  const roleLabel: Record<string, string> = {
    contractor: 'Contractor',
    homeowner: 'Homeowner',
    system: 'ContractPay System',
    mediator: 'ContractPay Mediator'
  };
  return (
    <div className="flex flex-col bg-gray-50 -m-4 lg:-m-8 min-h-full">
      <ConfirmationModal
        isOpen={escalateModalOpen}
        onClose={() => setEscalateModalOpen(false)}
        onConfirm={handleEscalate}
        title="Escalate to Mediation"
        message="This will notify a ContractPay mediator who will review all dispute communications, photos, and contract terms. The dispute record will be locked. Are you sure?"
        confirmText="Escalate Dispute"
        confirmVariant="danger" />

      <ConfirmationModal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        onConfirm={handleResolve}
        title="Resolve Dispute"
        message={`Confirm that both parties have agreed to a resolution. Funds of $${draw.amount.toLocaleString()} will be released from escrow.`}
        confirmText="Confirm Resolution"
        icon="success" />


      {/* Screen view */}
      <div className="p-4 lg:p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Status banner */}
          <div
            className={`rounded-xl p-4 flex items-center gap-3 ${isEscalated ? 'bg-purple-50 border border-purple-200' : 'bg-red-50 border border-red-200'}`}>

            {isEscalated ?
            <Shield className="w-5 h-5 text-purple-600 flex-shrink-0" /> :

            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            }
            <div className="flex-1">
              <p
                className={`text-sm font-bold ${isEscalated ? 'text-purple-900' : 'text-red-900'}`}>

                {isEscalated ?
                'Escalated to ContractPay Mediation' :
                'Dispute In Progress — Funds Held in Escrow'}
              </p>
              <p
                className={`text-xs mt-0.5 ${isEscalated ? 'text-purple-700' : 'text-red-700'}`}>

                {isEscalated ?
                'A mediator is reviewing this case. All communications are recorded.' :
                `$${draw.amount.toLocaleString()} is protected in escrow until this dispute is resolved.`}
              </p>
            </div>
            <SecondaryButton size="sm" onClick={() => window.print()}>
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </SecondaryButton>
          </div>

          {/* Dispute summary */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Disputed Draw
                  </p>
                  <h2 className="text-xl font-bold text-gray-900">
                    {draw.milestoneName}
                  </h2>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {project?.address}
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Opened Feb 20, 2025
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">
                    Amount in Dispute
                  </p>
                  <p className="text-2xl font-bold font-mono text-red-600">
                    ${draw.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 grid grid-cols-2 gap-4 text-sm border-b border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Contractor
                </p>
                <p className="font-semibold text-gray-900">
                  {project?.contractorName}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Homeowner
                </p>
                <p className="font-semibold text-gray-900">
                  {project?.homeownerName}
                </p>
              </div>
            </div>
            <div className="px-6 py-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Original Dispute Reason
              </p>
              <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                <p className="text-sm font-semibold text-red-800 mb-1">
                  Work is incomplete
                </p>
                <p className="text-sm text-red-700">
                  {mockDisputeThread[0].content}
                </p>
              </div>
            </div>
          </div>

          {/* Dispute thread */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-gray-400" />
                Dispute Communications
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Lock className="w-3.5 h-3.5" />
                <span>All messages are timestamped and immutable</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {messages.map((msg) =>
              <div key={msg.id} className="message-block">
                  {msg.role === 'system' || msg.role === 'mediator' ?
                <div
                  className={`rounded-lg px-4 py-3 text-sm ${roleColors[msg.role]}`}>

                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-3.5 h-3.5" />
                        <span className="font-bold text-xs uppercase tracking-wide">
                          {roleLabel[msg.role]}
                        </span>
                        <span className="text-xs opacity-60 ml-auto">
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="leading-relaxed">{msg.content}</p>
                    </div> :

                <div
                  className={`flex flex-col ${msg.role === userRole ? 'items-end' : 'items-start'}`}>

                      <div className="flex items-center gap-2 mb-1.5">
                        <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${msg.role === 'contractor' ? 'bg-[#1e3a5f] text-white' : 'bg-gray-200 text-gray-700'}`}>

                          {msg.author.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-gray-700">
                          {msg.author}
                        </span>
                        <span className="text-xs text-gray-400">
                          · {roleLabel[msg.role]}
                        </span>
                        {msg.isOfficial &&
                    <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
                            Official Filing
                          </span>
                    }
                      </div>
                      <div
                    className={`max-w-[85%] px-4 py-3 rounded-xl text-sm leading-relaxed ${msg.role === userRole ? 'bg-[#1e3a5f] text-white rounded-tr-sm' : 'bg-gray-50 border border-gray-200 text-gray-800 rounded-tl-sm'}`}>

                        {msg.content}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1">
                        {msg.timestamp}
                      </span>
                    </div>
                }
                </div>
              )}
            </div>

            {/* Response input */}
            {!isEscalated &&
            <div className="px-6 pb-6">
                <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#1e3a5f]/40 focus-within:ring-1 focus-within:ring-[#1e3a5f]/20 transition-all">
                  <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={
                  userRole === 'contractor' ?
                  'Respond to the dispute — be specific about work completed, dates, and any supporting details...' :
                  'Add to the dispute record — describe your concerns clearly...'
                  }
                  rows={3}
                  className="w-full px-4 py-3 text-sm border-none focus:ring-0 resize-none bg-white" />

                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      This message will be permanently recorded
                    </p>
                    <button
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${newMessage.trim() ? 'bg-[#1e3a5f] text-white hover:bg-[#162d4a]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>

                      <Send className="w-3.5 h-3.5" />
                      Submit Response
                    </button>
                  </div>
                </div>
              </div>
            }

            {isEscalated &&
            <div className="px-6 pb-6">
                <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-purple-800">
                  <Lock className="w-4 h-4 flex-shrink-0" />
                  <span>
                    This dispute has been escalated. The record is locked and
                    under mediator review.
                  </span>
                </div>
              </div>
            }
          </div>

          {/* Actions */}
          {!isEscalated &&
          <div className="grid grid-cols-2 gap-4">
              <DangerButton
              fullWidth
              onClick={() => setEscalateModalOpen(true)}>

                <ChevronUp className="w-4 h-4 mr-2" />
                Escalate to Mediation
              </DangerButton>
              <PrimaryButton
              fullWidth
              onClick={() => setResolveModalOpen(true)}>

                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Resolved
              </PrimaryButton>
            </div>
          }

          <p className="text-xs text-center text-gray-400 pb-2">
            All dispute communications are encrypted, timestamped, and
            admissible as legal documentation. Export a full dispute report
            using the Export button above.
          </p>
        </div>
      </div>

      {/* ── PRINT / LEGAL EXPORT DOCUMENT ── */}
      <div
        id="dispute-printable"
        style={{
          display: 'none'
        }}>

        <div
          style={{
            fontFamily: 'Georgia, serif',
            color: '#111',
            background: 'white'
          }}>

          {/* Header */}
          <div
            className="print-header"
            style={{
              background: '#7f1d1d',
              color: 'white',
              padding: '32px 40px'
            }}>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>

              <div>
                <p
                  style={{
                    fontSize: '11px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    opacity: 0.7,
                    marginBottom: '8px'
                  }}>

                  ContractPay · Dispute Record
                </p>
                <h1
                  style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    marginBottom: '4px'
                  }}>

                  Dispute Resolution File
                </h1>
                <p
                  style={{
                    opacity: 0.7,
                    fontSize: '14px'
                  }}>

                  Case #{draw.id.toUpperCase()}-DISPUTE · Generated{' '}
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div
                style={{
                  textAlign: 'right',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '12px 16px',
                  borderRadius: '8px'
                }}>

                <p
                  style={{
                    fontSize: '11px',
                    opacity: 0.7,
                    marginBottom: '4px'
                  }}>

                  STATUS
                </p>
                <p
                  style={{
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>

                  {isEscalated ? 'ESCALATED' : 'OPEN'}
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '32px 40px',
              lineHeight: 1.6
            }}>

            {/* Parties & Case Info */}
            <section
              style={{
                marginBottom: '32px',
                padding: '20px',
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}>

              <h2
                style={{
                  fontSize: '13px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#6b7280',
                  marginBottom: '16px'
                }}>

                Case Information
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px'
                }}>

                <div>
                  <p
                    style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      marginBottom: '4px'
                    }}>

                    Project Address
                  </p>
                  <p
                    style={{
                      fontWeight: 'bold'
                    }}>

                    {project?.address}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      marginBottom: '4px'
                    }}>

                    Disputed Milestone
                  </p>
                  <p
                    style={{
                      fontWeight: 'bold'
                    }}>

                    {draw.milestoneName}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      marginBottom: '4px'
                    }}>

                    Contractor
                  </p>
                  <p
                    style={{
                      fontWeight: 'bold'
                    }}>

                    {project?.contractorName}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      marginBottom: '4px'
                    }}>

                    Homeowner
                  </p>
                  <p
                    style={{
                      fontWeight: 'bold'
                    }}>

                    {project?.homeownerName}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      marginBottom: '4px'
                    }}>

                    Amount in Dispute
                  </p>
                  <p
                    style={{
                      fontWeight: 'bold',
                      fontSize: '18px'
                    }}>

                    ${draw.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      marginBottom: '4px'
                    }}>

                    Date Opened
                  </p>
                  <p
                    style={{
                      fontWeight: 'bold'
                    }}>

                    February 20, 2025
                  </p>
                </div>
              </div>
            </section>

            {/* Dispute Reason */}
            <section
              style={{
                marginBottom: '32px'
              }}>

              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  borderBottom: '2px solid #e5e7eb',
                  paddingBottom: '8px'
                }}>

                Original Dispute Filing
              </h2>
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '16px'
                }}>

                <p
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '4px',
                    color: '#991b1b'
                  }}>

                  Reason: Work is incomplete
                </p>
                <p
                  style={{
                    color: '#7f1d1d',
                    fontSize: '14px'
                  }}>

                  {mockDisputeThread[0].content}
                </p>
                <p
                  style={{
                    fontSize: '11px',
                    color: '#9ca3af',
                    marginTop: '8px'
                  }}>

                  Filed by: {mockDisputeThread[0].author} ·{' '}
                  {mockDisputeThread[0].timestamp}
                </p>
              </div>
            </section>

            {/* Full Communication Log */}
            <section
              style={{
                marginBottom: '32px'
              }}>

              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  borderBottom: '2px solid #e5e7eb',
                  paddingBottom: '8px'
                }}>

                Complete Communication Record
              </h2>
              <p
                style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '16px'
                }}>

                All messages are timestamped and have not been altered. This
                record is admissible as legal documentation.
              </p>
              {messages.map((msg, i) =>
              <div
                key={msg.id}
                style={{
                  marginBottom: '16px',
                  pageBreakInside: 'avoid'
                }}>

                  <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>

                    <span
                    style={{
                      fontWeight: 'bold',
                      fontSize: '13px'
                    }}>

                      {msg.author}
                      <span
                      style={{
                        fontWeight: 'normal',
                        color: '#6b7280',
                        marginLeft: '8px',
                        fontSize: '12px'
                      }}>

                        ({roleLabel[msg.role]})
                      </span>
                      {msg.isOfficial &&
                    <span
                      style={{
                        marginLeft: '8px',
                        fontSize: '11px',
                        color: '#dc2626',
                        fontWeight: 'bold'
                      }}>

                          OFFICIAL FILING
                        </span>
                    }
                    </span>
                    <span
                    style={{
                      fontSize: '11px',
                      color: '#9ca3af'
                    }}>

                      {msg.timestamp}
                    </span>
                  </div>
                  <div
                  style={{
                    background:
                    msg.role === 'system' || msg.role === 'mediator' ?
                    '#f5f3ff' :
                    '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '13px',
                    lineHeight: 1.6
                  }}>

                    {msg.content}
                  </div>
                </div>
              )}
            </section>

            {/* Legal Notice */}
            <section
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '12px',
                color: '#6b7280'
              }}>

              <p
                style={{
                  fontWeight: 'bold',
                  marginBottom: '4px',
                  color: '#374151'
                }}>

                Legal Notice
              </p>
              <p>
                This document is an official record generated by ContractPay.
                All communications, timestamps, and dispute details contained
                herein are authentic and unmodified. This record may be
                submitted as evidence in mediation, arbitration, or legal
                proceedings. ContractPay maintains encrypted backups of all
                dispute records for a minimum of 7 years.
              </p>
              <p
                style={{
                  marginTop: '8px'
                }}>

                Generated: {new Date().toLocaleString()} · Case ID:{' '}
                {draw.id.toUpperCase()}-DISPUTE · ContractPay Platform
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>);

}