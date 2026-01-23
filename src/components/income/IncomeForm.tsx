'use client';

import { useState, useEffect } from 'react';
import { Income, Currency, IncomeCategory } from '@/types';
import { generateId } from '@/lib/storage';
import { incomeCategories, incomeCategoryLabels } from '@/lib/categories';
import '@/components/debts/Debts.css';

interface IncomeFormProps {
  income?: Income | null;
  onSave: (income: Income) => void;
  onClose: () => void;
}

export default function IncomeForm({ income, onSave, onClose }: IncomeFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    category: 'salary' as IncomeCategory,
    date: new Date().toISOString().split('T')[0],
    notes: '',
    currency: 'CAD' as Currency,
  });

  useEffect(() => {
    if (income) {
      const incomeDate = typeof income.date === 'string'
        ? new Date(income.date)
        : income.date;

      setFormData({
        amount: income.amount.toString(),
        source: income.source,
        category: income.category || 'other',
        date: incomeDate.toISOString().split('T')[0],
        notes: income.notes || '',
        currency: income.currency || 'CAD',
      });
    }
  }, [income]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const newIncome: Income = {
      id: income?.id || generateId(),
      amount: parseFloat(formData.amount) || 0,
      source: formData.source,
      category: formData.category,
      date: new Date(formData.date),
      notes: formData.notes || undefined,
      currency: formData.currency,
      createdAt: income?.createdAt || now,
      updatedAt: now,
    };

    onSave(newIncome);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{income ? 'Edit Income' : 'Log Income'}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="source">Source</label>
              <input
                type="text"
                id="source"
                name="source"
                className="form-input"
                placeholder="e.g., Main Job, Freelance, Bonus"
                value={formData.source}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                {incomeCategories.map(cat => (
                  <option key={cat} value={cat}>{incomeCategoryLabels[cat]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="amount">Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                className="form-input"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="currency">Currency</label>
              <select
                id="currency"
                name="currency"
                className="form-select"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="CAD">CAD ($)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="date">Date Received</label>
            <input
              type="date"
              id="date"
              name="date"
              className="form-input"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="notes">Notes (optional)</label>
            <input
              type="text"
              id="notes"
              name="notes"
              className="form-input"
              placeholder="e.g., Overtime pay, Holiday bonus"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="form-btn form-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="form-btn form-btn-primary">
              {income ? 'Save Changes' : 'Log Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
