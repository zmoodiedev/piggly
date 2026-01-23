'use client';

import { useState, useEffect } from 'react';
import { Transaction, ExpenseCategory, Currency } from '@/types';
import { generateId } from '@/lib/storage';
import { expenseCategories, expenseCategoryLabels } from '@/lib/categories';
import '@/components/debts/Debts.css';

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSave: (transaction: Transaction) => void;
  onClose: () => void;
}

export default function TransactionForm({ transaction, onSave, onClose }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'groceries' as ExpenseCategory,
    description: '',
    date: new Date().toISOString().split('T')[0],
    currency: 'CAD' as Currency,
  });

  useEffect(() => {
    if (transaction) {
      const transactionDate = typeof transaction.date === 'string'
        ? new Date(transaction.date)
        : transaction.date;

      setFormData({
        amount: transaction.amount.toString(),
        category: transaction.category,
        description: transaction.description,
        date: transactionDate.toISOString().split('T')[0],
        currency: transaction.currency || 'CAD',
      });
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const newTransaction: Transaction = {
      id: transaction?.id || generateId(),
      amount: parseFloat(formData.amount) || 0,
      category: formData.category,
      description: formData.description,
      date: new Date(formData.date),
      currency: formData.currency,
      createdAt: transaction?.createdAt || now,
      updatedAt: now,
    };

    onSave(newTransaction);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{transaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              className="form-input"
              placeholder="e.g., Grocery shopping at Costco"
              value={formData.description}
              onChange={handleChange}
              required
            />
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
                {expenseCategories.map(cat => (
                  <option key={cat} value={cat}>{expenseCategoryLabels[cat]}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="date">Date</label>
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
          </div>

          <div className="form-actions">
            <button type="button" className="form-btn form-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="form-btn form-btn-primary">
              {transaction ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
