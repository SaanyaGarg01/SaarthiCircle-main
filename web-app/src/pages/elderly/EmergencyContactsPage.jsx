import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Phone } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import storage from '../../utils/storage';

const EmergencyContactsPage = () => {
  const { showToast } = useToast();
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', relationship: '' });

  useEffect(() => {
    const load = async () => {
      const cJson = await storage.getItem('emergencyContacts');
      setContacts(cJson ? JSON.parse(cJson) : [{ name: 'Emergency Services', phone: '112', relationship: 'Emergency' }]);
    };
    load();
  }, []);

  const save = async (updated) => {
    setContacts(updated);
    await storage.setItem('emergencyContacts', JSON.stringify(updated));
  };

  const addContact = async () => {
    if (!form.name.trim() || !form.phone.trim()) { showToast('Name and phone are required', 'error'); return; }
    const updated = [...contacts, { ...form, id: Date.now().toString() }];
    await save(updated);
    setForm({ name: '', phone: '', relationship: '' });
    setShowForm(false);
    showToast('Contact added!', 'success');
  };

  const removeContact = async (idx) => {
    const updated = contacts.filter((_, i) => i !== idx);
    await save(updated);
    showToast('Contact removed', 'info');
  };

  return (
    <div className="page-enter" style={{ maxWidth: 600 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>📞 Emergency Contacts</h1>
        <button id="add-contact-btn" className="btn btn-primary" style={{ minHeight: 48 }} onClick={() => setShowForm(true)}>
          <Plus size={18} /> Add Contact
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 'var(--sp-lg)', background: 'var(--color-primary-light)' }}>
          <h3 style={{ marginBottom: 'var(--sp-lg)' }}>New Emergency Contact</h3>
          <div className="input-group">
            <label className="input-label">Full Name *</label>
            <input className="input" placeholder="Contact name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="input-group">
            <label className="input-label">Phone Number *</label>
            <input className="input" type="tel" placeholder="+91..." value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          </div>
          <div className="input-group">
            <label className="input-label">Relationship</label>
            <input className="input" placeholder="e.g. Son, Daughter, Doctor" value={form.relationship} onChange={e => setForm(p => ({ ...p, relationship: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-md)' }}>
            <button id="save-contact-btn" className="btn btn-primary" style={{ flex: 1 }} onClick={addContact}>Save</button>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
        {contacts.map((c, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-lg)' }} id={`contact-${i}`}>
            <div className="avatar" style={{ background: 'var(--color-secondary-green)', flexShrink: 0 }}>
              {c.name[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{c.name}</div>
              <div style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)' }}>{c.relationship}</div>
              <div style={{ fontWeight: 600, color: 'var(--color-primary-main)', marginTop: 4, fontSize: 'var(--font-sm)' }}>{c.phone}</div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--sp-sm)' }}>
              <a href={`tel:${c.phone}`} className="btn btn-secondary" style={{ minHeight: 44, padding: '0 var(--sp-md)' }}>
                <Phone size={18} />
              </a>
              <button id={`delete-contact-${i}`} className="btn btn-danger" style={{ minHeight: 44, padding: '0 var(--sp-md)' }} onClick={() => removeContact(i)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {contacts.length === 0 && (
          <div className="card" style={{ textAlign: 'center', color: 'var(--color-dark-gray)', padding: 'var(--sp-xxl)' }}>
            No emergency contacts added yet. Add at least one!
          </div>
        )}
      </div>
    </div>
  );
};
export default EmergencyContactsPage;
