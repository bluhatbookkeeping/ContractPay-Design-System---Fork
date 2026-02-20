import React, { useState, useId } from 'react';
import {
  Check,
  ChevronRight,
  FileText,
  DollarSign,
  Shield,
  Lock,
  CreditCard,
  Building,
  ChevronDown,
  ChevronUp } from
'lucide-react';
import { HeaderBar } from '../components/Navigation';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { StatusBadge } from '../components/Badges';
import { TextInput } from '../components/FormElements';
import { projects } from '../data/mockData';
import {
  getSelectedClauses,
  defaultClauses,
  getSelectedTemplate } from
'../data/templateStore';
interface HomeownerContractReviewPageProps {
  projectId?: string;
  onNavigate: (page: string, id?: string) => void;
  addToast: (variant: 'success' | 'error', title?: string) => void;
}
export function HomeownerContractReviewPage({
  projectId,
  onNavigate,
  addToast
}: HomeownerContractReviewPageProps) {
  const [step, setStep] = useState(1);
  const [signature, setSignature] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'wire'>('bank');
  const [expandedClauseId, setExpandedClauseId] = useState<string | null>(null);
  const project = projects.find((p) => p.id === projectId) || projects[0];
  // Pull clauses from the store (same source as ContractPage)
  const selectedClauses = getSelectedClauses();
  const clausesToShow =
  selectedClauses.length > 0 ?
  selectedClauses :
  defaultClauses.filter((c) => c.isDefault);
  // Pull scope text from selected template, or fall back to project-specific description
  const selectedTemplate = getSelectedTemplate();
  const scopeText =
  selectedTemplate?.scope ||
  'Contractor agrees to perform a complete kitchen remodel at the property listed above, including: demolition of existing cabinets, countertops, and flooring; installation of new custom cabinets per approved layout; supply and installation of quartz countertops; installation of hardwood flooring; updating electrical outlets and under-cabinet lighting to code; installation of new appliances (supplied by homeowner unless otherwise noted); painting of walls and ceiling in colors selected by homeowner. All work shall be completed in a workmanlike manner and in compliance with all applicable building codes.';
  const handleNext = () => {
    if (step === 2 && !signature) {
      addToast('error', 'Please sign the contract to continue');
      return;
    }
    setStep(step + 1);
    window.scrollTo(0, 0);
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);else
    onNavigate('dashboard');
  };
  const handleComplete = () => {
    addToast('success', 'Contract signed and escrow funded successfully!');
    onNavigate('dashboard');
  };
  return (
    <div className="flex flex-col bg-gray-50 -m-4 lg:-m-8 min-h-full">
      <HeaderBar title="Contract Review & Setup" showBack onBack={handleBack} />

      <div className="p-4 lg:p-8 max-w-4xl mx-auto w-full">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-sm font-medium ${step >= 1 ? 'text-navy-900' : 'text-gray-400'}`}>

              Review
            </span>
            <span
              className={`text-sm font-medium ${step >= 2 ? 'text-navy-900' : 'text-gray-400'}`}>

              Sign
            </span>
            <span
              className={`text-sm font-medium ${step >= 3 ? 'text-navy-900' : 'text-gray-400'}`}>

              Fund Escrow
            </span>
            <span
              className={`text-sm font-medium ${step >= 4 ? 'text-navy-900' : 'text-gray-400'}`}>

              Complete
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
            <div
              className={`h-full bg-navy-900 transition-all duration-500 ease-in-out`}
              style={{
                width: `${step / 4 * 100}%`
              }} />

          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Step 1: Review Contract */}
          {step === 1 &&
          <div className="p-6 lg:p-8 space-y-8 animate-in fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Review Contract Terms
                </h2>
                <p className="text-gray-500">
                  Please review the scope of work, payment schedule, and all
                  contract terms carefully.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
                {/* Project header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {project.address}
                    </h3>
                    <p className="text-gray-500">
                      Contractor: {project.contractorName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Value</p>
                    <p className="text-xl font-mono font-bold text-navy-900">
                      ${project.contractAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Scope of Work — dynamic */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" /> Scope of Work
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {scopeText}
                  </p>
                </div>

                {/* Payment Schedule — dynamic from project milestones */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" /> Payment
                      Schedule
                    </h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {project.milestones.length > 0 ?
                    project.milestones.length :
                    4}{' '}
                      milestones
                    </span>
                  </div>

                  <div className="space-y-3">
                    {project.milestones.length > 0 ?
                  project.milestones.map((m, i) =>
                  <div
                    key={m.id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden">

                            {/* Milestone header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-navy-50 flex items-center justify-center text-xs font-bold text-navy-900 flex-shrink-0">
                                  {i + 1}
                                </div>
                                <span className="font-semibold text-gray-900 text-sm">
                                  {m.name}
                                </span>
                              </div>
                              <span className="font-mono font-bold text-navy-900 text-sm">
                                ${m.amount.toLocaleString()}
                              </span>
                            </div>
                            {/* What's included */}
                            {m.description ?
                    <div className="px-4 py-3 bg-gray-50">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                                  What's included
                                </p>
                                <p className="text-sm text-gray-700 leading-relaxed break-words">
                                  {m.description}
                                </p>
                              </div> :

                    <div className="px-4 py-3 bg-gray-50">
                                <p className="text-sm text-gray-400 italic">
                                  No details provided for this milestone.
                                </p>
                              </div>
                    }
                          </div>
                  ) :
                  // Fallback hardcoded milestones
                  [
                  {
                    name: 'Deposit / Materials',
                    amount: '$25,000',
                    description:
                    'Initial deposit to secure project start date and order all materials.'
                  },
                  {
                    name: 'Rough-in Complete',
                    amount: '$35,000',
                    description:
                    'Plumbing and electrical rough-in complete, inspected, and approved.'
                  },
                  {
                    name: 'Cabinet Installation',
                    amount: '$40,000',
                    description:
                    'All base and upper cabinets installed. Countertops fabricated and installed.'
                  },
                  {
                    name: 'Final Completion',
                    amount: '$20,000',
                    description:
                    'Paint, trim, fixtures, punch-list walkthrough, and final clean.'
                  }].
                  map((m, i) =>
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden">

                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-navy-50 flex items-center justify-center text-xs font-bold text-navy-900 flex-shrink-0">
                                  {i + 1}
                                </div>
                                <span className="font-semibold text-gray-900 text-sm">
                                  {m.name}
                                </span>
                              </div>
                              <span className="font-mono font-bold text-navy-900 text-sm">
                                {m.amount}
                              </span>
                            </div>
                            <div className="px-4 py-3 bg-gray-50">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                                What's included
                              </p>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {m.description}
                              </p>
                            </div>
                          </div>
                  )}

                    {/* Total row */}
                    <div className="flex items-center justify-between px-4 py-3 bg-navy-900 rounded-xl">
                      <span className="font-bold text-white text-sm">
                        Total Contract Value
                      </span>
                      <span className="font-mono font-bold text-white text-base">
                        ${project.contractAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions — dynamic from template store */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" /> Terms &
                    Conditions
                  </h4>
                  <p className="text-xs text-gray-500 mb-4">
                    {clausesToShow.length} clause
                    {clausesToShow.length !== 1 ? 's' : ''} included in this
                    contract
                  </p>
                  <div className="space-y-2">
                    {clausesToShow.map((clause, index) => {
                    const isExpanded = expandedClauseId === clause.id;
                    return (
                      <div
                        key={clause.id}
                        className="border border-gray-200 rounded-lg overflow-hidden bg-white">

                          <button
                          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                          onClick={() =>
                          setExpandedClauseId(isExpanded ? null : clause.id)
                          }>

                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-xs font-bold text-gray-400 w-5 flex-shrink-0">
                                {index + 1}.
                              </span>
                              <span className="text-sm font-semibold text-gray-900 truncate">
                                {clause.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                              <span className="text-xs text-gray-400 capitalize hidden sm:inline">
                                {clause.category}
                              </span>
                              {isExpanded ?
                            <ChevronUp className="w-4 h-4 text-gray-400" /> :

                            <ChevronDown className="w-4 h-4 text-gray-400" />
                            }
                            </div>
                          </button>
                          {isExpanded &&
                        <div className="px-4 pb-4 border-t border-gray-100">
                              <p className="text-sm text-gray-600 leading-relaxed pt-3 whitespace-pre-wrap break-words">
                                {clause.content}
                              </p>
                            </div>
                        }
                          {!isExpanded &&
                        <div className="px-4 pb-3">
                              <p className="text-xs text-gray-400 leading-relaxed line-clamp-1 break-words">
                                {clause.content}
                              </p>
                            </div>
                        }
                        </div>);

                  })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg text-blue-800 text-sm">
                <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                  ContractPay Escrow Protection: Your funds will be held
                  securely in escrow and only released when milestones are
                  completed and approved by you.
                </p>
              </div>
            </div>
          }

          {/* Step 2: Sign Contract */}
          {step === 2 &&
          <div className="p-6 lg:p-8 space-y-8 animate-in fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Sign Contract
                </h2>
                <p className="text-gray-500">
                  Type your full legal name to digitally sign this agreement.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-sm text-gray-600 space-y-4">
                  <p>
                    By signing below, I acknowledge that I have read and agree
                    to the terms and conditions outlined in the Construction
                    Agreement for the property at{' '}
                    <strong>{project.address}</strong>.
                  </p>
                  <p>
                    I understand that this is a legally binding contract between
                    myself (Homeowner) and {project.contractorName}{' '}
                    (Contractor).
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Digital Signature (Full Legal Name)
                  </label>
                  <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="block w-full h-14 px-4 rounded-lg border border-gray-300 text-lg font-script text-navy-900 focus:ring-2 focus:ring-navy-900 focus:border-transparent" />

                  <p className="text-xs text-gray-500 mt-2">
                    Signed by {signature || '[Your Name]'} on{' '}
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          }

          {/* Step 3: Fund Escrow */}
          {step === 3 &&
          <div className="p-6 lg:p-8 space-y-8 animate-in fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Fund Escrow Account
                </h2>
                <p className="text-gray-500">
                  Secure the project by funding the escrow account.
                </p>
              </div>

              <div className="max-w-xl mx-auto">
                <div className="bg-navy-900 text-white p-6 rounded-xl mb-8 text-center">
                  <p className="text-navy-200 text-sm uppercase tracking-wider mb-1">
                    Total to Fund
                  </p>
                  <p className="text-4xl font-bold font-mono">
                    ${project.contractAmount.toLocaleString()}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-navy-200 bg-white/10 py-1 px-3 rounded-full w-fit mx-auto">
                    <Lock className="w-3 h-3" /> Funds held securely by
                    ContractPay
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 mb-4">
                  Select Payment Method
                </h3>
                <div className="grid gap-4 mb-8">
                  <label
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-navy-900 bg-blue-50 ring-1 ring-navy-900' : 'border-gray-200 hover:border-gray-300'}`}>

                    <input
                    type="radio"
                    name="payment"
                    className="sr-only"
                    checked={paymentMethod === 'bank'}
                    onChange={() => setPaymentMethod('bank')} />

                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-navy-900 mr-4">
                      <Building className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">
                        Bank Transfer (ACH)
                      </p>
                      <p className="text-sm text-gray-500">
                        Connect your bank account via Plaid
                      </p>
                    </div>
                    <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                      {paymentMethod === 'bank' &&
                    <div className="w-2.5 h-2.5 rounded-full bg-navy-900" />
                    }
                    </div>
                  </label>

                  <label
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'wire' ? 'border-navy-900 bg-blue-50 ring-1 ring-navy-900' : 'border-gray-200 hover:border-gray-300'}`}>

                    <input
                    type="radio"
                    name="payment"
                    className="sr-only"
                    checked={paymentMethod === 'wire'}
                    onChange={() => setPaymentMethod('wire')} />

                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-navy-900 mr-4">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">Wire Transfer</p>
                      <p className="text-sm text-gray-500">
                        Manual transfer instructions
                      </p>
                    </div>
                    <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                      {paymentMethod === 'wire' &&
                    <div className="w-2.5 h-2.5 rounded-full bg-navy-900" />
                    }
                    </div>
                  </label>
                </div>
              </div>
            </div>
          }

          {/* Step 4: Complete */}
          {step === 4 &&
          <div className="p-12 text-center animate-in fade-in">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                You're All Set!
              </h2>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                The contract has been signed and your escrow account is funded.
                The contractor has been notified and can now begin work.
              </p>
              <div className="flex justify-center gap-4">
                <SecondaryButton
                onClick={() => onNavigate('project-detail', project.id)}>

                  View Project
                </SecondaryButton>
                <PrimaryButton onClick={handleComplete}>
                  Go to Dashboard
                </PrimaryButton>
              </div>
            </div>
          }

          {/* Footer Actions */}
          {step < 4 &&
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between">
              <SecondaryButton onClick={handleBack}>
                {step === 1 ? 'Cancel' : 'Back'}
              </SecondaryButton>
              <PrimaryButton onClick={handleNext}>
                {step === 1 ?
              'Accept & Continue' :
              step === 2 ?
              'Sign & Agree' :
              'Initiate Transfer'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </PrimaryButton>
            </div>
          }
        </div>
      </div>
    </div>);

}