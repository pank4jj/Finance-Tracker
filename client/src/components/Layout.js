import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import MobileBottomNav from './MobileBottomNav';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--canvas)' }}>
      {/* Sidebar — visible md+ */}
      <Sidebar />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-6 md:p-8 lg:p-10 pb-24 md:pb-10">
          <div className="container-max">{children}</div>
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default Layout;
