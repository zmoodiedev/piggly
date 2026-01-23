import { ExpenseCategory, IncomeCategory } from '@/lib/categories';

// Currency types
export type Currency = 'CAD' | 'USD';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
}

// Re-export category types for convenience
export type { ExpenseCategory, IncomeCategory } from '@/lib/categories';

// Financial data types
export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  currentBalance: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: number; // day of month
  category: 'credit-card' | 'loan' | 'mortgage' | 'other';
  currency: Currency;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: number; // day of month
  category: ExpenseCategory;
  isRecurring: boolean;
  frequency: 'monthly' | 'quarterly' | 'annually';
  isPaid: boolean;
  isAutoPay: boolean;
  lastPaidDate?: Date;
  currency: Currency;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  category: 'emergency' | 'vacation' | 'purchase' | 'retirement' | 'other';
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  category: IncomeCategory;
  date: Date;
  notes?: string;
  currency: Currency;
  createdAt: Date;
  updatedAt: Date;
}

// Deprecated: Use ExpenseCategory instead
export type TransactionCategory = ExpenseCategory;

export interface Transaction {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: Date;
  currency: Currency;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard metrics
export interface DashboardMetrics {
  totalDebt: number;
  totalBills: number;
  totalSavings: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netWorth: number;
}

// Chart data types
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  [key: string]: string | number;
}
