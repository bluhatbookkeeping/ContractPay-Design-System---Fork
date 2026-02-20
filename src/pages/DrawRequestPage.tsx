import React, { useState, Component } from 'react';
import { HeaderBar } from '../components/Navigation';
import { StatusBadge } from '../components/Badges';
import { PhotoGallery } from '../components/PhotoComponents';
import { Timeline } from '../components/DataDisplay';
import { ConfirmationModal } from '../components/Modals';
import { SuccessButton, DangerButton } from '../components/Buttons';
import { draws } from '../data/mockData';
interface DrawRequestPageProps {
  drawId?: string;
  onNavigate: (page: string) => void;
  userRole: 'contractor' | 'homeowner';
  addToast: (variant: 'success' | 'error') => void;
}
export function DrawRequestPage({
  drawId,
  onNavigate,
  userRole,
  addToast
}: DrawRequestPageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'dispute' | null>(
    null
  );
  const draw = draws.find((d) => d.id === drawId) || draws[0];
  const handleAction = (type: 'approve' | 'dispute') => {
    setActionType(type);
    setModalOpen(true);
  };
  const confirmAction = () => {
    setModalOpen(false);
    addToast(actionType === 'approve' ? 'success' : 'error');
    onNavigate('dashboard');
  };
  return (
    <div className="flex flex-col bg-gray-50 -m-4 lg:-m-8 min-h-full">
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAction}
        title={actionType === 'approve' ? 'Approve Payment' : 'Dispute Request'}
        message={
        actionType === 'approve' ?
        `Confirm release of $${draw.amount.toLocaleString()} to the contractor?` :
        'Please confirm you want to dispute this draw request.'
        }
        confirmVariant={actionType === 'approve' ? 'primary' : 'danger'} />


      <HeaderBar
        title="Draw Request Details"
        showBack
        onBack={() => onNavigate('dashboard')}
        rightAction={<StatusBadge status={draw.status} />} />


      <div className="p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Milestone</p>
                <h2 className="text-xl font-bold text-gray-900">
                  {draw.milestoneName}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Amount Requested</p>
                <p className="text-3xl font-bold font-mono text-navy-900">
                  ${draw.amount.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase text-gray-500 mb-3">
                Work Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {draw.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase text-gray-500 mb-3">
                Evidence Photos
              </h3>
              <PhotoGallery photos={draw.photos} />
            </div>
          </div>

          {userRole === 'homeowner' && draw.status === 'pending' &&
          <div className="grid grid-cols-2 gap-4">
              <SuccessButton
              size="lg"
              fullWidth
              onClick={() => handleAction('approve')}>

                Approve Payment
              </SuccessButton>
              <DangerButton
              size="lg"
              fullWidth
              onClick={() => handleAction('dispute')}>

                Dispute Request
              </DangerButton>
            </div>
          }

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">History</h3>
            <Timeline
              events={[
              {
                id: '1',
                title: 'Request Submitted',
                timestamp: draw.dateSubmitted,
                status: 'neutral',
                description: 'Submitted by Contractor'
              },
              {
                id: '2',
                title: 'Milestone Started',
                timestamp: 'Feb 01, 2025',
                status: 'success'
              }]
              } />

          </div>
        </div>
      </div>
    </div>);

}