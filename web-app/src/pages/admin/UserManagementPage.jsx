import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Ban, CheckCircle } from 'lucide-react';
import { BACKEND_URL } from '../../config/backend';
import storage from '../../utils/storage';
import { useToast } from '../../context/ToastContext';

const MOCK_USERS = [
  { id: '1', name: 'Sharma Ji', email: 'sharma@example.com', role: 'elderly', city: 'Delhi', status: 'active', joinedAt: '2025-01-10' },
  { id: '2', name: 'Priya Sharma', email: 'priya@example.com', role: 'volunteer', city: 'Mumbai', status: 'active', joinedAt: '2025-01-12' },
  { id: '3', name: 'Verma Aunty', email: 'verma@example.com', role: 'elderly', city: 'Noida', status: 'active', joinedAt: '2025-01-15' },
  { id: '4', name: 'Kumar Ji', email: 'kumar@example.com', role: 'volunteer', city: 'Pune', status: 'suspended', joinedAt: '2025-01-20' },
  { id: '5', name: 'Gupta Uncle', email: 'gupta@example.com', role: 'elderly', city: 'Bangalore', status: 'active', joinedAt: '2025-01-22' },
];

const roleColors = { elderly: '#5B9BD5', volunteer: '#4CAF50', admin: '#7B68EE', ngo: '#FF8C42' };

const UserManagementPage = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const token = await storage.getItem('userToken');
      const res = await fetch(`${BACKEND_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setUsers(data.length ? data : MOCK_USERS); }
      else setUsers(MOCK_USERS);
    } catch { setUsers(MOCK_USERS); }
    setLoading(false);
  };

  const filtered = users.filter(u =>
    (roleFilter === 'all' || u.role === roleFilter) &&
    (u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const suspend = (id) => { setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u)); showToast('User status updated', 'success'); };

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: 'var(--font-xxl)', fontWeight: 800, marginBottom: 'var(--sp-lg)' }}>User Management</h1>

      <div style={{ display: 'flex', gap: 'var(--sp-md)', marginBottom: 'var(--sp-lg)', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-dark-gray)' }} />
          <input id="user-search" className="input" style={{ paddingLeft: 44 }} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select id="role-filter" className="input" style={{ width: 160 }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="elderly">Elderly</option>
          <option value="volunteer">Volunteer</option>
          <option value="ngo">NGO</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--sp-xxl)' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F1F5F9' }}>
                {['Name', 'Email', 'Role', 'City', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: 'var(--sp-md)', textAlign: 'left', fontSize: 13, fontWeight: 700, color: 'var(--color-dark-gray)', borderBottom: '1px solid var(--color-medium-gray)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} id={`user-row-${u.id}`} style={{ borderBottom: '1px solid var(--color-light-gray)', background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                  <td style={{ padding: 'var(--sp-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)' }}>
                      <div className="avatar" style={{ width: 36, height: 36, fontSize: 16, background: roleColors[u.role] || 'var(--color-primary-main)' }}>{u.name[0]?.toUpperCase()}</div>
                      <span style={{ fontWeight: 600, fontSize: 'var(--font-xs)' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--sp-md)', fontSize: 'var(--font-xs)', color: 'var(--color-dark-gray)' }}>{u.email}</td>
                  <td style={{ padding: 'var(--sp-md)' }}>
                    <span style={{ background: `${roleColors[u.role] || '#999'}22`, color: roleColors[u.role] || '#999', padding: '4px 10px', borderRadius: 'var(--br-full)', fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>{u.role}</span>
                  </td>
                  <td style={{ padding: 'var(--sp-md)', fontSize: 'var(--font-xs)' }}>{u.city}</td>
                  <td style={{ padding: 'var(--sp-md)' }}>
                    <span className={u.status === 'active' ? 'badge badge-success' : 'badge badge-danger'}>{u.status}</span>
                  </td>
                  <td style={{ padding: 'var(--sp-md)', fontSize: 13, color: 'var(--color-dark-gray)' }}>{u.joinedAt}</td>
                  <td style={{ padding: 'var(--sp-md)' }}>
                    <button id={`toggle-${u.id}`} onClick={() => suspend(u.id)} style={{ background: u.status === 'active' ? 'var(--color-danger-light)' : '#E8F5E9', color: u.status === 'active' ? 'var(--color-accent-red)' : 'var(--color-success)', border: 'none', borderRadius: 'var(--br-sm)', padding: '6px 12px', cursor: 'pointer', fontWeight: 700, fontSize: 12, fontFamily: 'inherit' }}>
                      {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 'var(--sp-xxl)', color: 'var(--color-dark-gray)' }}>No users found</div>}
        </div>
      )}
    </div>
  );
};
export default UserManagementPage;
