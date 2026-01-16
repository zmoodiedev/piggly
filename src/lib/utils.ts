import { format, formatDistanceToNow, isAfter, isBefore, addDays } from 'date-fns';

/**
 * Format date for display
 */
export function formatDate(date: Date | string, formatStr: string = 'MMM d, yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Get relative time string (e.g., "2 days ago", "in 3 days")
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Check if a bill/payment is overdue
 */
export function isOverdue(dueDate: Date | string): boolean {
  const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  return isBefore(dateObj, new Date());
}

/**
 * Check if a bill/payment is due soon (within specified days)
 */
export function isDueSoon(dueDate: Date | string, withinDays: number = 7): boolean {
  const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const threshold = addDays(new Date(), withinDays);
  return isBefore(dateObj, threshold) && isAfter(dateObj, new Date());
}

/**
 * Calculate percentage
 */
export function calculatePercentage(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate a random color from a predefined palette
 */
export function getRandomColor(): string {
  const colors = [
    '#FF7B9C', '#FF6B9D', '#7C3AED', '#2563EB',
    '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Classname utility for conditional classes
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
