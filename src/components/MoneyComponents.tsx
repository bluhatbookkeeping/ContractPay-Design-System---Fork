import React from 'react';
import { Lock, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
import { BasicCard } from './Cards';
import { PrimaryButton } from './Buttons';
interface EscrowBalanceCardProps {
  totalBalance: number;
  available: number;
  holdback: number;
  disputed?: number;
  onFund?: () => void;
  userType: 'contractor' | 'homeowner';
}
export function EscrowBalanceCard({
  totalBalance,
  available,
  holdback,
  disputed = 0,
  onFund,
  userType
}: EscrowBalanceCardProps) {
  return (
    <BasicCard className="w-full max-w-md bg-gradient-to-br from-white to-gray-50">
      <div className="text-center mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
          Escrow Balance
        </p>
        <h2 className="text-4xl font-bold font-mono text-navy-900 tracking-tight">
          $
          {totalBalance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="flex flex-col items-center p-2 rounded-lg bg-green-50 border border-green-100">
          <span className="text-[10px] font-semibold uppercase text-green-700 mb-1">
            Available
          </span>
          <span className="text-sm font-bold font-mono text-green-700">
            ${available.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-1 mb-1">
            <Lock className="w-3 h-3 text-blue-600" />
            <span className="text-[10px] font-semibold uppercase text-blue-700">
              Holdback
            </span>
          </div>
          <span className="text-sm font-bold font-mono text-blue-700">
            ${holdback.toLocaleString()}
          </span>
        </div>
        <div
          className={`flex flex-col items-center p-2 rounded-lg border ${disputed > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>

          <span
            className={`text-[10px] font-semibold uppercase mb-1 ${disputed > 0 ? 'text-red-700' : 'text-gray-500'}`}>

            Disputed
          </span>
          <span
            className={`text-sm font-bold font-mono ${disputed > 0 ? 'text-red-700' : 'text-gray-500'}`}>

            ${disputed.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex mb-6">
        <div
          className="h-full bg-green-500"
          style={{
            width: `${available / totalBalance * 100}%`
          }} />

        <div
          className="h-full bg-blue-500"
          style={{
            width: `${holdback / totalBalance * 100}%`
          }} />

        <div
          className="h-full bg-red-500"
          style={{
            width: `${disputed / totalBalance * 100}%`
          }} />

      </div>

      {userType === 'homeowner' && onFund &&
      <PrimaryButton onClick={onFund} fullWidth>
          Fund Escrow
        </PrimaryButton>
      }
    </BasicCard>);

}
interface TransactionItemProps {
  type: 'deposit' | 'draw' | 'refund' | 'fee';
  description: string;
  date: string;
  amount: number;
  status?: 'pending' | 'completed' | 'failed';
}
export function TransactionItem({
  type,
  description,
  date,
  amount,
  status = 'completed'
}: TransactionItemProps) {
  const isPositive = type === 'deposit' || type === 'refund';
  const icons = {
    deposit: <ArrowDownLeft className="w-5 h-5 text-green-600" />,
    draw: <ArrowUpRight className="w-5 h-5 text-navy-900" />,
    refund: <ArrowDownLeft className="w-5 h-5 text-green-600" />,
    fee: <Wallet className="w-5 h-5 text-gray-500" />
  };
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${type === 'deposit' ? 'bg-green-100' : type === 'draw' ? 'bg-navy-100' : 'bg-gray-100'}`}>

          {icons[type]}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{description}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{date}</span>
            {status !== 'completed' &&
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold ${status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>

                {status}
              </span>
            }
          </div>
        </div>
      </div>
      <span
        className={`font-mono font-bold ${isPositive ? 'text-green-600' : 'text-gray-900'}`}>

        {isPositive ? '+' : ''}
        {amount.toLocaleString(undefined, {
          style: 'currency',
          currency: 'USD'
        })}
      </span>
    </div>);

}