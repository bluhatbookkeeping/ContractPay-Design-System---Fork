import React, { useEffect, useState, createElement } from 'react';
import {
  Download,
  PenTool,
  Calendar,
  MapPin,
  User,
  FileText,
  DollarSign,
  Shield } from
'lucide-react';
import { HeaderBar } from '../components/Navigation';
import { StatusBadge } from '../components/Badges';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { ConfirmationModal } from '../components/Modals';
import { projects, changeOrders } from '../data/mockData';
import { getSelectedClauses, defaultClauses } from '../data/templateStore';
interface ContractPageProps {
  projectId?: string;
  onNavigate: (page: string, id?: string) => void;
  userRole: 'contractor' | 'homeowner';
  addToast: (variant: 'success' | 'error', title?: string) => void;
}
export function ContractPage({
  projectId,
  onNavigate,
  userRole,
  addToast
}: ContractPageProps) {
  const [signModalOpen, setSignModalOpen] = useState(false);
  const project = projects.find((p) => p.id === projectId) || projects[0];
  const approvedChangeOrders = changeOrders.filter(
    (co) => co.projectId === project.id && co.status === 'approved'
  );
  const changeOrderTotal = approvedChangeOrders.reduce(
    (sum, co) => sum + co.amount,
    0
  );
  const revisedTotal = project.contractAmount + changeOrderTotal;
  const selectedClauses = getSelectedClauses();
  const clausesToShow =
  selectedClauses.length > 0 ?
  selectedClauses :
  defaultClauses.filter((c) => c.isDefault);
  // Inject print styles on mount, clean up on unmount
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'contract-print-styles';
    style.innerHTML = `
      @media print {
        /* Hide all page chrome using visibility so DOM tree stays intact */
        body { margin: 0 !important; padding: 0 !important; background: white !important; }
        body * { visibility: hidden !important; }

        /* Show only the contract content */
        #contract-printable,
        #contract-printable * {
          visibility: visible !important;
        }

        /* Position contract at top-left of page */
        #contract-printable {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
          border: none !important;
          border-radius: 0 !important;
          overflow: visible !important;
          background: white !important;
        }

        /* Force color printing for navy header */
        #contract-printable .print-navy-header {
          background-color: #1e3a5f !important;
          color: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        #contract-printable .print-navy-header * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Blue escrow box */
        #contract-printable .print-blue-box {
          background-color: #eff6ff !important;
          border-color: #dbeafe !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Table footer stripe */
        #contract-printable .print-table-footer {
          background-color: #1e3a5f !important;
          color: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        #contract-printable .print-table-footer td {
          color: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Revised total banner */
        #contract-printable .print-revised-banner {
          background-color: #1e3a5f !important;
          color: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        #contract-printable .print-revised-banner * {
          color: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Amber change order rows */
        #contract-printable .print-co-row {
          background-color: #fffbeb !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Swap badge for plain text */
        #contract-printable .status-badge-print { display: none !important; }
        #contract-printable .status-text-print {
          display: inline !important;
          visibility: visible !important;
        }

        /* Page break control */
        #contract-printable section { page-break-inside: avoid; }
        #contract-printable .signatures-section {
          page-break-inside: avoid;
          margin-top: 24px;
        }

        @page {
          margin: 0.6in 0.7in;
          size: letter portrait;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const existing = document.getElementById('contract-print-styles');
      if (existing) existing.remove();
    };
  }, []);
  const handlePrintPDF = () => {
    window.print();
  };
  const handleSign = () => {
    setSignModalOpen(false);
    addToast('success', 'Contract signed successfully');
  };
  return (
    <div className="flex flex-col bg-gray-50 -m-4 lg:-m-8 min-h-full">
      <ConfirmationModal
        isOpen={signModalOpen}
        onClose={() => setSignModalOpen(false)}
        onConfirm={handleSign}
        title="Sign Contract"
        message={`By signing, you agree to the terms and conditions for the project at ${project.address}. This action is legally binding.`}
        confirmText="Sign & Accept"
        icon="success" />


      <HeaderBar
        title="Contract Details"
        showBack
        onBack={() => onNavigate('project-detail', projectId)}
        rightAction={
        <div className="flex items-center gap-2">
            <SecondaryButton size="sm" onClick={handlePrintPDF}>
              <Download className="w-4 h-4 mr-2" />
              PDF
            </SecondaryButton>
            {project.status === 'sent' &&
          <PrimaryButton size="sm" onClick={() => setSignModalOpen(true)}>
                <PenTool className="w-4 h-4 mr-2" />
                Sign Contract
              </PrimaryButton>
          }
          </div>
        } />


      {/* Print root wrapper — only this is shown when printing */}
      <div id="contract-print-root">
        <div className="p-4 lg:p-8">
          <div
            id="contract-printable"
            className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">

            {/* Contract Header */}
            <div className="print-navy-header bg-navy-900 text-white p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-blue-200 text-sm font-medium tracking-widest uppercase">
                      ContractPay
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">
                    Construction Agreement
                  </h1>
                  <p className="text-blue-200">
                    Contract #{project.id.toUpperCase()}-2025
                  </p>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20 text-right">
                  <span className="text-xs text-blue-100 uppercase tracking-wider block mb-1">
                    Status
                  </span>
                  <span className="font-bold">
                    {project.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs uppercase">Client</p>
                    <p className="font-semibold">{project.homeownerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs uppercase">Location</p>
                    <p className="font-semibold">{project.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs uppercase">Timeline</p>
                    <p className="font-semibold">
                      {project.startDate} – {project.estimatedCompletion}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Body */}
            <div className="p-8 space-y-8">
              {/* Parties */}
              <section className="grid md:grid-cols-2 gap-6 p-5 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Contractor
                  </p>
                  <p className="font-bold text-gray-900">
                    {project.contractorName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Licensed General Contractor
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Homeowner / Client
                  </p>
                  <p className="font-bold text-gray-900">
                    {project.homeownerName}
                  </p>
                  <p className="text-sm text-gray-500">{project.address}</p>
                </div>
              </section>

              {/* Scope of Work */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  Scope of Work
                </h3>
                <div className="prose prose-sm text-gray-600 max-w-none bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <p>
                    Contractor agrees to perform the following work at the
                    location described above, including all milestones outlined
                    in the payment schedule:
                  </p>
                  <ul className="mt-3 space-y-2 list-none pl-0">
                    {project.milestones.map((m) =>
                    <li key={m.id} className="flex items-start gap-2">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                        <span>
                          <strong>{m.name}</strong>
                          {m.description ? ` — ${m.description}` : ''}
                        </span>
                      </li>
                    )}
                  </ul>
                  <p className="mt-4">
                    All work shall be completed in a workmanlike manner and in
                    compliance with all applicable building codes and other
                    applicable laws.
                  </p>
                </div>
              </section>

              {/* Payment Schedule */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  Payment Schedule
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3">Milestone</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {project.milestones.map((m, i) =>
                      <tr key={m.id}>
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">
                              {i + 1}. {m.name}
                            </p>
                            {m.description &&
                          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed max-w-sm break-words">
                                {m.description}
                              </p>
                          }
                          </td>
                          <td className="px-6 py-4">
                            <span className="status-badge-print">
                              <StatusBadge
                              status={
                              m.status === 'completed' ?
                              'complete' :
                              m.status === 'disputed' ?
                              'pending' :
                              m.status === 'current' ?
                              'active' :
                              'pending'
                              } />

                            </span>
                            <span className="status-text-print hidden text-xs font-medium text-gray-700 uppercase tracking-wide">
                              {m.status === 'completed' ?
                            'Completed' :
                            m.status === 'current' ?
                            'In Progress' :
                            'Upcoming'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-mono align-top">
                            ${m.amount.toLocaleString()}
                          </td>
                        </tr>
                      )}

                      {/* Original subtotal */}
                      <tr className="bg-gray-50 border-t-2 border-gray-200">
                        <td
                          className="px-6 py-3 text-sm text-gray-500"
                          colSpan={2}>

                          Original Contract Value
                        </td>
                        <td className="px-6 py-3 text-right font-mono text-sm text-gray-700">
                          ${project.contractAmount.toLocaleString()}
                        </td>
                      </tr>

                      {/* Change Orders section */}
                      {approvedChangeOrders.length > 0 &&
                      <>
                          <tr>
                            <td colSpan={3} className="px-6 pt-5 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                                  Approved Change Orders
                                </span>
                                <div className="flex-1 h-px bg-amber-200" />
                              </div>
                            </td>
                          </tr>
                          {approvedChangeOrders.map((co, i) =>
                        <tr
                          key={co.id}
                          className="print-co-row bg-amber-50/40">

                              <td className="px-6 py-3">
                                <div className="flex items-start gap-2">
                                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0">
                                    CO-{i + 1}
                                  </span>
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {co.title}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      {co.description}
                                    </p>
                                    {co.dateApproved &&
                                <p className="text-xs text-amber-600 mt-0.5">
                                        Approved {co.dateApproved}
                                      </p>
                                }
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-3">
                                <span className="text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                                  Approved
                                </span>
                              </td>
                              <td className="px-6 py-3 text-right font-mono text-amber-700">
                                +${co.amount.toLocaleString()}
                              </td>
                            </tr>
                        )}
                          <tr className="print-co-row bg-amber-50/60 border-t border-amber-100">
                            <td
                            className="px-6 py-3 text-sm text-amber-700"
                            colSpan={2}>

                              Change Orders Subtotal
                            </td>
                            <td className="px-6 py-3 text-right font-mono text-sm text-amber-700">
                              +${changeOrderTotal.toLocaleString()}
                            </td>
                          </tr>
                        </>
                      }

                      {/* Revised total row inside table */}
                      <tr className="print-table-footer bg-[#1e3a5f] font-bold">
                        <td className="px-6 py-4 text-white" colSpan={2}>
                          {approvedChangeOrders.length > 0 ?
                          'Revised Contract Total' :
                          'Total Contract Value'}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-lg text-white">
                          ${revisedTotal.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Revised total summary banner — shown when there are change orders */}
                {approvedChangeOrders.length > 0 &&
                <div className="print-revised-banner mt-4 bg-[#1e3a5f] rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-xs uppercase tracking-widest font-medium mb-1">
                        Revised Contract Total
                      </p>
                      <p className="text-white text-3xl font-bold font-mono">
                        ${revisedTotal.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-200 text-xs mb-1">Original</p>
                      <p className="text-white/70 font-mono">
                        ${project.contractAmount.toLocaleString()}
                      </p>
                      <p className="text-amber-300 text-xs mt-1">
                        + ${changeOrderTotal.toLocaleString()} in change orders
                      </p>
                    </div>
                  </div>
                }
              </section>

              {/* Terms & Conditions */}
              <section className="terms-section">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-400" />
                  Terms & Conditions
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {clausesToShow.length} clause
                  {clausesToShow.length !== 1 ? 's' : ''} included in this
                  contract
                </p>
                <div className="space-y-3">
                  {clausesToShow.map((clause, index) =>
                  <div
                    key={clause.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                    style={{
                      pageBreakInside: 'avoid'
                    }}>

                      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 w-5">
                          {index + 1}.
                        </span>
                        <h4 className="text-sm font-bold text-gray-900">
                          {clause.name}
                        </h4>
                      </div>
                      <div className="px-5 py-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {clause.content}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Escrow Notice */}
              <section className="print-blue-box bg-blue-50 border border-blue-100 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-blue-900 mb-1">
                      ContractPay Escrow Protection
                    </p>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      All payments under this contract are held in a secure
                      ContractPay escrow account and released only upon
                      homeowner approval of each completed milestone. Neither
                      party may access escrowed funds without mutual agreement
                      or dispute resolution.
                    </p>
                  </div>
                </div>
              </section>

              {/* Signatures */}
              <div className="signatures-section grid md:grid-cols-2 gap-12 pt-8 border-t-2 border-gray-200">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Contractor Signature
                  </p>
                  <p className="text-sm text-gray-600 mb-6">
                    {project.contractorName}
                  </p>
                  <div className="h-16 border-b-2 border-gray-400 flex items-end pb-2">
                    <svg
                      viewBox="0 0 200 50"
                      className="h-10 w-auto opacity-80"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">

                      <path
                        d="M10 38 C20 10, 35 8, 45 28 C52 42, 58 18, 70 22 C80 25, 82 38, 92 35 C104 31, 108 14, 120 18 C130 21, 132 36, 142 33 C154 29, 160 12, 175 16 C185 19, 188 32, 195 30"
                        stroke="#1e3a5f"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round" />

                      <path
                        d="M15 42 C40 40, 80 41, 120 40 C150 39, 175 41, 192 40"
                        stroke="#1e3a5f"
                        strokeWidth="1"
                        strokeLinecap="round"
                        opacity="0.3" />

                    </svg>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Signed on {project.startDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Homeowner Signature
                  </p>
                  <p className="text-sm text-gray-600 mb-6">
                    {project.homeownerName}
                  </p>
                  {project.status === 'active' ||
                  project.status === 'complete' ?
                  <>
                      <div className="h-16 border-b-2 border-gray-400 flex items-end pb-2">
                        <span className="font-script text-3xl text-[#1e3a5f]">
                          {project.homeownerName}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Signed on {project.startDate}
                      </p>
                    </> :

                  <div className="h-16 border-b-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 text-sm italic rounded">
                      Awaiting signature…
                    </div>
                  }
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span>
                  Contract #{project.id.toUpperCase()}-2025 · Generated by
                  ContractPay
                </span>
                <span>
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}