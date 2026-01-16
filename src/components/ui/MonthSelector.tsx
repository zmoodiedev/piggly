'use client';

import { useState } from 'react';
import { useMonth } from '@/lib/context/MonthContext';
import { format, subMonths, startOfMonth } from 'date-fns';
import './MonthSelector.css';

interface MonthSelectorProps {
  compact?: boolean;
}

export default function MonthSelector({ compact = false }: MonthSelectorProps) {
  const { selectedDate, monthLabel, goToPreviousMonth, goToNextMonth, goToMonth, isCurrentMonth } = useMonth();
  const [showDropdown, setShowDropdown] = useState(false);

  // Generate last 12 months for dropdown
  const months = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = subMonths(now, i);
    months.push({
      date: startOfMonth(date),
      label: format(date, 'MMMM yyyy'),
      shortLabel: format(date, 'MMM yyyy'),
    });
  }

  const handleMonthSelect = (date: Date) => {
    goToMonth(date);
    setShowDropdown(false);
  };

  const displayLabel = compact ? format(selectedDate, 'MMM yyyy') : monthLabel;

  return (
    <div className="month-selector">
      <button
        className={`month-selector-arrow ${compact ? 'compact' : ''}`}
        onClick={goToPreviousMonth}
        title="Previous month"
      >
        <svg width={compact ? 16 : 20} height={compact ? 16 : 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className="month-selector-current">
        <button
          className={`month-selector-label ${compact ? 'compact' : ''}`}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {displayLabel}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {showDropdown && (
          <>
            <div className="month-selector-backdrop" onClick={() => setShowDropdown(false)} />
            <div className="month-selector-dropdown">
              {months.map((month, index) => (
                <button
                  key={index}
                  className={`month-selector-option ${month.label === monthLabel ? 'active' : ''}`}
                  onClick={() => handleMonthSelect(month.date)}
                >
                  {month.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <button
        className={`month-selector-arrow ${compact ? 'compact' : ''}`}
        onClick={goToNextMonth}
        disabled={isCurrentMonth}
        title="Next month"
      >
        <svg width={compact ? 16 : 20} height={compact ? 16 : 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
