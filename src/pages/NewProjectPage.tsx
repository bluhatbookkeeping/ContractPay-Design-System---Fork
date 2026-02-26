import React, { useEffect, useState, useId } from 'react';
import {
  ChevronRight,
  Plus,
  Trash2,
  Check,
  Library,
  FileText,
  DollarSign,
  Shield,
  ChevronDown,
  ChevronUp,
  X } from
'lucide-react';
import { HeaderBar } from '../components/Navigation';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import {
  TextInput,
  SelectInput,
  CurrencyInput,
  TextareaInput,
  PhoneInput } from
'../components/FormElements';
import { BottomSheet } from '../components/Modals';
import {
  getAllClauses,
  getSelectedClauseIds,
  setSelectedClauseIds,
  getSelectedTemplate,
  setSelectedTemplate,
  fullTemplates,
  Clause } from
'../data/templateStore';
interface NewProjectPageProps {
  onNavigate: (page: string, id?: string) => void;
  addToast: (variant: 'success' | 'error', title?: string) => void;
}
interface MilestoneItem {
  id: string;
  name: string;
  amount: string;
  description: string;
}
export function NewProjectPage({ onNavigate, addToast }: NewProjectPageProps) {
  const [step, setStep] = useState(1);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [appliedTemplate, setAppliedTemplate] = useState<
    (typeof fullTemplates)[0] | null>(
    null);
  const [previewExpandedSection, setPreviewExpandedSection] = useState<
    'scope' | 'milestones' | 'clauses' | null>(
    'milestones');
  const [formData, setFormData] = useState({
    address: '',
    homeownerName: '',
    homeownerEmail: '',
    homeownerPhone: '',
    projectType: '',
    scope: '',
    startDate: '',
    completionDate: '',
    contractValue: ''
  });
  const [milestones, setMilestones] = useState<MilestoneItem[]>([
  {
    id: '1',
    name: 'Deposit',
    amount: '',
    description: ''
  }]
  );
  const [selectedClauses, setSelectedClauses] = useState<string[]>(() =>
  getSelectedClauseIds()
  );
  const [allClauses] = useState<Clause[]>(() => getAllClauses());
  // Auto-apply template if one was selected from the Templates page
  useEffect(() => {
    const template = getSelectedTemplate();
    if (template) {
      setFormData((prev) => ({
        ...prev,
        projectType: template.projectType,
        scope: template.scope,
        contractValue: template.contractValue
      }));
      setMilestones(
        template.milestones.map((m, i) => ({
          id: String(i + 1),
          name: m.name,
          amount: m.amount,
          description: m.description ?? ''
        }))
      );
      const clauseIds = template.clauseIds;
      setSelectedClauses(clauseIds);
      setSelectedClauseIds(clauseIds);
      setAppliedTemplate(template);
      setSelectedTemplate(null);
      addToast('success', `"${template.name}" template applied`);
    }
  }, []);
  const updateForm = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  const addMilestone = () => {
    setMilestones([
    ...milestones,
    {
      id: Math.random().toString(),
      name: '',
      amount: '',
      description: ''
    }]
    );
  };
  const removeMilestone = (id: string) => {
    if (milestones.length > 1)
    setMilestones(milestones.filter((m) => m.id !== id));
  };
  const updateMilestone = (
  id: string,
  key: keyof MilestoneItem,
  value: string) =>
  {
    setMilestones(
      milestones.map((m) =>
      m.id === id ?
      {
        ...m,
        [key]: value
      } :
      m
      )
    );
  };
  const toggleClause = (id: string, checked: boolean) => {
    const next = checked ?
    [...selectedClauses, id] :
    selectedClauses.filter((c) => c !== id);
    setSelectedClauses(next);
    setSelectedClauseIds(next);
  };
  const moveMilestone = (id: string, direction: 'up' | 'down') => {
    const index = milestones.findIndex((m) => m.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === milestones.length - 1) return;
    const newMilestones = [...milestones];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newMilestones[index], newMilestones[swapIndex]] = [
    newMilestones[swapIndex],
    newMilestones[index]];

    setMilestones(newMilestones);
  };
  const handleNext = () => {
    // If template applied on step 1, skip straight to Review
    if (step === 1 && appliedTemplate) {
      setStep(4);
    } else if (step < 4) {
      setStep(step + 1);
    } else {
      addToast('success', 'Project created & contract sent to homeowner');
      onNavigate('projects');
    }
  };
  const handleBack = () => {
    // If on Review and template was applied, go back to step 1
    if (step === 4 && appliedTemplate) {
      setStep(1);
    } else if (step > 1) {
      setStep(step - 1);
    } else {
      onNavigate('projects');
    }
  };
  const totalMilestones = milestones.reduce(
    (sum, m) => sum + (parseFloat(m.amount) || 0),
    0
  );
  const contractValue = parseFloat(formData.contractValue) || 0;
  const remainingBudget = contractValue - totalMilestones;
  const applyTemplate = (template: (typeof fullTemplates)[0]) => {
    setFormData((prev) => ({
      ...prev,
      projectType: template.projectType,
      scope: template.scope,
      contractValue: template.contractValue
    }));
    setMilestones(
      template.milestones.map((m, i) => ({
        id: String(i + 1),
        name: m.name,
        amount: m.amount,
        description: m.description ?? ''
      }))
    );
    const clauseIds = template.clauseIds;
    setSelectedClauses(clauseIds);
    setSelectedClauseIds(clauseIds);
    setAppliedTemplate(template);
    setShowTemplatePicker(false);
    addToast('success', `"${template.name}" template applied`);
  };
  return (
    <div className="flex flex-col bg-gray-50 -m-4 lg:-m-8 min-h-full">
      <HeaderBar
        title="Create New Project"
        showBack
        onBack={() => onNavigate('projects')} />


      {/* Template Picker BottomSheet */}
      <BottomSheet
        isOpen={showTemplatePicker}
        onClose={() => setShowTemplatePicker(false)}
        title="Choose a Template">

        <div className="space-y-3">
          {fullTemplates.map((template) =>
          <button
            key={template.id}
            onClick={() => applyTemplate(template)}
            className="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-navy-300 hover:bg-navy-50 transition-all">

              <div className="flex justify-between items-start mb-1">
                <p className="font-bold text-gray-900">{template.name}</p>
                <span className="text-sm font-mono font-bold text-navy-900">
                  {template.avgValue}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                {template.description}
              </p>
              <div className="flex gap-3 text-xs text-gray-400">
                <span>{template.milestoneCount} milestones</span>
                <span>·</span>
                <span>{template.clauseIds.length} clauses included</span>
                <span>·</span>
                <span>Used {template.usedCount}×</span>
              </div>
            </button>
          )}
        </div>
      </BottomSheet>

      <div className="p-4 lg:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {['Project Info', 'Milestones', 'Terms & Clauses', 'Review'].map(
                (label, i) =>
                <span
                  key={label}
                  className={`text-xs sm:text-sm font-medium ${step >= i + 1 ? 'text-[#1e3a5f]' : 'text-gray-400'}`}>

                    {label}
                  </span>

              )}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-[#1e3a5f] transition-all duration-300 ${step === 1 ? 'w-1/4' : step === 2 ? 'w-2/4' : step === 3 ? 'w-3/4' : 'w-full'}`} />

            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Step 1: Project Info */}
            {step === 1 &&
            <div className="p-6 space-y-6 animate-in fade-in">
                <h2 className="text-xl font-bold text-gray-900">
                  Project Details
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <TextInput
                  label="Project Address"
                  placeholder="123 Main St, City, State"
                  value={formData.address}
                  onChange={(e) => updateForm('address', e.target.value)} />

                  <SelectInput
                  label="Project Type"
                  value={formData.projectType}
                  onChange={(e) => updateForm('projectType', e.target.value)}
                  options={[
                  {
                    value: 'kitchen',
                    label: 'Kitchen Remodel'
                  },
                  {
                    value: 'bath',
                    label: 'Bathroom Remodel'
                  },
                  {
                    value: 'addition',
                    label: 'Home Addition'
                  },
                  {
                    value: 'deck',
                    label: 'Deck / Patio'
                  },
                  {
                    value: 'roofing',
                    label: 'Roofing'
                  },
                  {
                    value: 'other',
                    label: 'Other'
                  }]
                  } />

                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <TextInput
                  label="Homeowner Name"
                  placeholder="Jane Doe"
                  value={formData.homeownerName}
                  onChange={(e) =>
                  updateForm('homeownerName', e.target.value)
                  } />

                  <TextInput
                  label="Email"
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.homeownerEmail}
                  onChange={(e) =>
                  updateForm('homeownerEmail', e.target.value)
                  } />

                  <PhoneInput
                  label="Phone"
                  placeholder="(555) 123-4567"
                  value={formData.homeownerPhone}
                  onChange={(e) =>
                  updateForm('homeownerPhone', e.target.value)
                  } />

                </div>

                {/* Scope of Work — only show when no template applied */}
                {!appliedTemplate &&
              <TextareaInput
                label="Scope of Work"
                placeholder="Describe the project details, materials, and expectations..."
                className="min-h-[150px]"
                value={formData.scope}
                onChange={(e) => updateForm('scope', e.target.value)} />

              }

                {/* Template Banner — below project details */}
                {appliedTemplate ?
              <div className="border border-green-200 bg-green-50 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 bg-green-600">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">
                            Template Applied
                          </p>
                          <p className="text-green-100 text-xs">
                            {appliedTemplate.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                      onClick={() => setShowTemplatePicker(true)}
                      className="text-xs text-white/80 hover:text-white underline transition-colors">

                          Change
                        </button>
                        <button
                      onClick={() => setAppliedTemplate(null)}
                      className="p-1 text-white/60 hover:text-white transition-colors">

                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="divide-y divide-green-100">
                      <div className="px-5 py-3">
                        <p className="text-sm text-gray-600">
                          {appliedTemplate.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {appliedTemplate.tags.map((tag) =>
                      <span
                        key={tag}
                        className="text-xs bg-white border border-green-200 text-green-700 px-2 py-0.5 rounded-full">

                              {tag}
                            </span>
                      )}
                          <span className="text-xs text-gray-400 font-mono">
                            {appliedTemplate.avgValue}
                          </span>
                        </div>
                      </div>

                      {/* Scope accordion */}
                      <div>
                        <button
                      className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-green-50/50 transition-colors"
                      onClick={() =>
                      setPreviewExpandedSection(
                        previewExpandedSection === 'scope' ?
                        null :
                        'scope'
                      )
                      }>

                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-gray-800">
                              Scope of Work
                            </span>
                          </div>
                          {previewExpandedSection === 'scope' ?
                      <ChevronUp className="w-4 h-4 text-gray-400" /> :

                      <ChevronDown className="w-4 h-4 text-gray-400" />
                      }
                        </button>
                        {previewExpandedSection === 'scope' &&
                    <div className="px-5 pb-4">
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words bg-white border border-green-100 rounded-lg p-3">
                              {appliedTemplate.scope}
                            </p>
                          </div>
                    }
                      </div>

                      {/* Milestones accordion */}
                      <div>
                        <button
                      className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-green-50/50 transition-colors"
                      onClick={() =>
                      setPreviewExpandedSection(
                        previewExpandedSection === 'milestones' ?
                        null :
                        'milestones'
                      )
                      }>

                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-gray-800">
                              Payment Schedule
                              <span className="ml-2 text-xs font-normal text-gray-400">
                                {appliedTemplate.milestones.length} milestones
                              </span>
                            </span>
                          </div>
                          {previewExpandedSection === 'milestones' ?
                      <ChevronUp className="w-4 h-4 text-gray-400" /> :

                      <ChevronDown className="w-4 h-4 text-gray-400" />
                      }
                        </button>
                        {previewExpandedSection === 'milestones' &&
                    <div className="px-5 pb-4 space-y-2">
                            {appliedTemplate.milestones.map((m, i) =>
                      <div
                        key={i}
                        className="bg-white border border-green-100 rounded-lg px-4 py-3">

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                      {i + 1}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900">
                                      {m.name}
                                    </span>
                                  </div>
                                  <span className="text-sm font-mono font-bold text-[#1e3a5f]">
                                    ${Number(m.amount).toLocaleString()}
                                  </span>
                                </div>
                                {m.description &&
                        <p className="text-xs text-gray-500 mt-1.5 ml-7 leading-relaxed break-words">
                                    {m.description}
                                  </p>
                        }
                              </div>
                      )}
                          </div>
                    }
                      </div>

                      {/* Clauses accordion */}
                      <div>
                        <button
                      className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-green-50/50 transition-colors"
                      onClick={() =>
                      setPreviewExpandedSection(
                        previewExpandedSection === 'clauses' ?
                        null :
                        'clauses'
                      )
                      }>

                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-gray-800">
                              Terms & Clauses
                              <span className="ml-2 text-xs font-normal text-gray-400">
                                {appliedTemplate.clauseIds.length} included
                              </span>
                            </span>
                          </div>
                          {previewExpandedSection === 'clauses' ?
                      <ChevronUp className="w-4 h-4 text-gray-400" /> :

                      <ChevronDown className="w-4 h-4 text-gray-400" />
                      }
                        </button>
                        {previewExpandedSection === 'clauses' &&
                    <div className="px-5 pb-4 space-y-1.5">
                            {allClauses.
                      filter((c) =>
                      appliedTemplate.clauseIds.includes(c.id)
                      ).
                      map((c) =>
                      <div
                        key={c.id}
                        className="flex items-start gap-2 bg-white border border-green-100 rounded-lg px-3 py-2.5">

                                  <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {c.name}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                                      {c.content.substring(0, 80)}…
                                    </p>
                                  </div>
                                </div>
                      )}
                          </div>
                    }
                      </div>
                    </div>
                  </div> :

              <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] rounded-xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        <Library className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-white">
                          Start from a Template
                        </p>
                        <p className="text-sm text-white/70">
                          Pre-fill scope, milestones & clauses
                        </p>
                      </div>
                    </div>
                    <button
                  onClick={() => setShowTemplatePicker(true)}
                  className="bg-white text-[#1e3a5f] font-semibold text-sm px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">

                      Browse Templates
                    </button>
                  </div>
              }

                {/* Dates & Contract Value — always at bottom */}
                <div className="grid md:grid-cols-3 gap-6">
                  <TextInput
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateForm('startDate', e.target.value)} />

                  <TextInput
                  label="Est. Completion"
                  type="date"
                  value={formData.completionDate}
                  onChange={(e) =>
                  updateForm('completionDate', e.target.value)
                  } />

                  <CurrencyInput
                  label="Total Contract Value"
                  placeholder="0.00"
                  value={formData.contractValue}
                  onChange={(e) =>
                  updateForm('contractValue', e.target.value)
                  } />

                </div>
              </div>
            }

            {/* Step 2: Milestones */}
            {step === 2 &&
            <div className="p-6 space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    Payment Schedule
                  </h2>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Contract Total</p>
                    <p className="font-mono font-bold text-lg">
                      ${contractValue.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex justify-between items-center">
                  <span className="text-sm text-blue-800 font-medium">
                    Remaining to allocate:
                  </span>
                  <span
                  className={`font-mono font-bold ${remainingBudget < 0 ? 'text-red-600' : 'text-blue-800'}`}>

                    ${remainingBudget.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3">
                  {milestones.map((milestone, index) =>
                <div
                  key={milestone.id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">

                      {/* Row 1: reorder + number + name + amount + delete */}
                      <div className="flex gap-3 items-start">
                        {/* Reorder buttons + number */}
                        <div className="flex flex-col items-center gap-0.5 pt-1 flex-shrink-0">
                          <button
                        onClick={() => moveMilestone(milestone.id, 'up')}
                        disabled={index === 0}
                        className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                        title="Move up">

                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-bold text-gray-400 leading-none">
                            {index + 1}
                          </span>
                          <button
                        onClick={() => moveMilestone(milestone.id, 'down')}
                        disabled={index === milestones.length - 1}
                        className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                        title="Move down">

                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Name + Amount */}
                        <div className="flex-1 grid md:grid-cols-2 gap-3">
                          <TextInput
                        placeholder="Milestone Name (e.g. Rough Plumbing)"
                        value={milestone.name}
                        onChange={(e) =>
                        updateMilestone(
                          milestone.id,
                          'name',
                          e.target.value
                        )
                        } />

                          <CurrencyInput
                        placeholder="Amount"
                        value={milestone.amount}
                        onChange={(e) =>
                        updateMilestone(
                          milestone.id,
                          'amount',
                          e.target.value
                        )
                        } />

                        </div>

                        {/* Delete */}
                        <button
                      onClick={() => removeMilestone(milestone.id)}
                      className="mt-1 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      disabled={milestones.length === 1}>

                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Row 2: Description */}
                      <div className="pl-8">
                        <TextareaInput
                      placeholder="Describe what's included in this milestone (e.g. Full demo of existing cabinets, countertops, flooring. Haul-away included.)"
                      value={milestone.description}
                      onChange={(e) =>
                      updateMilestone(
                        milestone.id,
                        'description',
                        e.target.value
                      )
                      }
                      rows={2} />

                      </div>
                    </div>
                )}
                </div>

                <SecondaryButton
                onClick={addMilestone}
                fullWidth
                className="border-dashed">

                  <Plus className="w-4 h-4 mr-2" /> Add Milestone
                </SecondaryButton>
              </div>
            }

            {/* Step 3: Terms & Clauses */}
            {step === 3 &&
            <div className="p-6 space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Terms & Clauses
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Select the clauses to include in this contract.
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                    {selectedClauses.length} of {allClauses.length} selected
                  </span>
                </div>

                {allClauses.length === 0 ?
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                    <Shield className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium text-gray-500">
                      No clauses created yet
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add clauses in Contract Templates to use them here.
                    </p>
                  </div> :

              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                    {allClauses.map((clause) =>
                <label
                  key={clause.id}
                  className="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors">

                        <input
                    type="checkbox"
                    checked={selectedClauses.includes(clause.id)}
                    onChange={(e) =>
                    toggleClause(clause.id, e.target.checked)
                    }
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#1e3a5f]" />

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {clause.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {clause.content.substring(0, 120)}…
                          </p>
                        </div>
                        {clause.isDefault &&
                  <span className="text-[10px] bg-[#1e3a5f]/10 text-[#1e3a5f] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                            Default
                          </span>
                  }
                      </label>
                )}
                  </div>
              }

                <p className="text-xs text-gray-400">
                  Selected clauses will appear in the Terms & Conditions section
                  of the homeowner contract.
                </p>
              </div>
            }

            {/* Step 4: Review */}
            {step === 4 &&
            <div className="p-6 space-y-8 animate-in fade-in">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Ready to Send?
                  </h2>
                  <p className="text-gray-500">
                    Review the contract details before sending to the homeowner.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block text-gray-500">Homeowner</span>
                      <span className="font-medium text-gray-900">
                        {formData.homeownerName || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-500">
                        Project Address
                      </span>
                      <span className="font-medium text-gray-900">
                        {formData.address || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-500">
                        Contract Value
                      </span>
                      <span className="font-medium text-gray-900 font-mono">
                        ${contractValue.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Timeline</span>
                      <span className="font-medium text-gray-900">
                        {formData.startDate || 'TBD'} –{' '}
                        {formData.completionDate || 'TBD'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <span className="block text-gray-500 text-sm mb-2">
                      Milestones ({milestones.length})
                    </span>
                    <ul className="space-y-2">
                      {milestones.map((m, i) =>
                    <li key={m.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {i + 1}. {m.name}
                          </span>
                          <span className="font-mono text-gray-900">
                            ${(parseFloat(m.amount) || 0).toLocaleString()}
                          </span>
                        </li>
                    )}
                    </ul>
                  </div>

                  {selectedClauses.length > 0 &&
                <div className="pt-4 border-t border-gray-200">
                      <span className="block text-gray-500 text-sm mb-2">
                        Terms & Clauses ({selectedClauses.length} included)
                      </span>
                      <ul className="space-y-1">
                        {allClauses.
                    filter((c) => selectedClauses.includes(c.id)).
                    map((c) =>
                    <li
                      key={c.id}
                      className="flex items-center gap-2 text-sm text-gray-700">

                              <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                              {c.name}
                            </li>
                    )}
                      </ul>
                    </div>
                }
                </div>
              </div>
            }

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between">
              <SecondaryButton onClick={handleBack}>
                {step === 1 ? 'Cancel' : 'Back'}
              </SecondaryButton>
              <PrimaryButton onClick={handleNext}>
                {step === 4 ?
                'Create & Send Contract' :
                step === 1 && appliedTemplate ?
                'Review Contract' :
                'Next Step'}
                {!(step === 4) && <ChevronRight className="w-4 h-4 ml-2" />}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>);

}