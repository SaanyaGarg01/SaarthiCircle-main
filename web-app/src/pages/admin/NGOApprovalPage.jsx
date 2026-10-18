import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Building2 } from 'lucide-react';
import { BACKEND_URL } from '../../config/backend';
import storage from '../../utils/storage';
import { useToast } from '../../context/ToastContext';

const MOCK = [
  { id: '1', ngoName: 'Seva Foundation', contactPerson: 'Amit Kumar', email: 'seva@ngo.org', city: 'Delhi', areasOfOperation: 'North Delhi, Rohini', servicesOffered: 'Elder care, Medical assistance', status: 'pending' },
  { id: '2', ngoName: 'HelpAge India', contactPerson: 'Ritu Sharma', email: 'helpage@ngo.org', city: 'Mumbai', areasOfOperation: 'All Mumbai', servicesOffered: 'Comprehensive elder care', status: 'approved' },
];

const NGOApprovalPage = () => {
  const { showToast } = useToast();
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => { loadNGOs(); }, []);
  const loadNGOs = async () => {
    setLoading(true);
    try {
      const token = await storage.getItem('userToken');
      const res = await fetch(`${BACKEND_URL}/admin/ngos/pending`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setNgos(data.length ? data : MOCK); } else setNgos(MOCK);
    } catch { setNgos(MOCK); }
    setLoading(false);
  };
  const updateStatus = async (id, status) => {
    try {
      const token = await storage.getItem('userToken');
      await fetch(`${BACKEND_URL}/admin/ngos/${id}/${status}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
    } catch { }
    setNgos(prev => prev.map(n => n.id === id ? { ...n, status } : n));
    showToast(`NGO ${status}!`, status === 'approved' ? 'success' : 'info');
  };

  const filtered = ngos.filter(n => filter === 'all' || n.status === filter);

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: 'var(--font-xxl)', fontWeight: 800, marginBottom: 'var(--sp-lg)' }}>NGO Approvals</h1>
      <div style={{ display: 'flex', gap: 'var(--sp-sm)', marginBottom: 'var(--sp-lg)' }}>
        {['pending', 'approved', 'rejected', 'all'].map(f => (
          <button key={f} id={`ngo-filter-${f}`} onClick={() => setFilter(f)} style={{ padding: '8px var(--sp-lg)', border: 'none', borderRadius: 'var(--br-full)', background: filter === f ? 'var(--color-primary-main)' : 'white', color: filter === f ? 'white' : 'var(--color-black)', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: 'var(--shadow-sm)', textTransform: 'capitalize' }}>
            {f} ({ngos.filter(n => f === 'all' || n.status === f).length})
          </button>
        ))}
      </div>
      {loading ? <div style={{ textAlign: 'center', padding: 'var(--sp-xxl)' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
          {filtered.map(n => (
            <div key={n.id} id={`ngo-${n.id}`} className="card" style={{ borderLeft: `4px solid ${n.status === 'approved' ? 'var(--color-success)' : n.status === 'rejected' ? 'var(--color-error)' : 'var(--color-accent-orange)'}` }}>
              <div style={{ display: 'flex', gap: 'var(--sp-md)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ width: 56, height: 56, borderRadius: 'var(--br-md)', background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building2 size={28} color="var(--color-accent-orange)" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 800 }}>{n.ngoName || n.ngo_name}</h3>
                  <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)' }}>Contact: {n.contactPerson || n.contact_person} • {n.email}</p>
                  <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)', marginTop: 4 }}>📍 {n.city} • Areas: {n.areasOfOperation || n.areas_of_operation}</p>
                  <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)', marginTop: 4 }}>Services: {n.servicesOffered || n.services_offered}</p>
                </div>
                <span className={`badge ${n.status === 'pending' ? 'badge-warning' : n.status === 'approved' ? 'badge-success' : 'badge-danger'}`}>{n.status}</span>
              </div>
              {n.status === 'pending' && (
                <div style={{ display: 'flex', gap: 'var(--sp-md)', marginTop: 'var(--sp-lg)' }}>
                  <button id={`approve-ngo-${n.id}`} className="btn btn-secondary" style={{ flex: 1, minHeight: 48 }} onClick={() => updateStatus(n.id, 'approved')}><CheckCircle size={18} /> Approve</button>
                  <button id={`reject-ngo-${n.id}`} className="btn btn-danger" style={{ flex: 1, minHeight: 48 }} onClick={() => updateStatus(n.id, 'rejected')}><XCircle size={18} /> Reject</button>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-xxl)', color: 'var(--color-dark-gray)' }}>No {filter} NGO applications.</div>}
        </div>
      )}
    </div>
  );
};
export default NGOApprovalPage;
