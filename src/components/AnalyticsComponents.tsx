import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
interface MetricCardProps {
  label: string;
  value: string | number;
  format?: 'currency' | 'number' | 'percentage';
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
  subtitle?: string;
}
export function MetricCard({
  label,
  value,
  format = 'number',
  trend,
  subtitle
}: MetricCardProps) {
  const formattedValue =
  format === 'currency' ?
  `$${Number(value).toLocaleString()}` :
  format === 'percentage' ?
  `${value}%` :
  value.toLocaleString();
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
        {label}
      </p>

      <div className="flex items-end gap-3 mb-1 flex-wrap overflow-hidden">
        <h3
          className={`text-3xl font-bold font-mono ${format === 'currency' ? 'text-green-700' : 'text-gray-900'}`}>

          {formattedValue}
        </h3>

        {trend &&
        <div
          className={`flex items-center gap-0.5 text-sm font-bold mb-1.5 flex-shrink-0 ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>

            {trend.direction === 'up' ?
          <TrendingUp className="w-4 h-4" /> :

          <TrendingDown className="w-4 h-4" />
          }
            {trend.value}
          </div>
        }
      </div>

      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>);

}
interface ProgressChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
}
export function ProgressChart({ data }: ProgressChartProps) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  return (
    <div className="space-y-4">
      {data.map((item, index) =>
      <div key={index}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">{item.label}</span>
            <span className="font-mono text-gray-900">{item.value}</span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
            className={`h-full rounded-full ${item.color}`}
            style={{
              width: `${item.value / total * 100}%`
            }} />

          </div>
        </div>
      )}
    </div>);

}
interface AgingChartProps {
  current: number;
  days30: number;
  days60: number;
  days90: number;
}
export function AgingChart({
  current,
  days30,
  days60,
  days90
}: AgingChartProps) {
  const total = current + days30 + days60 + days90;
  const getWidth = (val: number) => total > 0 ? val / total * 100 : 0;
  return (
    <div className="w-full">
      <div className="flex h-8 w-full rounded-lg overflow-hidden mb-4">
        {current > 0 &&
        <div
          style={{
            width: `${getWidth(current)}%`
          }}
          className="bg-green-500 h-full"
          title="Current" />

        }
        {days30 > 0 &&
        <div
          style={{
            width: `${getWidth(days30)}%`
          }}
          className="bg-yellow-500 h-full"
          title="30-60 Days" />

        }
        {days60 > 0 &&
        <div
          style={{
            width: `${getWidth(days60)}%`
          }}
          className="bg-orange-500 h-full"
          title="60-90 Days" />

        }
        {days90 > 0 &&
        <div
          style={{
            width: `${getWidth(days90)}%`
          }}
          className="bg-red-500 h-full"
          title="90+ Days" />

        }
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <div>
            <p className="text-[10px] uppercase text-gray-500 font-bold">
              Current
            </p>
            <p className="text-sm font-mono font-bold">
              ${current.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div>
            <p className="text-[10px] uppercase text-gray-500 font-bold">
              30-60 Days
            </p>
            <p className="text-sm font-mono font-bold">
              ${days30.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <div>
            <p className="text-[10px] uppercase text-gray-500 font-bold">
              60-90 Days
            </p>
            <p className="text-sm font-mono font-bold">
              ${days60.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div>
            <p className="text-[10px] uppercase text-gray-500 font-bold">
              90+ Days
            </p>
            <p className="text-sm font-mono font-bold">
              ${days90.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>);

}