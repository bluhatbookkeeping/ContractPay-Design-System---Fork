import React, { useState, Component } from 'react';
import { Plus, MapPin, ChevronDown, Share2, EyeOff } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import {
  ReceiptCard,
  CostSummaryCard,
  ReceiptCategory } from
'../components/ReceiptComponents';
import { BottomSheet } from '../components/Modals';
import {
  TextInput,
  SelectInput,
  CurrencyInput } from
'../components/FormElements';
import { PhotoUpload } from '../components/PhotoComponents';
import {
  receipts as initialReceipts,
  projects,
  Receipt } from
'../data/mockData';
interface ReceiptsPageProps {
  userRole?: 'contractor' | 'homeowner';
}
export function ReceiptsPage({ userRole = 'contractor' }: ReceiptsPageProps) {
  const [receipts, setReceipts] = useState<Receipt[]>(initialReceipts);
  const [isAddSheetOpen, setAddSheetOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [expandedReceiptId, setExpandedReceiptId] = useState<string | null>(
    null
  );
  // New receipt project assignment
  const [newReceiptProjectId, setNewReceiptProjectId] = useState<string>(
    projects[0]?.id || ''
  );
  // Edit form state
  const [editVendor, setEditVendor] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editCategory, setEditCategory] = useState<ReceiptCategory>('materials');
  // Only show active projects (not sent/pending/complete)
  const activeProjects = projects.filter((p) => p.status === 'active');
  const activeProjectIds = new Set(activeProjects.map((p) => p.id));
  // Only include receipts from active projects
  const activeReceipts = receipts.filter((r) =>
  activeProjectIds.has(r.projectId)
  );
  // For homeowners, only show shared receipts
  const visibleReceipts =
  userRole === 'homeowner' ?
  activeReceipts.filter((r) => r.isShared) :
  activeReceipts;
  const openEdit = (receipt: Receipt) => {
    setEditingReceipt(receipt);
    setEditVendor(receipt.vendor);
    setEditAmount(receipt.amount.toFixed(2));
    setEditDate(receipt.date);
    setEditCategory(receipt.category);
  };
  const saveEdit = () => {
    if (!editingReceipt) return;
    setReceipts((prev) =>
    prev.map((r) =>
    r.id === editingReceipt.id ?
    {
      ...r,
      vendor: editVendor,
      amount: parseFloat(editAmount) || r.amount,
      date: editDate,
      category: editCategory
    } :
    r
    )
    );
    setEditingReceipt(null);
  };
  const handleDelete = (id: string) => {
    setReceipts((prev) => prev.filter((r) => r.id !== id));
  };
  const handleToggleShare = (id: string) => {
    setReceipts((prev) =>
    prev.map((r) =>
    r.id === id ?
    {
      ...r,
      isShared: !r.isShared
    } :
    r
    )
    );
  };
  // Filter by project first, then by category
  const projectReceipts =
  selectedProjectId === 'all' ?
  visibleReceipts :
  visibleReceipts.filter((r) => r.projectId === selectedProjectId);
  const filteredReceipts =
  activeCategory === 'all' ?
  projectReceipts :
  projectReceipts.filter((r) => r.category === activeCategory);
  const totalAmount = projectReceipts.reduce((sum, r) => sum + r.amount, 0);
  // Get contract amount for selected project
  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const contractAmount =
  selectedProjectId === 'all' ?
  activeProjects.reduce((sum, p) => sum + p.contractAmount, 0) :
  selectedProject?.contractAmount || 0;
  // Build category breakdown from project receipts
  const categoryMap = new Map<string, number>();
  projectReceipts.forEach((r) => {
    categoryMap.set(r.category, (categoryMap.get(r.category) || 0) + r.amount);
  });
  const categoryColors: Record<string, string> = {
    materials: 'bg-blue-500',
    labor: 'bg-purple-500',
    equipment: 'bg-teal-500',
    permits: 'bg-amber-500',
    delivery: 'bg-orange-500',
    misc: 'bg-gray-500'
  };
  const categoryBreakdown = Array.from(categoryMap.entries()).map(
    ([category, amount]) => ({
      category,
      amount,
      color: categoryColors[category] || 'bg-gray-400'
    })
  );
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

  const projectOptions = [
  {
    value: 'all',
    label: 'All Active Projects'
  },
  ...activeProjects.map((p) => ({
    value: p.id,
    label: p.address
  }))];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">
          {userRole === 'homeowner' ? 'Shared Receipts' : 'Project Expenses'}
        </h2>
        {userRole === 'contractor' &&
        <PrimaryButton size="sm" onClick={() => setAddSheetOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Receipt
          </PrimaryButton>
        }
      </div>

      {/* Homeowner info banner */}
      {userRole === 'homeowner' &&
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <Share2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900">
              Receipts Shared by Your Contractor
            </p>
            <p className="text-sm text-blue-700 mt-0.5">
              These receipts have been shared with you as proof of materials and
              expenses for your projects.
            </p>
          </div>
        </div>
      }

      {/* Project Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {projectOptions.map((opt) => {
          const isSelected = selectedProjectId === opt.value;
          const project = projects.find((p) => p.id === opt.value);
          const projectReceiptCount =
          opt.value === 'all' ?
          visibleReceipts.length :
          visibleReceipts.filter((r) => r.projectId === opt.value).length;
          return (
            <button
              key={opt.value}
              onClick={() => {
                setSelectedProjectId(opt.value);
                setActiveCategory('all');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${isSelected ? 'bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}>

              {opt.value !== 'all' &&
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              }
              <span>{opt.label}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>

                {projectReceiptCount}
              </span>
            </button>);

        })}
      </div>

      <CostSummaryCard
        totalReceipts={totalAmount}
        contractAmount={contractAmount}
        categoryBreakdown={categoryBreakdown} />


      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'materials', 'labor', 'equipment', 'permits'].map((cat) =>
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-navy-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>

            {cat}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {filteredReceipts.length > 0 ?
        filteredReceipts.map((receipt) =>
        <ReceiptCard
          key={receipt.id}
          receipt={receipt}
          isExpanded={expandedReceiptId === receipt.id}
          onToggleExpand={() =>
          setExpandedReceiptId(
            expandedReceiptId === receipt.id ? null : receipt.id
          )
          }
          onEdit={
          userRole === 'contractor' ? () => openEdit(receipt) : undefined
          }
          onDelete={
          userRole === 'contractor' ?
          () => handleDelete(receipt.id) :
          undefined
          }
          onToggleShare={
          userRole === 'contractor' ?
          () => handleToggleShare(receipt.id) :
          undefined
          }
          viewOnly={userRole === 'homeowner'} />

        ) :

        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            {userRole === 'homeowner' ?
          <>
                <EyeOff className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  No receipts shared yet
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Your contractor hasn't shared any receipts with you yet.
                </p>
              </> :

          <>
                <p className="text-gray-400 font-medium">
                  No receipts found
                  {selectedProjectId !== 'all' ? ' for this project' : ''}.
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Add a receipt to start tracking expenses.
                </p>
              </>
          }
          </div>
        }
      </div>

      {/* Add Receipt Sheet - only for contractors */}
      {userRole === 'contractor' &&
      <BottomSheet
        isOpen={isAddSheetOpen}
        onClose={() => setAddSheetOpen(false)}
        title="Add New Receipt">

          <div className="space-y-6">
            <SelectInput
            label="Project"
            value={newReceiptProjectId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setNewReceiptProjectId(e.target.value)
            }
            options={activeProjects.map((p) => ({
              value: p.id,
              label: p.address
            }))} />

            <TextInput label="Vendor Name" placeholder="e.g. Home Depot" />
            <div className="grid grid-cols-2 gap-4">
              <CurrencyInput label="Amount" placeholder="0.00" />
              <TextInput label="Date" type="date" />
            </div>
            <SelectInput label="Category" options={categoryOptions} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receipt Photo
              </label>
              <PhotoUpload
              photos={[]}
              onUpload={() => {}}
              onRemove={() => {}}
              maxPhotos={1} />

            </div>
            <PrimaryButton fullWidth onClick={() => setAddSheetOpen(false)}>
              Save Receipt
            </PrimaryButton>
          </div>
        </BottomSheet>
      }

      {/* Edit Receipt Sheet - only for contractors */}
      {userRole === 'contractor' &&
      <BottomSheet
        isOpen={!!editingReceipt}
        onClose={() => setEditingReceipt(null)}
        title="Edit Receipt">

          <div className="space-y-6">
            <TextInput
            label="Vendor Name"
            value={editVendor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEditVendor(e.target.value)
            }
            placeholder="e.g. Home Depot" />

            <div className="grid grid-cols-2 gap-4">
              <CurrencyInput
              label="Amount"
              value={editAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditAmount(e.target.value)
              }
              placeholder="0.00" />

              <TextInput
              label="Date"
              type="text"
              value={editDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditDate(e.target.value)
              } />

            </div>
            <SelectInput
            label="Category"
            value={editCategory}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setEditCategory(e.target.value as ReceiptCategory)
            }
            options={categoryOptions} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receipt Photo
              </label>
              <PhotoUpload
              photos={editingReceipt ? [editingReceipt.thumbnailUrl] : []}
              onUpload={() => {}}
              onRemove={() => {}}
              maxPhotos={1} />

            </div>
            <div className="flex gap-3">
              <SecondaryButton
              fullWidth
              onClick={() => setEditingReceipt(null)}>

                Cancel
              </SecondaryButton>
              <PrimaryButton fullWidth onClick={saveEdit}>
                Save Changes
              </PrimaryButton>
            </div>
          </div>
        </BottomSheet>
      }
    </div>);

}