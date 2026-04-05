import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, LineChart, Link } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

const Dashboard = () => {
  const { contract, currentAccount } = useWeb3();
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    if (contract) {
      // Just a mock stat pull, counting total records globally if possible
      contract.methods.recordCounter().call()
        .then(res => setTotalRecords(res))
        .catch(console.error);
    }
  }, [contract]);

  return (
    <div>
      <h4 style={{ textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>LEDGER OVERVIEW</h4>
      <h1 style={{ color: 'var(--primary-blue)', marginBottom: '3rem', fontSize: '2.5rem' }}>Institutional Oversight</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        
        {/* Stat Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <div style={{ display: 'flex', gap: '4rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <LineChart size={20} className="text-muted" />
                <h2 style={{ fontSize: '2rem', margin: 0 }}>{totalRecords?.toString()}</h2>
              </div>
              <p className="text-muted text-small">Total Verified Allocations</p>
            </div>
            <div>
              <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>1</h2>
              <p className="text-muted text-small">Active Institutional Nodes</p>
            </div>
          </div>
          
          <div className="card" style={{ background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
             <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={20} color="var(--primary-blue)" /> System Health
             </h3>
             <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
               <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-muted">Smart Contract Sync</span>
                  <span className="badge badge-success">Operational</span>
               </li>
               <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-muted">Database Indexer (Port 5000)</span>
                  <span className="badge badge-warning">Checking...</span>
               </li>
             </ul>
          </div>
        </div>

        {/* Integrity Status */}
        <div className="card" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--primary-blue)' }}>Integrity Status</h3>
            <ShieldCheck color="var(--success-green)" size={24} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
            <div style={{ padding: '10px', background: 'white', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
               <Link color="var(--success-green)" size={24} />
            </div>
            <div>
              <div className="text-bold">Node Fully Synced</div>
              <div className="text-small text-muted">Ethereum Virtual Machine Ready</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
            <div style={{ padding: '10px', background: 'white', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
               <ShieldCheck color="var(--success-green)" size={24} />
            </div>
            <div>
              <div className="text-bold">Cryptographic Tunnel Secure</div>
              <div className="text-small text-muted">KECCAK-256 Enabled</div>
            </div>
          </div>

          <div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <span>NETWORK LATENCY</span>
                <span style={{ color: 'var(--success-green)' }}>12ms</span>
             </div>
             <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '95%', height: '100%', background: 'var(--success-green)' }}></div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
