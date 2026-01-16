'use client';

import { Debt } from '@/types';
import { formatCurrency } from '@/lib/currency';

interface DebtCardProps {
  debt: Debt;
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'credit-card': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  loan: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12M8 10h8M8 14h8" />
    </svg>
  ),
  mortgage: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  other: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
};

export default function DebtCard({ debt, onEdit, onDelete }: DebtCardProps) {
  const debtCurrency = debt.currency || 'CAD';

  const paidOff = debt.totalAmount - debt.currentBalance;
  const progressPercent = Math.round((paidOff / debt.totalAmount) * 100);

  const formatAmount = (amount: number) => {
    return formatCurrency(amount, debtCurrency);
  };

  const formatCategory = (category: string) => {
    return category.replace('-', ' ');
  };

  return (
    <div className="debt-card">
      <div className="debt-card-header">
        <div className="debt-card-info">
          <div className={`debt-card-icon ${debt.category}`}>
            {categoryIcons[debt.category] || categoryIcons.other}
          </div>
          <div>
            <h3 className="debt-card-title">{debt.name}</h3>
            <p className="debt-card-category">{formatCategory(debt.category)}</p>
          </div>
        </div>
        <div className="debt-card-actions">
          <button
            className="debt-card-action-btn"
            onClick={() => onEdit(debt)}
            title="Edit debt"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className="debt-card-action-btn delete"
            onClick={() => onDelete(debt.id)}
            title="Delete debt"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      <div className="debt-card-progress">
        <div className="debt-card-progress-header">
          <span className="debt-card-progress-label">Payoff Progress</span>
          <span className="debt-card-progress-percent">{progressPercent}% paid</span>
        </div>
        <div className="debt-card-progress-bar">
          <div
            className="debt-card-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="debt-card-details">
        <div className="debt-card-detail">
          <p className="debt-card-detail-label">Current Balance</p>
          <p className="debt-card-detail-value">{formatAmount(debt.currentBalance)}</p>
        </div>
        <div className="debt-card-detail">
          <p className="debt-card-detail-label">Original Amount</p>
          <p className="debt-card-detail-value">{formatAmount(debt.totalAmount)}</p>
        </div>
        <div className="debt-card-detail">
          <p className="debt-card-detail-label">Interest Rate</p>
          <p className="debt-card-detail-value">{debt.interestRate}%</p>
        </div>
        <div className="debt-card-detail">
          <p className="debt-card-detail-label">Min. Payment</p>
          <p className="debt-card-detail-value">{formatAmount(debt.minimumPayment)}</p>
        </div>
      </div>
    </div>
  );
}
