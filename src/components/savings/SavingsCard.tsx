'use client';

import { SavingsGoal } from '@/types';
import { formatCurrency } from '@/lib/currency';
import { calculatePercentage } from '@/lib/utils';

interface SavingsCardProps {
  goal: SavingsGoal;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (id: string) => void;
  onAddMoney: (goal: SavingsGoal) => void;
}

export default function SavingsCard({ goal, onEdit, onDelete, onAddMoney }: SavingsCardProps) {
  const formatAmount = (amount: number) => {
    return formatCurrency(amount);
  };

  const progress = calculatePercentage(goal.currentAmount, goal.targetAmount);
  const remaining = goal.targetAmount - goal.currentAmount;

  const getDeadlineText = () => {
    if (!goal.deadline) return 'No deadline';
    const deadline = new Date(goal.deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Deadline passed';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day left';
    if (diffDays < 30) return `${diffDays} days left`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months left`;
    return `${Math.floor(diffDays / 365)} years left`;
  };

  return (
    <div className="savings-card">
      <div className="savings-card-header">
        <div className="savings-card-info">
          <div className="savings-card-color" style={{ backgroundColor: goal.color }} />
          <div>
            <h3 className="savings-card-title">{goal.name}</h3>
            <p className="savings-card-category">{goal.category}</p>
          </div>
        </div>
        <div className="savings-card-actions">
          <button
            className="savings-card-action-btn add"
            onClick={() => onAddMoney(goal)}
            title="Add money"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            className="savings-card-action-btn"
            onClick={() => onEdit(goal)}
            title="Edit goal"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className="savings-card-action-btn delete"
            onClick={() => onDelete(goal.id)}
            title="Delete goal"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      <div className="savings-card-progress">
        <div className="savings-card-progress-header">
          <span className="savings-card-progress-amounts">
            <strong>{formatAmount(goal.currentAmount)}</strong> of {formatAmount(goal.targetAmount)}
          </span>
          <span className="savings-card-progress-percent">{progress}%</span>
        </div>
        <div className="savings-card-progress-bar">
          <div
            className="savings-card-progress-fill"
            style={{
              width: `${Math.min(progress, 100)}%`,
              backgroundColor: goal.color
            }}
          />
        </div>
      </div>

      <div className="savings-card-details">
        <div className="savings-card-detail">
          <p className="savings-card-detail-label">Remaining</p>
          <p className="savings-card-detail-value">{formatAmount(Math.max(remaining, 0))}</p>
        </div>
        <div className="savings-card-detail">
          <p className="savings-card-detail-label">Deadline</p>
          <p className="savings-card-detail-value">{getDeadlineText()}</p>
        </div>
        <div className="savings-card-detail">
          <p className="savings-card-detail-label">Status</p>
          <p className="savings-card-detail-value" style={{ color: progress >= 100 ? '#10B981' : '#F59E0B' }}>
            {progress >= 100 ? 'Complete!' : 'In Progress'}
          </p>
        </div>
      </div>
    </div>
  );
}
