'use client';

import { useState, useEffect } from 'react';
import { Debt, Currency } from '@/types';
import { generateId } from '@/lib/storage';

interface DebtFormProps {
  debt?: Debt | null;
  onSave: (debt: Debt) => void;
  onClose: () => void;
}

export default function DebtForm({ debt, onSave, onClose }: DebtFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    totalAmount: '',
    currentBalance: '',
    interestRate: '',
    minimumPayment: '',
    dueDate: '',
    category: 'credit-card' as Debt['category'],
    currency: 'CAD' as Currency,
  });

  useEffect(() => {
    if (debt) {
      setFormData({
        name: debt.name,
        totalAmount: debt.totalAmount.toString(),
        currentBalance: debt.currentBalance.toString(),
        interestRate: debt.interestRate.toString(),
        minimumPayment: debt.minimumPayment.toString(),
        dueDate: debt.dueDate.toString(),
        category: debt.category,
        currency: debt.currency || 'CAD',
      });
    }
  }, [debt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const newDebt: Debt = {
      id: debt?.id || generateId(),
      name: formData.name,
      totalAmount: parseFloat(formData.totalAmount) || 0,
      currentBalance: parseFloat(formData.currentBalance) || 0,
      interestRate: parseFloat(formData.interestRate) || 0,
      minimumPayment: parseFloat(formData.minimumPayment) || 0,
      dueDate: parseInt(formData.dueDate) || 1,
      category: formData.category,
      currency: formData.currency,
      createdAt: debt?.createdAt || now,
      updatedAt: now,
    };

    onSave(newDebt);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{debt ? 'Edit Debt' : 'Add New Debt'}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Debt Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="e.g., Credit Card, Car Loan"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="credit-card">Credit Card</option>
                <option value="loan">Loan</option>
                <option value="mortgage">Mortgage</option>
                <option value="other">Other</option>
              </select>
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

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="totalAmount">Original Amount</label>
              <input
                type="number"
                id="totalAmount"
                name="totalAmount"
                className="form-input"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.totalAmount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="currentBalance">Current Balance</label>
              <input
                type="number"
                id="currentBalance"
                name="currentBalance"
                className="form-input"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.currentBalance}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="interestRate">Interest Rate (%)</label>
              <input
                type="number"
                id="interestRate"
                name="interestRate"
                className="form-input"
                placeholder="0.00"
                step="0.01"
                min="0"
                max="100"
                value={formData.interestRate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="minimumPayment">Minimum Payment</label>
              <input
                type="number"
                id="minimumPayment"
                name="minimumPayment"
                className="form-input"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.minimumPayment}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="dueDate">Due Date (day of month)</label>
            <input
              type="number"
              id="dueDate"
              name="dueDate"
              className="form-input"
              placeholder="15"
              min="1"
              max="31"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="form-btn form-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="form-btn form-btn-primary">
              {debt ? 'Save Changes' : 'Add Debt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
