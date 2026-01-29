'use client';

import { useState, useEffect } from 'react';
import { Income } from '@/types';
import { fetchIncome, saveIncomeToSheet } from '@/lib/storage';
import { useMonth } from '@/lib/context/MonthContext';
import { formatCurrency } from '@/lib/currency';
import { IncomeCard, IncomeForm } from '@/components/income';
import { format, isWithinInterval } from 'date-fns';
import '@/components/income/Income.css';

export default function IncomePage() {
  const { monthStart, monthEnd, monthLabel } = useMonth();
  const [income, setIncome] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  useEffect(() => {
    const loadIncome = async () => {
      const storedIncome = await fetchIncome();
      setIncome(storedIncome);
      setIsLoading(false);
    };
    loadIncome();
  }, []);

  const formatAmount = (amount: number) => {
    return formatCurrency(amount);
  };

  const handleSaveIncome = async (entry: Income) => {
    let updatedIncome: Income[];

    if (editingIncome) {
      updatedIncome = income.map(i => i.id === entry.id ? entry : i);
    } else {
      updatedIncome = [...income, entry];
    }

    setIncome(updatedIncome);
    await saveIncomeToSheet(updatedIncome);
    setShowForm(false);
    setEditingIncome(null);
  };

  const handleEditIncome = (entry: Income) => {
    setEditingIncome(entry);
    setShowForm(true);
  };

  const handleDeleteIncome = async (id: string) => {
    if (confirm('Are you sure you want to delete this income entry?')) {
      const updatedIncome = income.filter(i => i.id !== id);
      setIncome(updatedIncome);
      await saveIncomeToSheet(updatedIncome);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingIncome(null);
  };

  // Filter income for selected month
  const selectedMonthIncome = income.filter(i => {
    const incomeDate = typeof i.date === 'string' ? new Date(i.date) : i.date;
    return isWithinInterval(incomeDate, { start: monthStart, end: monthEnd });
  });

  // Calculate metrics for selected month
  const thisMonthTotal = selectedMonthIncome.reduce((sum, i) => sum + i.amount, 0);
  const avgPerEntry = selectedMonthIncome.length > 0 ? thisMonthTotal / selectedMonthIncome.length : 0;

  // Sort income by date (newest first)
  const sortedIncome = [...selectedMonthIncome].sort((a, b) => {
    const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
    const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
    return dateB.getTime() - dateA.getTime();
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid #10B981',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div>
      <div className="income-header">
        <div>
          <h1 className="income-title">Income Tracker</h1>
          <p className="income-subtitle">Log and track your paychecks and other income</p>
        </div>
        <button className="income-add-btn" onClick={() => setShowForm(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Log Income
        </button>
      </div>

      {/* Summary cards */}
      <div className="income-summary">
        <div className="income-summary-card gradient">
          <p className="income-summary-label">{monthLabel}</p>
          <p className="income-summary-value">{formatAmount(thisMonthTotal)}</p>
        </div>
        <div className="income-summary-card">
          <p className="income-summary-label">Entries</p>
          <p className="income-summary-value">{selectedMonthIncome.length}</p>
        </div>
        <div className="income-summary-card">
          <p className="income-summary-label">Average Per Entry</p>
          <p className="income-summary-value positive">{formatAmount(avgPerEntry)}</p>
        </div>
        <div className="income-summary-card">
          <p className="income-summary-label">All Time Total</p>
          <p className="income-summary-value">{income.length} entries</p>
        </div>
      </div>

      {/* Income list */}
      <div className="income-list">
        {sortedIncome.length === 0 ? (
          <div className="income-empty">
            <div className="income-empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 className="income-empty-title">No income for {monthLabel}</h3>
            <p className="income-empty-text">Log income for this month or select a different month.</p>
          </div>
        ) : (
          sortedIncome.map(entry => (
            <IncomeCard
              key={entry.id}
              income={entry}
              onEdit={handleEditIncome}
              onDelete={handleDeleteIncome}
            />
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <IncomeForm
          income={editingIncome}
          onSave={handleSaveIncome}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
