'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Currency } from '@/types';
import { getCurrency, saveCurrency } from '@/lib/storage';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('CAD');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = getCurrency();
    setCurrencyState(savedCurrency);
    setIsLoaded(true);
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    saveCurrency(newCurrency);
  };

  // Prevent hydration mismatch by not rendering until loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
