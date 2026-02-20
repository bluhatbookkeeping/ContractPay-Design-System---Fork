import React from 'react';
import { TextInput, ToggleSwitch, PhoneInput } from '../components/FormElements';
import { PrimaryButton } from '../components/Buttons';
import { currentUserContractor } from '../data/mockData';
export function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
          Profile Settings
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <TextInput
            label="Full Name"
            defaultValue={currentUserContractor.name} />

          <TextInput
            label="Company Name"
            defaultValue={currentUserContractor.company} />

          <TextInput
            label="Email Address"
            defaultValue={currentUserContractor.email} />

          <PhoneInput
            label="Phone Number"
            defaultValue={currentUserContractor.phone} />

        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
          Notifications
        </h3>

        <div className="space-y-4">
          <ToggleSwitch
            checked={true}
            onChange={() => {}}
            label="Email notifications for new messages" />

          <ToggleSwitch
            checked={true}
            onChange={() => {}}
            label="SMS alerts for draw requests" />

          <ToggleSwitch
            checked={false}
            onChange={() => {}}
            label="Weekly project summary" />

        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
          Payment Methods
        </h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-6 bg-navy-900 rounded flex items-center justify-center text-white text-[10px] font-bold">
              BANK
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                Chase Bank ****8842
              </p>
              <p className="text-xs text-gray-500">Primary checking</p>
            </div>
          </div>
          <button className="text-sm text-blue-600 font-medium hover:underline">
            Edit
          </button>
        </div>
        <PrimaryButton variant="secondary" fullWidth>
          Add Payment Method
        </PrimaryButton>
      </div>

      <div className="flex justify-end pt-4">
        <PrimaryButton>Save Changes</PrimaryButton>
      </div>
    </div>);

}