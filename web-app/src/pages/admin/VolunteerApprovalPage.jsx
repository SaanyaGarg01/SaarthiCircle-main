import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { BACKEND_URL } from '../../config/backend';
import storage from '../../utils/storage';
import { useToast } from '../../context/ToastContext';

const MOCK = [
  { id: '1', name: 'Priya Sharma', email: 'priya@ex.com', city: 'Mumbai', skills: 'Medical, Hindi', whyVolunteer: 'Want to help elderly in my community', appliedAt: '2 hours ago', status: 'pending' },
  { id: '2', name: 'Rajesh Kumar', email: 'rajesh@ex.com', city: 'Delhi', skills: 'Tech, English', whyVolunteer: 'My grandfather needed volunteers. I want to give back.', appliedAt: '1 day ago', status: 'pending' },
  { id: '3', name: 'Sunita Patel', email: 'sunita@ex.com', city: 'Ahmedabad', skills: 'Gujarati, Cooking', whyVolunteer: 'I have 3 hours free daily and want to do good.', appliedAt: '2 days ago', status: 'approved' },
];

const VolunteerApprovalPage = () => {
  const { showToast } = useToast();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => { loadVolunteers(); }, []);

  const loadVolunteers = async () => {
    setLoading(true);
    try {
      const token = await storage.getItem('userToken');
      const res = await fetch(`${BACKEND_URL}/admin/volunteers/pending`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setVolunteers(data.length ? data : MOCK); }
      else setVolunteers(MOCK);
    } catch { setVolunteers(MOCK); }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    try {
      const token = await storage.getItem('userToken');
      await fetch(`${BACKEND_URL}/admin/volunteers/${id}/${status}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
      setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status } : v));
      showToast(`Volunteer ${status}!`, status === 'approved' ? 'success' : 'info');
    } catch { setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status } : v)); }
  };

  const filtered = volunteers.filter(v => filter === 'all' || v.status === filter);

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: 'var(--font-xxl)', fontWeight: 800, marginBottom: 'var(--sp-lg)' }}>Volunteer Approvals</h1>
      <div style={{ display: 'flex', gap: 'var(--sp-sm)', marginBottom: 'var(--sp-lg)' }}>
        {['pending', 'approved', 'rejected', 'all'].map(f => (
          <button key={f} id={`filter-${f}`} onClick={() => setFilter(f)} style={{ padding: '8px var(--sp-lg)', border: 'none', borderRadius: 'var(--br-full)', background: filter === f ? 'var(--color-primary-main)' : 'white', color: filter === f ? 'white' : 'var(--color-black)', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: 'var(--shadow-sm)', textTransform: 'capitalize' }}>
            {f} ({volunteers.filter(v => f === 'all' || v.status === f).length})
          </button>
        ))}
      </div>
      {loading ? <div style={{ textAlign: 'center', padding: 'var(--sp-xxl)' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
          {filtered.map(v => (
            <div key={v.id} id={`volunteer-${v.id}`} className="card" style={{ borderLeft: `4px solid ${v.status === 'pending' ? 'var(--color-warning)' : v.status === 'approved' ? 'var(--color-success)' : 'var(--color-error)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-md)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 800 }}>{v.name || v.full_name}</h3>
                  <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)' }}>{v.email} • 📍 {v.city}</p>
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-dark-gray)', marginTop: 4 }}>🎯 Skills: {v.skills}</p>
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-dark-gray)', marginTop: 4, fontStyle: 'italic' }}>"{v.whyVolunteer || v.why_volunteer}"</p>
                  <p style={{ fontSize: 13, color: 'var(--color-dark-gray)', marginTop: 6 }}>Applied {v.appliedAt || v.created_at}</p>
                </div>
                <span className={`badge ${v.status === 'pending' ? 'badge-warning' : v.status === 'approved' ? 'badge-success' : 'badge-danger'}`} style={{ textTransform: 'capitalize' }}>
                  {v.status}
                </span>
              </div>
              {v.status === 'pending' && (
                <div style={{ display: 'flex', gap: 'var(--sp-md)', marginTop: 'var(--sp-lg)' }}>
                  <button id={`approve-${v.id}`} className="btn btn-secondary" style={{ flex: 1, minHeight: 48 }} onClick={() => updateStatus(v.id, 'approved')}>
                    <CheckCircle size={18} /> Approve
                  </button>
                  <button id={`reject-${v.id}`} className="btn btn-danger" style={{ flex: 1, minHeight: 48 }} onClick={() => updateStatus(v.id, 'rejected')}>
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-xxl)', color: 'var(--color-dark-gray)' }}>No {filter} applications.</div>}
        </div>
      )}
    </div>
  );
};
export default VolunteerApprovalPage;
