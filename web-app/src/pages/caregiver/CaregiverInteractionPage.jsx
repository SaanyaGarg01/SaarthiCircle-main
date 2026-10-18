import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, Phone, Send, PhoneOff } from 'lucide-react';
import { BACKEND_URL } from '../../config/backend';
import { getSocket, joinSession, sendMessage as socketSend } from '../../services/socketService';
import storage from '../../utils/storage';
import { useToast } from '../../context/ToastContext';

const CaregiverInteractionPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { showToast } = useToast();
  const request = state?.request;
  const conversationId = state?.conversationId;
  const [mode, setMode] = useState('text');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef();

  const seniorName = request?.seniorName || request?.senior_name || 'Senior';

  useEffect(() => {
    if (conversationId) {
      const socket = getSocket();
      joinSession(conversationId);
      socket.on('new_message', (msg) => {
        setMessages(prev => [...prev, { id: Date.now(), text: msg.content || msg.text, sender: 'senior', time: new Date() }]);
      });
      return () => socket.off('new_message');
    }
  }, [conversationId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMsg = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    const local = { id: Date.now(), text, sender: 'caregiver', time: new Date() };
    setMessages(prev => [...prev, local]);
    setSending(true);
    try {
      const token = await storage.getItem('userToken');
      if (conversationId) {
        socketSend({ conversationId, content: text, token });
      } else {
        await fetch(`${BACKEND_URL}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ content: text, request_id: request?.id }),
        });
      }
    } catch { }
    setSending(false);
  };

  const endSession = () => {
    showToast('Session ended', 'info');
    navigate('/caregiver/dashboard');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-h))', maxWidth: 700 }}>
      {/* Header */}
      <div className="card" style={{ borderRadius: 'var(--br-lg) var(--br-lg) 0 0', display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', flexShrink: 0 }}>
        <div className="avatar avatar-lg" style={{ background: 'var(--color-secondary-green)', color: 'white' }}>
          {seniorName[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 800 }}>{seniorName}</h3>
          <p style={{ color: 'var(--color-dark-gray)', fontSize: 'var(--font-xs)' }}>{request?.helpType || 'Assistance Requested'}</p>
          <span className="badge badge-success">Active Session</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-sm)' }}>
          <button id="mode-voice-btn" className={`btn ${mode === 'voice' ? 'btn-primary' : 'btn-ghost'}`} style={{ minHeight: 44 }} onClick={() => setMode('voice')}>
            <Phone size={18} /> Voice
          </button>
          <button id="mode-text-btn" className={`btn ${mode === 'text' ? 'btn-primary' : 'btn-ghost'}`} style={{ minHeight: 44 }} onClick={() => setMode('text')}>
            <MessageCircle size={18} /> Chat
          </button>
          <button id="end-session-btn" className="btn btn-danger" style={{ minHeight: 44 }} onClick={endSession}>
            <PhoneOff size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 'var(--sp-lg)', background: 'var(--color-light-gray)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--color-dark-gray)', padding: 'var(--sp-xxl)' }}>
            <div style={{ fontSize: 48, marginBottom: 'var(--sp-md)' }}>💬</div>
            <p style={{ fontSize: 'var(--font-sm)' }}>Session started. Say hello to {seniorName}!</p>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'caregiver' ? 'flex-end' : 'flex-start' }}>
            <div className={`chat-bubble ${msg.sender === 'caregiver' ? 'user' : 'companion'}`}>
              {msg.text}
              <div className="msg-time">{msg.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 'var(--sp-sm)', padding: 'var(--sp-md)', background: 'white', borderTop: '1px solid var(--color-medium-gray)' }}>
        <input
          id="caregiver-chat-input"
          className="input"
          placeholder={`Message ${seniorName}...`}
          style={{ flex: 1, minHeight: 48, borderRadius: 'var(--br-full)' }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMsg()}
        />
        <button id="send-msg-btn" className="btn btn-primary" style={{ borderRadius: '50%', width: 52, height: 52, minHeight: 52, padding: 0 }} onClick={sendMsg} disabled={!input.trim()}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
export default CaregiverInteractionPage;
