import { ExpenseCategory, IncomeCategory, Currency } from './index';

export interface ParsedTransaction {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: Date;
  currency: Currency;
  selected: boolean;
  isDuplicate: boolean;
}

export interface ParsedIncome {
  id: string;
  amount: number;
  source: string;
  category: IncomeCategory;
  date: Date;
  currency: Currency;
  selected: boolean;
  isDuplicate: boolean;
}

export type ImportStep = 'upload' | 'review' | 'importing' | 'complete';

export interface ImportState {
  step: ImportStep;
  transactions: ParsedTransaction[];
  income: ParsedIncome[];
  error: string | null;
}

export interface RBCRow {
  accountType: string;
  accountNumber: string;
  transactionDate: string;
  chequeNumber: string;
  description1: string;
  description2: string;
  cad: string;
  usd: string;
}
