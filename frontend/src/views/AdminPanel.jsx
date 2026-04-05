import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { UserPlus, ShieldX, CheckCircle, Shield } from 'lucide-react';

const AdminPanel = () => {
    const { contract, currentAccount, isAdmin } = useWeb3();
    const [officerAddr, setOfficerAddr] = useState("");
    const [status, setStatus] = useState(null);
    const [logs, setLogs] = useState([]);

    if (!isAdmin) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <ShieldX size={64} style={{ color: 'var(--danger-red)', marginBottom: '1rem' }} />
                <h2 style={{ color: 'var(--text-dark)' }}>Restricted Administrative Canvas</h2>
                <p className="text-muted">Access to this panel is verified via cryptographic signature. Only admins can view this.</p>
            </div>
        );
    }

    const showStatus = (msg, isError=false) => {
        setStatus({ msg, isError });
        setTimeout(() => setStatus(null), 5000);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if(!officerAddr) return showStatus("Address is required", true);
        try {
            showStatus("Authorizing...");
            await contract.methods.addOfficer(officerAddr).send({ from: currentAccount, gas: 150000 });
            showStatus("✅ Officer Authorized Successfully!");
            setLogs(prev => [{addr: officerAddr, action: 'Added', time: new Date().toLocaleTimeString()}, ...prev]);
            setOfficerAddr("");
        } catch (err) {
            showStatus(err.message, true);
        }
    };

    const handleRemove = async (e) => {
        e.preventDefault();
        if(!officerAddr) return showStatus("Address is required", true);
        try {
            showStatus("Revoking...");
            await contract.methods.removeOfficer(officerAddr).send({ from: currentAccount, gas: 150000 });
            showStatus("✅ Officer Access Revoked!");
            setLogs(prev => [{addr: officerAddr, action: 'Revoked', time: new Date().toLocaleTimeString()}, ...prev]);
            setOfficerAddr("");
        } catch (err) {
            showStatus(err.message, true);
        }
    };

    return (
        <div>
            <h4 style={{ textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>GOVERNANCE CONTROL</h4>
            <h1 style={{ color: 'var(--text-dark)', marginBottom: '1rem', fontSize: '2.5rem', letterSpacing: '-0.02em' }}>Admin Management Panel</h1>
            <p className="text-muted" style={{ maxWidth: '600px', marginBottom: '2rem' }}>Maintain the integrity of the ledger by managing authorized officers. Only addresses listed and authorized by the smart contract are permitted to execute cryptographic fund allocations.</p>

            {status && (
                <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', 
                    backgroundColor: status.isError ? 'var(--danger-bg)' : 'var(--success-bg)',
                    color: status.isError ? 'var(--danger-red)' : 'var(--success-green)',
                    border: `1px solid ${status.isError ? '#fca5a5' : '#86efac'}` }}>
                    {status.msg}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'start' }}>
                
                {/* Authorize Form */}
                <div className="card" style={{ background: '#f8fafc', position: 'relative' }}>
                    <div style={{ position: 'absolute', right: '-12px', top: '-12px', background: 'var(--primary-blue)', color: 'white', padding: '10px', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}>
                        <UserPlus size={20} />
                    </div>
                    <h3 style={{ marginBottom: '1.5rem' }}>Authorize Officer</h3>
                    <form>
                        <div className="form-group">
                            <label className="form-label">WALLET ADDRESS</label>
                            <input className="form-control" placeholder="0x..." value={officerAddr} onChange={e=>setOfficerAddr(e.target.value)} />
                        </div>
                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label className="form-label">ASSIGN DEPARTMENT</label>
                            <select className="form-control">
                                <option>Infrastructure & Development</option>
                                <option>Social Welfare</option>
                                <option>Emergency Reserve</option>
                                <option>Public Healthcare</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={handleAdd} className="btn btn-primary" style={{ flex: 1 }}>ADD</button>
                            <button onClick={handleRemove} className="btn" style={{ flex: 1, backgroundColor: 'var(--danger-bg)', color: 'var(--danger-red)' }}>REVOKE</button>
                        </div>
                    </form>

                    <div style={{ marginTop: '2rem', padding: '1rem', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #10b981' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857', fontWeight: 600, marginBottom: '0.5rem' }}>
                           <Shield size={16} /> AUTHORIZATION PROTOCOL
                        </div>
                        <p className="text-small" style={{ color: '#065f46', margin: 0 }}>Adding an officer requires transaction verification. Once confirmed, this address will have full allocation permissions.</p>
                    </div>
                </div>

                {/* Audit Log / Registered View */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Recent Role Modifications</h3>
                    {logs.length > 0 ? (
                        <div className="table-container">
                            <table>
                                <thead style={{ background: '#f8fafc' }}>
                                    <tr>
                                        <th>Address</th>
                                        <th>Action Taken</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log, i) => (
                                        <tr key={i}>
                                            <td style={{ fontFamily: 'monospace', color: 'var(--primary-blue)' }}>{log.addr}</td>
                                            <td>
                                                <span className={`badge ${log.action === 'Added' ? 'badge-success' : 'badge-danger'}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="text-muted text-small">{log.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <CheckCircle size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                            <p>No recent authorization changes pending in your session.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
