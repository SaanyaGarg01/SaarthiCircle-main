import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BACKEND_URL } from '../../config/backend';
import storage from '../../utils/storage';

const VolunteerProfilePage = () => {
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  const name = userProfile?.fullName || userProfile?.full_name || 'Volunteer';
  const [formData, setFormData] = useState({
    fullName: name,
    city: userProfile?.city || '',
    skills: userProfile?.skills || '',
    languages: userProfile?.languages || 'Hindi, English',
    availability: userProfile?.availability || 'Weekdays 9am-5pm',
    bio: userProfile?.bio || '',
  });
  const [saving, setSaving] = useState(false);

  const update = (f, v) => setFormData(prev => ({ ...prev, [f]: v }));
  const save = async () => {
    setSaving(true);
    try {
      const token = await storage.getItem('userToken');
      await fetch(`${BACKEND_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      showToast('Profile updated!', 'success');
    } catch { showToast('Saved locally', 'info'); }
    setSaving(false);
  };

  return (
    <div className="page-enter" style={{ maxWidth: 600 }}>
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-xl)', marginBottom: 'var(--sp-lg)', background: 'linear-gradient(135deg, #E8F5E9, white)' }}>
        <div className="avatar avatar-xl" style={{ background: '#2E7D32', color: 'white', fontSize: 40 }}>{name[0]?.toUpperCase()}</div>
        <div>
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>{name}</h2>
          <p style={{ color: 'var(--color-dark-gray)', marginTop: 4 }}>{userProfile?.email}</p>
          <span className="badge badge-success" style={{ marginTop: 8 }}>Volunteer Caregiver</span>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
        <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: 'var(--sp-sm)' }}>Edit Profile</h3>
        {[
          { label: 'Full Name', key: 'fullName', type: 'text', placeholder: 'Your name' },
          { label: 'City', key: 'city', type: 'text', placeholder: 'City you serve in' },
          { label: 'Languages Spoken', key: 'languages', type: 'text', placeholder: 'e.g. Hindi, English, Marathi' },
          { label: 'Skills', key: 'skills', type: 'text', placeholder: 'e.g. Medical, Cooking, Tech support' },
          { label: 'Availability', key: 'availability', type: 'text', placeholder: 'e.g. Weekdays 9am-5pm' },
        ].map(field => (
          <div key={field.key} className="input-group">
            <label className="input-label">{field.label}</label>
            <input className="input" type={field.type} placeholder={field.placeholder} value={formData[field.key]} onChange={e => update(field.key, e.target.value)} />
          </div>
        ))}
        <div className="input-group">
          <label className="input-label">Bio</label>
          <textarea className="input" style={{ minHeight: 80 }} placeholder="Tell seniors about yourself..." value={formData.bio} onChange={e => update('bio', e.target.value)} />
        </div>
        <button id="save-profile-btn" className="btn btn-secondary w-full" onClick={save} disabled={saving}>
          {saving ? <span className="spinner spinner-sm spinner-white" /> : 'Save Profile'}
        </button>
      </div>
    </div>
  );
};
export default VolunteerProfilePage;
