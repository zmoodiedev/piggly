'use client';

import { useState, useEffect } from 'react';
import { Transaction, TransactionCategory } from '@/types';
import { fetchTransactions, saveTransactionsToSheet } from '@/lib/storage';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { useMonth } from '@/lib/context/MonthContext';
import { formatCurrency, convertCurrency } from '@/lib/currency';
import { TransactionCard, TransactionForm } from '@/components/transactions';
import { isWithinInterval } from 'date-fns';
import '@/components/transactions/Transactions.css';

const categoryLabels: Record<TransactionCategory, string> = {
  'groceries': 'Groceries',
  'eating-out': 'Eating Out',
  'entertainment': 'Entertainment',
  'clothing': 'Clothing',
  'transportation': 'Transportation',
  'healthcare': 'Healthcare',
  'personal-care': 'Personal Care',
  'gifts': 'Gifts',
  'education': 'Education',
  'travel': 'Travel',
  'shopping': 'Shopping',
  'other': 'Other',
};

export default function TransactionsPage() {
  const { currency } = useCurrency();
  const { monthStart, monthEnd, monthLabel } = useMonth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filterCategory, setFilterCategory] = useState<TransactionCategory | 'all'>('all');

  useEffect(() => {
    const loadTransactions = async () => {
      const storedTransactions = await fetchTransactions();
      setTransactions(storedTransactions);
      setIsLoading(false);
    };
    loadTransactions();
  }, []);

  const formatAmount = (amount: number, itemCurrency: string = 'CAD') => {
    return formatCurrency(convertCurrency(amount, itemCurrency as 'CAD' | 'USD', currency), currency);
  };

  const handleSaveTransaction = async (entry: Transaction) => {
    let updatedTransactions: Transaction[];

    if (editingTransaction) {
      updatedTransactions = transactions.map(t => t.id === entry.id ? entry : t);
    } else {
      updatedTransactions = [...transactions, entry];
    }

    setTransactions(updatedTransactions);
    await saveTransactionsToSheet(updatedTransactions);
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleEditTransaction = (entry: Transaction) => {
    setEditingTransaction(entry);
    setShowForm(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      await saveTransactionsToSheet(updatedTransactions);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  // Filter transactions for selected month
  const selectedMonthTransactions = transactions.filter(t => {
    const transactionDate = typeof t.date === 'string' ? new Date(t.date) : t.date;
    return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
  });

  // Calculate metrics for selected month
  const thisMonthTotal = selectedMonthTransactions.reduce((sum, t) => {
    const converted = convertCurrency(t.amount, t.currency || 'CAD', currency);
    return sum + converted;
  }, 0);

  const avgPerTransaction = selectedMonthTransactions.length > 0 ? thisMonthTotal / selectedMonthTransactions.length : 0;

  // Filter by category within selected month
  const filteredTransactions = filterCategory === 'all'
    ? selectedMonthTransactions
    : selectedMonthTransactions.filter(t => t.category === filterCategory);

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
    const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
    return dateB.getTime() - dateA.getTime();
  });

  // Get unique categories from selected month's transactions for filter
  const usedCategories = [...new Set(selectedMonthTransactions.map(t => t.category))];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid #FF7B9C',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div>
      <div className="transactions-header">
        <div>
          <h1 className="transactions-title">Transactions</h1>
          <p className="transactions-subtitle">Track your spending by category</p>
        </div>
        <button className="transactions-add-btn" onClick={() => setShowForm(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Transaction
        </button>
      </div>

      {/* Summary cards */}
      <div className="transactions-summary">
        <div className="transactions-summary-card gradient">
          <p className="transactions-summary-label">{monthLabel}</p>
          <p className="transactions-summary-value">{formatCurrency(thisMonthTotal, currency)}</p>
        </div>
        <div className="transactions-summary-card">
          <p className="transactions-summary-label">Transactions</p>
          <p className="transactions-summary-value">{selectedMonthTransactions.length}</p>
        </div>
        <div className="transactions-summary-card">
          <p className="transactions-summary-label">Average Per Transaction</p>
          <p className="transactions-summary-value">{formatCurrency(avgPerTransaction, currency)}</p>
        </div>
        <div className="transactions-summary-card">
          <p className="transactions-summary-label">All Time Total</p>
          <p className="transactions-summary-value">{transactions.length} entries</p>
        </div>
      </div>

      {/* Category filters */}
      {usedCategories.length > 0 && (
        <div className="transactions-filters">
          <button
            className={`transactions-filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            All
          </button>
          {usedCategories.map(cat => (
            <button
              key={cat}
              className={`transactions-filter-btn ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>
      )}

      {/* Transaction list */}
      <div className="transactions-list">
        {sortedTransactions.length === 0 ? (
          <div className="transactions-empty">
            <div className="transactions-empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <h3 className="transactions-empty-title">No transactions for {monthLabel}</h3>
            <p className="transactions-empty-text">Add a transaction for this month or select a different month.</p>
          </div>
        ) : (
          sortedTransactions.map(entry => (
            <TransactionCard
              key={entry.id}
              transaction={entry}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onSave={handleSaveTransaction}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
