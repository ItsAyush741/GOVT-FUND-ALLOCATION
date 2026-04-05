import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Shield, ShieldCheck, User, Users } from 'lucide-react';
import './PortalSelector.css';

const PortalSelector = () => {
  const { accounts, loginAccount, adminAddress, isConnected } = useWeb3();

  if (!isConnected) {
    return (
      <div className="portal-container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
        <h1 style={{ color: 'var(--primary-blue)' }}>Connecting to Blockchain...</h1>
        <p>Please ensure Ganache is running on port 7545.</p>
      </div>
    );
  }

  return (
    <div className="portal-container">
      <div className="portal-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--primary-blue)', marginBottom: '1rem' }}>
          <ShieldCheck size={32} />
          <h2 style={{ fontSize: '1.5rem', m: 0 }}>THE SOVEREIGN LEDGER</h2>
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', letterSpacing: '-0.03em' }}>Choose Your Portal</h1>
        <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Select an authorized Ganache account to enter the transparency ledger. Each portal grants specific administrative or oversight permissions within the institutional ecosystem.
        </p>
      </div>

      <div className="portal-grid">
        {accounts.map((acc, index) => {
          const isAdmin = adminAddress && acc.toLowerCase() === adminAddress;
          const isOfficer = index === 1 || index === 2 || index === 3; // Mocking officer status visually since we don't have async check per account map
          
          let role = "PUBLIC VIEWER";
          let Icon = User;
          let badgeClass = "badge-role-viewer";
          
          if (isAdmin) {
            role = "ADMIN";
            Icon = ShieldCheck;
            badgeClass = "badge-role-admin";
          } else if (isOfficer) {
            role = "OFFICER";
            Icon = Shield;
            badgeClass = "badge-role-officer";
          }

          return (
            <div className="portal-card" key={acc}>
              <div className={`portal-icon-wrapper ${isAdmin ? 'admin-icon' : ''}`}>
                <Icon size={32} />
              </div>
              <div className="portal-info">
                <span className="text-muted text-small" style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Account {index}</span>
                <h3 style={{ margin: '0.5rem 0', wordBreak: 'break-all', fontSize: '1rem' }}>
                  {acc.substring(0, 6)}...{acc.substring(acc.length - 4)}
                </h3>
                <span className={`badge-role ${badgeClass}`}>{role}</span>
              </div>
              <button className="btn-portal" onClick={() => loginAccount(acc)}>SWITCH TO ACCOUNT</button>
            </div>
          );
        })}
      </div>
{/* 
      <div className="portal-footer">
         Footer stuff here
      </div> */}
    </div>
  );
};

export default PortalSelector;
