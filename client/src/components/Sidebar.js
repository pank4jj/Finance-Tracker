import React from 'react';
import { NavLink } from 'react-router-dom';

// Minimal SVG icons — stroke-based, 24px
const icons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  transactions: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 10h16M4 14h10M4 18h7" />
    </svg>
  ),
  budgets: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
  categories: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
    </svg>
  ),
  profile: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

const items = [
  { to: '/dashboard',    label: 'Dashboard',    icon: icons.dashboard },
  { to: '/transactions', label: 'Transactions', icon: icons.transactions },
  { to: '/budgets',      label: 'Budgets',      icon: icons.budgets },
  { to: '/categories',   label: 'Categories',   icon: icons.categories },
  { to: '/profile',      label: 'Profile',      icon: icons.profile },
];

const Sidebar = () => {
  return (
    <aside
      className="hidden md:flex flex-col w-64 shrink-0"
      style={{
        height: '100vh',
        position: 'sticky',
        top: 0,
        background: 'var(--canvas)',
        borderRight: '1px solid var(--hairline)',
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* Logo */}
      <div
        className="px-6 h-nav flex items-center shrink-0"
        style={{ borderBottom: '1px solid var(--hairline)' }}
      >
        <span className="text-xl font-semibold tracking-tight" style={{ color: 'var(--ink)' }}>
          Finance<span style={{ color: 'var(--rausch)' }}>.</span>
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' active' : ''}`
            }
          >
            <span className="shrink-0">{it.icon}</span>
            <span>{it.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-6 py-4 shrink-0"
        style={{ borderTop: '1px solid var(--hairline)' }}
      >
        <p className="text-xs" style={{ color: 'var(--muted)' }}>Finance Tracker v1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
