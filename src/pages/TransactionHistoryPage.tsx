import React, { useState } from 'react';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Lock,
  Clock,
  CheckCircle,
  Filter,
  Download,
  Search } from
'lucide-react';
import { HeaderBar } from '../components/Navigation';
import { projects } from '../data/mockData';
interface TransactionHistoryPageProps {
  onNavigate: (page: string, id?: string) => void;
}
interface Transaction {
  id: string;
  type: 'deposit' | 'release' | 'holdback' | 'pending';
  description: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending';
  balance?: number;
}
export function TransactionHistoryPage({
  onNavigate
}: TransactionHistoryPageProps) {
  const [filter, setFilter] = useState<
    'all' | 'deposit' | 'release' | 'holdback'>(
    'all');
  // Mock transactions based on request
  const transactions: Transaction[] = [
  {
    id: 't6',
    type: 'pending',
    description: 'Draw Request: Cabinets & Counters',
    date: 'Today',
    amount: 25000,
    status: 'pending'
  },
  {
    id: 't5',
    type: 'holdback',
    description: 'Holdback Reserve (10%)',
    date: 'Feb 15, 2025',
    amount: 8500,
    status: 'completed',
    balance: 47000
  },
  {
    id: 't4',
    type: 'release',
    description: 'Draw Release: Rough Electrical',
    date: 'Feb 15, 2025',
    amount: 10000,
    status: 'completed',
    balance: 55500
  },
  {
    id: 't3',
    type: 'release',
    description: 'Draw Release: Rough Plumbing',
    date: 'Feb 5, 2025',
    amount: 12000,
    status: 'completed',
    balance: 65500
  },
  {
    id: 't2',
    type: 'release',
    description: 'Draw Release: Demolition',
    date: 'Jan 22, 2025',
    amount: 8000,
    status: 'completed',
    balance: 77500
  },
  {
    id: 't1',
    type: 'deposit',
    description: 'Initial Escrow Funding',
    date: 'Jan 10, 2025',
    amount: 85000,
    status: 'completed',
    balance: 85500
  }];

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'deposit') return t.type === 'deposit';
    if (filter === 'release')
    return t.type === 'release' || t.type === 'pending';
    if (filter === 'holdback') return t.type === 'holdback';
    return true;
  });
  const project = projects[0]; // Default to main project
  return (
    <div className="flex flex-col bg-gray-50 -m-4 lg:-m-8 min-h-full">
      <HeaderBar
        title="Transaction History"
        showBack
        onBack={() => onNavigate('dashboard')}
        rightAction={
        <button className="p-2 text-gray-500 hover:text-navy-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
        } />


      <div className="p-4 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-navy-900 text-white p-6 rounded-xl shadow-sm">
            <p className="text-navy-200 text-sm font-medium mb-1">
              Total Funded
            </p>
            <h3 className="text-3xl font-bold font-mono">
              ${project.escrow.total.toLocaleString()}
            </h3>
            <div className="mt-4 flex items-center gap-2 text-xs text-navy-200 bg-white/10 py-1 px-2 rounded-lg w-fit">
              <CheckCircle className="w-3 h-3" /> Fully Funded
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-sm font-medium mb-1">
              Total Released
            </p>
            <h3 className="text-3xl font-bold font-mono text-gray-900">
              $
              {(
              project.escrow.total - project.escrow.available).
              toLocaleString()}
            </h3>
            <p className="text-xs text-gray-400 mt-2">
              Includes holdback reserves
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-sm font-medium mb-1">
              Available Balance
            </p>
            <h3 className="text-3xl font-bold font-mono text-green-600">
              ${project.escrow.available.toLocaleString()}
            </h3>
            <p className="text-xs text-gray-400 mt-2">
              Ready for future milestones
            </p>
          </div>
        </div>

        {/* Filters & List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              {(['all', 'deposit', 'release', 'holdback'] as const).map((f) =>
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>

                  {f === 'all' ?
                'All Transactions' :
                f === 'deposit' ?
                'Deposits' :
                f === 'release' ?
                'Releases' :
                'Holdbacks'}
                </button>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-900 w-full sm:w-48" />

            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredTransactions.length > 0 ?
            filteredTransactions.map((t) =>
            <div
              key={t.id}
              className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">

                  {/* Icon */}
                  <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${t.type === 'deposit' ? 'bg-green-100 text-green-600' : t.type === 'release' ? 'bg-red-100 text-red-600' : t.type === 'holdback' ? 'bg-gray-100 text-gray-500' : 'bg-yellow-100 text-yellow-600'}`}>

                    {t.type === 'deposit' ?
                <ArrowDownCircle className="w-5 h-5" /> :
                t.type === 'release' ?
                <ArrowUpCircle className="w-5 h-5" /> :
                t.type === 'holdback' ?
                <Lock className="w-5 h-5" /> :

                <Clock className="w-5 h-5" />
                }
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-gray-900 truncate">
                        {t.description}
                      </p>
                      {t.status === 'pending' &&
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                  }
                    </div>
                    <p className="text-sm text-gray-500">{t.date}</p>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p
                  className={`font-mono font-bold ${t.type === 'deposit' ? 'text-green-600' : t.type === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>

                      {t.type === 'deposit' ? '+' : '-'}$
                      {t.amount.toLocaleString()}
                    </p>
                    {t.balance &&
                <p className="text-xs text-gray-400 mt-0.5">
                        Bal: ${t.balance.toLocaleString()}
                      </p>
                }
                  </div>
                </div>
            ) :

            <div className="p-12 text-center text-gray-500">
                <Filter className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p>No transactions found for this filter.</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

}