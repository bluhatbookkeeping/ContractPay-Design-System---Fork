import React, { useState, Component } from 'react';
import { Plus } from 'lucide-react';
import { PrimaryButton } from '../components/Buttons';
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
import { receipts } from '../data/mockData';
export function ReceiptsPage() {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const filteredReceipts =
  activeCategory === 'all' ?
  receipts :
  receipts.filter((r) => r.category === activeCategory);
  const totalAmount = receipts.reduce((sum, r) => sum + r.amount, 0);
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Project Expenses</h2>
        <PrimaryButton size="sm" onClick={() => setSheetOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Receipt
        </PrimaryButton>
      </div>

      <CostSummaryCard
        totalReceipts={totalAmount}
        contractAmount={85000}
        categoryBreakdown={[
        {
          category: 'materials',
          amount: 8000,
          color: 'bg-blue-500'
        },
        {
          category: 'labor',
          amount: 3000,
          color: 'bg-purple-500'
        },
        {
          category: 'equipment',
          amount: 1500,
          color: 'bg-teal-500'
        }]
        } />


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
        {filteredReceipts.map((receipt) =>
        <ReceiptCard key={receipt.id} receipt={receipt} />
        )}
      </div>

      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Add New Receipt">

        <div className="space-y-6">
          <TextInput label="Vendor Name" placeholder="e.g. Home Depot" />
          <div className="grid grid-cols-2 gap-4">
            <CurrencyInput label="Amount" placeholder="0.00" />
            <TextInput label="Date" type="date" />
          </div>
          <SelectInput
            label="Category"
            options={[
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
            }]
            } />

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
          <PrimaryButton fullWidth onClick={() => setSheetOpen(false)}>
            Save Receipt
          </PrimaryButton>
        </div>
      </BottomSheet>
    </div>);

}