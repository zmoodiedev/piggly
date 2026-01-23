'use client';

import { useState, useCallback } from 'react';
import { Transaction, Income } from '@/types';
import { ParsedTransaction, ParsedIncome, ImportStep } from '@/types/import';
import { parseRBCCSV, detectDuplicates, convertToTransaction, convertToIncome } from '@/lib/csvParser';
import ImportUploadStep from './ImportUploadStep';
import ImportReviewStep from './ImportReviewStep';
import './Import.css';

interface ImportModalProps {
  existingTransactions: Transaction[];
  existingIncome: Income[];
  onImport: (transactions: Transaction[], income: Income[]) => Promise<void>;
  onClose: () => void;
}

export default function ImportModal({
  existingTransactions,
  existingIncome,
  onImport,
  onClose,
}: ImportModalProps) {
  const [step, setStep] = useState<ImportStep>('upload');
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([]);
  const [income, setIncome] = useState<ParsedIncome[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileSelect = useCallback((content: string) => {
    try {
      const parsed = parseRBCCSV(content);

      if (parsed.transactions.length === 0 && parsed.income.length === 0) {
        setError('No valid transactions found in the CSV file');
        return;
      }

      // Detect duplicates
      const withDuplicates = detectDuplicates(
        parsed.transactions,
        parsed.income,
        existingTransactions,
        existingIncome
      );

      setTransactions(withDuplicates.transactions);
      setIncome(withDuplicates.income);
      setError(null);
      setStep('review');
    } catch (err) {
      setError('Failed to parse CSV file. Please check the format.');
      console.error('CSV parse error:', err);
    }
  }, [existingTransactions, existingIncome]);

  const handleTransactionChange = useCallback((id: string, updates: Partial<ParsedTransaction>) => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  }, []);

  const handleIncomeChange = useCallback((id: string, updates: Partial<ParsedIncome>) => {
    setIncome(prev =>
      prev.map(i => i.id === id ? { ...i, ...updates } : i)
    );
  }, []);

  const handleSelectAllTransactions = useCallback((selected: boolean) => {
    setTransactions(prev =>
      prev.map(t => ({ ...t, selected }))
    );
  }, []);

  const handleSelectAllIncome = useCallback((selected: boolean) => {
    setIncome(prev =>
      prev.map(i => ({ ...i, selected }))
    );
  }, []);

  const handleConfirm = async () => {
    setIsImporting(true);
    try {
      const selectedTransactions = transactions
        .filter(t => t.selected)
        .map(convertToTransaction);

      const selectedIncome = income
        .filter(i => i.selected)
        .map(convertToIncome);

      await onImport(selectedTransactions, selectedIncome);
      onClose();
    } catch (err) {
      setError('Failed to import data');
      console.error('Import error:', err);
    } finally {
      setIsImporting(false);
    }
  };

  const handleBack = () => {
    setStep('upload');
    setTransactions([]);
    setIncome([]);
    setError(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content import-modal"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {step === 'upload' && 'Import Bank Statement'}
            {step === 'review' && 'Review Import'}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="import-error">{error}</div>
          )}

          {step === 'upload' && (
            <ImportUploadStep
              onFileSelect={handleFileSelect}
              onCancel={onClose}
            />
          )}

          {step === 'review' && (
            <ImportReviewStep
              transactions={transactions}
              income={income}
              onTransactionChange={handleTransactionChange}
              onIncomeChange={handleIncomeChange}
              onSelectAllTransactions={handleSelectAllTransactions}
              onSelectAllIncome={handleSelectAllIncome}
              onConfirm={handleConfirm}
              onBack={handleBack}
              onCancel={onClose}
              isImporting={isImporting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
