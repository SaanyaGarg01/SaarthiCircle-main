import React, { useState, useEffect } from 'react';
import { Brain, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';
import { BACKEND_URL } from '../../config/backend';
import storage from '../../utils/storage';

const MOCK_RISKS = [
  { id: '1', seniorName: 'Sharma Ji', riskScore: 87, riskLevel: 'high', factors: ['Isolation detected', 'Missed 3 check-ins', 'Mood: Sad for 5 days'], lastActive: '3 days ago', city: 'Delhi' },
  { id: '2', seniorName: 'Verma Aunty', riskScore: 65, riskLevel: 'medium', factors: ['Irregular sleep pattern', 'Medication reminder missed'], lastActive: '1 day ago', city: 'Noida' },
  { id: '3', seniorName: 'Gupta Uncle', riskScore: 42, riskLevel: 'low', factors: ['Occasional mood dip'], lastActive: '2 hours ago', city: 'Pune' },
  { id: '4', seniorName: 'Patel Ji', riskScore: 91, riskLevel: 'critical', factors: ['SOS history', 'No family contact in 7 days', 'Health deteriorating'], lastActive: '5 days ago', city: 'Mumbai' },
];

const riskColors = { critical: '#E53935', high: '#FF8C42', medium: '#FFC107', low: '#4CAF50' };
const riskBg = { critical: '#FFEBEE', high: '#FFF3E0', medium: '#FFF8E1', low: '#E8F5E9' };

const AIRiskDashboardPage = () => {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadRisks(); }, []);

  const loadRisks = async () => {
    setLoading(true);
    try {
      const token = await storage.getItem('userToken');
      const res = await fetch(`${BACKEND_URL}/admin/ai-risk`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setRisks(data.length ? data : MOCK_RISKS); }
      else setRisks(MOCK_RISKS);
    } catch { setRisks(MOCK_RISKS); }
    setLoading(false);
  };

  const filtered = risks.filter(r => filter === 'all' || r.riskLevel === filter);

  return (
    <div className="page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-lg)', flexWrap: 'wrap', gap: 'var(--sp-md)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-xxl)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)' }}>
            <Brain size={32} color="var(--color-primary-main)" /> AI Risk Dashboard
          </h1>
          <p style={{ color: 'var(--color-dark-gray)', marginTop: 4 }}>AI-powered early warning system for at-risk seniors</p>
        </div>
        <button id="refresh-risk-btn" className="btn btn-ghost" style={{ minHeight: 44 }} onClick={loadRisks}><RefreshCw size={18} /> Refresh</button>
      </div>

      {/* Summary */}
      <div className="grid-4" style={{ marginBottom: 'var(--sp-xl)' }}>
        {['critical', 'high', 'medium', 'low'].map(level => (
          <div key={level} id={`risk-${level}`} className="stat-card" style={{ borderTop: `4px solid ${riskColors[level]}`, cursor: 'pointer' }} onClick={() => setFilter(level)}>
            <div className="stat-number" style={{ color: riskColors[level] }}>{risks.filter(r => r.riskLevel === level).length}</div>
            <div className="stat-label" style={{ textTransform: 'capitalize' }}>{level} Risk</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 'var(--sp-sm)', marginBottom: 'var(--sp-lg)' }}>
        {['all', 'critical', 'high', 'medium', 'low'].map(f => (
          <button key={f} id={`ai-filter-${f}`} onClick={() => setFilter(f)} style={{ padding: '8px var(--sp-md)', border: 'none', borderRadius: 'var(--br-full)', background: filter === f ? riskColors[f] || 'var(--color-primary-main)' : 'white', color: filter === f ? 'white' : 'var(--color-black)', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: 'var(--shadow-sm)', textTransform: 'capitalize' }}>
            {f}
          </button>
        ))}
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 'var(--sp-xxl)' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
          {filtered.map(r => (
            <div key={r.id} id={`risk-card-${r.id}`} className="card" style={{ borderLeft: `4px solid ${riskColors[r.riskLevel]}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-md)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 800 }}>{r.seniorName || r.senior_name}</h3>
                  <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)', marginTop: 2 }}>📍 {r.city} • Last active {r.lastActive || r.last_active}</p>
                  <div style={{ margin: 'var(--sp-md) 0' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Risk Factors:</p>
                    {(r.factors || []).map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <AlertTriangle size={14} color={riskColors[r.riskLevel]} />
                        <span style={{ fontSize: 13, color: 'var(--color-dark-gray)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-sm)' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: riskBg[r.riskLevel], border: `4px solid ${riskColors[r.riskLevel]}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: riskColors[r.riskLevel] }}>{r.riskScore}</span>
                    <span style={{ fontSize: 10, color: 'var(--color-dark-gray)' }}>Risk Score</span>
                  </div>
                  <span style={{ background: riskBg[r.riskLevel], color: riskColors[r.riskLevel], padding: '4px 12px', borderRadius: 'var(--br-full)', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>{r.riskLevel}</span>
                </div>
              </div>
              {(r.riskLevel === 'critical' || r.riskLevel === 'high') && (
                <div style={{ display: 'flex', gap: 'var(--sp-md)', marginTop: 'var(--sp-md)' }}>
                  <button id={`action-${r.id}`} className="btn btn-danger" style={{ flex: 1, minHeight: 48 }}>
                    🚨 Take Immediate Action
                  </button>
                  <button className="btn btn-ghost" style={{ flex: 1, minHeight: 48 }}>
                    📞 Contact Family
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AIRiskDashboardPage;
