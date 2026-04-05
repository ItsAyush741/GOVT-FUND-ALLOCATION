import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { Building2, Search, HelpCircle, LogOut } from 'lucide-react';
import './PublicLayout.css';

const PublicLayout = () => {
  const { logout, currentAccount } = useWeb3();

  return (
    <div className="public-layout">
      {/* Top Navigation */}
      <nav className="public-nav">
        <div className="public-nav-left">
          <div className="brand" onClick={logout} style={{cursor: 'pointer'}}>
            <span style={{color: 'var(--primary-blue)', fontWeight: 700, fontSize: '1.25rem'}}>The Sovereign Ledger</span>
          </div>
          <div className="nav-links">
            <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Ledger</NavLink>
            <span className="nav-link disabled">Allocations</span>
            <span className="nav-link disabled">Verification</span>
            <span className="nav-link disabled">Glossary</span>
          </div>
        </div>
        <div className="public-nav-right">
          <div className="badge-public">PUBLIC VIEWER</div>
          <div className="nav-icon" onClick={logout} title="Back to Portal Selection"><Building2 size={20} /></div>
          <div className="nav-icon"><HelpCircle size={20} /></div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="public-main">
        <Outlet />
      </main>

      {/* Footer Info Section */}
      <footer className="public-footer">
        <div className="footer-grid">
           <div>
              <div className="footer-icon-wrapper"><ShieldIcon /></div>
              <h4>Immutable Governance</h4>
              <p>Once a transaction is signed, it cannot be altered by any authority, ensuring public funds are tracked without tampering.</p>
           </div>
           <div>
              <div className="footer-icon-wrapper"><EyeIcon /></div>
              <h4>Open Visibility</h4>
              <p>Citizens maintain the right to view every Wei allocated. Our ledger is public, permissionless to view, and constantly audited.</p>
           </div>
           <div>
              <div className="footer-icon-wrapper"><NodesIcon /></div>
              <h4>Traceable Supply</h4>
              <p>From the central treasury to the final contractor, every step of the value chain is visible through distinct cryptographic nodes.</p>
           </div>
        </div>
        <div className="footer-bottom">
           <div>© 2024 Sovereign Ledger - Official Transparency Portal<br/><span style={{fontSize:'0.65rem', color:'var(--text-muted)'}}>POWERED BY ETHEREUM L2 GOVERNANCE ENGINE</span></div>
           <div style={{display:'flex', gap:'1.5rem', color:'var(--text-muted)'}}>
              <span>Terms of Service</span>
              <span>Privacy Policy</span>
              <span>Blockchain Node Status</span>
              <span>API Documentation</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

// SVG Icons for Footer
const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
);
const EyeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const NodesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="8" x="2" y="2" rx="2"></rect><path d="M14 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2"></path><path d="M20 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2"></path><path d="M10 18H5c-1.7 0-3-1.3-3-3v-1"></path><polyline points="7 21 10 18 7 15"></polyline><rect width="8" height="8" x="14" y="14" rx="2"></rect></svg>
);

export default PublicLayout;
