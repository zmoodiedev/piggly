'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { startOfMonth, endOfMonth, subMonths, addMonths, format } from 'date-fns';

interface MonthContextType {
  selectedDate: Date;
  monthStart: Date;
  monthEnd: Date;
  monthLabel: string;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToMonth: (date: Date) => void;
  isCurrentMonth: boolean;
}

const MonthContext = createContext<MonthContextType | undefined>(undefined);

export function MonthProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const monthLabel = format(selectedDate, 'MMMM yyyy');

  const currentMonthStart = startOfMonth(new Date());
  const isCurrentMonth = monthStart.getTime() === currentMonthStart.getTime();

  const goToPreviousMonth = () => {
    setSelectedDate(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(prev => addMonths(prev, 1));
  };

  const goToMonth = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <MonthContext.Provider
      value={{
        selectedDate,
        monthStart,
        monthEnd,
        monthLabel,
        goToPreviousMonth,
        goToNextMonth,
        goToMonth,
        isCurrentMonth,
      }}
    >
      {children}
    </MonthContext.Provider>
  );
}

export function useMonth() {
  const context = useContext(MonthContext);
  if (context === undefined) {
    throw new Error('useMonth must be used within a MonthProvider');
  }
  return context;
}
