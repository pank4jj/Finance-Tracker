import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/dashboard':    'Dashboard',
  '/transactions': 'Transactions',
  '/budgets':      'Budgets',
  '/categories':   'Categories',
  '/profile':      'Profile',
};

const TopNav = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

  const pageTitle = PAGE_TITLES[pathname] ?? 'Finance Tracker';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className="h-nav w-full flex items-center px-6 md:px-8 shrink-0"
      style={{
        background: 'var(--canvas)',
        borderBottom: '1px solid var(--hairline)',
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold truncate md:hidden" style={{ color: 'var(--ink)' }}>
          Finance<span style={{ color: 'var(--rausch)' }}>.</span>
        </h1>
        <h1 className="hidden md:block text-base font-semibold" style={{ color: 'var(--ink)' }}>
          {pageTitle}
        </h1>
      </div>

      {/* Right area: theme toggle + account */}
      <div className="flex items-center gap-3" ref={menuRef}>

        {/* Quick dark-mode toggle in header */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'var(--surface-soft)', color: 'var(--ink)' }}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            /* Sun icon */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            /* Moon icon */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Avatar button */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0 focus:outline-none"
          style={{ background: 'var(--rausch)' }}
          aria-label="Account menu"
        >
          {initials}
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div
            className="absolute right-6 md:right-8 top-16 rounded-md z-50 min-w-[180px]"
            style={{
              background: 'var(--canvas)',
              border: '1px solid var(--hairline)',
              boxShadow: 'var(--shadow-airbnb)',
            }}
          >
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--hairline)' }}>
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--ink)' }}>{user?.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{user?.email}</p>
            </div>
            <button
              onClick={() => { navigate('/profile'); setMenuOpen(false); }}
              className="w-full text-left px-4 py-3 text-sm transition-colors"
              style={{ color: 'var(--ink)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-soft)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Profile & Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm transition-colors"
              style={{ color: 'var(--ink)', borderTop: '1px solid var(--hairline)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-soft)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNav;
