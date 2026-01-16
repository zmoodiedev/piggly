'use client';

import { SavingsGoal } from '@/types';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { formatCurrency, convertCurrency } from '@/lib/currency';
import { calculatePercentage } from '@/lib/utils';

interface SavingsProgressProps {
  goals: SavingsGoal[];
}

export default function SavingsProgress({ goals }: SavingsProgressProps) {
  const { currency } = useCurrency();

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1A1D2E', margin: 0 }}>
          Savings Goals
        </h3>
        <span style={{ fontSize: '14px', color: '#9CA3AF' }}>
          {goals.length} active
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {goals.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9CA3AF', padding: '16px 0' }}>
            No savings goals yet
          </p>
        ) : (
          goals.map((goal) => {
            const progress = calculatePercentage(goal.currentAmount, goal.targetAmount);
            const currentConverted = convertCurrency(goal.currentAmount, 'CAD', currency);
            const targetConverted = convertCurrency(goal.targetAmount, 'CAD', currency);

            return (
              <div key={goal.id} style={{ padding: '12px', background: '#F8F9FC', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: goal.color,
                      }}
                    />
                    <span style={{ fontWeight: 500, color: '#1A1D2E' }}>
                      {goal.name}
                    </span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1A1D2E' }}>
                    {progress}%
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    background: '#E5E7EB',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                    marginBottom: '8px',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      borderRadius: '9999px',
                      transition: 'all 0.5s',
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: goal.color,
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#9CA3AF' }}>
                    {formatCurrency(currentConverted, currency)}
                  </span>
                  <span style={{ color: '#9CA3AF' }}>
                    {formatCurrency(targetConverted, currency)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
