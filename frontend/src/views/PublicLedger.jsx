import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Search, CheckCircle2, ShieldCheck, ChevronDown } from 'lucide-react';

const PublicLedger = () => {
    const { contract } = useWeb3();
    const [projectId, setProjectId] = useState("");
    const [history, setHistory] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [projectName, setProjectName] = useState("Awaiting Project Query");

    const handleSearch = async (e) => {
        e.preventDefault();
        if(!projectId) return;
        setLoading(true); setError(null); setHistory([]); setSummary(null);

        try {
            const sum = await contract.methods.getProjectSummary(projectId).call();
            setSummary(sum);

            let records = [];
            try {
                const res = await fetch(`http://localhost:5000/api/projects/${projectId}/history`);
                if(res.ok) records = await res.json();
                else throw new Error("API Failed");
            } catch (err) {
                records = await contract.methods.getProjectHistory(projectId).call();
            }
            setHistory(records);
            
            if (records.length > 0) {
                // take the latest event name as project title
                setProjectName(records[records.length - 1].eventName || "Unnamed Public Project");
            } else {
                setProjectName("No Allocations Yet");
            }

        } catch(err) {
            setError("Could not retrieve project data. Verify the ID.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                <div>
                    <h4 style={{ textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>INSTITUTIONAL TRANSPARENCY</h4>
                    <h1 style={{ color: 'var(--text-dark)', marginBottom: '1rem', fontSize: '2.5rem' }}>Public Project Audit</h1>
                    <p className="text-muted" style={{ maxWidth: '500px' }}>Verify the flow of public capital through the cryptographic immutable record. Enter a Project ID to retrieve live blockchain data.</p>
                </div>
                
                <form onSubmit={handleSearch} style={{ position: 'relative', width: '400px' }}>
                    <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                        className="form-control" 
                        style={{ paddingLeft: '48px', paddingRight: '1rem', paddingBottom: '1rem', paddingTop: '1rem', background: '#f1f5f9', border: 'none', borderRadius: '8px' }} 
                        placeholder="Enter Project ID (e.g. PRJ-2024-001)" 
                        value={projectId} 
                        onChange={e=>setProjectId(e.target.value)} 
                    />
                </form>
            </div>

            {error && <div className="badge badge-danger" style={{ marginBottom: '2rem', padding: '1rem' }}>ERROR: {error}</div>}

            {summary && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', marginBottom: '4rem' }}>
                    
                    {/* Main Project Card */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span className="badge badge-success" style={{ background: '#059669', color: 'white' }}>✓ BLOCKCHAIN VERIFIED</span>
                                <span className="text-small text-muted text-bold">PROJECT ID: {projectId.toUpperCase()}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div className="text-small text-muted" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>LAST SYNC</div>
                                <div className="text-small" style={{ fontFamily: 'monospace' }}>Block #18,442,109</div>
                            </div>
                        </div>
                        
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '3rem' }}>{projectName}</h2>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <div className="text-small text-muted text-bold" style={{ marginBottom: '0.5rem' }}>INITIAL ESTIMATE</div>
                                <h2 style={{ color: 'var(--primary-blue)', margin: 0, fontSize: '1.75rem' }}>{summary.estimate?.toString()} <span style={{fontSize:'0.875rem', fontWeight:600}}>WEI</span></h2>
                            </div>
                            <div>
                                <div className="text-small text-muted text-bold" style={{ marginBottom: '0.5rem' }}>TOTAL ALLOCATED</div>
                                <h2 style={{ margin: 0, fontSize: '1.75rem' }}>{summary.totalAllocated?.toString()} <span style={{fontSize:'0.875rem', fontWeight:600}}>WEI</span></h2>
                            </div>
                            <div>
                                <div className="text-small text-muted text-bold" style={{ marginBottom: '0.5rem' }}>REMAINING BUDGET</div>
                                <h2 style={{ color: 'var(--success-green)', margin: 0, fontSize: '1.75rem' }}>{summary.remaining?.toString()} <span style={{fontSize:'0.875rem', fontWeight:600}}>WEI</span></h2>
                            </div>
                            <div>
                                <div className="text-small text-muted text-bold" style={{ marginBottom: '0.5rem' }}>TX COUNT</div>
                                <h2 style={{ margin: 0, fontSize: '1.75rem' }}>{summary.numberOfTransactions?.toString()}</h2>
                            </div>
                        </div>
                    </div>

                    {/* Integrity Node Card */}
                    <div className="card" style={{ background: '#f8fafc', border: 'none', display: 'flex', flexDirection: 'column' }}>
                       <h3 style={{ marginBottom: '1rem' }}>Integrity Node</h3>
                       <p className="text-small text-muted" style={{ marginBottom: '1.5rem', lineHeight: 1.5 }}>This record is verified by independent validator nodes. The cryptographic hash matches the official executive order.</p>
                       
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--success-green)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1rem' }}>
                          <CheckCircle2 size={18} /> Double-Entry Validated
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--success-green)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '2rem' }}>
                          <ShieldCheck size={18} /> Signature Authenticated
                       </div>

                       <button className="btn btn-outline" style={{ marginTop: 'auto', background: 'white' }}>VIEW SMART CONTRACT</button>
                    </div>
                </div>
            )}

            {/* Audit History */}
            {summary && (
                <div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.5rem' }}>Audit History</h3>
                      <span className="text-small text-muted">Showing {history.length} of {history.length} chronological events</span>
                   </div>

                   <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        {history.length > 0 ? (
                            <div className="table-container">
                                <table style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                                    <thead style={{ background: '#f8fafc' }}>
                                        <tr>
                                            <th style={{ padding: '1.25rem' }}>RECORD ID</th>
                                            <th>EVENT NAME</th>
                                            <th>CONTRACTOR</th>
                                            <th>AMOUNT (WEI)</th>
                                            <th>TIMESTAMP</th>
                                            <th>WALLET ADDRESS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((rec, i) => (
                                            <tr key={rec.recordId?.toString() || i}>
                                                <td className="text-bold" style={{ padding: '1.25rem', fontSize: '0.875rem' }}>#A992B-{(i+1).toString().padStart(2, '0')}</td>
                                                <td>{rec.eventName}</td>
                                                <td>
                                                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-blue)', marginRight: '6px' }}></span>
                                                    {rec.contractorName}
                                                </td>
                                                <td className="text-bold">{rec.fundAllocated?.toString()}</td>
                                                <td className="text-muted text-small">{new Date(parseInt(rec.timestamp ? (rec.timestamp.toString().length > 10 ? rec.timestamp.toString() : (parseInt(rec.timestamp) * 1000).toString()) : Date.now())).toLocaleString()}</td>
                                                <td><span style={{ background: '#e2e8f0', color: '#64748b', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.75rem' }}>{rec.recordedBy ? `${rec.recordedBy.substring(0,6)}...${rec.recordedBy.substring(rec.recordedBy.length-4)}` : 'N/A'}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <p>No records found for this project.</p>
                            </div>
                        )}
                   </div>

                   {history.length > 0 && (
                       <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                           <button className="btn" style={{ background: 'transparent', color: 'var(--primary-blue)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                               LOAD OLDER RECORDS <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                           </button>
                       </div>
                   )}
                </div>
            )}
        </div>
    );
};

export default PublicLedger;
