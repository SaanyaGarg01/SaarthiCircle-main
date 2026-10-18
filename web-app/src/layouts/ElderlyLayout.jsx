import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Heart, HelpCircle, AlertTriangle, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ElderlyLayout.css';

const NAV_ITEMS = [
  { to: '/elderly/home', icon: Home, label: 'Home' },
  { to: '/elderly/companion', icon: Heart, label: 'Companion' },
  { to: '/elderly/help', icon: HelpCircle, label: 'Help' },
  { to: '/elderly/sos', icon: AlertTriangle, label: 'SOS' },
  { to: '/elderly/profile', icon: User, label: 'Profile' },
];

const ElderlyLayout = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const doLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const name = userProfile?.fullName || userProfile?.full_name || userProfile?.name || 'Friend';

  return (
    <div className="app-shell elderly-shell">
      {/* Sidebar */}
      <aside className="sidebar elderly-sidebar">
        <div className="sidebar-logo">
          <Heart size={28} color="white" fill="rgba(255,255,255,0.4)" />
          <span>SaathiCircle</span>
        </div>
        <div className="sidebar-user">
          <div className="avatar" style={{ background: 'rgba(255,255,255,0.3)', color: 'white', fontSize: 24 }}>
            {name[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 'var(--font-sm)' }}>{name}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>Senior Member</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={22} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="nav-item logout-btn" onClick={doLogout}>
          <LogOut size={22} />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main */}
      <div className="main-content">
        <div className="topbar elderly-topbar">
          <span style={{ fontWeight: 700, fontSize: 'var(--font-md)', color: 'var(--color-primary-main)' }}>
            Good {getGreeting()}, {name.split(' ')[0]} 🌸
          </span>
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(true)}>
            <Menu size={26} color="var(--color-primary-main)" />
          </button>
        </div>
        <div className="page-body">
          <Outlet />
        </div>
      </div>

      {/* Bottom Nav (mobile) */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu" onClick={e => e.stopPropagation()}>
            <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>
              <X size={24} />
            </button>
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
                <Icon size={22} color="var(--color-primary-main)" />
                <span>{label}</span>
              </NavLink>
            ))}
            <button className="mobile-menu-item logout-item" onClick={doLogout}>
              <LogOut size={22} color="var(--color-accent-red)" />
              <span style={{ color: 'var(--color-accent-red)' }}>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
};

export default ElderlyLayout;
