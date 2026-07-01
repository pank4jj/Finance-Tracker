import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const TxnIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6h16M4 10h16M4 14h10M4 18h7" />
  </svg>
);

const BudgetIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

const CatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
  </svg>
);

const PersonIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const navItems = [
  { to: '/dashboard',    label: 'Home',         Icon: HomeIcon },
  { to: '/transactions', label: 'Transactions', Icon: TxnIcon },
  { to: '/budgets',      label: 'Budgets',      Icon: BudgetIcon },
  { to: '/categories',   label: 'Categories',   Icon: CatIcon },
  { to: '/profile',      label: 'Profile',      Icon: PersonIcon },
];

export default function MobileBottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 md:hidden z-50"
      style={{
        background: 'var(--canvas)',
        borderTop: '1px solid var(--hairline)',
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ to, label, Icon }) => {
          const active =
            to === '/dashboard'
              ? pathname === '/' || pathname.startsWith('/dashboard')
              : pathname.startsWith(to);

          return (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full"
              style={{ color: active ? 'var(--rausch)' : 'var(--muted)' }}
              aria-current={active ? 'page' : undefined}
            >
              <Icon />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
