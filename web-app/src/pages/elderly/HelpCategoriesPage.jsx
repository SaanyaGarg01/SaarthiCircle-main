import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, Heart, ShoppingCart, Smartphone, Car, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CATEGORIES = [
  { id: 'medical', icon: Pill, label: 'Medical Help', desc: 'Medicine, appointments', color: '#E53935', bg: '#FFEBEE' },
  { id: 'emotional', icon: Heart, label: 'Emotional Support', desc: 'Talk to someone', color: '#8FBC8F', bg: '#E8F5E9' },
  { id: 'grocery', icon: ShoppingCart, label: 'Grocery Shopping', desc: 'Daily essentials', color: '#FF8C42', bg: '#FFF3E0' },
  { id: 'tech', icon: Smartphone, label: 'Tech Help', desc: 'Phone, tablet, computer', color: '#5B9BD5', bg: '#E8F4FD' },
  { id: 'transport', icon: Car, label: 'Transport', desc: 'Getting around', color: '#7B68EE', bg: '#EDE7F6' },
  { id: 'daily', icon: Users, label: 'Daily Assistance', desc: 'Household tasks', color: '#26A69A', bg: '#E0F2F1' },
];

const HelpCategoriesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSelect = (cat) => {
    navigate('/elderly/help/processing', { state: { category: cat } });
  };

  return (
    <div className="page-enter" style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 'var(--sp-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>{t('help.title')}</h1>
        <p style={{ color: 'var(--color-dark-gray)', marginTop: 8, fontSize: 'var(--font-sm)' }}>{t('help.subtitle')}</p>
      </div>
      <div className="grid-2">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              id={`help-cat-${cat.id}`}
              onClick={() => handleSelect(cat)}
              style={{
                background: cat.bg, border: `2px solid ${cat.color}40`, borderRadius: 'var(--br-lg)',
                padding: 'var(--sp-xl)', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)',
                transition: 'all 0.2s', minHeight: 130,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 'var(--br-md)', background: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={28} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--color-black)' }}>{cat.label}</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-dark-gray)', marginTop: 4 }}>{cat.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default HelpCategoriesPage;
