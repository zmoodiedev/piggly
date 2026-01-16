'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { formatCurrency, convertCurrency } from '@/lib/currency';

interface SpendingDataPoint {
  month: string;
  income: number;
  expenses: number;
}

interface SpendingChartProps {
  data: SpendingDataPoint[];
}

export default function SpendingChart({ data }: SpendingChartProps) {
  const { currency } = useCurrency();

  const convertedData = data.map((point) => ({
    ...point,
    income: convertCurrency(point.income, 'CAD', currency),
    expenses: convertCurrency(point.expenses, 'CAD', currency),
  }));

  const formatTooltipValue = (value: number | undefined) => {
    return formatCurrency(value ?? 0, currency);
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #F3F4F6',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1A1D2E', margin: 0 }}>
          Income vs Expenses
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }} />
            <span style={{ color: '#9CA3AF' }}>Income</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF7B9C' }} />
            <span style={{ color: '#9CA3AF' }}>Expenses</span>
          </div>
        </div>
      </div>
      <div style={{ height: '256px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={convertedData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={formatTooltipValue}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{ color: '#1A1D2E', fontWeight: 600 }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#10B981' }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#FF7B9C"
              strokeWidth={3}
              dot={{ fill: '#FF7B9C', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#FF7B9C' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
