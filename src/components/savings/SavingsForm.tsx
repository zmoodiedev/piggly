'use client';

import { useState, useEffect } from 'react';
import { SavingsGoal } from '@/types';
import { generateId } from '@/lib/storage';
import '@/components/debts/Debts.css'; // Reuse modal/form styles

interface SavingsFormProps {
  goal?: SavingsGoal | null;
  onSave: (goal: SavingsGoal) => void;
  onClose: () => void;
}

const COLORS = [
  '#FF7B9C', '#7C3AED', '#3B82F6', '#10B981', '#F59E0B',
  '#EF4444', '#EC4899', '#8B5CF6', '#06B6D4', '#84CC16'
];

export default function SavingsForm({ goal, onSave, onClose }: SavingsFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: 'emergency' as SavingsGoal['category'],
    color: COLORS[0],
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
        category: goal.category,
        color: goal.color,
      });
    }
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const newGoal: SavingsGoal = {
      id: goal?.id || generateId(),
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount) || 0,
      currentAmount: parseFloat(formData.currentAmount) || 0,
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
      category: formData.category,
      color: formData.color,
      createdAt: goal?.createdAt || now,
      updatedAt: now,
    };

    onSave(newGoal);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{goal ? 'Edit Savings Goal' : 'Add Savings Goal'}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Goal Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="e.g., Emergency Fund, Vacation, New Car"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="targetAmount">Target Amount</label>
              <input
                type="number"
                id="targetAmount"
                name="targetAmount"
                className="form-input"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.targetAmount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="currentAmount">Current Amount</label>
              <input
                type="number"
                id="currentAmount"
                name="currentAmount"
                className="form-input"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.currentAmount}
                onChange={handleChange}
                required
              />
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
                <option value="emergency">Emergency Fund</option>
                <option value="vacation">Vacation</option>
                <option value="purchase">Purchase</option>
                <option value="retirement">Retirement</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="deadline">Deadline (optional)</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                className="form-input"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Color</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: formData.color === color ? '3px solid #1A1D2E' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="form-btn form-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="form-btn form-btn-primary">
              {goal ? 'Save Changes' : 'Add Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
