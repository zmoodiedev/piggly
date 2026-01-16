'use client';

import { useState } from 'react';
import { SavingsGoal } from '@/types';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { formatCurrency, convertCurrency } from '@/lib/currency';
import '@/components/debts/Debts.css';

interface AddMoneyModalProps {
  goal: SavingsGoal;
  onSave: (goal: SavingsGoal, amount: number) => void;
  onClose: () => void;
}

export default function AddMoneyModal({ goal, onSave, onClose }: AddMoneyModalProps) {
  const { currency } = useCurrency();
  const [amount, setAmount] = useState('');

  const formatAmount = (amt: number) => {
    return formatCurrency(convertCurrency(amt, 'CAD', currency), currency);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addAmount = parseFloat(amount) || 0;
    if (addAmount > 0) {
      onSave(goal, addAmount);
    }
  };

  const remaining = goal.targetAmount - goal.currentAmount;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Add Money</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: goal.color,
                margin: '0 auto 12px',
              }}
            />
            <h3 style={{ margin: '0 0 4px', color: '#1A1D2E', fontSize: '18px' }}>{goal.name}</h3>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>
              {formatAmount(goal.currentAmount)} of {formatAmount(goal.targetAmount)}
            </p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="amount">Amount to Add</label>
            <input
              type="number"
              id="amount"
              className="form-input"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
              required
            />
            {remaining > 0 && (
              <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#6B7280' }}>
                {formatAmount(remaining)} remaining to reach goal
              </p>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="form-btn form-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="form-btn form-btn-primary">
              Add Money
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
