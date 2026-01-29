'use client';

import { useSession } from 'next-auth/react';
import { MetricCard } from '@/components/ui';
import { SpendingChart, BudgetBreakdown, SpendingByCategory } from '@/components/charts';
import { UpcomingBills, SavingsProgress } from '@/components/dashboard';
import { useDashboardData } from '@/lib/hooks/useDashboardData';
import { formatCurrency } from '@/lib/currency';

export default function Home() {
  const { data: session } = useSession();

  // Get first name from session
  const firstName = session?.user?.name?.split(' ')[0] || '';
  const {
    savings,
    metrics,
    unpaidBills,
    monthlySpending,
    budgetBreakdown,
    spendingBreakdown,
    isLoading,
  } = useDashboardData();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid #FF7B9C',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  const formatAmount = (amount: number) => {
    return formatCurrency(amount);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome section */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1D2E', margin: 0 }}>
          Welcome back{firstName ? `, ${firstName}` : ''}
        </h2>
        <p style={{ color: '#6B7280', marginTop: '4px' }}>
          Here&apos;s your financial overview for today
        </p>
      </div>

      {/* Metric cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <MetricCard
          title="Monthly Income"
          value={formatAmount(metrics.totalMonthlyIncome)}
          change="This month"
          changeType="positive"
          variant="gradient"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />
        <MetricCard
          title="Money Left"
          value={formatAmount(metrics.moneyLeftAfterBills)}
          change="After bills & min payments"
          changeType={metrics.moneyLeftAfterBills >= 0 ? 'positive' : 'negative'}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />
        <MetricCard
          title="Total Savings"
          value={formatAmount(metrics.totalSavings)}
          change={`${metrics.savingsProgress}% of goal`}
          changeType="positive"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
              <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z" />
              <path d="M2 9v1c0 1.1.9 2 2 2h1" />
            </svg>
          }
        />
        <MetricCard
          title="Total Debt"
          value={formatAmount(metrics.totalDebt)}
          change={`${metrics.debtPayoffPercent}% paid off`}
          changeType={metrics.debtPayoffPercent > 50 ? 'positive' : 'neutral'}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF7B9C" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          }
        />
        <MetricCard
          title="Monthly Bills"
          value={formatAmount(metrics.totalBillsAmount)}
          change={`${metrics.unpaidBillsCount} unpaid`}
          changeType={metrics.unpaidBillsCount > 3 ? 'negative' : 'neutral'}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          }
        />
      </div>

      {/* Income vs Expenses - Full width */}
      <div>
        <SpendingChart data={monthlySpending} />
      </div>

      {/* Spending & Budget breakdown row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        <div style={{ minWidth: 0 }}>
          <SpendingByCategory data={spendingBreakdown} title="Spending This Month" />
        </div>
        <div style={{ minWidth: 0 }}>
          <BudgetBreakdown data={budgetBreakdown} />
        </div>
      </div>

      {/* Lists row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        <UpcomingBills bills={unpaidBills} />
        <SavingsProgress goals={savings} />
      </div>
    </div>
  );
}
