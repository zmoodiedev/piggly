'use client';

import { Bill } from '@/types';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { formatCurrency, convertCurrency } from '@/lib/currency';

interface UpcomingBillsProps {
  bills: Bill[];
}

const categoryIcons: Record<string, string> = {
  utilities: '⚡',
  subscription: '📺',
  insurance: '🛡️',
  rent: '🏠',
  other: '📄',
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  utilities: { bg: '#FEF3C7', text: '#D97706' },
  subscription: { bg: '#EDE9FE', text: '#7C3AED' },
  insurance: { bg: '#DBEAFE', text: '#2563EB' },
  rent: { bg: '#D1FAE5', text: '#059669' },
  other: { bg: '#F3F4F6', text: '#6B7280' },
};

export default function UpcomingBills({ bills }: UpcomingBillsProps) {
  const { currency } = useCurrency();

  const today = new Date().getDate();

  const billsWithDays = bills
    .map((bill) => {
      let daysUntil = bill.dueDate - today;
      if (daysUntil < 0) daysUntil += 30;
      return { ...bill, daysUntil };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 5);

  const getDueStatus = (days: number) => {
    if (days <= 2) return { text: 'Due soon', color: '#EF4444' };
    if (days <= 7) return { text: `${days} days`, color: '#F59E0B' };
    return { text: `${days} days`, color: '#9CA3AF' };
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1A1D2E', margin: 0 }}>
          Upcoming Bills
        </h3>
        <span style={{ fontSize: '14px', color: '#9CA3AF' }}>
          {bills.length} unpaid
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {billsWithDays.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9CA3AF', padding: '16px 0' }}>
            No upcoming bills
          </p>
        ) : (
          billsWithDays.map((bill) => {
            const status = getDueStatus(bill.daysUntil);
            const colors = categoryColors[bill.category] || categoryColors.other;
            return (
              <div
                key={bill.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: '#F8F9FC',
                  borderRadius: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      background: colors.bg,
                      color: colors.text,
                    }}
                  >
                    {categoryIcons[bill.category] || categoryIcons.other}
                  </div>
                  <div>
                    <p style={{ fontWeight: 500, color: '#1A1D2E', margin: 0 }}>
                      {bill.name}
                    </p>
                    <p style={{ fontSize: '14px', color: '#9CA3AF', margin: 0 }}>
                      Due on the {bill.dueDate}
                      {bill.dueDate === 1 ? 'st' : bill.dueDate === 2 ? 'nd' : bill.dueDate === 3 ? 'rd' : 'th'}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 600, color: '#1A1D2E', margin: 0 }}>
                    {formatCurrency(convertCurrency(bill.amount, 'CAD', currency), currency)}
                  </p>
                  <p style={{ fontSize: '14px', color: status.color, margin: 0 }}>{status.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
