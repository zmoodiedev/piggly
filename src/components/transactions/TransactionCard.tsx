'use client';

import { Transaction } from '@/types';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { formatCurrency, convertCurrency } from '@/lib/currency';
import { expenseCategoryIcons, expenseCategoryLabels } from '@/lib/categories';
import { format } from 'date-fns';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionCard({ transaction, onEdit, onDelete }: TransactionCardProps) {
  const { currency } = useCurrency();

  const formatAmount = (amount: number) => {
    const sourceCurrency = transaction.currency || 'CAD';
    return formatCurrency(convertCurrency(amount, sourceCurrency, currency), currency);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, 'MMM d, yyyy');
  };

  return (
    <div className="transaction-card">
      <div className="transaction-card-left">
        <div className={`transaction-card-icon ${transaction.category}`}>
          {expenseCategoryIcons[transaction.category] || '📦'}
        </div>
        <div className="transaction-card-info">
          <h3 className="transaction-card-description">{transaction.description}</h3>
          <div className="transaction-card-details">
            <span className="transaction-card-category">
              {expenseCategoryLabels[transaction.category] || transaction.category}
            </span>
            <span className="transaction-card-date">
              {formatDate(transaction.date)}
            </span>
          </div>
        </div>
      </div>

      <div className="transaction-card-right">
        <div className="transaction-card-amount">-{formatAmount(transaction.amount)}</div>
        <div className="transaction-card-actions">
          <button
            className="transaction-card-action-btn"
            onClick={() => onEdit(transaction)}
            title="Edit"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className="transaction-card-action-btn delete"
            onClick={() => onDelete(transaction.id)}
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
