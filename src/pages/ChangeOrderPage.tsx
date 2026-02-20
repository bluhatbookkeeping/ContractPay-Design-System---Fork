import React, { useState } from 'react';
import { FileText, Plus, DollarSign, Clock, Check, X } from 'lucide-react';
import { HeaderBar } from '../components/Navigation';
import { StatusBadge } from '../components/Badges';
import {
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  SuccessButton } from
'../components/Buttons';
import {
  TextInput,
  CurrencyInput,
  TextareaInput } from
'../components/FormElements';
import { ConfirmationModal } from '../components/Modals';
interface ChangeOrderPageProps {
  projectId?: string;
  onNavigate: (page: string, id?: string) => void;
  embedded?: boolean;
}
export function ChangeOrderPage({
  projectId,
  onNavigate,
  embedded = false
}: ChangeOrderPageProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  // Mock data
  const changeOrders = [
  {
    id: 'co-1',
    title: 'Upgrade Kitchen Faucet',
    description:
    'Client requested to upgrade from standard chrome faucet to matte black touchless model.',
    amount: 450.0,
    status: 'approved',
    dateSubmitted: 'Jan 25, 2025',
    impactDays: 0
  },
  {
    id: 'co-2',
    title: 'Additional Recessed Lighting',
    description:
    'Add 4 additional 6-inch recessed LED cans in the living room area.',
    amount: 1200.0,
    status: 'pending',
    dateSubmitted: 'Feb 02, 2025',
    impactDays: 1
  },
  {
    id: 'co-3',
    title: 'Shower Niche Modification',
    description: 'Change shower niche size from 12x12 to 12x24 horizontal.',
    amount: 350.0,
    status: 'rejected',
    dateSubmitted: 'Jan 15, 2025',
    impactDays: 0
  }];

  const handleCreate = () => {
    setIsCreating(false);
    // Logic to add new change order would go here
  };
  const content =
  <div className="space-y-6">
      {!embedded && !isCreating &&
    <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Change Orders</h2>
          <PrimaryButton size="sm" onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Change Order
          </PrimaryButton>
        </div>
    }

      {isCreating ?
    <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Create Change Order
          </h3>
          <div className="space-y-4">
            <TextInput label="Title" placeholder="e.g. Upgrade Flooring" />
            <div className="grid grid-cols-2 gap-4">
              <CurrencyInput label="Additional Cost" placeholder="0.00" />
              <TextInput
            label="Schedule Impact (Days)"
            type="number"
            placeholder="0" />

            </div>
            <TextareaInput
          label="Description"
          placeholder="Describe the changes and reason..." />


            <div className="flex justify-end gap-3 pt-4">
              <SecondaryButton onClick={() => setIsCreating(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton onClick={handleCreate}>
                Submit Request
              </PrimaryButton>
            </div>
          </div>
        </div> :

    <div className="grid gap-4">
          {embedded &&
      <div className="flex justify-end mb-2">
              <PrimaryButton size="sm" onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Change Order
              </PrimaryButton>
            </div>
      }

          {changeOrders.map((order) =>
      <div
        key={order.id}
        className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">

              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-navy-50 rounded-lg text-navy-900 mt-1">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{order.title}</h3>
                    <p className="text-xs text-gray-500">
                      Submitted on {order.dateSubmitted}
                    </p>
                  </div>
                </div>
                <StatusBadge status={order.status as any} />
              </div>

              <p className="text-sm text-gray-600 mb-4 pl-[52px]">
                {order.description}
              </p>

              <div className="flex items-center justify-between pl-[52px] pt-3 border-t border-gray-100">
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <DollarSign className="w-4 h-4 text-gray-400" />$
                    {order.amount.toFixed(2)}
                  </div>
                  {order.impactDays > 0 &&
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Clock className="w-4 h-4 text-gray-400" />+
                      {order.impactDays} Days
                    </div>
            }
                </div>

                {order.status === 'pending' &&
          <div className="flex gap-2">
                    <DangerButton
              size="sm"
              onClick={() => {
                setSelectedOrder(order.id);
                setModalOpen(true);
              }}>

                      Reject
                    </DangerButton>
                    <SuccessButton
              size="sm"
              onClick={() => {
                setSelectedOrder(order.id);
                setModalOpen(true);
              }}>

                      Approve
                    </SuccessButton>
                  </div>
          }
              </div>
            </div>
      )}
        </div>
    }

      <ConfirmationModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      onConfirm={() => setModalOpen(false)}
      title="Confirm Action"
      message="Are you sure you want to proceed with this action?"
      confirmText="Confirm" />

    </div>;

  if (embedded) return content;
  return (
    <div className="flex flex-col bg-gray-50 -m-4 lg:-m-8 min-h-full">
      <HeaderBar
        title="Change Orders"
        showBack
        onBack={() => onNavigate('project-detail', projectId)} />

      <div className="p-4 lg:p-8 max-w-4xl mx-auto w-full">{content}</div>
    </div>);

}