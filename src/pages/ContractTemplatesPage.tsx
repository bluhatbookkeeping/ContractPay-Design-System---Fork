import React, { useState, useId } from 'react';
import {
  Plus,
  FileText,
  AlignLeft,
  Copy,
  Trash2,
  Edit2,
  Check,
  X,
  ToggleLeft,
  ToggleRight,
  Search,
  ChevronDown,
  ChevronUp,
  DollarSign } from
'lucide-react';
import { HeaderBar } from '../components/Navigation';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { BasicCard } from '../components/Cards';
import {
  TextInput,
  TextareaInput,
  SelectInput } from
'../components/FormElements';
import {
  getAllClauses,
  addClause,
  updateClause,
  deleteClause,
  toggleClauseDefault,
  fullTemplates,
  setSelectedTemplate,
  Clause,
  FullTemplate } from
'../data/templateStore';
interface ContractTemplatesPageProps {
  onNavigate: (page: string, id?: string) => void;
}
export function ContractTemplatesPage({
  onNavigate
}: ContractTemplatesPageProps) {
  const [activeTab, setActiveTab] = useState<
    'details' | 'milestones' | 'clauses'>(
    'details');
  const [clauses, setClauses] = useState<Clause[]>(() => getAllClauses());
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingClauseId, setEditingClauseId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({
    name: '',
    content: ''
  });
  const [showCreateClause, setShowCreateClause] = useState(false);
  const [newClause, setNewClause] = useState({
    name: '',
    content: '',
    category: 'general' as Clause['category']
  });
  const [expandedClauseId, setExpandedClauseId] = useState<string | null>(null);
  const [localTemplates, setLocalTemplates] = useState<FullTemplate[]>(() => [
  ...fullTemplates]
  );
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(
    null
  );
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [templateDraft, setTemplateDraft] = useState<{
    name: string;
    description: string;
    scope: string;
    tags: string;
    milestones: {
      name: string;
      amount: string;
      description: string;
    }[];
  }>({
    name: '',
    description: '',
    scope: '',
    tags: '',
    milestones: []
  });
  const resetTemplateDraft = () =>
  setTemplateDraft({
    name: '',
    description: '',
    scope: '',
    tags: '',
    milestones: []
  });
  const refreshClauses = () => setClauses(getAllClauses());
  const handleCopy = (clause: Clause) => {
    navigator.clipboard.writeText(clause.content).catch(() => {});
    setCopiedId(clause.id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  const handleStartEdit = (clause: Clause) => {
    setEditingClauseId(clause.id);
    setEditDraft({
      name: clause.name,
      content: clause.content
    });
  };
  const handleSaveEdit = (id: string) => {
    updateClause(id, {
      name: editDraft.name,
      content: editDraft.content
    });
    setEditingClauseId(null);
    refreshClauses();
  };
  const handleDelete = (id: string) => {
    if (
    window.confirm(
      'Delete this clause? It will be removed from all future contracts.'
    ))
    {
      deleteClause(id);
      refreshClauses();
    }
  };
  const handleToggleDefault = (id: string) => {
    toggleClauseDefault(id);
    refreshClauses();
  };
  const handleCreateClause = () => {
    if (!newClause.name.trim() || !newClause.content.trim()) return;
    addClause({
      name: newClause.name,
      content: newClause.content,
      category: newClause.category,
      isDefault: false
    });
    setNewClause({
      name: '',
      content: '',
      category: 'general'
    });
    setShowCreateClause(false);
    refreshClauses();
  };
  const handleStartEditTemplate = (template: FullTemplate) => {
    setEditingTemplateId(template.id);
    setTemplateDraft({
      name: template.name,
      description: template.description,
      scope: template.scope,
      tags: template.tags.join(', '),
      milestones: template.milestones.map((m) => ({
        name: m.name,
        amount: m.amount,
        description: m.description ?? ''
      }))
    });
  };
  const handleSaveTemplate = (id: string) => {
    setLocalTemplates((prev) =>
    prev.map((t) =>
    t.id === id ?
    {
      ...t,
      name: templateDraft.name,
      description: templateDraft.description,
      scope: templateDraft.scope,
      tags: templateDraft.tags.
      split(',').
      map((s) => s.trim()).
      filter(Boolean),
      milestones: templateDraft.milestones,
      milestoneCount: templateDraft.milestones.length
    } :
    t
    )
    );
    setEditingTemplateId(null);
  };
  const handleCreateTemplate = () => {
    if (!templateDraft.name.trim()) return;
    const newTemplate: FullTemplate = {
      id: `t${Date.now()}`,
      name: templateDraft.name,
      type: 'full',
      description: templateDraft.description,
      scope: templateDraft.scope,
      contractValue: '',
      projectType: 'general',
      usedCount: 0,
      useCount: 0,
      lastUsed: 'Never',
      avgValue:
      templateDraft.milestones.length > 0 ?
      `$${templateDraft.milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0).toLocaleString()}` :
      '$0',
      milestoneCount: templateDraft.milestones.length,
      tags: templateDraft.tags.
      split(',').
      map((s) => s.trim()).
      filter(Boolean),
      milestones: templateDraft.milestones,
      clauseIds: []
    };
    setLocalTemplates((prev) => [...prev, newTemplate]);
    setIsCreatingTemplate(false);
    resetTemplateDraft();
  };
  const startCreateTemplate = () => {
    resetTemplateDraft();
    setEditingTemplateId(null);
    setIsCreatingTemplate(true);
    setActiveTab('details');
  };
  const handleUpdateMilestoneDraft = (
  index: number,
  field: 'name' | 'amount' | 'description',
  value: string) =>
  {
    setTemplateDraft((prev) => {
      const updated = [...prev.milestones];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return {
        ...prev,
        milestones: updated
      };
    });
  };
  const handleAddMilestoneDraft = () => {
    setTemplateDraft((prev) => ({
      ...prev,
      milestones: [
      ...prev.milestones,
      {
        name: '',
        amount: '',
        description: ''
      }]

    }));
  };
  const handleRemoveMilestoneDraft = (index: number) => {
    setTemplateDraft((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };
  const handleMoveMilestoneDraft = (
  index: number,
  direction: 'up' | 'down') =>
  {
    setTemplateDraft((prev) => {
      const updated = [...prev.milestones];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= updated.length) return prev;
      [updated[index], updated[swapIndex]] = [
      updated[swapIndex],
      updated[index]];

      return {
        ...prev,
        milestones: updated
      };
    });
  };
  const handleUseTemplate = (templateId: string) => {
    const template = localTemplates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      onNavigate('new-project');
    }
  };
  const handleDuplicateTemplate = (templateId: string) => {
    const template = localTemplates.find((t) => t.id === templateId);
    if (!template) return;
    const duplicate: FullTemplate = {
      ...template,
      id: `t${Date.now()}`,
      name: `${template.name} (Copy)`,
      usedCount: 0,
      useCount: 0,
      lastUsed: 'Never',
      milestones: template.milestones.map((m) => ({
        ...m
      })),
      tags: [...template.tags],
      clauseIds: [...template.clauseIds]
    };
    setLocalTemplates((prev) => [...prev, duplicate]);
  };
  const handleDeleteMilestone = (id: string) => {
    setMilestoneTemplates((prev) => prev.filter((m) => m.id !== id));
  };
  const handleSaveMilestone = (id: string) => {
    setMilestoneTemplates((prev) =>
    prev.map((m) =>
    m.id === id ?
    {
      ...m,
      name: milestoneDraft.name,
      description: milestoneDraft.description
    } :
    m
    )
    );
    setEditingMilestoneId(null);
  };
  const handleCreateMilestone = () => {
    if (!newMilestone.name.trim()) return;
    setMilestoneTemplates((prev) => [
    ...prev,
    {
      id: `m${Date.now()}`,
      name: newMilestone.name,
      description: newMilestone.description,
      items: parseInt(newMilestone.items) || 3
    }]
    );
    setNewMilestone({
      name: '',
      description: '',
      items: ''
    });
    setShowCreateMilestone(false);
  };
  const filteredClauses = clauses.filter(
    (c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const categoryLabels: Record<Clause['category'], string> = {
    warranty: 'Warranty',
    payment: 'Payment',
    access: 'Site Access',
    delay: 'Delays',
    dispute: 'Dispute',
    general: 'General'
  };
  const renderFullTemplates = () => {
    // Creating new template
    if (isCreatingTemplate) {
      return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-navy-900">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-semibold text-gray-900">
                New Contract Template
              </span>
            </div>
            <button
              onClick={() => {
                setIsCreatingTemplate(false);
                resetTemplateDraft();
              }}
              className="text-gray-400 hover:text-gray-600 p-1">

              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <TextInput
                label="Template Name"
                placeholder="e.g. Bathroom Renovation — Full"
                value={templateDraft.name}
                onChange={(e) =>
                setTemplateDraft((p) => ({
                  ...p,
                  name: e.target.value
                }))
                } />

              <TextInput
                label="Tags (comma-separated)"
                placeholder="e.g. Bathroom, Remodel"
                value={templateDraft.tags}
                onChange={(e) =>
                setTemplateDraft((p) => ({
                  ...p,
                  tags: e.target.value
                }))
                } />

            </div>

            <TextareaInput
              label="Short Description"
              placeholder="Brief summary shown on the template card"
              value={templateDraft.description}
              onChange={(e) =>
              setTemplateDraft((p) => ({
                ...p,
                description: e.target.value
              }))
              }
              rows={2} />


            <TextareaInput
              label="Scope of Work"
              placeholder="Full scope text that will appear in the contract..."
              value={templateDraft.scope}
              onChange={(e) =>
              setTemplateDraft((p) => ({
                ...p,
                scope: e.target.value
              }))
              }
              rows={6} />


            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Add payment milestones in the{' '}
                <button
                  onClick={() => setActiveTab('milestones')}
                  className="text-navy-900 font-semibold underline underline-offset-2">

                  Payment Milestones
                </button>{' '}
                tab
              </p>
              <div className="flex gap-3">
                <PrimaryButton
                  size="sm"
                  onClick={handleCreateTemplate}
                  disabled={!templateDraft.name.trim()}>

                  <Check className="w-4 h-4 mr-1.5" /> Save Template
                </PrimaryButton>
                <SecondaryButton
                  size="sm"
                  onClick={() => {
                    setIsCreatingTemplate(false);
                    resetTemplateDraft();
                  }}>

                  Cancel
                </SecondaryButton>
              </div>
            </div>
          </div>
        </div>);

    }
    // Editing existing template
    if (editingTemplateId) {
      const template = localTemplates.find((t) => t.id === editingTemplateId);
      if (!template) return null;
      return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-navy-900">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-semibold text-gray-900">
                Editing Template
              </span>
            </div>
            <button
              onClick={() => setEditingTemplateId(null)}
              className="text-gray-400 hover:text-gray-600 p-1">

              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <TextInput
                label="Template Name"
                value={templateDraft.name}
                onChange={(e) =>
                setTemplateDraft((p) => ({
                  ...p,
                  name: e.target.value
                }))
                } />

              <TextInput
                label="Tags (comma-separated)"
                placeholder="e.g. Kitchen, Remodel"
                value={templateDraft.tags}
                onChange={(e) =>
                setTemplateDraft((p) => ({
                  ...p,
                  tags: e.target.value
                }))
                } />

            </div>
            <TextareaInput
              label="Short Description"
              placeholder="Brief summary shown on the template card"
              value={templateDraft.description}
              onChange={(e) =>
              setTemplateDraft((p) => ({
                ...p,
                description: e.target.value
              }))
              }
              rows={2} />

            <TextareaInput
              label="Scope of Work"
              placeholder="Full scope text that will appear in the contract..."
              value={templateDraft.scope}
              onChange={(e) =>
              setTemplateDraft((p) => ({
                ...p,
                scope: e.target.value
              }))
              }
              rows={6} />


            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Edit milestones in the{' '}
                <button
                  onClick={() => setActiveTab('milestones')}
                  className="text-navy-900 font-semibold underline underline-offset-2">

                  Payment Milestones
                </button>{' '}
                tab
              </p>
              <div className="flex gap-3">
                <PrimaryButton
                  size="sm"
                  onClick={() => handleSaveTemplate(editingTemplateId)}>

                  <Check className="w-4 h-4 mr-1.5" /> Save Template
                </PrimaryButton>
                <SecondaryButton
                  size="sm"
                  onClick={() => setEditingTemplateId(null)}>

                  Cancel
                </SecondaryButton>
              </div>
            </div>
          </div>
        </div>);

    }
    // Normal grid view
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {localTemplates.map((template) =>
        <BasicCard key={template.id} className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center text-navy-900">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs bg-navy-900 text-white px-2 py-1 rounded-full font-medium">
                Full Contract
              </span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{template.name}</h3>
            <p className="text-sm text-gray-500 mb-4 flex-1 line-clamp-2">
              {template.description}
            </p>
            <div className="flex flex-wrap gap-1 mb-4">
              {template.tags.map((tag) =>
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">

                  {tag}
                </span>
            )}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-4 pt-4 border-t border-gray-100">
              <span>Used {template.usedCount}×</span>
              <span>{template.milestones.length} milestones</span>
              <span className="font-mono font-bold text-navy-900">
                {template.avgValue}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <SecondaryButton
              size="sm"
              onClick={() => handleStartEditTemplate(template)}>

                <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
              </SecondaryButton>
              <SecondaryButton
              size="sm"
              onClick={() => handleDuplicateTemplate(template.id)}>

                <Copy className="w-3.5 h-3.5 mr-1" /> Duplicate
              </SecondaryButton>
              <PrimaryButton
              size="sm"
              onClick={() => handleUseTemplate(template.id)}>

                Use
              </PrimaryButton>
            </div>
          </BasicCard>
        )}

        <button
          className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-8 hover:border-navy-300 hover:bg-navy-50 transition-all group h-full min-h-[280px]"
          onClick={startCreateTemplate}>

          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-navy-600 mb-4 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-medium text-gray-600 group-hover:text-navy-900">
            Create New Template
          </span>
        </button>
      </div>);

  };
  const renderMilestones = () => {
    // Show milestone editor when creating or editing a template
    if (isCreatingTemplate || editingTemplateId) {
      const templateName = editingTemplateId ?
      localTemplates.find((t) => t.id === editingTemplateId)?.name ||
      'Template' :
      templateDraft.name || 'New Template';
      return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-700">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-gray-900">
                  Payment Milestones
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  for {templateName}
                </span>
              </div>
            </div>
            {templateDraft.milestones.length > 0 &&
            <span className="text-sm font-mono font-bold text-navy-900">
                Total: $
                {templateDraft.milestones.
              reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0).
              toLocaleString()}
              </span>
            }
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {templateDraft.milestones.map((m, i) =>
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">

                  <div className="flex gap-3 items-center">
                    <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                      <button
                      type="button"
                      onClick={() => handleMoveMilestoneDraft(i, 'up')}
                      disabled={i === 0}
                      className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">

                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-gray-400 leading-none">
                        {i + 1}
                      </span>
                      <button
                      type="button"
                      onClick={() => handleMoveMilestoneDraft(i, 'down')}
                      disabled={i === templateDraft.milestones.length - 1}
                      className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">

                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <input
                      type="text"
                      placeholder="Milestone name"
                      value={m.name}
                      onChange={(e) =>
                      handleUpdateMilestoneDraft(i, 'name', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-900"
                      style={{
                        overflowX: 'hidden'
                      }} />

                    </div>
                    <div className="w-32">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-mono">
                          $
                        </span>
                        <input
                        type="text"
                        placeholder="0"
                        value={m.amount}
                        onChange={(e) =>
                        handleUpdateMilestoneDraft(
                          i,
                          'amount',
                          e.target.value
                        )
                        }
                        className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm font-mono text-right bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-900"
                        style={{
                          overflowX: 'hidden'
                        }} />

                      </div>
                    </div>
                    <button
                    onClick={() => handleRemoveMilestoneDraft(i)}
                    className="p-1.5 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">

                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="pl-8">
                    <textarea
                    placeholder="What's included in this milestone? (shown to homeowner)"
                    value={m.description ?? ''}
                    onChange={(e) =>
                    handleUpdateMilestoneDraft(
                      i,
                      'description',
                      e.target.value
                    )
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-900 resize-none text-gray-600"
                    style={{
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      overflowX: 'hidden'
                    }} />

                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleAddMilestoneDraft}
              className="mt-4 w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-medium hover:border-navy-300 hover:text-navy-900 hover:bg-navy-50 transition-all flex items-center justify-center gap-2">

              <Plus className="w-4 h-4" /> Add Milestone
            </button>

            {templateDraft.milestones.length === 0 &&
            <div className="text-center py-8 text-gray-400">
                <DollarSign className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No milestones yet</p>
                <p className="text-xs mt-1">
                  Add payment milestones for this template
                </p>
              </div>
            }
          </div>
        </div>);

    }
    // No template being edited — show prompt to select one
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-7 h-7 text-gray-400" />
        </div>
        <h3 className="font-bold text-gray-900 mb-2">
          Select a Template to Edit Milestones
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
          Go to the{' '}
          <button
            onClick={() => setActiveTab('details')}
            className="text-navy-900 font-semibold underline underline-offset-2">

            Template Details
          </button>{' '}
          tab and click Edit on a template, then come back here to manage its
          payment milestones.
        </p>
        <SecondaryButton size="sm" onClick={() => setActiveTab('details')}>
          Go to Template Details
        </SecondaryButton>
      </div>);

  };
  const renderClauses = () =>
  <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
        type="text"
        placeholder="Search clauses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-900" />

      </div>

      {/* Create Form */}
      {showCreateClause &&
    <div className="bg-white border-2 border-navy-200 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900">New Clause</h3>
            <button
          onClick={() => setShowCreateClause(false)}
          className="text-gray-400 hover:text-gray-600">

              <X className="w-5 h-5" />
            </button>
          </div>
          <TextInput
        label="Clause Name"
        placeholder="e.g. 1-Year Workmanship Warranty"
        value={newClause.name}
        onChange={(e) =>
        setNewClause((prev) => ({
          ...prev,
          name: e.target.value
        }))
        } />

          <SelectInput
        label="Category"
        value={newClause.category}
        onChange={(e) =>
        setNewClause((prev) => ({
          ...prev,
          category: e.target.value as Clause['category']
        }))
        }
        options={[
        {
          value: 'warranty',
          label: 'Warranty'
        },
        {
          value: 'payment',
          label: 'Payment'
        },
        {
          value: 'access',
          label: 'Site Access'
        },
        {
          value: 'delay',
          label: 'Delays'
        },
        {
          value: 'dispute',
          label: 'Dispute Resolution'
        },
        {
          value: 'general',
          label: 'General'
        }]
        } />

          <TextareaInput
        label="Clause Content"
        placeholder="Write the full legal text of this clause..."
        value={newClause.content}
        onChange={(e) =>
        setNewClause((prev) => ({
          ...prev,
          content: e.target.value
        }))
        }
        rows={5} />

          <div className="flex gap-3">
            <PrimaryButton size="sm" onClick={handleCreateClause}>
              Save Clause
            </PrimaryButton>
            <SecondaryButton
          size="sm"
          onClick={() => setShowCreateClause(false)}>

              Cancel
            </SecondaryButton>
          </div>
        </div>
    }

      {/* Clause List */}
      {filteredClauses.map((clause) => {
      const isExpanded = expandedClauseId === clause.id;
      const isEditing = editingClauseId === clause.id;
      return (
        <div
          key={clause.id}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all">

            {isEditing /* ── Edit mode ── */ ?
          <div className="p-5 space-y-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-navy-900">
                    Editing Clause
                  </span>
                  <button
                onClick={() => setEditingClauseId(null)}
                className="text-gray-400 hover:text-gray-600">

                    <X className="w-4 h-4" />
                  </button>
                </div>
                <TextInput
              label="Clause Name"
              value={editDraft.name}
              onChange={(e) =>
              setEditDraft((prev) => ({
                ...prev,
                name: e.target.value
              }))
              } />

                <TextareaInput
              label="Clause Text"
              value={editDraft.content}
              onChange={(e) =>
              setEditDraft((prev) => ({
                ...prev,
                content: e.target.value
              }))
              }
              rows={6} />

                <div className="flex gap-3">
                  <PrimaryButton
                size="sm"
                onClick={() => handleSaveEdit(clause.id)}>

                    <Check className="w-4 h-4 mr-1" /> Save Changes
                  </PrimaryButton>
                  <SecondaryButton
                size="sm"
                onClick={() => setEditingClauseId(null)}>

                    Cancel
                  </SecondaryButton>
                </div>
              </div> /* ── View mode (collapsed + expanded) ── */ :

          <>
                {/* Header row — always visible, click to expand */}
                <button
              className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              onClick={() =>
              setExpandedClauseId(isExpanded ? null : clause.id)
              }>

                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                      <AlignLeft className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                        {clause.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">
                          {categoryLabels[clause.category]}
                        </span>
                        {clause.isDefault &&
                    <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                            Default
                          </span>
                    }
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    {/* Action buttons — stop propagation so they don't toggle expand */}
                    <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(clause);
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${copiedId === clause.id ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-navy-900 hover:bg-gray-100'}`}
                  title="Copy clause text">

                      {copiedId === clause.id ?
                  <Check className="w-4 h-4" /> :

                  <Copy className="w-4 h-4" />
                  }
                    </button>
                    <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartEdit(clause);
                  }}
                  className="p-1.5 text-gray-400 hover:text-navy-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit clause">

                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(clause.id);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete clause">

                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    {isExpanded ?
                <ChevronUp className="w-4 h-4 text-gray-400" /> :

                <ChevronDown className="w-4 h-4 text-gray-400" />
                }
                  </div>
                </button>

                {/* Preview (collapsed) */}
                {!isExpanded &&
            <div className="px-4 pb-4 -mt-1">
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 break-words">
                      {clause.content}
                    </p>
                  </div>
            }

                {/* Full text (expanded) */}
                {isExpanded &&
            <div className="px-4 pb-4 border-t border-gray-100">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words pt-3">
                      {clause.content}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        Include in contracts by default
                      </span>
                      <button
                  onClick={() => handleToggleDefault(clause.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${clause.isDefault ? 'text-green-600' : 'text-gray-400'}`}>

                        {clause.isDefault ?
                  <>
                            <ToggleRight className="w-5 h-5" /> On
                          </> :

                  <>
                            <ToggleLeft className="w-5 h-5" /> Off
                          </>
                  }
                      </button>
                    </div>
                  </div>
            }

                {/* Default toggle (collapsed) */}
                {!isExpanded &&
            <div className="px-4 pb-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-xs text-gray-500">
                      Include by default
                    </span>
                    <button
                onClick={() => handleToggleDefault(clause.id)}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${clause.isDefault ? 'text-green-600' : 'text-gray-400'}`}>

                      {clause.isDefault ?
                <>
                          <ToggleRight className="w-5 h-5" /> On
                        </> :

                <>
                          <ToggleLeft className="w-5 h-5" /> Off
                        </>
                }
                    </button>
                  </div>
            }
              </>
          }
          </div>);

    })}

      {filteredClauses.length === 0 &&
    <div className="text-center py-12 text-gray-400">
          <AlignLeft className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No clauses found</p>
        </div>
    }

      {!showCreateClause &&
    <button
      onClick={() => setShowCreateClause(true)}
      className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-medium hover:border-navy-300 hover:text-navy-900 hover:bg-navy-50 transition-all flex items-center justify-center gap-2">

          <Plus className="w-5 h-5" /> Add New Clause
        </button>
    }
    </div>;

  return (
    <div className="flex flex-col bg-gray-50 -m-4 lg:-m-8 min-h-full">
      <HeaderBar
        title="Contract Templates"
        rightAction={
        <PrimaryButton size="sm" onClick={startCreateTemplate}>
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </PrimaryButton>
        } />


      <div className="p-4 lg:p-8 max-w-6xl mx-auto w-full">
        <div className="flex gap-1 bg-gray-200/50 p-1 rounded-xl w-fit mb-8">
          {[
          {
            id: 'details' as const,
            label: 'Template Details'
          },
          {
            id: 'milestones' as const,
            label: 'Payment Milestones'
          },
          {
            id: 'clauses' as const,
            label: 'Scope Clauses'
          }].
          map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>

              {tab.label}
            </button>
          )}
        </div>

        <div className="animate-in fade-in duration-300">
          {activeTab === 'details' && renderFullTemplates()}
          {activeTab === 'milestones' && renderMilestones()}
          {activeTab === 'clauses' && renderClauses()}
        </div>
      </div>
    </div>);

}