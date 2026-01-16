'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Currency } from '@/types';
import { MonthSelector } from '@/components/ui';

interface HeaderProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export default function Header({ currency, onCurrencyChange }: HeaderProps) {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        height: '64px',
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}
    >
      {/* Search bar */}
      <div style={{ flex: 1, maxWidth: '400px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type="text"
            placeholder="Search transactions, bills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '40px',
              paddingLeft: '40px',
              paddingRight: '16px',
              background: '#F8F9FC',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              fontSize: '14px',
              color: '#1A1D2E',
              outline: 'none',
            }}
          />
          <svg
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9CA3AF',
            }}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
      </div>

      {/* Month selector */}
      <MonthSelector />

      {/* Right side actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Currency toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#F8F9FC',
            borderRadius: '12px',
            padding: '4px',
            border: '1px solid #E5E7EB',
          }}
        >
          <button
            onClick={() => onCurrencyChange('CAD')}
            style={{
              padding: '6px 12px',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: currency === 'CAD' ? '#FFFFFF' : 'transparent',
              color: currency === 'CAD' ? '#1A1D2E' : '#9CA3AF',
              boxShadow: currency === 'CAD' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            CAD
          </button>
          <button
            onClick={() => onCurrencyChange('USD')}
            style={{
              padding: '6px 12px',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: currency === 'USD' ? '#FFFFFF' : 'transparent',
              color: currency === 'USD' ? '#1A1D2E' : '#9CA3AF',
              boxShadow: currency === 'USD' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            USD
          </button>
        </div>

        {/* User menu */}
        {session?.user && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt=""
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF7B9C 0%, #FF6B9D 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {session.user.name?.charAt(0) || session.user.email?.charAt(0) || '?'}
                </div>
              )}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6B7280"
                strokeWidth="2"
                style={{
                  transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  minWidth: '200px',
                  overflow: 'hidden',
                  zIndex: 50,
                }}
              >
                <div
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #E5E7EB',
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 600, color: '#1A1D2E', fontSize: '14px' }}>
                    {session.user.name || 'User'}
                  </p>
                  <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: '12px' }}>
                    {session.user.email}
                  </p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#EF4444',
                    fontSize: '14px',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#FEE2E2'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
