import { Debt, Bill, SavingsGoal, Income, Transaction, Currency } from '@/types';

const STORAGE_KEYS = {
  DEBTS: 'finance_dashboard_debts',
  BILLS: 'finance_dashboard_bills',
  SAVINGS_GOALS: 'finance_dashboard_savings_goals',
  TRANSACTIONS: 'finance_dashboard_transactions',
  CURRENCY: 'finance_dashboard_currency',
  SETTINGS: 'finance_dashboard_settings',
} as const;

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generic get from localStorage with type safety
 */
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (!isLocalStorageAvailable()) return defaultValue;

  try {
    const item = window.localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    console.error(`Error reading from localStorage: ${key}`);
    return defaultValue;
  }
}

/**
 * Generic set to localStorage
 */
function setToStorage<T>(key: string, value: T): void {
  if (!isLocalStorageAvailable()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage: ${key}`, error);
  }
}

// Debts - localStorage (legacy, used as fallback)
export const getDebts = (): Debt[] => getFromStorage(STORAGE_KEYS.DEBTS, []);
export const saveDebts = (debts: Debt[]) => setToStorage(STORAGE_KEYS.DEBTS, debts);

// Debts - API/Excel storage
export async function fetchDebts(): Promise<Debt[]> {
  try {
    const response = await fetch('/api/debts');
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Error fetching debts:', error);
    return [];
  }
}

export async function saveDebtsToExcel(debts: Debt[]): Promise<boolean> {
  try {
    const response = await fetch('/api/debts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(debts),
    });
    return response.ok;
  } catch (error) {
    console.error('Error saving debts:', error);
    return false;
  }
}

// Bills - localStorage (legacy, used as fallback)
export const getBills = (): Bill[] => getFromStorage(STORAGE_KEYS.BILLS, []);
export const saveBills = (bills: Bill[]) => setToStorage(STORAGE_KEYS.BILLS, bills);

// Bills - API/Google Sheets storage
export async function fetchBills(): Promise<Bill[]> {
  try {
    const response = await fetch('/api/bills');
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Error fetching bills:', error);
    return [];
  }
}

export async function saveBillsToSheet(bills: Bill[]): Promise<boolean> {
  try {
    const response = await fetch('/api/bills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bills),
    });
    return response.ok;
  } catch (error) {
    console.error('Error saving bills:', error);
    return false;
  }
}

// Savings Goals - localStorage (legacy, used as fallback)
export const getSavingsGoals = (): SavingsGoal[] =>
  getFromStorage(STORAGE_KEYS.SAVINGS_GOALS, []);
export const saveSavingsGoals = (goals: SavingsGoal[]) =>
  setToStorage(STORAGE_KEYS.SAVINGS_GOALS, goals);

// Savings Goals - API/Google Sheets storage
export async function fetchSavings(): Promise<SavingsGoal[]> {
  try {
    const response = await fetch('/api/savings');
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Error fetching savings:', error);
    return [];
  }
}

export async function saveSavingsToSheet(savings: SavingsGoal[]): Promise<boolean> {
  try {
    const response = await fetch('/api/savings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(savings),
    });
    return response.ok;
  } catch (error) {
    console.error('Error saving savings:', error);
    return false;
  }
}

// Income - API/Google Sheets storage
export async function fetchIncome(): Promise<Income[]> {
  try {
    const response = await fetch('/api/income');
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Error fetching income:', error);
    return [];
  }
}

export async function saveIncomeToSheet(income: Income[]): Promise<boolean> {
  try {
    const response = await fetch('/api/income', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(income),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error saving income:', response.status, errorData);
    }
    return response.ok;
  } catch (error) {
    console.error('Error saving income:', error);
    return false;
  }
}

// Transactions - localStorage (legacy, used as fallback)
export const getTransactions = (): Transaction[] =>
  getFromStorage(STORAGE_KEYS.TRANSACTIONS, []);
export const saveTransactions = (transactions: Transaction[]) =>
  setToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);

// Transactions - API/Google Sheets storage
export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const response = await fetch('/api/transactions');
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function saveTransactionsToSheet(transactions: Transaction[]): Promise<boolean> {
  try {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transactions),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error saving transactions:', response.status, errorData);
    }
    return response.ok;
  } catch (error) {
    console.error('Error saving transactions:', error);
    return false;
  }
}

// Currency preference
export const getCurrency = (): Currency =>
  getFromStorage(STORAGE_KEYS.CURRENCY, 'CAD');
export const saveCurrency = (currency: Currency) =>
  setToStorage(STORAGE_KEYS.CURRENCY, currency);

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
