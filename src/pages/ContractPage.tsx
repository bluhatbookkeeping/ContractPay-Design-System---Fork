import React, { useState } from 'react';
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
import { projects } from '../data/mockData';
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
  // Get clauses selected for this contract (from store, falls back to defaults)
  const selectedClauses = getSelectedClauses();
  const clausesToShow =
  selectedClauses.length > 0 ?
  selectedClauses :
  defaultClauses.filter((c) => c.isDefault);
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
            <SecondaryButton size="sm">
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


      <div className="p-4 lg:p-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          {/* Contract Header */}
          <div className="bg-navy-900 text-white p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Construction Agreement
                </h1>
                <p className="text-navy-200">
                  Contract #{project.id.toUpperCase()}-2025
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <span className="text-xs text-navy-100 uppercase tracking-wider block mb-1">
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
                  <p className="text-navy-200 text-xs uppercase">Client</p>
                  <p className="font-semibold">{project.homeownerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-navy-200 text-xs uppercase">Location</p>
                  <p className="font-semibold">{project.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-navy-200 text-xs uppercase">Timeline</p>
                  <p className="font-semibold">
                    {project.startDate} – {project.estimatedCompletion}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contract Body */}
          <div className="p-8 space-y-8">
            {/* Scope of Work */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                Scope of Work
              </h3>
              <div className="prose prose-sm text-gray-600 max-w-none bg-gray-50 p-6 rounded-lg border border-gray-100">
                <p>
                  Contractor agrees to perform the following work at the
                  location described above: Full kitchen remodel including
                  demolition of existing cabinets and flooring. Installation of
                  new custom cabinets, quartz countertops, and hardwood
                  flooring. Updating electrical and plumbing to code.
                  Installation of new appliances and fixtures. Painting of walls
                  and ceiling.
                </p>
                <p className="mt-4">
                  All work shall be completed in a workmanlike manner and in
                  compliance with all building codes and other applicable laws.
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
                          <StatusBadge
                          status={
                          m.status === 'completed' ?
                          'complete' :
                          m.status === 'current' ?
                          'active' :
                          'pending'
                          } />

                        </td>
                        <td className="px-6 py-4 text-right font-mono align-top">
                          ${m.amount.toLocaleString()}
                        </td>
                      </tr>
                    )}
                    <tr className="bg-gray-50 font-bold">
                      <td className="px-6 py-4" colSpan={2}>
                        Total Contract Value
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-lg text-navy-900">
                        ${project.contractAmount.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Terms & Conditions — Dynamic from Template Store */}
            <section>
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
                  className="border border-gray-200 rounded-lg overflow-hidden">

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

            {/* Signatures */}
            <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-gray-200">
              <div>
                <p className="text-sm font-bold text-gray-900 mb-8">
                  Contractor Signature
                </p>
                <div className="h-16 border-b border-gray-300 flex items-end pb-2">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png"
                    alt="Signature"
                    className="h-12 opacity-70" />

                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Signed by {project.contractorName} on {project.startDate}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 mb-8">
                  Homeowner Signature
                </p>
                {project.status === 'active' ||
                project.status === 'complete' ?
                <>
                    <div className="h-16 border-b border-gray-300 flex items-end pb-2">
                      <span className="font-script text-3xl text-navy-900">
                        {project.homeownerName}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Signed by {project.homeownerName} on {project.startDate}
                    </p>
                  </> :

                <div className="h-16 border-b border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 text-sm italic">
                    Waiting for signature...
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}