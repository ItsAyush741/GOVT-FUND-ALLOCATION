import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { LayoutDashboard, Wallet, History, ShieldAlert, LogOut, Bell, Building2 } from 'lucide-react';
import './Layout.css';

const Layout = () => {
  const { currentAccount, isAdmin, logout } = useWeb3();

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Building2 size={24} color="var(--primary-blue)" />
          <span>The Sovereign Ledger</span>
        </div>
        
        <div className="sidebar-subtitle">GOVERNMENT TRANSPARENCY PROTOCOL</div>

        <nav className="sidebar-nav">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/fund-allocation" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <Wallet size={20} /> Fund Allocation
          </NavLink>
          <NavLink to="/history" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <History size={20} /> History
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <ShieldAlert size={20} /> Admin Management
            </NavLink>
          )}
        </nav>

        <div className="sidebar-bottom">
          <button className="btn-logout" onClick={logout}>
            <LogOut size={20} /> Switch Portal
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <h2>Institutional Portal</h2>
          </div>
          <div className="topbar-right">
            <span className="account-badge">
              <span className={`status-dot ${isAdmin ? 'admin' : ''}`}></span>
              {isAdmin ? 'ADMIN ACCESS' : 'OFFICER ACCESS'}
            </span>
            <span className="account-hash">{currentAccount?.substring(0, 6)}...{currentAccount?.substring(currentAccount.length - 4)}</span>
            <Bell size={20} className="text-muted" style={{marginLeft: '1rem'}} />
          </div>
        </header>

        <div className="content-pad">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
