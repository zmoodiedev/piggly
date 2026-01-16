'use client';

import { useState } from 'react';
import { useMonth } from '@/lib/context/MonthContext';
import { format, subMonths, startOfMonth } from 'date-fns';
import './MonthSelector.css';

export default function MonthSelector() {
  const { monthLabel, goToPreviousMonth, goToNextMonth, goToMonth, isCurrentMonth } = useMonth();
  const [showDropdown, setShowDropdown] = useState(false);

  // Generate last 12 months for dropdown
  const months = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = subMonths(now, i);
    months.push({
      date: startOfMonth(date),
      label: format(date, 'MMMM yyyy'),
    });
  }

  const handleMonthSelect = (date: Date) => {
    goToMonth(date);
    setShowDropdown(false);
  };

  return (
    <div className="month-selector">
      <button
        className="month-selector-arrow"
        onClick={goToPreviousMonth}
        title="Previous month"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className="month-selector-current">
        <button
          className="month-selector-label"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {monthLabel}
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
        className="month-selector-arrow"
        onClick={goToNextMonth}
        disabled={isCurrentMonth}
        title="Next month"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
