import React, { useState } from 'react';
import {
  FileText,
  Plus,
  DollarSign,
  Clock,
  Check,
  X,
  XCircle } from
'lucide-react';
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
import { changeOrders as mockChangeOrders } from '../data/mockData';
interface ChangeOrderPageProps {
  projectId?: string;
  onNavigate: (page: string, id?: string) => void;
  embedded?: boolean;
  userRole?: 'contractor' | 'homeowner';
}
export function ChangeOrderPage({
  projectId,
  onNavigate,
  embedded = false,
  userRole = 'contractor'
}: ChangeOrderPageProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<
    'cancel' | 'approve' | 'reject'>(
    'cancel');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [cancelledOrders, setCancelledOrders] = useState<string[]>([]);
  const changeOrders = mockChangeOrders.
  filter((o) => o.projectId === (projectId || 'p1')).
  filter((o) => !cancelledOrders.includes(o.id));
  const handleCreate = () => {
    setIsCreating(false);
  };
  const handleConfirmModal = () => {
    if (modalAction === 'cancel' && selectedOrder) {
      setCancelledOrders((prev) => [...prev, selectedOrder]);
    }
    setModalOpen(false);
    setSelectedOrder(null);
  };
  const openModal = (
  action: 'cancel' | 'approve' | 'reject',
  orderId: string) =>
  {
    setModalAction(action);
    setSelectedOrder(orderId);
    setModalOpen(true);
  };
  const modalConfig = {
    cancel: {
      title: 'Cancel Change Order',
      message:
      'Are you sure you want to cancel this change order? It will be removed from the project.',
      confirmText: 'Yes, Cancel It',
      icon: undefined as any
    },
    approve: {
      title: 'Approve Change Order',
      message:
      'Approving this change order will add the cost and schedule impact to the contract.',
      confirmText: 'Approve',
      icon: 'success' as any
    },
    reject: {
      title: 'Reject Change Order',
      message:
      'Are you sure you want to reject this change order? The contractor will be notified.',
      confirmText: 'Reject',
      icon: undefined as any
    }
  };
  const content =
  <div className="space-y-6">
      {!embedded && !isCreating &&
    <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Change Orders</h2>
          {userRole === 'contractor' &&
      <PrimaryButton size="sm" onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Change Order
            </PrimaryButton>
      }
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
          {embedded && userRole === 'contractor' &&
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
        className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">

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

                {/* Contractor: can only cancel pending orders */}
                {userRole === 'contractor' && order.status === 'pending' &&
          <DangerButton
            size="sm"
            onClick={() => openModal('cancel', order.id)}>

                    <XCircle className="w-4 h-4 mr-1.5" />
                    Cancel Request
                  </DangerButton>
          }

                {/* Homeowner: can approve or reject pending orders */}
                {userRole === 'homeowner' && order.status === 'pending' &&
          <div className="flex gap-2">
                    <DangerButton
              size="sm"
              onClick={() => openModal('reject', order.id)}>

                      Reject
                    </DangerButton>
                    <SuccessButton
              size="sm"
              onClick={() => openModal('approve', order.id)}>

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
      onConfirm={handleConfirmModal}
      title={modalConfig[modalAction].title}
      message={modalConfig[modalAction].message}
      confirmText={modalConfig[modalAction].confirmText}
      icon={modalConfig[modalAction].icon} />

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