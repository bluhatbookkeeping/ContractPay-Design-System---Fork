import React, { useState, useRef, Component } from 'react';
import {
  ShieldCheck,
  Upload,
  CheckCircle,
  FileText,
  Loader2,
  Building2,
  BadgeCheck,
  X,
  Plus } from
'lucide-react';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { TextInput, SelectInput } from '../components/FormElements';
import { VerificationBadge } from '../components/VerificationComponents';
const LICENSE_OPTIONS = [
{
  value: 'a',
  label: 'A — General Engineering Contractor'
},
{
  value: 'b',
  label: 'B — General Building Contractor'
},
{
  value: 'b2',
  label: 'B-2 — Residential Remodeling Contractor'
},
{
  value: 'c2',
  label: 'C-2 — Insulation and Acoustical Contractor'
},
{
  value: 'c4',
  label: 'C-4 — Boiler, Hot Water Heating and Steam Fitting Contractor'
},
{
  value: 'c5',
  label: 'C-5 — Framing and Rough Carpentry Contractor'
},
{
  value: 'c6',
  label: 'C-6 — Cabinet, Millwork and Finish Carpentry Contractor'
},
{
  value: 'c7',
  label: 'C-7 — Low Voltage Systems Contractor'
},
{
  value: 'c8',
  label: 'C-8 — Concrete Contractor'
},
{
  value: 'c9',
  label: 'C-9 — Drywall Contractor'
},
{
  value: 'c10',
  label: 'C-10 — Electrical Contractor'
},
{
  value: 'c11',
  label: 'C-11 — Elevator Contractor'
},
{
  value: 'c12',
  label: 'C-12 — Earthwork and Paving Contractor'
},
{
  value: 'c13',
  label: 'C-13 — Fencing Contractor'
},
{
  value: 'c15',
  label: 'C-15 — Flooring and Floor Covering Contractor'
},
{
  value: 'c16',
  label: 'C-16 — Fire Protection Contractor'
},
{
  value: 'c17',
  label: 'C-17 — Glazing Contractor'
},
{
  value: 'c20',
  label:
  'C-20 — Warm-Air Heating, Ventilating and Air-Conditioning Contractor'
},
{
  value: 'c21',
  label: 'C-21 — Building Moving/Demolition Contractor'
},
{
  value: 'c22',
  label: 'C-22 — Asbestos Abatement Contractor'
},
{
  value: 'c23',
  label: 'C-23 — Ornamental Metal Contractor'
},
{
  value: 'c27',
  label: 'C-27 — Landscaping Contractor'
},
{
  value: 'c28',
  label: 'C-28 — Lock and Security Equipment Contractor'
},
{
  value: 'c29',
  label: 'C-29 — Masonry Contractor'
},
{
  value: 'c31',
  label: 'C-31 — Construction Zone Traffic Control Contractor'
},
{
  value: 'c32',
  label: 'C-32 — Parking and Highway Improvement Contractor'
},
{
  value: 'c33',
  label: 'C-33 — Painting and Decorating Contractor'
},
{
  value: 'c34',
  label: 'C-34 — Pipeline Contractor'
},
{
  value: 'c35',
  label: 'C-35 — Lathing and Plastering Contractor'
},
{
  value: 'c36',
  label: 'C-36 — Plumbing Contractor'
},
{
  value: 'c38',
  label: 'C-38 — Refrigeration Contractor'
},
{
  value: 'c39',
  label: 'C-39 — Roofing Contractor'
},
{
  value: 'c42',
  label: 'C-42 — Sanitation System Contractor'
},
{
  value: 'c43',
  label: 'C-43 — Sheet Metal Contractor'
},
{
  value: 'c45',
  label: 'C-45 — Sign Contractor'
},
{
  value: 'c46',
  label: 'C-46 — Solar Contractor'
},
{
  value: 'c47',
  label: 'C-47 — General Manufactured Housing Contractor'
},
{
  value: 'c49',
  label: 'C-49 — Tree and Palm Contractor'
},
{
  value: 'c50',
  label: 'C-50 — Reinforcing Steel Contractor'
},
{
  value: 'c51',
  label: 'C-51 — Structural Steel Contractor'
},
{
  value: 'c53',
  label: 'C-53 — Swimming Pool Contractor'
},
{
  value: 'c54',
  label: 'C-54 — Ceramic and Mosaic Tile Contractor'
},
{
  value: 'c55',
  label: 'C-55 — Water Conditioning Contractor'
},
{
  value: 'c57',
  label: 'C-57 — Well Drilling Contractor'
},
{
  value: 'c60',
  label: 'C-60 — Welding Contractor'
},
{
  value: 'c61',
  label: 'C-61 — Limited Specialty Classification'
}];

export function VerificationPage() {
  const [verificationState, setVerificationState] = useState<
    'idle' | 'verifying' | 'verified'>(
    'idle');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [licenseTypes, setLicenseTypes] = useState<string[]>([]);
  const [licenseTypeInput, setLicenseTypeInput] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('');
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const insuranceInputRef = useRef<HTMLInputElement>(null);
  const workersCompInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<{
    license: string | null;
    insurance: string | null;
    workersComp: string | null;
  }>({
    license: null,
    insurance: null,
    workersComp: null
  });
  const addLicenseType = (value: string) => {
    if (value && !licenseTypes.includes(value)) {
      setLicenseTypes((prev) => [...prev, value]);
    }
    setLicenseTypeInput('');
  };
  const removeLicenseType = (value: string) => {
    setLicenseTypes((prev) => prev.filter((t) => t !== value));
  };
  const getLicenseLabel = (value: string) =>
  LICENSE_OPTIONS.find((o) => o.value === value)?.label ?? value;
  const handleVerify = () => {
    if (!licenseNumber || licenseTypes.length === 0 || !issuingAuthority) return;
    setVerificationState('verifying');
    setTimeout(() => setVerificationState('verified'), 2000);
  };
  const handleFileUpload = (
  type: 'license' | 'insurance' | 'workersComp',
  e: React.ChangeEvent<HTMLInputElement>) =>
  {
    const file = e.target.files?.[0];
    if (file)
    setFiles((prev) => ({
      ...prev,
      [type]: file.name
    }));
  };
  const availableOptions = LICENSE_OPTIONS.filter(
    (o) => !licenseTypes.includes(o.value)
  );
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-navy-900">
          Trust & Verification
        </h2>
        <p className="text-gray-500">
          Verify your license and manage your credentials
        </p>
      </div>

      {/* License Verification Form */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-navy-900" />
          <h3 className="font-bold text-gray-900">License Verification</h3>
        </div>

        <div className="p-6 space-y-6">
          {verificationState === 'verified' ?
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <BadgeCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-900">
                    License Verified
                  </h3>
                  <p className="text-green-700 text-sm">
                    Your credentials have been confirmed against the state
                    database.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                    License #
                  </p>
                  <p className="font-mono font-bold text-gray-900 text-lg">
                    {licenseNumber || '1058090'}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                    Issued By
                  </p>
                  <p className="font-bold text-gray-900">
                    {issuingAuthority === 'cslb' ? 'CA CSLB' : 'State Board'}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm md:col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                    License Type{licenseTypes.length > 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {licenseTypes.map((t) =>
                  <span
                    key={t}
                    className="text-sm font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full">

                        {getLicenseLabel(t)}
                      </span>
                  )}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm md:col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                    Verified by ContractPay on
                  </p>
                  <p className="font-bold text-gray-900">2025-12-22</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                onClick={() => setVerificationState('idle')}
                className="text-sm text-green-700 hover:text-green-800 font-medium underline">

                  Update License Info
                </button>
              </div>
            </div> :

          <>
              <div className="grid md:grid-cols-2 gap-6">
                <TextInput
                label="License Number"
                placeholder="e.g. 1058090"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)} />

                <SelectInput
                label="Issuing Authority"
                value={issuingAuthority}
                onChange={(e) => setIssuingAuthority(e.target.value)}
                options={[
                {
                  value: 'cslb',
                  label: 'CA CSLB (California)'
                }]
                } />

              </div>

              {/* Multi-select license types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  License Type(s)
                </label>

                {/* Selected chips */}
                {licenseTypes.length > 0 &&
              <div className="flex flex-wrap gap-2 mb-3">
                    {licenseTypes.map((t) =>
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 bg-navy-900/10 text-navy-900 text-xs font-semibold px-3 py-1.5 rounded-full border border-navy-900/20">

                        {getLicenseLabel(t)}
                        <button
                    onClick={() => removeLicenseType(t)}
                    className="hover:text-red-600 transition-colors ml-0.5">

                          <X className="w-3 h-3" />
                        </button>
                      </span>
                )}
                  </div>
              }

                {/* Add another type */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <SelectInput
                    label=""
                    value={licenseTypeInput}
                    onChange={(e) => setLicenseTypeInput(e.target.value)}
                    options={availableOptions} />

                  </div>
                  <button
                  onClick={() => addLicenseType(licenseTypeInput)}
                  disabled={!licenseTypeInput}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 text-sm font-medium rounded-lg transition-colors border border-gray-200 h-12 self-end">

                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                {licenseTypes.length === 0 &&
              <p className="text-xs text-gray-400 mt-1.5">
                    Select a type and click Add. You can add multiple.
                  </p>
              }
              </div>

              <TextInput
              label="Business Address"
              placeholder="123 Main St, City, State"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)} />


              <div className="pt-2 flex justify-end">
                <PrimaryButton
                onClick={handleVerify}
                disabled={
                !licenseNumber ||
                licenseTypes.length === 0 ||
                !issuingAuthority ||
                verificationState === 'verifying'
                }>

                  {verificationState === 'verifying' ?
                <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </> :

                'Verify License'
                }
                </PrimaryButton>
              </div>
            </>
          }
        </div>
      </div>

      {/* Document Uploads */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 px-1">
          Required Documents
        </h3>

        <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${verificationState === 'verified' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>

              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                State License Copy
              </h4>
              <p className="text-sm text-gray-500">
                {files.license ?
                <span className="text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {files.license}
                  </span> :

                'Upload a PDF or image of your license'
                }
              </p>
            </div>
          </div>
          <div>
            <input
              type="file"
              ref={licenseInputRef}
              className="hidden"
              onChange={(e) => handleFileUpload('license', e)}
              accept=".pdf,.jpg,.png" />

            {files.license ?
            <VerificationBadge type="license" status="verified" /> :

            <SecondaryButton
              size="sm"
              onClick={() => licenseInputRef.current?.click()}>

                <Upload className="w-4 h-4 mr-2" />
                Upload
              </SecondaryButton>
            }
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                Liability Insurance
              </h4>
              <p className="text-sm text-gray-500">
                {files.insurance ?
                <span className="text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {files.insurance}
                  </span> :

                'Policy expiring soon (03/15/2025)'
                }
              </p>
            </div>
          </div>
          <div>
            <input
              type="file"
              ref={insuranceInputRef}
              className="hidden"
              onChange={(e) => handleFileUpload('insurance', e)}
              accept=".pdf,.jpg,.png" />

            {files.insurance ?
            <VerificationBadge type="insurance" status="verified" /> :

            <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded uppercase tracking-wide">
                  Expiring
                </span>
                <SecondaryButton
                size="sm"
                onClick={() => insuranceInputRef.current?.click()}>

                  Update
                </SecondaryButton>
              </div>
            }
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                Workers' Compensation
              </h4>
              <p className="text-sm text-gray-500">
                {files.workersComp ?
                <span className="text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {files.workersComp}
                  </span> :

                'Proof of coverage required'
                }
              </p>
            </div>
          </div>
          <div>
            <input
              type="file"
              ref={workersCompInputRef}
              className="hidden"
              onChange={(e) => handleFileUpload('workersComp', e)}
              accept=".pdf,.jpg,.png" />

            {files.workersComp ?
            <VerificationBadge type="workersComp" status="verified" /> :

            <SecondaryButton
              size="sm"
              onClick={() => workersCompInputRef.current?.click()}>

                <Upload className="w-4 h-4 mr-2" />
                Upload
              </SecondaryButton>
            }
          </div>
        </div>
      </div>
    </div>);

}