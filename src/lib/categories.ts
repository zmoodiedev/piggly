/**
 * Centralized category definitions for the finance dashboard.
 * All expense categories (transactions, bills) and income categories are defined here.
 *
 * Future: These could be stored in the database and made user-configurable
 * via a settings page.
 */

// =============================================================================
// EXPENSE CATEGORIES (used for both Transactions and Bills)
// =============================================================================

export type ExpenseCategory =
  | 'groceries'
  | 'eating-out'
  | 'entertainment'
  | 'clothing'
  | 'transportation'
  | 'healthcare'
  | 'personal-care'
  | 'gifts'
  | 'education'
  | 'travel'
  | 'shopping'
  | 'utilities'
  | 'subscription'
  | 'insurance'
  | 'housing'
  | 'harrison'
  | 'debt'
  | 'other';

export const expenseCategories: ExpenseCategory[] = [
  'groceries',
  'eating-out',
  'entertainment',
  'clothing',
  'transportation',
  'healthcare',
  'personal-care',
  'gifts',
  'education',
  'travel',
  'shopping',
  'utilities',
  'subscription',
  'insurance',
  'housing',
  'harrison',
  'debt',
  'other',
];

export const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  'groceries': 'Groceries',
  'eating-out': 'Eating Out',
  'entertainment': 'Entertainment',
  'clothing': 'Clothing',
  'transportation': 'Transportation',
  'healthcare': 'Healthcare',
  'personal-care': 'Personal Care',
  'gifts': 'Gifts',
  'education': 'Education',
  'travel': 'Travel',
  'shopping': 'Shopping',
  'utilities': 'Utilities',
  'subscription': 'Subscription',
  'insurance': 'Insurance',
  'housing': 'Housing',
  'harrison': 'Harrison',
  'debt': 'Debt',
  'other': 'Other',
};

export const expenseCategoryIcons: Record<ExpenseCategory, string> = {
  'groceries': '🛒',
  'eating-out': '🍔',
  'entertainment': '🎬',
  'clothing': '👕',
  'transportation': '🚗',
  'healthcare': '💊',
  'personal-care': '💅',
  'gifts': '🎁',
  'education': '📚',
  'travel': '✈️',
  'shopping': '🛍️',
  'utilities': '💡',
  'subscription': '📱',
  'insurance': '🛡️',
  'housing': '🏠',
  'harrison': '👶',
  'debt': '💳',
  'other': '📦',
};

export const expenseCategoryColors: Record<ExpenseCategory, string> = {
  'groceries': '#22c55e',
  'eating-out': '#f59e0b',
  'entertainment': '#8b5cf6',
  'clothing': '#ec4899',
  'transportation': '#3b82f6',
  'healthcare': '#ef4444',
  'personal-care': '#a855f7',
  'gifts': '#f87171',
  'education': '#06b6d4',
  'travel': '#10b981',
  'shopping': '#fb923c',
  'utilities': '#eab308',
  'subscription': '#6366f1',
  'insurance': '#14b8a6',
  'housing': '#84cc16',
  'harrison': '#f472b6',
  'debt': '#dc2626',
  'other': '#6b7280',
};

// =============================================================================
// INCOME CATEGORIES
// =============================================================================

export type IncomeCategory =
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'refund'
  | 'gift'
  | 'transfer'
  | 'other';

export const incomeCategories: IncomeCategory[] = [
  'salary',
  'freelance',
  'investment',
  'refund',
  'gift',
  'transfer',
  'other',
];

export const incomeCategoryLabels: Record<IncomeCategory, string> = {
  'salary': 'Salary',
  'freelance': 'Freelance',
  'investment': 'Investment',
  'refund': 'Refund',
  'gift': 'Gift',
  'transfer': 'Transfer',
  'other': 'Other',
};

export const incomeCategoryIcons: Record<IncomeCategory, string> = {
  'salary': '💰',
  'freelance': '💼',
  'investment': '📈',
  'refund': '↩️',
  'gift': '🎁',
  'transfer': '🔄',
  'other': '💵',
};

export const incomeCategoryColors: Record<IncomeCategory, string> = {
  'salary': '#22c55e',
  'freelance': '#3b82f6',
  'investment': '#8b5cf6',
  'refund': '#f59e0b',
  'gift': '#ec4899',
  'transfer': '#6366f1',
  'other': '#6b7280',
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getExpenseCategoryLabel(category: ExpenseCategory): string {
  return expenseCategoryLabels[category] || category;
}

export function getIncomeCategoryLabel(category: IncomeCategory): string {
  return incomeCategoryLabels[category] || category;
}

export function getExpenseCategoryIcon(category: ExpenseCategory): string {
  return expenseCategoryIcons[category] || '📦';
}

export function getIncomeCategoryIcon(category: IncomeCategory): string {
  return incomeCategoryIcons[category] || '💵';
}
