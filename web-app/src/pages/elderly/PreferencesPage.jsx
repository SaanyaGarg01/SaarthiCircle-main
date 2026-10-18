import React, { useState } from 'react';
import { Globe, Bell, Moon, Type } from 'lucide-react';
import i18n from '../../i18n/index.js';

const LANGUAGES = [
  { code: 'en', native: 'English' }, { code: 'hi', native: 'हिन्दी' }, { code: 'bn', native: 'বাংলা' },
  { code: 'ta', native: 'தமிழ்' }, { code: 'te', native: 'తెలుగు' }, { code: 'mr', native: 'मराठी' },
  { code: 'gu', native: 'ગુજરાતી' }, { code: 'kn', native: 'ಕನ್ನಡ' }, { code: 'ml', native: 'മലയാളം' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ' },
];

const PreferencesPage = () => {
  const [lang, setLang] = useState(i18n.language);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('large');

  const changeLang = (code) => {
    setLang(code);
    i18n.changeLanguage(code);
  };

  const Toggle = ({ value, onChange, id }) => (
    <button id={id} onClick={() => onChange(!value)} style={{ width: 52, height: 28, borderRadius: 14, background: value ? 'var(--color-primary-main)' : 'var(--color-medium-gray)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}>
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: value ? 27 : 3, transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
    </button>
  );

  return (
    <div className="page-enter" style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, marginBottom: 'var(--sp-lg)' }}>⚙️ Preferences</h1>

      <div className="card" style={{ marginBottom: 'var(--sp-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', marginBottom: 'var(--sp-lg)' }}>
          <Globe size={24} color="var(--color-primary-main)" />
          <h3>Language</h3>
        </div>
        <div className="grid-2">
          {LANGUAGES.map(l => (
            <button key={l.code} id={`lang-pref-${l.code}`} onClick={() => changeLang(l.code)}
              style={{ padding: 'var(--sp-md)', border: `2px solid ${lang === l.code ? 'var(--color-primary-main)' : 'var(--color-medium-gray)'}`, borderRadius: 'var(--br-md)', background: lang === l.code ? 'var(--color-primary-light)' : 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'var(--font-xs)', fontWeight: lang === l.code ? 700 : 500, color: lang === l.code ? 'var(--color-primary-main)' : 'var(--color-black)', transition: 'all 0.2s' }}>
              {l.native}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)' }}>
        {[
          { icon: Bell, label: 'Push Notifications', sub: 'Alerts for help requests and messages', value: notifications, onChange: setNotifications, id: 'notif-toggle' },
          { icon: Moon, label: 'Dark Mode', sub: 'Easier on the eyes at night', value: darkMode, onChange: setDarkMode, id: 'dark-toggle' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--br-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color="var(--color-primary-main)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>{item.label}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-dark-gray)' }}>{item.sub}</div>
                </div>
              </div>
              <Toggle value={item.value} onChange={item.onChange} id={item.id} />
            </div>
          );
        })}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--br-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Type size={22} color="var(--color-primary-main)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>Font Size</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-dark-gray)' }}>Adjust text size</div>
            </div>
          </div>
          <select id="font-size-select" className="input" style={{ width: 120, minHeight: 44 }} value={fontSize} onChange={e => setFontSize(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="large">Large</option>
            <option value="xlarge">Extra Large</option>
          </select>
        </div>
      </div>
    </div>
  );
};
export default PreferencesPage;
