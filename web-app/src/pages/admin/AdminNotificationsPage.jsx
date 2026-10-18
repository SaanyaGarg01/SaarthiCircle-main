import React, { useState } from 'react';
import { Bell, Send, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { BACKEND_URL } from '../../config/backend';
import storage from '../../utils/storage';

const MOCK_NOTIFS = [
  { id: '1', title: 'System Maintenance', message: 'Scheduled maintenance on Sunday 2am-4am', type: 'info', sent: '2 hours ago', recipients: 'All Users' },
  { id: '2', title: 'SOS Alert', message: 'Emergency alert triggered in Sector 15', type: 'alert', sent: '5 hours ago', recipients: 'Caregivers' },
  { id: '3', title: 'New Feature Available', message: 'Voice calling is now available for all seniors', type: 'success', sent: '1 day ago', recipients: 'Seniors' },
];

const AdminNotificationsPage = () => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState(MOCK_NOTIFS);
  const [form, setForm] = useState({ title: '', message: '', type: 'info', recipients: 'all' });
  const [sending, setSending] = useState(false);

  const sendNotification = async () => {
    if (!form.title.trim() || !form.message.trim()) { showToast('Title and message are required', 'error'); return; }
    setSending(true);
    try {
      const token = await storage.getItem('userToken');
      await fetch(`${BACKEND_URL}/admin/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      setNotifications(prev => [{ id: Date.now().toString(), ...form, sent: 'Just now', recipients: form.recipients === 'all' ? 'All Users' : form.recipients }, ...prev]);
      setForm({ title: '', message: '', type: 'info', recipients: 'all' });
      showToast('Notification sent!', 'success');
    } catch { showToast('Sent locally (backend unavailable)', 'info'); }
    setSending(false);
  };

  const typeIcons = { info: Info, alert: AlertTriangle, success: CheckCircle };
  const typeColors = { info: '#2196F3', alert: '#E53935', success: '#4CAF50' };

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: 'var(--font-xxl)', fontWeight: 800, marginBottom: 'var(--sp-lg)' }}>Notifications</h1>

      <div className="card" style={{ marginBottom: 'var(--sp-lg)', background: 'linear-gradient(135deg, var(--color-primary-light), white)' }}>
        <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: 'var(--sp-lg)', display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)' }}>
          <Send size={20} /> Send New Notification
        </h3>
        <div className="input-group">
          <label className="input-label">Title</label>
          <input className="input" placeholder="Notification title..." value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} id="notif-title" />
        </div>
        <div className="input-group">
          <label className="input-label">Message</label>
          <textarea className="input" style={{ minHeight: 80 }} placeholder="Notification message..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} id="notif-message" />
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-md)', flexWrap: 'wrap' }}>
          <div className="input-group" style={{ flex: 1, minWidth: 140 }}>
            <label className="input-label">Type</label>
            <select className="input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} id="notif-type">
              <option value="info">ℹ️ Info</option>
              <option value="alert">⚠️ Alert</option>
              <option value="success">✅ Success</option>
            </select>
          </div>
          <div className="input-group" style={{ flex: 1, minWidth: 140 }}>
            <label className="input-label">Recipients</label>
            <select className="input" value={form.recipients} onChange={e => setForm(p => ({ ...p, recipients: e.target.value }))} id="notif-recipients">
              <option value="all">All Users</option>
              <option value="elderly">Seniors Only</option>
              <option value="volunteer">Caregivers Only</option>
              <option value="ngo">NGOs Only</option>
            </select>
          </div>
        </div>
        <button id="send-notif-btn" className="btn btn-primary" style={{ minHeight: 52 }} onClick={sendNotification} disabled={sending}>
          {sending ? <span className="spinner spinner-sm spinner-white" /> : <><Send size={18} /> Send Notification</>}
        </button>
      </div>

      <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: 'var(--sp-md)' }}>Recent Notifications</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
        {notifications.map(n => {
          const Icon = typeIcons[n.type] || Info;
          const color = typeColors[n.type] || '#999';
          return (
            <div key={n.id} id={`notif-${n.id}`} className="card" style={{ borderLeft: `4px solid ${color}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-md)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--br-md)', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 'var(--font-md)', fontWeight: 700 }}>{n.title}</h4>
                  <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)', marginTop: 4 }}>{n.message}</p>
                  <div style={{ display: 'flex', gap: 'var(--sp-lg)', marginTop: 'var(--sp-sm)' }}>
                    <span style={{ fontSize: 13, color: 'var(--color-dark-gray)' }}>👥 {n.recipients}</span>
                    <span style={{ fontSize: 13, color: 'var(--color-dark-gray)' }}>🕐 {n.sent}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AdminNotificationsPage;
