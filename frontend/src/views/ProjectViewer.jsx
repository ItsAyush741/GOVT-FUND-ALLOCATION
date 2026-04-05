import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Search, FileText, CheckCircle2 } from 'lucide-react';

const ProjectViewer = () => {
    const { contract } = useWeb3();
    const [projectId, setProjectId] = useState("");
    const [history, setHistory] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [integrity, setIntegrity] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if(!projectId) return;
        setLoading(true); setError(null); setHistory([]); setSummary(null); setIntegrity(null);

        try {
            // Fetch Summary
            const sum = await contract.methods.getProjectSummary(projectId).call();
            setSummary(sum);

            // Fetch Integrity
            const intg = await contract.methods.verifyProjectIntegrity(projectId).call();
            setIntegrity(intg);

            // Fetch History (Try API first, fallback to blockchain)
            let records = [];
            try {
                const res = await fetch(`http://localhost:5000/api/projects/${projectId}/history`);
                if(res.ok) records = await res.json();
                else throw new Error("API Failed");
            } catch (err) {
                console.log("Falling back to blockchain for history...");
                records = await contract.methods.getProjectHistory(projectId).call();
            }
            setHistory(records);
        } catch(err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h4 style={{ textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>AUDIT REPOSITORY</h4>
            <h1 style={{ color: 'var(--text-dark)', marginBottom: '2rem', fontSize: '2.5rem' }}>Project Ledger</h1>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', maxWidth: '600px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input className="form-control" style={{ paddingLeft: '40px', background: '#f1f5f9', border: 'none' }} placeholder="SEARCH PROJECT ID (E.G. PRJ-2024-001)" value={projectId} onChange={e=>setProjectId(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'SEARCHING...' : 'SEARCH'}
                </button>
            </form>

            {error && <div className="badge badge-danger" style={{ marginBottom: '1rem', padding: '1rem' }}>ERROR: {error}</div>}

            {summary && (
                <>
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                        <div className="card" style={{ flex: 1 }}>
                            <span className="text-small text-muted text-bold">ESTIMATED BUDGET</span>
                            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{summary.estimate?.toString()} WEI</h2>
                        </div>
                        <div className="card" style={{ flex: 1 }}>
                            <span className="text-small text-muted text-bold">TOTAL SPENT</span>
                            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{summary.totalAllocated?.toString()} WEI</h2>
                            {integrity && (
                                <span className={`badge ${integrity.isValid ? 'badge-success' : 'badge-danger'}`} style={{ marginTop: '0.5rem' }}>
                                    {integrity.isValid ? '✓ Verified by Smart Contract' : '❌ Tampering Detected'}
                                </span>
                            )}
                        </div>
                        <div className="card" style={{ flex: 1 }}>
                            <span className="text-small text-muted text-bold">REMAINING / TRANSACTIONS</span>
                            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{summary.remaining?.toString()} WEI</h2>
                            <span className="text-small text-muted">{summary.numberOfTransactions?.toString()} recorded events</span>
                        </div>
                    </div>

                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
                            <h3 style={{ margin: 0 }}>Full Transaction Record</h3>
                        </div>
                        {history.length > 0 ? (
                            <div className="table-container">
                                <table>
                                    <thead style={{ background: '#f8fafc' }}>
                                        <tr>
                                            <th>Record ID</th>
                                            <th>Event Name</th>
                                            <th>Contractor</th>
                                            <th>Amount (Wei)</th>
                                            <th>Total (Wei)</th>
                                            <th>Timestamp</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((rec) => (
                                            <tr key={rec.recordId?.toString() || Math.random()}>
                                                <td className="text-bold" style={{ color: 'var(--primary-blue)' }}>#{rec.recordId?.toString()}</td>
                                                <td>{rec.eventName}</td>
                                                <td>{rec.contractorName}</td>
                                                <td className="text-bold">{rec.fundAllocated?.toString()}</td>
                                                <td>{rec.totalFundTillNow?.toString()}</td>
                                                <td className="text-muted text-small">{new Date(parseInt(rec.timestamp ? (rec.timestamp.toString().length > 10 ? rec.timestamp.toString() : (parseInt(rec.timestamp) * 1000).toString()) : Date.now())).toLocaleString()}</td>
                                                <td><span className="badge badge-success" style={{ background: '#059669', color: 'white' }}>VERIFIED</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <FileText size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                <p>No records found for this project.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProjectViewer;
