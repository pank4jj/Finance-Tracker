import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full p-4 md:p-6 flex items-center justify-between glass" style={{backdropFilter:'blur(6px)'}}>
      <div>
        <motion.h1 initial={{opacity:0}} animate={{opacity:1}} className="text-lg font-semibold text-white">Welcome{user ? `, ${user.name}` : ''}</motion.h1>
        <p className="text-sm text-[color:var(--muted)]">Overview of your financials</p>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleLogout} className="px-3 py-2 rounded-md bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] transition text-[color:var(--muted)]">Logout</button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
          {user?.name?.split(' ').map(n=>n[0]).slice(0,2).join('')}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
