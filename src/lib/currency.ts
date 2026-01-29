import { Currency } from '@/types';

/**
 * Format currency for display
 */
export function formatCurrency(
  amount: number,
  currency: Currency = 'CAD',
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}

/**
 * Format compact currency (e.g., $1.2K, $3.5M)
 */
export function formatCompactCurrency(
  amount: number,
  currency: Currency = 'CAD'
): string {
  const symbol = currency === 'USD' ? 'US$' : '$';
  if (amount >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount, currency);
}
