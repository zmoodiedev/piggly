import { Currency, CurrencyConfig } from '@/types';

// Static exchange rates (CAD as base currency)
// In production, these would be fetched from an API
export const EXCHANGE_RATES: Record<Currency, number> = {
  CAD: 1,
  USD: 0.74, // 1 CAD = 0.74 USD (approximate)
};

export const CURRENCY_CONFIG: Record<Currency, CurrencyConfig> = {
  CAD: {
    code: 'CAD',
    symbol: '$',
    name: 'Canadian Dollar',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
  },
};

/**
 * Convert amount from base currency (CAD) to target currency
 */
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): number {
  if (from === to) return amount;

  // Convert to CAD first (base currency), then to target
  const amountInCAD = amount / EXCHANGE_RATES[from];
  return amountInCAD * EXCHANGE_RATES[to];
}

/**
 * Format currency for display
 */
export function formatCurrency(
  amount: number,
  currency: Currency = 'CAD',
  options?: Intl.NumberFormatOptions
): string {
  const config = CURRENCY_CONFIG[currency];

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
  if (amount >= 1000000) {
    return `${CURRENCY_CONFIG[currency].symbol}${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${CURRENCY_CONFIG[currency].symbol}${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount, currency);
}
