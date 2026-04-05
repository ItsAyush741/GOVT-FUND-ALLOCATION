import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ShieldCheck, Wallet } from 'lucide-react';
import './PortalSelector.css';

const PortalSelector = () => {
  const { loginAccount, isConnected, providerError, currentAccount } = useWeb3();

  return (
    <div className="portal-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      
      <div className="portal-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--primary-blue)', marginBottom: '1rem' }}>
          <ShieldCheck size={32} />
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>THE SOVEREIGN LEDGER</h2>
        </div>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.03em' }}>Enter Transparency</h1>
        <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Connect your Web3 identity via MetaMask to access the decentralized ledger. Permissions are crypotgraphically evaluated upon entry.
        </p>
      </div>

      <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        {providerError ? (
            <div style={{ padding: '1rem', background: '#fee2e2', color: '#ef4444', borderRadius: '8px', border: '1px solid #fca5a5', marginBottom: '1rem' }}>
              {providerError}
            </div>
        ) : !isConnected ? (
            <div style={{ padding: '1rem', background: '#fef3c7', color: '#d97706', borderRadius: '8px', border: '1px solid #fcd34d', marginBottom: '1rem' }}>
              No Web3 provider detected locally. Wait for initialization or ensure MetaMask is installed.
            </div>
        ) : currentAccount ? (
            <div style={{ padding: '1rem', background: '#ecfdf5', color: '#059669', borderRadius: '8px', border: '1px solid #6ee7b7', marginBottom: '1rem' }}>
              Wallet connected. Reading blockchain permissions...
            </div>
        ) : (
             <button 
                onClick={loginAccount}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem',
                  width: '100%', padding: '1.25rem', background: 'var(--primary-blue)', 
                  color: 'white', borderRadius: '12px', border: 'none',
                  fontSize: '1.125rem', fontWeight: '700', cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 71, 171, 0.3)', transition: 'all 0.2s', margin: '0 auto'
                }}
             >
                <Wallet size={24} />
                Connect MetaMask
             </button>
        )}
      </div>

    </div>
  );
};

export default PortalSelector;
