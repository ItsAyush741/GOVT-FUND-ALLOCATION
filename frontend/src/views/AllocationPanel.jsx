import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ShieldAlert, Send } from 'lucide-react';

const AllocationPanel = () => {
  const { contract, currentAccount, isAdmin, isOfficer } = useWeb3();
  const [status, setStatus] = useState(null);

  // Estimate State
  const [estPid, setEstPid] = useState("");
  const [estAmt, setEstAmt] = useState("");

  // Allocate State
  const [alPid, setAlPid] = useState("");
  const [alEvent, setAlEvent] = useState("");
  const [alContractor, setAlContractor] = useState("");
  const [alFund, setAlFund] = useState("");
  const [alRemarks, setAlRemarks] = useState("");

  const showStatus = (msg, isError=false) => {
    setStatus({ msg, isError });
    setTimeout(() => setStatus(null), 5000);
  };

  const handleEstimate = async (e) => {
    e.preventDefault();
    if (!estPid || !estAmt) return showStatus("Fill all estimate fields", true);
    try {
      showStatus("Sending transaction...");
      await contract.methods.setProjectEstimate(estPid, estAmt).send({ from: currentAccount, gas: 200000 });
      showStatus("✅ Estimate set successfully!");
      setEstPid(''); setEstAmt('');
    } catch (err) {
      showStatus(err.message, true);
    }
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    if (!alPid || !alEvent || !alContractor || !alFund) return showStatus("Fill required allocation fields", true);
    if (!isOfficer) return showStatus("Not an authorized officer", true);

    try {
      showStatus("Sending transaction...");
      await contract.methods.allocateFund(alPid, alEvent, alContractor, alFund, alRemarks).send({ from: currentAccount, gas: 500000 });
      showStatus("✅ Fund allocated successfully and recorded to blockchain!");
      setAlPid(''); setAlEvent(''); setAlContractor(''); setAlFund(''); setAlRemarks('');
    } catch (err) {
      showStatus(err.message, true);
    }
  };

  return (
    <div>
      <h4 style={{ textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>FINANCIAL INTEGRITY DASHBOARD</h4>
      <h1 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem', fontSize: '2.5rem' }}>Override public funds with <br/> <em style={{fontStyle: 'italic', color: '#0047AB'}}>Absolute Transparency.</em></h1>
      <p className="text-muted" style={{ maxWidth: '600px', marginBottom: '2rem' }}>Configure project parameters and execute cryptographic allocations directly to verified contractor wallets. Each entry is a permanent record of trust.</p>

      {status && (
        <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', 
            backgroundColor: status.isError ? 'var(--danger-bg)' : 'var(--success-bg)',
            color: status.isError ? 'var(--danger-red)' : 'var(--success-green)',
            border: `1px solid ${status.isError ? '#fca5a5' : '#86efac'}` }}>
          {status.msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Admin Estimate Card */}
          {isAdmin && (
            <div className="card" style={{ background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: '#1e293b', color: 'white', padding: '10px', borderRadius: '8px' }}>
                       <ShieldAlert size={20} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0 }}>Set Project Estimate</h3>
                      <span className="text-small text-muted">ADMIN PRIVILEGED ACTION</span>
                    </div>
                 </div>
                 <span className="badge badge-warning">PHASE 1: PLANNING</span>
              </div>

              <form onSubmit={handleEstimate}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">PROJECT ID</label>
                    <input className="form-control" placeholder="e.g. PRJ-2024-001" value={estPid} onChange={e=>setEstPid(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">BUDGET CAP (WEI)</label>
                    <input className="form-control" type="number" placeholder="500000000" value={estAmt} onChange={e=>setEstAmt(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>FINALIZE ESTIMATE</button>
              </form>
            </div>
          )}

          {/* Allocation Card */}
          <div className="card">
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--primary-blue)', color: 'white', padding: '10px', borderRadius: '8px' }}>
                   <Send size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>New Fund Allocation</h3>
                  <span className="text-small text-muted">OFFICER LEVEL EXECUTION</span>
                </div>
             </div>

             <form onSubmit={handleAllocate}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">PROJECT REFERENCE (ID)</label>
                    <input className="form-control" placeholder="e.g. PRJ-2024-001" value={alPid} onChange={e=>setAlPid(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CONTRACTOR NAME</label>
                    <input className="form-control" placeholder="Institutional Wallet Holder" value={alContractor} onChange={e=>setAlContractor(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div className="form-group">
                      <label className="form-label">EVENT NAME</label>
                      <input className="form-control" placeholder="Main Highway Phase 1" value={alEvent} onChange={e=>setAlEvent(e.target.value)} />
                   </div>
                   <div className="form-group">
                      <label className="form-label">ALLOCATION AMOUNT (WEI)</label>
                      <input className="form-control" type="number" placeholder="12500000" value={alFund} onChange={e=>setAlFund(e.target.value)} />
                   </div>
                </div>

                <div className="form-group">
                   <label className="form-label">REMARKS / PURPOSE</label>
                   <textarea className="form-control" rows="3" placeholder="Define the milestone or specific deliverable for this release..." value={alRemarks} onChange={e=>setAlRemarks(e.target.value)} style={{ resize: 'vertical' }}></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>EXECUTE TRANSACTION</button>
             </form>
          </div>
        </div>

        {/* Side Info */}
        <div>
           <div className="card" style={{ background: '#f8fafc', marginBottom: '1rem' }}>
              <span className="text-small text-bold text-muted">TOTAL MANAGED BUDGET (WEI)</span>
              <h2 style={{ color: 'var(--primary-blue)', margin: '0.5rem 0' }}>Dynamic</h2>
              <span className="text-small text-bold" style={{ color: 'var(--success-green)' }}>✔ ON-CHAIN VERIFIED</span>
           </div>

           <div style={{ background: '#0f172a', color: 'white', padding: '2rem 1.5rem', borderRadius: '12px', textAlign: 'center', backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' }}>
              <ShieldAlert size={48} color="rgba(255,255,255,0.1)" style={{ margin: '0 auto 1rem' }} />
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '0.5rem' }}>PROTOCOL INSIGHT</div>
              <p style={{ fontWeight: 600, margin: 0 }}>Every transaction is a digital brick in the wall of public accountability.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationPanel;
