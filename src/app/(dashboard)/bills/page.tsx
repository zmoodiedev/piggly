'use client';

import { useState, useEffect, useMemo } from 'react';
import { Bill } from '@/types';
import { fetchBills, createBill, updateBill, deleteBill } from '@/lib/storage';
import { formatCurrency } from '@/lib/currency';
import { BillCard, BillForm } from '@/components/bills';
import { ConfirmModal } from '@/components/ui';
import { useMonth } from '@/lib/context/MonthContext';
import '@/components/bills/Bills.css';

function isBillPaidForMonth(bill: Bill, monthStart: Date, monthEnd: Date): boolean {
  if (!bill.lastPaidDate) return false;
  const paidDate = bill.lastPaidDate instanceof Date ? bill.lastPaidDate : new Date(bill.lastPaidDate);
  return paidDate >= monthStart && paidDate <= monthEnd;
}

export default function BillsPage() {
  const { monthStart, monthEnd, isCurrentMonth } = useMonth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadBills = async () => {
      const storedBills = await fetchBills();

      // Process auto-pay bills for the current real month only
      const today = new Date();
      const currentDay = today.getDate();

      const autoPayUpdates: Promise<boolean>[] = [];
      const processedBills = storedBills.map(bill => {
        if (bill.isAutoPay && !isBillPaidForMonth(bill, monthStart, monthEnd) && currentDay > bill.dueDate) {
          const updates = {
            isPaid: true,
            lastPaidDate: new Date(),
            updatedAt: new Date(),
          };
          autoPayUpdates.push(updateBill(bill.id, updates));
          return { ...bill, ...updates };
        }
        return bill;
      });

      setBills(processedBills);

      if (autoPayUpdates.length > 0) {
        await Promise.all(autoPayUpdates);
      }

      setIsLoading(false);
    };
    loadBills();
  }, []);

  // Derive month-aware paid status for display
  const billsForMonth = useMemo(() => {
    return bills.map(bill => ({
      ...bill,
      isPaid: isBillPaidForMonth(bill, monthStart, monthEnd),
    }));
  }, [bills, monthStart, monthEnd]);

  const handleSaveBill = async (bill: Bill) => {
    if (editingBill) {
      const success = await updateBill(bill.id, bill);
      if (success) {
        setBills(bills.map(b => b.id === bill.id ? bill : b));
        setShowForm(false);
        setEditingBill(null);
      } else {
        alert('Failed to save bill. Please try again.');
      }
    } else {
      const created = await createBill(bill);
      if (created) {
        setBills([...bills, created]);
        setShowForm(false);
        setEditingBill(null);
      } else {
        alert('Failed to save bill. Please try again.');
      }
    }
  };

  const handleEditBill = (bill: Bill) => {
    setEditingBill(bill);
    setShowForm(true);
  };

  const handleDeleteBill = (id: string) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    const success = await deleteBill(confirmDelete);
    if (success) {
      setBills(bills.filter(b => b.id !== confirmDelete));
    } else {
      alert('Failed to delete bill. Please try again.');
    }
    setConfirmDelete(null);
  };

  const handleTogglePaid = async (bill: Bill) => {
    const currentlyPaidForMonth = isBillPaidForMonth(bill, monthStart, monthEnd);
    // Use a date within the selected month so it registers as paid for that month
    const paidDate = isCurrentMonth ? new Date() : new Date(monthStart.getFullYear(), monthStart.getMonth(), Math.min(bill.dueDate, monthEnd.getDate()));
    const updates = {
      isPaid: !currentlyPaidForMonth,
      lastPaidDate: !currentlyPaidForMonth ? paidDate : null,
      updatedAt: new Date(),
    };
    const success = await updateBill(bill.id, updates);
    if (success) {
      setBills(bills.map(b => b.id === bill.id ? { ...b, ...updates } : b));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBill(null);
  };

  // Split bills by currency (using month-aware paid status)
  const cadBills = billsForMonth.filter(b => (b.currency || 'CAD') === 'CAD');
  const usdBills = billsForMonth.filter(b => b.currency === 'USD');

  // Calculate summary metrics for each currency
  const cadTotal = cadBills.reduce((sum, b) => sum + b.amount, 0);
  const usdTotal = usdBills.reduce((sum, b) => sum + b.amount, 0);

  const cadUnpaid = cadBills.filter(b => !b.isPaid);
  const usdUnpaid = usdBills.filter(b => !b.isPaid);

  const cadUnpaidTotal = cadUnpaid.reduce((sum, b) => sum + b.amount, 0);
  const usdUnpaidTotal = usdUnpaid.reduce((sum, b) => sum + b.amount, 0);

  // Sort bills: unpaid first (by due date), then paid
  const sortBills = (billList: Bill[]) => [...billList].sort((a, b) => {
    if (a.isPaid !== b.isPaid) return a.isPaid ? 1 : -1;
    return a.dueDate - b.dueDate;
  });

  const sortedCadBills = sortBills(cadBills);
  const sortedUsdBills = sortBills(usdBills);

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
      <div className="bills-header">
        <div>
          <h1 className="bills-title">Bill Management</h1>
          <p className="bills-subtitle">Track and manage your recurring bills</p>
        </div>
        <button className="bills-add-btn" onClick={() => setShowForm(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Bill
        </button>
      </div>

      {/* Two column layout */}
      <div className="bills-columns">
        {/* CAD Bills Column */}
        <div className="bills-column">
          <div className="bills-column-header">
            <h2 className="bills-column-title">🇨🇦 Canadian Bills</h2>
          </div>

          {/* CAD Summary */}
          <div className="bills-column-summary">
            <div className="bills-summary-item">
              <span className="bills-summary-label">Total</span>
              <span className="bills-summary-value">{formatCurrency(cadTotal, 'CAD')}</span>
            </div>
            <div className="bills-summary-item">
              <span className="bills-summary-label">Unpaid</span>
              <span className="bills-summary-value warning">{formatCurrency(cadUnpaidTotal, 'CAD')}</span>
            </div>
            <div className="bills-summary-item">
              <span className="bills-summary-label">Bills</span>
              <span className="bills-summary-value">{cadBills.length}</span>
            </div>
          </div>

          {/* CAD Bills List */}
          <div className="bills-list">
            {sortedCadBills.length === 0 ? (
              <div className="bills-empty-small">
                <p>No Canadian bills yet</p>
              </div>
            ) : (
              sortedCadBills.map(bill => (
                <BillCard
                  key={bill.id}
                  bill={bill}
                  onEdit={handleEditBill}
                  onDelete={handleDeleteBill}
                  onTogglePaid={handleTogglePaid}
                />
              ))
            )}
          </div>
        </div>

        {/* USD Bills Column */}
        <div className="bills-column">
          <div className="bills-column-header">
            <h2 className="bills-column-title">🇺🇸 US Bills</h2>
          </div>

          {/* USD Summary */}
          <div className="bills-column-summary">
            <div className="bills-summary-item">
              <span className="bills-summary-label">Total</span>
              <span className="bills-summary-value">{formatCurrency(usdTotal, 'USD')}</span>
            </div>
            <div className="bills-summary-item">
              <span className="bills-summary-label">Unpaid</span>
              <span className="bills-summary-value warning">{formatCurrency(usdUnpaidTotal, 'USD')}</span>
            </div>
            <div className="bills-summary-item">
              <span className="bills-summary-label">Bills</span>
              <span className="bills-summary-value">{usdBills.length}</span>
            </div>
          </div>

          {/* USD Bills List */}
          <div className="bills-list">
            {sortedUsdBills.length === 0 ? (
              <div className="bills-empty-small">
                <p>No US bills yet</p>
              </div>
            ) : (
              sortedUsdBills.map(bill => (
                <BillCard
                  key={bill.id}
                  bill={bill}
                  onEdit={handleEditBill}
                  onDelete={handleDeleteBill}
                  onTogglePaid={handleTogglePaid}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <BillForm
          bill={editingBill}
          onSave={handleSaveBill}
          onClose={handleCloseForm}
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this bill?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
