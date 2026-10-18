import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Heart, Settings, Phone, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const name = userProfile?.fullName || userProfile?.full_name || userProfile?.name || 'Friend';
  const email = userProfile?.email || '';
  const city = userProfile?.city || '';

  const MENU = [
    { icon: User, label: 'Personal Information', to: '/elderly/health', desc: 'Edit your name, age, city' },
    { icon: Heart, label: 'Health Information', to: '/elderly/health', desc: 'Medical details & conditions' },
    { icon: Settings, label: 'Preferences', to: '/elderly/preferences', desc: 'Language, notifications' },
    { icon: Phone, label: 'Emergency Contacts', to: '/elderly/emergency-contacts', desc: 'Contacts for SOS alerts' },
  ];

  return (
    <div className="page-enter" style={{ maxWidth: 600 }}>
      {/* Profile card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-xl)', marginBottom: 'var(--sp-lg)', padding: 'var(--sp-xl)', background: 'linear-gradient(135deg, var(--color-primary-light), white)' }}>
        <div className="avatar avatar-xl" style={{ background: 'var(--color-primary-main)', color: 'white', fontSize: 40 }}>
          {name[0]?.toUpperCase()}
        </div>
        <div>
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>{name}</h2>
          {email && <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)', marginTop: 4 }}>{email}</p>}
          {city && <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)', marginTop: 2 }}>📍 {city}</p>}
          <span className="badge badge-success" style={{ marginTop: 8 }}>Senior Member</span>
        </div>
      </div>

      {/* Menu items */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {MENU.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              id={`profile-${item.label.toLowerCase().replace(/ /g, '-')}-btn`}
              onClick={() => navigate(item.to)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--sp-lg)', padding: 'var(--sp-lg) var(--sp-xl)',
                background: 'none', border: 'none', borderBottom: i < MENU.length - 1 ? '1px solid var(--color-light-gray)' : 'none',
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-light-gray)'}
              onMouseLeave={e => e.currentTarget.style.background = ''}
            >
              <div style={{ width: 48, height: 48, borderRadius: 'var(--br-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} color="var(--color-primary-main)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{item.label}</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-dark-gray)', marginTop: 2 }}>{item.desc}</div>
              </div>
              <ChevronRight size={22} color="var(--color-dark-gray)" />
            </button>
          );
        })}
      </div>

      <button
        id="logout-btn"
        className="btn btn-danger w-full"
        style={{ marginTop: 'var(--sp-lg)' }}
        onClick={async () => { await logout(); navigate('/login', { replace: true }); }}
      >
        <LogOut size={20} /> Sign Out
      </button>
    </div>
  );
};
export default ProfilePage;
