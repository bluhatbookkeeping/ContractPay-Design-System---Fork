import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  ExternalLink,
  CheckCircle } from
'lucide-react';
import { SecondaryButton } from './Buttons';
interface VerificationBadgeProps {
  type: 'license' | 'insurance' | 'workersComp';
  status: 'verified' | 'expiring' | 'expired' | 'unverified';
  expirationDate?: string;
}
export function VerificationBadge({
  type,
  status,
  expirationDate
}: VerificationBadgeProps) {
  const configs = {
    verified: {
      icon: ShieldCheck,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200'
    },
    expiring: {
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200'
    },
    expired: {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200'
    },
    unverified: {
      icon: Circle,
      color: 'text-gray-400',
      bg: 'bg-gray-50',
      border: 'border-gray-200'
    }
  };
  // Helper component for unverified icon
  const Circle = ({ className }: {className?: string;}) =>
  <div
    className={`w-4 h-4 rounded-full border-2 border-current ${className}`} />;


  const config = configs[status];
  const Icon = config.icon;
  const labels = {
    license: 'State License',
    insurance: 'Liability Insurance',
    workersComp: "Workers' Comp"
  };
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border ${config.bg} ${config.border}`}>

      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${config.color}`} />
        <div>
          <p className={`text-sm font-semibold ${config.color}`}>
            {labels[type]}
          </p>
          {expirationDate &&
          <p className="text-xs text-gray-500">Expires: {expirationDate}</p>
          }
        </div>
      </div>
      <div
        className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>

        {status}
      </div>
    </div>);

}
interface TrustCardProps {
  contractor: {
    name: string;
    ownerName: string;
    logoUrl?: string;
    license: {
      number: string;
      state: string;
      status: string;
    };
    insurance: {
      status: string;
    };
    lastVerified: string;
  };
  onContactClick?: () => void;
}
export function TrustCard({ contractor, onContactClick }: TrustCardProps) {
  const isFullyVerified =
  contractor.license.status === 'Active' &&
  contractor.insurance.status === 'Active';
  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${isFullyVerified ? 'border-green-500' : 'border-gray-300'}`}>

      <div className="p-5">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-lg bg-navy-900 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
            {contractor.logoUrl ?
            <img
              src={contractor.logoUrl}
              alt={contractor.name}
              className="w-full h-full object-cover rounded-lg" /> :


            contractor.name.substring(0, 2).toUpperCase()
            }
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
              {contractor.name}
            </h3>
            <p className="text-sm text-gray-600">{contractor.ownerName}</p>
            {isFullyVerified &&
            <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                <ShieldCheck className="w-3 h-3" /> Verified Pro
              </div>
            }
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>
                License #{contractor.license.number} ({contractor.license.state}
                )
              </span>
            </div>
            <a
              href="#"
              className="text-blue-600 hover:underline flex items-center gap-1 text-xs">

              Verify <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle
              className={`w-4 h-4 ${contractor.insurance.status === 'Active' ? 'text-green-600' : 'text-gray-300'}`} />

            <span>General Liability Insurance</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Identity Verified</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            Last verified: {contractor.lastVerified}
          </span>
          {onContactClick &&
          <SecondaryButton onClick={onContactClick} size="sm">
              Contact
            </SecondaryButton>
          }
        </div>
      </div>
    </div>);

}