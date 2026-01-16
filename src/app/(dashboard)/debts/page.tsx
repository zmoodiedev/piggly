'use client';

import { useState, useEffect } from 'react';
import { Debt } from '@/types';
import { fetchDebts, saveDebtsToExcel } from '@/lib/storage';
import { formatCurrency } from '@/lib/currency';
import { DebtCard, DebtForm } from '@/components/debts';
import '@/components/debts/Debts.css';

export default function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);

  useEffect(() => {
    const loadDebts = async () => {
      const storedDebts = await fetchDebts();
      setDebts(storedDebts);
      setIsLoading(false);
    };
    loadDebts();
  }, []);

  const handleSaveDebt = async (debt: Debt) => {
    let updatedDebts: Debt[];

    if (editingDebt) {
      updatedDebts = debts.map(d => d.id === debt.id ? debt : d);
    } else {
      updatedDebts = [...debts, debt];
    }

    setDebts(updatedDebts);
    await saveDebtsToExcel(updatedDebts);
    setShowForm(false);
    setEditingDebt(null);
  };

  const handleEditDebt = (debt: Debt) => {
    setEditingDebt(debt);
    setShowForm(true);
  };

  const handleDeleteDebt = async (id: string) => {
    if (confirm('Are you sure you want to delete this debt?')) {
      const updatedDebts = debts.filter(d => d.id !== id);
      setDebts(updatedDebts);
      await saveDebtsToExcel(updatedDebts);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDebt(null);
  };

  // Split debts by currency
  const cadDebts = debts.filter(d => (d.currency || 'CAD') === 'CAD');
  const usdDebts = debts.filter(d => d.currency === 'USD');

  // Calculate summary metrics for CAD
  const cadTotalDebt = cadDebts.reduce((sum, d) => sum + d.currentBalance, 0);
  const cadTotalOriginal = cadDebts.reduce((sum, d) => sum + d.totalAmount, 0);
  const cadTotalPaidOff = cadTotalOriginal - cadTotalDebt;
  const cadProgress = cadTotalOriginal > 0 ? Math.round((cadTotalPaidOff / cadTotalOriginal) * 100) : 0;

  // Calculate summary metrics for USD
  const usdTotalDebt = usdDebts.reduce((sum, d) => sum + d.currentBalance, 0);
  const usdTotalOriginal = usdDebts.reduce((sum, d) => sum + d.totalAmount, 0);
  const usdTotalPaidOff = usdTotalOriginal - usdTotalDebt;
  const usdProgress = usdTotalOriginal > 0 ? Math.round((usdTotalPaidOff / usdTotalOriginal) * 100) : 0;

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
      <div className="debts-header">
        <div>
          <h1 className="debts-title">Debt Tracker</h1>
          <p className="debts-subtitle">Manage and track your debt payoff progress</p>
        </div>
        <button className="debts-add-btn" onClick={() => setShowForm(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Debt
        </button>
      </div>

      {/* Two column layout */}
      <div className="debts-columns">
        {/* CAD Debts Column */}
        <div className="debts-column">
          <div className="debts-column-header">
            <h2 className="debts-column-title">🇨🇦 Canadian Debts</h2>
          </div>

          {/* CAD Summary */}
          <div className="debts-column-summary">
            <div className="debts-summary-item">
              <span className="debts-summary-label">Balance</span>
              <span className="debts-summary-value">{formatCurrency(cadTotalDebt, 'CAD')}</span>
            </div>
            <div className="debts-summary-item">
              <span className="debts-summary-label">Paid Off</span>
              <span className="debts-summary-value positive">{formatCurrency(cadTotalPaidOff, 'CAD')}</span>
            </div>
            <div className="debts-summary-item">
              <span className="debts-summary-label">Progress</span>
              <span className="debts-summary-value positive">{cadProgress}%</span>
            </div>
          </div>

          {/* CAD Debts List */}
          <div className="debts-list">
            {cadDebts.length === 0 ? (
              <div className="debts-empty-small">
                <p>No Canadian debts yet</p>
              </div>
            ) : (
              cadDebts.map(debt => (
                <DebtCard
                  key={debt.id}
                  debt={debt}
                  onEdit={handleEditDebt}
                  onDelete={handleDeleteDebt}
                />
              ))
            )}
          </div>
        </div>

        {/* USD Debts Column */}
        <div className="debts-column">
          <div className="debts-column-header">
            <h2 className="debts-column-title">🇺🇸 US Debts</h2>
          </div>

          {/* USD Summary */}
          <div className="debts-column-summary">
            <div className="debts-summary-item">
              <span className="debts-summary-label">Balance</span>
              <span className="debts-summary-value">{formatCurrency(usdTotalDebt, 'USD')}</span>
            </div>
            <div className="debts-summary-item">
              <span className="debts-summary-label">Paid Off</span>
              <span className="debts-summary-value positive">{formatCurrency(usdTotalPaidOff, 'USD')}</span>
            </div>
            <div className="debts-summary-item">
              <span className="debts-summary-label">Progress</span>
              <span className="debts-summary-value positive">{usdProgress}%</span>
            </div>
          </div>

          {/* USD Debts List */}
          <div className="debts-list">
            {usdDebts.length === 0 ? (
              <div className="debts-empty-small">
                <p>No US debts yet</p>
              </div>
            ) : (
              usdDebts.map(debt => (
                <DebtCard
                  key={debt.id}
                  debt={debt}
                  onEdit={handleEditDebt}
                  onDelete={handleDeleteDebt}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <DebtForm
          debt={editingDebt}
          onSave={handleSaveDebt}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
