import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const IconWrapper = ({ children }) => (
  <div className="w-6 h-6 text-current">{children}</div>
);

const HomeIcon = () => (
  <IconWrapper>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M3 10.5L12 4l9 6.5" />
      <path d="M9 21V12h6v9" />
    </svg>
  </IconWrapper>
);

const TransactionsIcon = () => (
  <IconWrapper>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
    </svg>
  </IconWrapper>
);

const BudgetsIcon = () => (
  <IconWrapper>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M12 3v18" />
      <path d="M6 12v6" />
      <path d="M18 8v10" />
    </svg>
  </IconWrapper>
);

const CategoriesIcon = () => (
  <IconWrapper>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M3 7h7l2 3h9v9H3z" />
      <path d="M3 7V5a2 2 0 0 1 2-2h3" />
    </svg>
  </IconWrapper>
);

const ProfileIcon = () => (
  <IconWrapper>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  </IconWrapper>
);

const NavItem = ({ to, label, Icon, active }) => (
  <Link
    to={to}
    className={`flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors text-sm ${
      active ? 'text-primary-300' : 'text-[color:var(--muted)]'
    }`}
    aria-current={active ? 'page' : undefined}
  >
    <div className="mb-1"><Icon /></div>
    <div className="mt-1">{label}</div>
  </Link>
);

export default function MobileBottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-4 inset-x-4 md:hidden z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}>
      <div className="bg-[rgba(11,17,32,0.6)] backdrop-blur-md ring-1 ring-white/6 rounded-full shadow-lg px-2 py-2 flex justify-between items-center">
        <NavItem to="/dashboard" label="Home" Icon={HomeIcon} active={pathname === '/' || pathname.startsWith('/dashboard')} />
        <NavItem to="/transactions" label="Transactions" Icon={TransactionsIcon} active={pathname.startsWith('/transactions')} />
        <NavItem to="/budgets" label="Budgets" Icon={BudgetsIcon} active={pathname.startsWith('/budgets')} />
        <NavItem to="/categories" label="Categories" Icon={CategoriesIcon} active={pathname.startsWith('/categories')} />
        <NavItem to="/profile" label="Profile" Icon={ProfileIcon} active={pathname.startsWith('/profile')} />
      </div>
    </nav>
  );
}
