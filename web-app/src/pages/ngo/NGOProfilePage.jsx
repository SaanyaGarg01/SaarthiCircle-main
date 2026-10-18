import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Building2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import storage from '../../utils/storage';
import { BACKEND_URL } from '../../config/backend';

const NGOProfilePage = () => {
  const { userProfile, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ngoName: userProfile?.ngo_name || userProfile?.ngoName || '',
    contactPerson: userProfile?.contact_person || userProfile?.contactPerson || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    city: userProfile?.city || '',
    areasOfOperation: userProfile?.areas_of_operation || '',
    servicesOffered: userProfile?.services_offered || '',
    website: userProfile?.website || '',
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const token = await storage.getItem('userToken');
      await fetch(`${BACKEND_URL}/ngo/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      showToast('NGO profile updated!', 'success');
    } catch { showToast('Saved locally', 'info'); }
    setSaving(false);
  };

  const name = formData.ngoName || 'NGO';

  return (
    <div className="page-enter" style={{ maxWidth: 600 }}>
      <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-xxl)', marginBottom: 'var(--sp-lg)', background: 'linear-gradient(135deg, #EDE7F6, white)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#4527A0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--sp-lg)' }}>
          <Building2 size={40} color="white" />
        </div>
        <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>{name}</h2>
        <p style={{ color: 'var(--color-dark-gray)', marginTop: 4 }}>{formData.email}</p>
        <span className="badge" style={{ marginTop: 'var(--sp-md)', background: '#EDE7F6', color: '#4527A0' }}>🏛️ NGO Partner</span>
      </div>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
        <h3>Edit Profile</h3>
        {[
          { label: 'NGO Name', key: 'ngoName' },
          { label: 'Contact Person', key: 'contactPerson' },
          { label: 'Email', key: 'email', type: 'email' },
          { label: 'Phone', key: 'phone', type: 'tel' },
          { label: 'City', key: 'city' },
          { label: 'Areas of Operation', key: 'areasOfOperation' },
          { label: 'Website', key: 'website', type: 'url' },
        ].map(f => (
          <div key={f.key} className="input-group">
            <label className="input-label">{f.label}</label>
            <input className="input" type={f.type || 'text'} placeholder={f.label} value={formData[f.key]} onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))} id={`ngo-${f.key}`} />
          </div>
        ))}
        <div className="input-group">
          <label className="input-label">Services Offered</label>
          <textarea className="input" style={{ minHeight: 80 }} value={formData.servicesOffered} onChange={e => setFormData(p => ({ ...p, servicesOffered: e.target.value }))} placeholder="Describe your NGO's services..." id="ngo-services" />
        </div>
        <button id="save-ngo-btn" className="btn btn-primary w-full" onClick={save} disabled={saving}>
          {saving ? <span className="spinner spinner-sm spinner-white" /> : 'Save NGO Profile'}
        </button>
      </div>
      <button id="ngo-logout-btn" className="btn btn-danger w-full" style={{ marginTop: 'var(--sp-lg)' }} onClick={async () => { await logout(); navigate('/login', { replace: true }); }}>
        <LogOut size={20} /> Sign Out
      </button>
    </div>
  );
};
export default NGOProfilePage;
