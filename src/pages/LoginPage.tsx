import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { PrimaryButton } from '../components/Buttons';
import { TextInput } from '../components/FormElements';
// Mock users for demo
const MOCK_USERS: Record<string, 'contractor' | 'homeowner'> = {
  'john@abcconst.com': 'contractor',
  'sarah.j@example.com': 'homeowner'
};
interface LoginPageProps {
  onLogin: (role: 'contractor' | 'homeowner') => void;
}
export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState<'entry' | 'sent'>('entry');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSendLink = () => {
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!MOCK_USERS[email.toLowerCase()]) {
      setError(
        'No account found for this email. Try john@abcconst.com or sarah.j@example.com'
      );
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStage('sent');
    }, 800);
  };
  const handleSimulateClick = () => {
    const role = MOCK_USERS[email.toLowerCase()];
    if (role) onLogin(role);
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1e3a5f] tracking-tight">
            ContractPay
          </h1>
        </div>
        <p className="text-sm text-gray-500">Construction Escrow Platform</p>
      </div>

      <div className="w-full max-w-sm">
        {stage === 'entry' ?
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Sign in</h2>
              <p className="text-sm text-gray-500">
                Enter your email and we'll send you a magic link to sign in
                instantly — no password needed.
              </p>
            </div>

            <div className="space-y-4">
              <TextInput
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSendLink()}
              error={error}
              autoFocus />


              <PrimaryButton
              fullWidth
              onClick={handleSendLink}
              loading={loading}>

                Send Magic Link
                <ArrowRight className="w-4 h-4 ml-2" />
              </PrimaryButton>
            </div>

            {/* Demo hint */}
            <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs font-semibold text-blue-800 mb-1">
                Demo accounts
              </p>
              <div className="space-y-1">
                <button
                onClick={() => {
                  setEmail('john@abcconst.com');
                  setError('');
                }}
                className="block text-xs text-blue-700 hover:text-blue-900 hover:underline transition-colors">

                  john@abcconst.com — Contractor
                </button>
                <button
                onClick={() => {
                  setEmail('sarah.j@example.com');
                  setError('');
                }}
                className="block text-xs text-blue-700 hover:text-blue-900 hover:underline transition-colors">

                  sarah.j@example.com — Homeowner
                </button>
              </div>
            </div>
          </div> :

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Check your email
            </h2>
            <p className="text-sm text-gray-500 mb-1">
              We sent a magic link to
            </p>
            <p className="text-sm font-semibold text-gray-900 mb-6">{email}</p>

            <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3 mb-6 text-left">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>
                Click the link in your email to sign in. The link expires in 15
                minutes.
              </span>
            </div>

            {/* Demo simulate button */}
            <div className="border-t border-gray-100 pt-5">
              <p className="text-xs text-gray-400 mb-3">
                Demo mode — simulate clicking the link:
              </p>
              <PrimaryButton fullWidth onClick={handleSimulateClick}>
                <Zap className="w-4 h-4 mr-2" />
                Open Magic Link
              </PrimaryButton>
            </div>

            <button
            onClick={() => {
              setStage('entry');
              setError('');
            }}
            className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors">

              Use a different email
            </button>
          </div>
        }
      </div>

      <p className="mt-8 text-xs text-gray-400 text-center">
        Protected by ContractPay ·{' '}
        <span className="hover:underline cursor-pointer">Privacy Policy</span>
      </p>
    </div>);

}