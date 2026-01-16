'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { formatCurrency, convertCurrency } from '@/lib/currency';

interface BudgetItem {
  name: string;
  value: number;
  color: string;
}

interface BudgetBreakdownProps {
  data: BudgetItem[];
}

export default function BudgetBreakdown({ data }: BudgetBreakdownProps) {
  const { currency } = useCurrency();

  const convertedData = data.map((item) => ({
    ...item,
    value: convertCurrency(item.value, 'CAD', currency),
  }));

  const total = convertedData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #F3F4F6',
        height: '100%',
      }}
    >
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1A1D2E', margin: '0 0 16px 0' }}>
        Budget Breakdown
      </h3>
      <div style={{ height: '192px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={convertedData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {convertedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value), currency)}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <p style={{ fontSize: '14px', color: '#9CA3AF', margin: 0 }}>Total Monthly</p>
        <p style={{ fontSize: '20px', fontWeight: 700, color: '#1A1D2E', margin: 0 }}>
          {formatCurrency(total, currency)}
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {convertedData.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                flexShrink: 0,
                backgroundColor: item.color,
              }}
            />
            <span style={{ fontSize: '12px', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
