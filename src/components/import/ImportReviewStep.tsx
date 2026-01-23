'use client';

import { ExpenseCategory, IncomeCategory } from '@/types';
import { ParsedTransaction, ParsedIncome } from '@/types/import';
import {
  expenseCategories,
  expenseCategoryLabels,
  incomeCategories,
  incomeCategoryLabels,
} from '@/lib/categories';
import { formatCurrency } from '@/lib/currency';

interface ImportReviewStepProps {
  transactions: ParsedTransaction[];
  income: ParsedIncome[];
  onTransactionChange: (id: string, updates: Partial<ParsedTransaction>) => void;
  onIncomeChange: (id: string, updates: Partial<ParsedIncome>) => void;
  onSelectAllTransactions: (selected: boolean) => void;
  onSelectAllIncome: (selected: boolean) => void;
  onConfirm: () => void;
  onBack: () => void;
  onCancel: () => void;
  isImporting: boolean;
}

export default function ImportReviewStep({
  transactions,
  income,
  onTransactionChange,
  onIncomeChange,
  onSelectAllTransactions,
  onSelectAllIncome,
  onConfirm,
  onBack,
  onCancel,
  isImporting,
}: ImportReviewStepProps) {
  const selectedTransactions = transactions.filter(t => t.selected);
  const selectedIncome = income.filter(i => i.selected);

  const transactionTotal = selectedTransactions.reduce((sum, t) => sum + t.amount, 0);
  const incomeTotal = selectedIncome.reduce((sum, i) => sum + i.amount, 0);

  const allTransactionsSelected = transactions.length > 0 && transactions.every(t => t.selected);
  const allIncomeSelected = income.length > 0 && income.every(i => i.selected);

  const duplicateTransactions = transactions.filter(t => t.isDuplicate).length;
  const duplicateIncome = income.filter(i => i.isDuplicate).length;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="import-review">
      {/* Summary */}
      <div className="import-summary">
        <div className="import-summary-item">
          <span className="import-summary-label">Expenses</span>
          <span className="import-summary-value">
            {selectedTransactions.length} of {transactions.length} selected
          </span>
          <span className="import-summary-amount expense">
            -{formatCurrency(transactionTotal, 'CAD')}
          </span>
        </div>
        <div className="import-summary-item">
          <span className="import-summary-label">Income</span>
          <span className="import-summary-value">
            {selectedIncome.length} of {income.length} selected
          </span>
          <span className="import-summary-amount income">
            +{formatCurrency(incomeTotal, 'CAD')}
          </span>
        </div>
      </div>

      {(duplicateTransactions > 0 || duplicateIncome > 0) && (
        <div className="import-warning">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>
            {duplicateTransactions + duplicateIncome} potential duplicate(s) detected and deselected
          </span>
        </div>
      )}

      {/* Transactions Section */}
      {transactions.length > 0 && (
        <div className="import-section">
          <div className="import-section-header">
            <h3>Expenses ({transactions.length})</h3>
            <button
              type="button"
              className="import-select-all-btn"
              onClick={() => onSelectAllTransactions(!allTransactionsSelected)}
            >
              {allTransactionsSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="import-table-wrapper">
            <table className="import-table">
              <thead>
                <tr>
                  <th className="import-th-checkbox"></th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} className={t.isDuplicate ? 'duplicate' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={t.selected}
                        onChange={(e) => onTransactionChange(t.id, { selected: e.target.checked })}
                      />
                    </td>
                    <td className="import-td-date">{formatDate(t.date)}</td>
                    <td className="import-td-description">
                      {t.description}
                      {t.isDuplicate && <span className="import-duplicate-badge">Duplicate</span>}
                    </td>
                    <td className="import-td-amount expense">
                      -{formatCurrency(t.amount, t.currency)}
                    </td>
                    <td>
                      <select
                        className="import-category-select"
                        value={t.category}
                        onChange={(e) => onTransactionChange(t.id, { category: e.target.value as ExpenseCategory })}
                      >
                        {expenseCategories.map(cat => (
                          <option key={cat} value={cat}>{expenseCategoryLabels[cat]}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Income Section */}
      {income.length > 0 && (
        <div className="import-section">
          <div className="import-section-header">
            <h3>Income ({income.length})</h3>
            <button
              type="button"
              className="import-select-all-btn"
              onClick={() => onSelectAllIncome(!allIncomeSelected)}
            >
              {allIncomeSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="import-table-wrapper">
            <table className="import-table">
              <thead>
                <tr>
                  <th className="import-th-checkbox"></th>
                  <th>Date</th>
                  <th>Source</th>
                  <th>Amount</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {income.map(i => (
                  <tr key={i.id} className={i.isDuplicate ? 'duplicate' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={i.selected}
                        onChange={(e) => onIncomeChange(i.id, { selected: e.target.checked })}
                      />
                    </td>
                    <td className="import-td-date">{formatDate(i.date)}</td>
                    <td className="import-td-description">
                      {i.source}
                      {i.isDuplicate && <span className="import-duplicate-badge">Duplicate</span>}
                    </td>
                    <td className="import-td-amount income">
                      +{formatCurrency(i.amount, i.currency)}
                    </td>
                    <td>
                      <select
                        className="import-category-select"
                        value={i.category}
                        onChange={(e) => onIncomeChange(i.id, { category: e.target.value as IncomeCategory })}
                      >
                        {incomeCategories.map(cat => (
                          <option key={cat} value={cat}>{incomeCategoryLabels[cat]}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {transactions.length === 0 && income.length === 0 && (
        <div className="import-empty">
          <p>No transactions found in the CSV file.</p>
        </div>
      )}

      {/* Actions */}
      <div className="form-actions">
        <button type="button" className="form-btn form-btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="form-btn form-btn-secondary" onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className="form-btn form-btn-primary"
          onClick={onConfirm}
          disabled={isImporting || (selectedTransactions.length === 0 && selectedIncome.length === 0)}
        >
          {isImporting ? 'Importing...' : `Import ${selectedTransactions.length + selectedIncome.length} Items`}
        </button>
      </div>
    </div>
  );
}
