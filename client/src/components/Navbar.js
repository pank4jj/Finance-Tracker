import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] md:w-[80%] lg:w-[70%] z-50 glass rounded-xl shadow-soft-lg">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-xl font-semibold tracking-tight text-white">Finance</Link>
          <div className="hidden md:flex items-center gap-3 text-sm text-[color:var(--muted)]">
            <Link to="/dashboard" className="hover:text-white transition">Dashboard</Link>
            <Link to="/transactions" className="hover:text-white transition">Transactions</Link>
            <Link to="/budgets" className="hover:text-white transition">Budgets</Link>
            <Link to="/categories" className="hover:text-white transition">Categories</Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/profile" className="text-sm text-[color:var(--muted)] hover:text-white">Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
