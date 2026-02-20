import React from 'react';
import { MoreVertical, Share2, Trash2, Pencil } from 'lucide-react';
export type ReceiptCategory =
'materials' |
'labor' |
'permits' |
'equipment' |
'delivery' |
'misc';
interface Receipt {
  id: string;
  thumbnailUrl: string;
  vendor: string;
  amount: number;
  category: ReceiptCategory;
  date: string;
  isShared: boolean;
}
interface ReceiptCardProps {
  receipt: Receipt;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleShare?: () => void;
}
export function ReceiptCard({
  receipt,
  onEdit,
  onDelete,
  onToggleShare
}: ReceiptCardProps) {
  const categoryColors: Record<ReceiptCategory, string> = {
    materials: 'bg-blue-100 text-blue-700',
    labor: 'bg-purple-100 text-purple-700',
    permits: 'bg-orange-100 text-orange-700',
    equipment: 'bg-teal-100 text-teal-700',
    delivery: 'bg-indigo-100 text-indigo-700',
    misc: 'bg-gray-100 text-gray-700'
  };
  return (
    <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow group">
      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
        <img
          src={receipt.thumbnailUrl}
          alt={receipt.vendor}
          className="w-full h-full object-cover" />

      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="text-base font-semibold text-gray-900 truncate">
            {receipt.vendor}
          </h4>
          <span className="font-mono font-bold text-gray-900">
            ${receipt.amount.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${categoryColors[receipt.category]}`}>

            {receipt.category}
          </span>
          <span className="text-xs text-gray-500">{receipt.date}</span>
          {receipt.isShared &&
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 flex items-center gap-1">
              <Share2 className="w-3 h-3" /> Shared
            </span>
          }
        </div>
      </div>

      <div className="relative">
        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>);

}
interface CostSummaryCardProps {
  totalReceipts: number;
  contractAmount: number;
  categoryBreakdown: {
    category: string;
    amount: number;
    color: string;
  }[];
}
export function CostSummaryCard({
  totalReceipts,
  contractAmount,
  categoryBreakdown
}: CostSummaryCardProps) {
  const margin = contractAmount - totalReceipts;
  const marginPercent = margin / contractAmount * 100;
  const isWarning = totalReceipts > contractAmount * 0.8;
  return (
    <div
      className={`bg-white border rounded-xl p-5 shadow-sm ${isWarning ? 'border-yellow-200 bg-yellow-50/30' : 'border-gray-200'}`}>

      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-xs font-bold uppercase text-gray-500 mb-1">
            Total Costs
          </p>
          <p className="text-2xl font-bold font-mono text-gray-900">
            ${totalReceipts.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Budget Margin</p>
          <p
            className={`text-sm font-bold font-mono ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>

            {margin >= 0 ? '+' : ''}
            {marginPercent.toFixed(1)}% (${margin.toLocaleString()})
          </p>
        </div>
      </div>

      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex mb-4">
        {categoryBreakdown.map((cat, i) =>
        <div
          key={i}
          className={cat.color}
          style={{
            width: `${cat.amount / totalReceipts * 100}%`
          }} />

        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {categoryBreakdown.map((cat, i) =>
        <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${cat.color}`} />
              <span className="text-gray-600 capitalize">{cat.category}</span>
            </div>
            <span className="font-mono text-gray-900">
              ${cat.amount.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>);

}