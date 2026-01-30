'use client';

import { useState, useEffect } from 'react';
import { SavingsGoal } from '@/types';
import { fetchSavings, saveSavingsToSheet } from '@/lib/storage';
import { formatCurrency } from '@/lib/currency';
import { SavingsCard, SavingsForm, AddMoneyModal } from '@/components/savings';
import { ConfirmModal } from '@/components/ui';
import '@/components/savings/Savings.css';

export default function SavingsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [addMoneyGoal, setAddMoneyGoal] = useState<SavingsGoal | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadSavings = async () => {
      const storedSavings = await fetchSavings();
      setGoals(storedSavings);
      setIsLoading(false);
    };
    loadSavings();
  }, []);

  const formatAmount = (amount: number) => {
    return formatCurrency(amount);
  };

  const handleSaveGoal = async (goal: SavingsGoal) => {
    let updatedGoals: SavingsGoal[];

    if (editingGoal) {
      updatedGoals = goals.map(g => g.id === goal.id ? goal : g);
    } else {
      updatedGoals = [...goals, goal];
    }

    setGoals(updatedGoals);
    await saveSavingsToSheet(updatedGoals);
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDeleteGoal = (id: string) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    const updatedGoals = goals.filter(g => g.id !== confirmDelete);
    setGoals(updatedGoals);
    await saveSavingsToSheet(updatedGoals);
    setConfirmDelete(null);
  };

  const handleAddMoney = (goal: SavingsGoal) => {
    setAddMoneyGoal(goal);
  };

  const handleSaveAddMoney = async (goal: SavingsGoal, amount: number) => {
    const updatedGoal = {
      ...goal,
      currentAmount: goal.currentAmount + amount,
      updatedAt: new Date(),
    };
    const updatedGoals = goals.map(g => g.id === goal.id ? updatedGoal : g);
    setGoals(updatedGoals);
    await saveSavingsToSheet(updatedGoals);
    setAddMoneyGoal(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  // Calculate summary metrics
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
  const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length;

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
      <div className="savings-header">
        <div>
          <h1 className="savings-title">Savings Goals</h1>
          <p className="savings-subtitle">Track progress toward your financial goals</p>
        </div>
        <button className="savings-add-btn" onClick={() => setShowForm(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Goal
        </button>
      </div>

      {/* Summary cards */}
      <div className="savings-summary">
        <div className="savings-summary-card gradient">
          <p className="savings-summary-label">Total Saved</p>
          <p className="savings-summary-value">{formatAmount(totalSaved)}</p>
        </div>
        <div className="savings-summary-card">
          <p className="savings-summary-label">Target Total</p>
          <p className="savings-summary-value">{formatAmount(totalTarget)}</p>
        </div>
        <div className="savings-summary-card">
          <p className="savings-summary-label">Overall Progress</p>
          <p className="savings-summary-value positive">{overallProgress}%</p>
        </div>
        <div className="savings-summary-card">
          <p className="savings-summary-label">Goals Completed</p>
          <p className="savings-summary-value positive">{completedGoals} / {goals.length}</p>
        </div>
      </div>

      {/* Savings goals grid */}
      <div className="savings-list">
        {goals.length === 0 ? (
          <div className="savings-empty">
            <div className="savings-empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z" />
                <path d="M2 9v1c0 1.1.9 2 2 2h1" />
              </svg>
            </div>
            <h3 className="savings-empty-title">No savings goals yet</h3>
            <p className="savings-empty-text">Create your first savings goal to start tracking your progress.</p>
          </div>
        ) : (
          goals.map(goal => (
            <SavingsCard
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
              onAddMoney={handleAddMoney}
            />
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <SavingsForm
          goal={editingGoal}
          onSave={handleSaveGoal}
          onClose={handleCloseForm}
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this savings goal?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Add Money Modal */}
      {addMoneyGoal && (
        <AddMoneyModal
          goal={addMoneyGoal}
          onSave={handleSaveAddMoney}
          onClose={() => setAddMoneyGoal(null)}
        />
      )}
    </div>
  );
}
