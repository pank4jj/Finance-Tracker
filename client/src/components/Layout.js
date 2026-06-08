import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { motion } from 'framer-motion';
import MobileBottomNav from './MobileBottomNav';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[radial-gradient(ellipse_at_top_left,_var(--bg)_0%,_#071025_40%)]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="p-6 md:p-8 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="container-max">{children}</div>
          </motion.div>
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default Layout;
