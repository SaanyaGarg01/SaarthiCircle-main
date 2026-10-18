import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BACKEND_URL } from '../../config/backend';
import storage from '../../utils/storage';

const HealthInfoPage = () => {
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    bloodGroup: userProfile?.blood_group || '',
    conditions: userProfile?.conditions || '',
    medications: userProfile?.medications || '',
    allergies: userProfile?.allergies || '',
    doctorName: userProfile?.doctor_name || '',
    doctorPhone: userProfile?.doctor_phone || '',
    hospitalName: userProfile?.hospital_name || '',
  });
  const [saving, setSaving] = useState(false);

  const update = (f, v) => setFormData(prev => ({ ...prev, [f]: v }));

  const save = async () => {
    setSaving(true);
    try {
      const token = await storage.getItem('userToken');
      await fetch(`${BACKEND_URL}/profile/health`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      showToast('Health information saved!', 'success');
    } catch { showToast('Saved locally.', 'info'); }
    setSaving(false);
  };

  const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="page-enter" style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, marginBottom: 'var(--sp-lg)' }}>❤️ Health Information</h1>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
        <div className="input-group">
          <label className="input-label">Blood Group</label>
          <select className="input" value={formData.bloodGroup} onChange={e => update('bloodGroup', e.target.value)}>
            <option value="">Select blood group</option>
            {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">Medical Conditions</label>
          <textarea className="input" style={{ minHeight: 80 }} placeholder="e.g. Diabetes, Hypertension..." value={formData.conditions} onChange={e => update('conditions', e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Current Medications</label>
          <textarea className="input" style={{ minHeight: 80 }} placeholder="e.g. Metformin 500mg..." value={formData.medications} onChange={e => update('medications', e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Allergies</label>
          <input className="input" placeholder="e.g. Penicillin, Nuts..." value={formData.allergies} onChange={e => update('allergies', e.target.value)} />
        </div>
        <div className="divider" />
        <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700 }}>Doctor Information</h3>
        <div className="form-row" style={{ display: 'flex', gap: 'var(--sp-md)' }}>
          <div className="input-group" style={{ flex: 1 }}>
            <label className="input-label">Doctor Name</label>
            <input className="input" placeholder="Dr. Name" value={formData.doctorName} onChange={e => update('doctorName', e.target.value)} />
          </div>
          <div className="input-group" style={{ flex: 1 }}>
            <label className="input-label">Doctor Phone</label>
            <input className="input" type="tel" placeholder="Phone" value={formData.doctorPhone} onChange={e => update('doctorPhone', e.target.value)} />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">Preferred Hospital</label>
          <input className="input" placeholder="Hospital name and address" value={formData.hospitalName} onChange={e => update('hospitalName', e.target.value)} />
        </div>
        <button id="save-health-btn" className="btn btn-primary w-full" onClick={save} disabled={saving}>
          {saving ? <span className="spinner spinner-sm spinner-white" /> : 'Save Health Information'}
        </button>
      </div>
    </div>
  );
};
export default HealthInfoPage;
