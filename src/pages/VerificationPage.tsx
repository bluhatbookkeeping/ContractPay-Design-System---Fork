import React, { Component } from 'react';
import {
  TrustCard,
  VerificationBadge } from
'../components/VerificationComponents';
import { PrimaryButton } from '../components/Buttons';
export function VerificationPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-navy-900">
          Trust & Verification
        </h2>
        <p className="text-gray-500">
          Manage your verified status and documents
        </p>
      </div>

      <TrustCard
        contractor={{
          name: 'ABC Construction',
          ownerName: 'John Builder',
          license: {
            number: '789456',
            state: 'CA',
            status: 'Active'
          },
          insurance: {
            status: 'Active'
          },
          lastVerified: 'Feb 1, 2025'
        }} />


      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Document Status</h3>

        <VerificationBadge
          type="license"
          status="verified"
          expirationDate="12/31/2026" />


        <div className="relative">
          <VerificationBadge
            type="insurance"
            status="expiring"
            expirationDate="03/15/2025" />

          <div className="mt-2 flex justify-end">
            <button className="text-sm text-blue-600 font-medium hover:underline">
              Update Policy
            </button>
          </div>
        </div>

        <div className="relative">
          <VerificationBadge type="workersComp" status="unverified" />
          <div className="mt-2 flex justify-end">
            <PrimaryButton size="sm">Upload Document</PrimaryButton>
          </div>
        </div>
      </div>
    </div>);

}