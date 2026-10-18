import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { BACKEND_URL } from '../../config/backend';
import storage from '../../utils/storage';

const MOCK = [
  { id: '1', caseId: 'SC-2025-001', senior: 'Sharma Ji', type: 'Medical Help', resolution: 'Medicine delivered, follow-up scheduled', volunteer: 'Priya Sharma', date: '2025-01-15', status: 'resolved' },
  { id: '2', caseId: 'SC-2025-002', senior: 'Verma Aunty', type: 'Emotional Support', resolution: 'Weekly calls arranged with volunteer', volunteer: 'Rahul Kumar', date: '2025-01-14', status: 'ongoing' },
  { id: '3', caseId: 'SC-2025-003', senior: 'Patel Ji', type: 'Emergency SOS', resolution: 'Hospitalised. Family notified. Discharged after 3 days.', volunteer: 'Sunita Rao', date: '2025-01-12', status: 'resolved' },
];

const NGOCaseHistoryPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await storage.getItem('userToken');
        const res = await fetch(`${BACKEND_URL}/ngo/cases`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) { const data = await res.json(); setCases(data.length ? data : MOCK); } else setCases(MOCK);
      } catch { setCases(MOCK); }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: 'var(--font-xxl)', fontWeight: 800, marginBottom: 'var(--sp-lg)' }}>Case History</h1>
      {loading ? <div style={{ textAlign: 'center', padding: 'var(--sp-xxl)' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
          {cases.map(c => (
            <div key={c.id} id={`case-${c.id}`} className="card" style={{ borderLeft: `4px solid ${c.status === 'resolved' ? 'var(--color-success)' : 'var(--color-warning)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-sm)', marginBottom: 'var(--sp-md)' }}>
                <div>
                  <span style={{ background: 'var(--color-light-gray)', color: 'var(--color-dark-gray)', padding: '3px 10px', borderRadius: 'var(--br-full)', fontSize: 12, fontWeight: 700, marginBottom: 8, display: 'inline-block' }}>#{c.caseId}</span>
                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800 }}>{c.senior}</h3>
                  <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)', marginTop: 4 }}>{c.type} • Handled by {c.volunteer}</p>
                </div>
                <span className={c.status === 'resolved' ? 'badge badge-success' : 'badge badge-warning'}>{c.status === 'resolved' ? '✅ Resolved' : '🔄 Ongoing'}</span>
              </div>
              <div style={{ background: 'var(--color-light-gray)', borderRadius: 'var(--br-md)', padding: 'var(--sp-md)' }}>
                <p style={{ fontSize: 'var(--font-xs)', fontWeight: 600, marginBottom: 4 }}>Resolution Summary:</p>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-dark-gray)' }}>{c.resolution}</p>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-dark-gray)', marginTop: 'var(--sp-sm)' }}>📅 {c.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default NGOCaseHistoryPage;
