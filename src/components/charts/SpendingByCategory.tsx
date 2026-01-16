'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { formatCurrency } from '@/lib/currency';

interface SpendingItem {
  name: string;
  value: number;
  color: string;
}

interface SpendingByCategoryProps {
  data: SpendingItem[];
  title?: string;
}

export default function SpendingByCategory({ data, title = 'Spending by Category' }: SpendingByCategoryProps) {
  const { currency } = useCurrency();

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
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
          {title}
        </h3>
        <div style={{
          height: '192px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9CA3AF',
          fontSize: '14px'
        }}>
          No transactions yet
        </div>
      </div>
    );
  }

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
        {title}
      </h3>
      <div style={{ height: '192px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
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
        <p style={{ fontSize: '14px', color: '#9CA3AF', margin: 0 }}>Total Spending</p>
        <p style={{ fontSize: '20px', fontWeight: 700, color: '#EF4444', margin: 0 }}>
          {formatCurrency(total, currency)}
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {data.slice(0, 6).map((item, index) => (
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
