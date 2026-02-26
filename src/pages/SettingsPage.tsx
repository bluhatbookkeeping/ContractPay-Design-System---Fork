import React, { useState } from 'react';
import { TextInput, ToggleSwitch, PhoneInput } from '../components/FormElements';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { SelectInput } from '../components/FormElements';
import { ConfirmationModal } from '../components/Modals';
import { currentUserHomeowner, currentUserContractor } from '../data/mockData';
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ChevronRight,
  AlertCircle,
  X,
  UserPlus,
  Users,
  Trash2,
  Mail,
  Phone,
  Shield,
  Eye,
  EyeOff,
  RefreshCw,
  FileText,
  DollarSign,
  Receipt,
  UserCheck,
  ArrowRightLeft,
  BookOpen } from
'lucide-react';
interface SettingsPageProps {
  addToast?: (
  variant: 'success' | 'error',
  title?: string,
  message?: string)
  => void;
  userRole?: 'contractor' | 'homeowner';
}
interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}
interface ContractorTeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'project-manager' | 'bookkeeper' | 'field-crew';
  status: 'active' | 'pending';
}
const contractorRoles = {
  admin: {
    label: 'Admin',
    description: 'Full access to everything',
    permissions: [
    'Projects',
    'Contracts',
    'Draws',
    'Receipts',
    'Messages',
    'Settings',
    'Payouts'],

    color: 'bg-red-50 text-red-700 border-red-200'
  },
  'project-manager': {
    label: 'Project Manager',
    description: 'Manage projects, schedules, and communicate with clients',
    permissions: [
    'Projects',
    'Contracts',
    'Draws',
    'Messages',
    'Schedule',
    'Daily Logs'],

    color: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  bookkeeper: {
    label: 'Bookkeeper',
    description: 'View and manage financial records',
    permissions: ['Receipts', 'Draws', 'Transaction History'],
    color: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  'field-crew': {
    label: 'Field Crew',
    description: 'Submit daily logs and photos from the job site',
    permissions: ['Daily Logs', 'Schedule', 'Photos'],
    color: 'bg-teal-50 text-teal-700 border-teal-200'
  }
};
export function SettingsPage({
  addToast,
  userRole = 'homeowner'
}: SettingsPageProps) {
  const isContractor = userRole === 'contractor';
  const [showPlaidModal, setShowPlaidModal] = useState(false);
  const [plaidStep, setPlaidStep] = useState<'intro' | 'connecting' | 'done'>(
    'intro'
  );
  // QuickBooks state
  const [qbConnected, setQbConnected] = useState(false);
  const [showQbModal, setShowQbModal] = useState(false);
  const [qbStep, setQbStep] = useState<'intro' | 'connecting' | 'done'>('intro');
  const [qbSyncSettings, setQbSyncSettings] = useState({
    syncInvoices: true,
    syncPayments: true,
    syncExpenses: true,
    syncCustomers: true
  });
  // Homeowner team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
  {
    id: 'tm1',
    name: 'Mike Jenkins',
    email: 'mike.j@example.com',
    phone: '(555) 987-1234',
    role: 'Co-owner'
  }]
  );
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState<Omit<TeamMember, 'id'>>({
    name: '',
    email: '',
    phone: '',
    role: ''
  });
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  // Contractor team members
  const [contractorTeam, setContractorTeam] = useState<ContractorTeamMember[]>([
  {
    id: 'ct1',
    name: 'Maria Lopez',
    email: 'maria@abcconst.com',
    phone: '(555) 234-5678',
    role: 'project-manager',
    status: 'active'
  },
  {
    id: 'ct2',
    name: 'Tom Rivera',
    email: 'tom@abcconst.com',
    phone: '(555) 345-6789',
    role: 'field-crew',
    status: 'active'
  }]
  );
  const [showAddContractorMember, setShowAddContractorMember] = useState(false);
  const [newContractorMember, setNewContractorMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'project-manager' as ContractorTeamMember['role']
  });
  const [contractorMemberToDelete, setContractorMemberToDelete] =
  useState<ContractorTeamMember | null>(null);
  const [notifications, setNotifications] = useState({
    emailMessages: true,
    smsPayments: true,
    notifyTeam: true,
    weeklySummary: false
  });
  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  // Homeowner handlers
  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) return;
    setTeamMembers((prev) => [
    ...prev,
    {
      ...newMember,
      id: `tm${Date.now()}`
    }]
    );
    setNewMember({
      name: '',
      email: '',
      phone: '',
      role: ''
    });
    setShowAddMember(false);
    addToast?.(
      'success',
      'Member added',
      `${newMember.name} has been added to your team.`
    );
  };
  const handleRemoveMember = (id: string) => {
    const member = teamMembers.find((m) => m.id === id);
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    setMemberToDelete(null);
    addToast?.(
      'success',
      'Member removed',
      `${member?.name ?? 'Member'} has been removed.`
    );
  };
  // Contractor team handlers
  const handleAddContractorMember = () => {
    if (!newContractorMember.name || !newContractorMember.email) return;
    setContractorTeam((prev) => [
    ...prev,
    {
      ...newContractorMember,
      id: `ct${Date.now()}`,
      status: 'pending' as const
    }]
    );
    setNewContractorMember({
      name: '',
      email: '',
      phone: '',
      role: 'project-manager'
    });
    setShowAddContractorMember(false);
    addToast?.(
      'success',
      'Invite sent',
      `${newContractorMember.name} will receive an email invite to join your team.`
    );
  };
  const handleRemoveContractorMember = (id: string) => {
    const member = contractorTeam.find((m) => m.id === id);
    setContractorTeam((prev) => prev.filter((m) => m.id !== id));
    setContractorMemberToDelete(null);
    addToast?.(
      'success',
      'Member removed',
      `${member?.name ?? 'Member'} has been removed from your team.`
    );
  };
  const handleConnectPlaid = () => {
    setPlaidStep('connecting');
    setTimeout(() => setPlaidStep('done'), 2000);
  };
  const closePlaidModal = () => {
    setShowPlaidModal(false);
    setPlaidStep('intro');
  };
  const handleConnectQb = () => {
    setQbStep('connecting');
    setTimeout(() => {
      setQbStep('done');
      setQbConnected(true);
    }, 2500);
  };
  const closeQbModal = () => {
    setShowQbModal(false);
    setQbStep('intro');
  };
  const handleDisconnectQb = () => {
    setQbConnected(false);
    addToast?.(
      'success',
      'QuickBooks disconnected',
      'Your QuickBooks account has been unlinked.'
    );
  };
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* QuickBooks Connect Modal */}
      {showQbModal &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#2CA01C] rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900 text-sm">
                  Connect QuickBooks
                </span>
              </div>
              <button
              onClick={closeQbModal}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">

                <X className="w-4 h-4" />
              </button>
            </div>
            {qbStep === 'intro' &&
          <div className="p-6 space-y-5">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-8 h-8 text-[#2CA01C]" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    Link QuickBooks Online
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Automatically sync your invoices, payments, and expenses to
                    QuickBooks for seamless bookkeeping.
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    What gets synced
                  </p>
                  {[
              {
                icon: FileText,
                label: 'Invoices',
                desc: 'Draw requests become invoices in QB',
                color: 'text-blue-600 bg-blue-50'
              },
              {
                icon: DollarSign,
                label: 'Payments',
                desc: 'Approved draws recorded as payments',
                color: 'text-green-600 bg-green-50'
              },
              {
                icon: Receipt,
                label: 'Expenses',
                desc: 'Receipts sync as expense transactions',
                color: 'text-purple-600 bg-purple-50'
              },
              {
                icon: UserCheck,
                label: 'Customers',
                desc: 'Homeowners created as QB customers',
                color: 'text-teal-600 bg-teal-50'
              }].
              map(({ icon: Icon, label, desc, color }) =>
              <div key={label} className="flex items-center gap-3">
                      <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>

                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {label}
                        </p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                    </div>
              )}
                </div>
                <PrimaryButton
              fullWidth
              onClick={handleConnectQb}
              className="!bg-[#2CA01C] hover:!bg-[#248a17]">

                  Sign in with QuickBooks{' '}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </PrimaryButton>
                <p className="text-center text-xs text-gray-400">
                  You'll be redirected to Intuit to authorize access
                </p>
              </div>
          }
            {qbStep === 'connecting' &&
          <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <BookOpen className="w-7 h-7 text-[#2CA01C]" />
                </div>
                <p className="font-semibold text-gray-900">
                  Connecting to QuickBooks…
                </p>
                <p className="text-sm text-gray-400">
                  Authorizing access to your company
                </p>
              </div>
          }
            {qbStep === 'done' &&
          <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">
                    QuickBooks Connected!
                  </p>
                  <p className="text-sm text-gray-500">
                    ABC Construction LLC is now linked. Data will sync
                    automatically.
                  </p>
                </div>
                <PrimaryButton fullWidth onClick={closeQbModal}>
                  Done
                </PrimaryButton>
              </div>
          }
          </div>
        </div>
      }

      {/* Plaid Connect Modal */}
      {showPlaidModal &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900 text-sm">
                  Connect Bank Account
                </span>
              </div>
              <button
              onClick={closePlaidModal}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">

                <X className="w-4 h-4" />
              </button>
            </div>
            {plaidStep === 'intro' &&
          <div className="p-6 space-y-5">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Building2 className="w-8 h-8 text-[#1e3a5f]" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    Link Your Bank via Plaid
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {isContractor ?
                'Securely connect your business checking account to receive ACH payouts when draw requests are approved.' :
                'Securely connect your account to fund the escrow and approve payments.'}
                  </p>
                </div>
                <div className="space-y-2.5">
                  {[
              {
                icon: ShieldCheck,
                text: 'Bank-level 256-bit encryption',
                color: 'text-green-600'
              },
              {
                icon: Zap,
                text: 'Payouts in 1–2 business days',
                color: 'text-blue-600'
              },
              {
                icon: CheckCircle2,
                text: 'Your credentials are never stored',
                color: 'text-green-600'
              }].
              map(({ icon: Icon, text, color }) =>
              <div
                key={text}
                className="flex items-center gap-3 text-sm text-gray-600">

                      <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
                      {text}
                    </div>
              )}
                </div>
                {isContractor &&
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      Use a <strong>business checking account</strong> to ensure
                      payments are properly recorded for tax purposes.
                    </p>
                  </div>
            }
                <PrimaryButton fullWidth onClick={handleConnectPlaid}>
                  Continue to Plaid <ChevronRight className="w-4 h-4 ml-1" />
                </PrimaryButton>
                <p className="text-center text-xs text-gray-400">
                  Powered by Plaid · Read their{' '}
                  <span className="underline cursor-pointer">
                    privacy policy
                  </span>
                </p>
              </div>
          }
            {plaidStep === 'connecting' &&
          <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Building2 className="w-7 h-7 text-[#1e3a5f]" />
                </div>
                <p className="font-semibold text-gray-900">
                  Connecting securely…
                </p>
                <p className="text-sm text-gray-400">
                  Verifying your account with Plaid
                </p>
              </div>
          }
            {plaidStep === 'done' &&
          <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">
                    Account Connected!
                  </p>
                  <p className="text-sm text-gray-500">
                    Chase Business Checking ****8842 is now set as your payout
                    account.
                  </p>
                </div>
                <PrimaryButton fullWidth onClick={closePlaidModal}>
                  Done
                </PrimaryButton>
              </div>
          }
          </div>
        </div>
      }

      {/* Delete confirmation modals */}
      <ConfirmationModal
        isOpen={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={() =>
        memberToDelete && handleRemoveMember(memberToDelete.id)
        }
        title="Remove Team Member"
        message={`Are you sure you want to remove ${memberToDelete?.name ?? 'this member'}? They will no longer receive messages or payment requests.`}
        confirmText="Remove"
        icon="warning" />

      <ConfirmationModal
        isOpen={!!contractorMemberToDelete}
        onClose={() => setContractorMemberToDelete(null)}
        onConfirm={() =>
        contractorMemberToDelete &&
        handleRemoveContractorMember(contractorMemberToDelete.id)
        }
        title="Remove Team Member"
        message={`Are you sure you want to remove ${contractorMemberToDelete?.name ?? 'this member'}? They will immediately lose access to all projects and data.`}
        confirmText="Remove Access"
        icon="warning" />


      {/* Profile */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
          Profile Settings
        </h3>
        {isContractor ?
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

          </div> :

        <div className="grid md:grid-cols-2 gap-6">
            <TextInput
            label="Full Name"
            defaultValue={currentUserHomeowner.name} />

            <TextInput
            label="Role"
            placeholder="e.g. Homeowner, Property Manager"
            defaultValue="Homeowner" />

            <TextInput
            label="Email Address"
            defaultValue={currentUserHomeowner.email} />

            <PhoneInput
            label="Phone Number"
            defaultValue={currentUserHomeowner.phone} />

          </div>
        }
      </div>

      {/* Contractor Team & Access */}
      {isContractor &&
      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-5">
          <div className="border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-[#1e3a5f]" />
              <h3 className="text-lg font-bold text-gray-900">Team & Access</h3>
            </div>
            <p className="text-sm text-gray-500">
              Invite team members and control what they can see and do. Each
              role has specific permissions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(
          Object.entries(contractorRoles) as [
            string,
            (typeof contractorRoles)['admin']][]).

          map(([key, role]) =>
          <div key={key} className={`p-3 rounded-lg border ${role.color}`}>
                <p className="text-xs font-bold">{role.label}</p>
                <p className="text-[10px] mt-0.5 opacity-80">
                  {role.description}
                </p>
              </div>
          )}
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  JB
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm">
                      {currentUserContractor.name}
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#1e3a5f] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                      Owner
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {currentUserContractor.email}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-400">Full access</span>
            </div>
            {contractorTeam.map((member) => {
            const roleInfo = contractorRoles[member.role];
            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {member.name.
                    split(' ').
                    map((n) => n[0]).
                    join('').
                    slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm">
                          {member.name}
                        </p>
                        <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleInfo.color}`}>

                          {roleInfo.label}
                        </span>
                        {member.status === 'pending' &&
                      <span className="text-[10px] font-medium text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                            Invite Pending
                          </span>
                      }
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </span>
                        {member.phone &&
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {member.phone}
                          </span>
                      }
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {roleInfo.permissions.map((perm) =>
                      <span
                        key={perm}
                        className="text-[9px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">

                            <Eye className="w-2.5 h-2.5" />
                            {perm}
                          </span>
                      )}
                      </div>
                    </div>
                  </div>
                  <button
                  onClick={() => setContractorMemberToDelete(member)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">

                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>);

          })}
          </div>
          {showAddContractorMember ?
        <div className="border border-blue-200 bg-blue-50/40 rounded-xl p-5 space-y-4">
              <h4 className="font-semibold text-gray-900 text-sm">
                Invite Team Member
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <TextInput
              label="Full Name"
              placeholder="e.g. Maria Lopez"
              value={newContractorMember.name}
              onChange={(e) =>
              setNewContractorMember((p) => ({
                ...p,
                name: e.target.value
              }))
              } />

                <SelectInput
              label="Role"
              value={newContractorMember.role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setNewContractorMember((p) => ({
                ...p,
                role: e.target.value as ContractorTeamMember['role']
              }))
              }
              options={[
              {
                value: 'admin',
                label: 'Admin'
              },
              {
                value: 'project-manager',
                label: 'Project Manager'
              },
              {
                value: 'bookkeeper',
                label: 'Bookkeeper'
              },
              {
                value: 'field-crew',
                label: 'Field Crew'
              }]
              } />

                <TextInput
              label="Email Address"
              placeholder="email@company.com"
              value={newContractorMember.email}
              onChange={(e) =>
              setNewContractorMember((p) => ({
                ...p,
                email: e.target.value
              }))
              } />

                <PhoneInput
              label="Phone Number"
              placeholder="(555) 000-0000"
              value={newContractorMember.phone}
              onChange={(e) =>
              setNewContractorMember((p) => ({
                ...p,
                phone: e.target.value
              }))
              } />

              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  This role will have access to:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {contractorRoles[newContractorMember.role].permissions.map(
                (perm) =>
                <span
                  key={perm}
                  className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">

                        <Eye className="w-3 h-3" />
                        {perm}
                      </span>

              )}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
              'Projects',
              'Contracts',
              'Draws',
              'Receipts',
              'Messages',
              'Settings',
              'Payouts',
              'Schedule',
              'Daily Logs',
              'Photos',
              'Transaction History'].

              filter(
                (p) =>
                !contractorRoles[
                newContractorMember.role].
                permissions.includes(p)
              ).
              map((perm) =>
              <span
                key={perm}
                className="text-xs font-medium text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full flex items-center gap-1">

                        <EyeOff className="w-3 h-3" />
                        {perm}
                      </span>
              )}
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <SecondaryButton
              onClick={() => setShowAddContractorMember(false)}>

                  Cancel
                </SecondaryButton>
                <PrimaryButton
              onClick={handleAddContractorMember}
              disabled={
              !newContractorMember.name || !newContractorMember.email
              }>

                  Send Invite
                </PrimaryButton>
              </div>
            </div> :

        <button
          onClick={() => setShowAddContractorMember(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-[#1e3a5f]/40 hover:text-[#1e3a5f] hover:bg-blue-50/30 transition-all">

              <UserPlus className="w-4 h-4" />
              <span className="text-sm font-medium">Invite team member</span>
            </button>
        }
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
            <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              Team members will receive an email invite to create their account.
              They'll only see the sections their role allows.{' '}
              <strong>
                Only Admins and Owners can manage team access or payout
                settings.
              </strong>
            </p>
          </div>
        </div>
      }

      {/* Team Members / Household (Homeowner only) */}
      {!isContractor &&
      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-5">
          <div className="border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-[#1e3a5f]" />
              <h3 className="text-lg font-bold text-gray-900">
                Household Members & Team
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              Add co-owners, spouses, or property managers who should receive
              messages, payment requests, and contract updates.
            </p>
          </div>
          <div className="space-y-3">
            {teamMembers.map((member) =>
          <div
            key={member.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {member.name.
                split(' ').
                map((n) => n[0]).
                join('').
                slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 text-sm">
                        {member.name}
                      </p>
                      {member.role &&
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#1e3a5f] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                          {member.role}
                        </span>
                  }
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {member.email}
                      </span>
                      {member.phone &&
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {member.phone}
                        </span>
                  }
                    </div>
                  </div>
                </div>
                <button
              onClick={() => setMemberToDelete(member)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">

                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
          )}
          </div>
          {showAddMember ?
        <div className="border border-blue-200 bg-blue-50/40 rounded-xl p-5 space-y-4">
              <h4 className="font-semibold text-gray-900 text-sm">
                Add Team Member
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <TextInput
              label="Full Name"
              placeholder="e.g. Mike Jenkins"
              value={newMember.name}
              onChange={(e) =>
              setNewMember((p) => ({
                ...p,
                name: e.target.value
              }))
              } />

                <TextInput
              label="Role"
              placeholder="e.g. Co-owner, Spouse, Manager"
              value={newMember.role}
              onChange={(e) =>
              setNewMember((p) => ({
                ...p,
                role: e.target.value
              }))
              } />

                <TextInput
              label="Email Address"
              placeholder="email@example.com"
              value={newMember.email}
              onChange={(e) =>
              setNewMember((p) => ({
                ...p,
                email: e.target.value
              }))
              } />

                <PhoneInput
              label="Phone Number"
              placeholder="(555) 000-0000"
              value={newMember.phone}
              onChange={(e) =>
              setNewMember((p) => ({
                ...p,
                phone: e.target.value
              }))
              } />

              </div>
              <div className="flex gap-3 pt-1">
                <SecondaryButton onClick={() => setShowAddMember(false)}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton
              onClick={handleAddMember}
              disabled={!newMember.name || !newMember.email}>

                  Add Member
                </PrimaryButton>
              </div>
            </div> :

        <button
          onClick={() => setShowAddMember(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-[#1e3a5f]/40 hover:text-[#1e3a5f] hover:bg-blue-50/30 transition-all">

              <UserPlus className="w-4 h-4" />
              <span className="text-sm font-medium">
                Add household member or team contact
              </span>
            </button>
        }
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Added members will receive{' '}
              <strong>payment requests, contract updates, and messages</strong>{' '}
              from your contractor. They won't have admin access to your
              account.
            </p>
          </div>
        </div>
      }

      {/* Notifications */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
          Notifications
        </h3>
        <div className="space-y-4">
          <ToggleSwitch
            checked={notifications.emailMessages}
            onChange={() => toggleNotification('emailMessages')}
            label="Email notifications for new messages" />

          <ToggleSwitch
            checked={notifications.smsPayments}
            onChange={() => toggleNotification('smsPayments')}
            label={
            isContractor ?
            'SMS alerts for draw requests' :
            'SMS alerts for payment requests'
            } />

          {!isContractor &&
          <ToggleSwitch
            checked={notifications.notifyTeam}
            onChange={() => toggleNotification('notifyTeam')}
            label="Notify team members on payment requests" />

          }
          <ToggleSwitch
            checked={notifications.weeklySummary}
            onChange={() => toggleNotification('weeklySummary')}
            label="Weekly project summary" />

        </div>
      </div>

      {/* Payout Account (Contractor only) */}
      {isContractor &&
      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-5">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900">Payout Account</h3>
            <p className="text-sm text-gray-500 mt-1">
              This is the bank account where you'll receive ACH payments when
              draw requests are approved by the homeowner.
            </p>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg border border-green-200 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#1e3a5f]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">
                    Chase Business Checking
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Account ending ****8842 · Verified via Plaid
                </p>
              </div>
            </div>
            <button className="text-sm text-[#1e3a5f] font-medium hover:underline">
              Edit
            </button>
          </div>
          <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-lg p-3">
            <Zap className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>
                ACH transfers typically arrive in 1–2 business days
              </strong>{' '}
              after a draw request is approved. Same-day payouts may be
              available depending on your bank.
            </p>
          </div>
          <button
          onClick={() => setShowPlaidModal(true)}
          className="w-full flex items-center justify-between px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-[#1e3a5f]/40 hover:text-[#1e3a5f] hover:bg-blue-50/30 transition-all group">

            <span className="text-sm font-medium">
              Connect a different bank account
            </span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      }

      {/* QuickBooks Integration (Contractor only) */}
      {isContractor &&
      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-5">
          <div className="border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-[#2CA01C]" />
              <h3 className="text-lg font-bold text-gray-900">
                QuickBooks Integration
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              Connect your QuickBooks Online account to automatically sync
              financial data for seamless bookkeeping.
            </p>
          </div>

          {qbConnected ?
        <>
              {/* Connected state */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg border border-green-200 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[#2CA01C]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">
                        ABC Construction LLC
                      </p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Connected
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      QuickBooks Online · Last synced 2 min ago
                    </p>
                  </div>
                </div>
                <button
              onClick={handleDisconnectQb}
              className="text-sm text-red-500 font-medium hover:underline">

                  Disconnect
                </button>
              </div>

              {/* Sync settings */}
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  What syncs to QuickBooks
                </p>
                <div className="space-y-3">
                  {[
              {
                key: 'syncInvoices' as const,
                icon: FileText,
                label: 'Invoices',
                desc: 'Draw requests → QB Invoices',
                color: 'text-blue-600 bg-blue-50'
              },
              {
                key: 'syncPayments' as const,
                icon: DollarSign,
                label: 'Payments Received',
                desc: 'Approved draws → QB Payments',
                color: 'text-green-600 bg-green-50'
              },
              {
                key: 'syncExpenses' as const,
                icon: Receipt,
                label: 'Expenses',
                desc: 'Receipts → QB Expense transactions',
                color: 'text-purple-600 bg-purple-50'
              },
              {
                key: 'syncCustomers' as const,
                icon: UserCheck,
                label: 'Customers',
                desc: 'Homeowners → QB Customer records',
                color: 'text-teal-600 bg-teal-50'
              }].
              map(({ key, icon: Icon, label, desc, color }) =>
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">

                      <div className="flex items-center gap-3">
                        <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>

                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {label}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <ArrowRightLeft className="w-3 h-3" /> {desc}
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                  checked={qbSyncSettings[key]}
                  onChange={() =>
                  setQbSyncSettings((prev) => ({
                    ...prev,
                    [key]: !prev[key]
                  }))
                  }
                  label="" />

                    </div>
              )}
                </div>
              </div>

              {/* Manual sync button */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-400">
                  Auto-syncs every 15 minutes
                </p>
                <button
              onClick={() =>
              addToast?.(
                'success',
                'Sync complete',
                'All data has been synced to QuickBooks.'
              )
              }
              className="flex items-center gap-1.5 text-sm font-medium text-[#2CA01C] hover:text-[#248a17] transition-colors">

                  <RefreshCw className="w-3.5 h-3.5" /> Sync Now
                </button>
              </div>
            </> :

        <>
              {/* Not connected state */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Data that will sync
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
              {
                icon: FileText,
                label: 'Invoices',
                desc: 'From draw requests',
                color: 'text-blue-600 bg-blue-50'
              },
              {
                icon: DollarSign,
                label: 'Payments',
                desc: 'Approved draws',
                color: 'text-green-600 bg-green-50'
              },
              {
                icon: Receipt,
                label: 'Expenses',
                desc: 'Receipt records',
                color: 'text-purple-600 bg-purple-50'
              },
              {
                icon: UserCheck,
                label: 'Customers',
                desc: 'Homeowner records',
                color: 'text-teal-600 bg-teal-50'
              }].
              map(({ icon: Icon, label, desc, color }) =>
              <div
                key={label}
                className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg border border-gray-200">

                      <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>

                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">
                          {label}
                        </p>
                        <p className="text-[10px] text-gray-500">{desc}</p>
                      </div>
                    </div>
              )}
                </div>
              </div>

              <button
            onClick={() => setShowQbModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2CA01C] hover:bg-[#248a17] text-white rounded-xl font-medium transition-colors text-sm">

                <BookOpen className="w-4 h-4" />
                Connect QuickBooks
              </button>

              <p className="text-center text-xs text-gray-400">
                Requires QuickBooks Online (Simple Start, Essentials, or Plus)
              </p>
            </>
        }
        </div>
      }

      <div className="flex justify-end pt-4">
        <PrimaryButton
          onClick={() =>
          addToast?.(
            'success',
            'Settings saved',
            'Your profile and notification preferences have been updated.'
          )
          }>

          Save Changes
        </PrimaryButton>
      </div>
    </div>);

}