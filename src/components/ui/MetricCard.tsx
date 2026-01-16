'use client';

import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
  variant?: 'default' | 'gradient';
}

export default function MetricCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  variant = 'default',
}: MetricCardProps) {
  const isGradient = variant === 'gradient';

  const getChangeColor = () => {
    if (isGradient) return 'rgba(255,255,255,0.9)';
    if (changeType === 'positive') return '#10B981';
    if (changeType === 'negative') return '#EF4444';
    return '#9CA3AF';
  };

  return (
    <div
      style={{
        borderRadius: '16px',
        padding: '20px',
        transition: 'all 0.2s',
        background: isGradient
          ? 'linear-gradient(135deg, #FF7B9C 0%, #FF6B9D 100%)'
          : '#FFFFFF',
        border: isGradient ? 'none' : '1px solid #F3F4F6',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '4px',
              color: isGradient ? 'rgba(255,255,255,0.8)' : '#9CA3AF',
            }}
          >
            {title}
          </p>
          <p
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: isGradient ? '#FFFFFF' : '#1A1D2E',
            }}
          >
            {value}
          </p>
          {change && (
            <p
              style={{
                fontSize: '14px',
                marginTop: '8px',
                fontWeight: 500,
                color: getChangeColor(),
              }}
            >
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              background: isGradient ? 'rgba(255,255,255,0.2)' : '#F8F9FC',
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
