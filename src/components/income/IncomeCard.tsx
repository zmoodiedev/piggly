'use client';

import { Income } from '@/types';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { formatCurrency, convertCurrency } from '@/lib/currency';
import { format } from 'date-fns';

interface IncomeCardProps {
  income: Income;
  onEdit: (income: Income) => void;
  onDelete: (id: string) => void;
}

export default function IncomeCard({ income, onEdit, onDelete }: IncomeCardProps) {
  const { currency } = useCurrency();

  const formatAmount = (amount: number) => {
    const sourceCurrency = income.currency || 'CAD';
    return formatCurrency(convertCurrency(amount, sourceCurrency, currency), currency);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, 'MMM d, yyyy');
  };

  return (
    <div className="income-card">
      <div className="income-card-left">
        <div className="income-card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <div className="income-card-info">
          <h3 className="income-card-source">{income.source}</h3>
          <div className="income-card-details">
            <span className="income-card-date">
              {formatDate(income.date)}
            </span>
            {income.notes && (
              <span className="income-card-notes">{income.notes}</span>
            )}
          </div>
        </div>
      </div>

      <div className="income-card-right">
        <div className="income-card-amount">+{formatAmount(income.amount)}</div>
        <div className="income-card-actions">
          <button
            className="income-card-action-btn"
            onClick={() => onEdit(income)}
            title="Edit"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className="income-card-action-btn delete"
            onClick={() => onDelete(income.id)}
            title="Delete"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
