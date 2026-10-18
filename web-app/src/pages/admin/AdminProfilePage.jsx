import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminProfilePage = () => {
  const { userProfile, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const name = userProfile?.displayName || userProfile?.full_name || 'Admin';
  const [pwd, setPwd] = useState({ current: '', newPwd: '', confirm: '' });

  return (
    <div className="page-enter" style={{ maxWidth: 600 }}>
      <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-xxl)', marginBottom: 'var(--sp-lg)', background: 'linear-gradient(135deg, #E8EAF6, white)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#3949AB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--sp-lg)' }}>
          <Shield size={40} color="white" />
        </div>
        <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>{name}</h2>
        <p style={{ color: 'var(--color-dark-gray)', marginTop: 4 }}>{userProfile?.email}</p>
        <span className="badge" style={{ marginTop: 'var(--sp-md)', background: '#E8EAF6', color: '#3949AB' }}>🛡️ Administrator</span>
      </div>
      <div className="card" style={{ marginBottom: 'var(--sp-lg)' }}>
        <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: 'var(--sp-lg)' }}>Change Password</h3>
        {[
          { label: 'Current Password', key: 'current' },
          { label: 'New Password', key: 'newPwd' },
          { label: 'Confirm New Password', key: 'confirm' },
        ].map(f => (
          <div key={f.key} className="input-group">
            <label className="input-label">{f.label}</label>
            <input className="input" type="password" placeholder="••••••••" value={pwd[f.key]} onChange={e => setPwd(p => ({ ...p, [f.key]: e.target.value }))} id={`admin-pwd-${f.key}`} />
          </div>
        ))}
        <button id="change-pwd-btn" className="btn btn-primary w-full" onClick={() => showToast('Password update would go to backend', 'info')}>Update Password</button>
      </div>
      <button id="admin-logout-btn" className="btn btn-danger w-full" onClick={async () => { await logout(); navigate('/login', { replace: true }); }}>
        <LogOut size={20} /> Sign Out
      </button>
    </div>
  );
};
export default AdminProfilePage;
