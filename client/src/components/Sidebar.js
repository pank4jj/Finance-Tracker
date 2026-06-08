import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const items = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/budgets', label: 'Budgets' },
  { to: '/categories', label: 'Categories' },
  { to: '/profile', label: 'Profile' },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex md:flex-col w-72 p-6 glass" style={{height: '100vh'}}>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white">Finance</h2>
        <p className="text-sm text-[color:var(--muted)] mt-1">Tracker Dashboard</p>
      </div>

      <nav className="flex-1">
        {items.map((it, idx) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({isActive}) => `block py-3 px-4 rounded-lg mb-2 text-sm font-medium transition ${isActive ? 'bg-[rgba(53,127,255,0.12)] text-primary-300' : 'text-[color:var(--muted)] hover:bg-[rgba(255,255,255,0.02)] hover:text-white'}`}
          >
            <motion.span whileHover={{ x: 6 }} transition={{ type: 'spring', stiffness: 300 }}>{it.label}</motion.span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto text-sm text-[color:var(--muted)]">
        <div className="py-2">v1.0 • Local</div>
      </div>
    </aside>
  );
};

export default Sidebar;
