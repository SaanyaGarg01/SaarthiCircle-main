import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, Mic, MicOff, PhoneOff, Smile } from 'lucide-react';
import { BACKEND_URL } from '../../config/backend';
import { getSocket, joinSession, sendMessage as socketSendMessage } from '../../services/socketService';
import storage from '../../utils/storage';
import './ChatPage.css';

const PROMPTS = [
  { id: 1, text: 'Talk about childhood memories', icon: '🧠' },
  { id: 2, text: "Discuss today's news", icon: '📰' },
  { id: 3, text: 'Share a favourite song', icon: '🎵' },
  { id: 4, text: 'Talk about family', icon: '👨‍👩‍👧' },
];

const ChatPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const companion = state?.companion;
  const conversationId = state?.conversationId;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef();
  const recognitionRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const profileJson = await storage.getItem('userProfile');
      const profile = profileJson ? JSON.parse(profileJson) : {};
      setCurrentUserId(profile?.id);

      if (conversationId) {
        loadHistory(conversationId, profile?.id);
        const socket = getSocket();
        joinSession(conversationId);
        socket.on('new_message', (msg) => {
          setMessages(prev => [...prev, normalizeMsg(msg, profile?.id, companion)]);
        });
      }
    };
    init();
    return () => { getSocket().off('new_message'); };
  }, [conversationId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async (convId, userId) => {
    try {
      const token = await storage.getItem('userToken');
      const res = await fetch(`${BACKEND_URL}/conversations/${convId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((data.messages || data).map(m => normalizeMsg(m, userId, companion)));
      }
    } catch { }
  };

  const normalizeMsg = (m, userId, companion) => ({
    id: m.id || Date.now(),
    text: m.content || m.text || '',
    sender: (m.sender_id || m.senderId) === (companion?.id) ? 'companion' : 'user',
    timestamp: new Date(m.sent_at || m.created_at || Date.now()),
  });

  const sendMsg = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    setSending(true);

    const localMsg = { id: Date.now(), text, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, localMsg]);

    try {
      const token = await storage.getItem('userToken');
      if (conversationId) {
        socketSendMessage({ conversationId, content: text, token });
      } else {
        await fetch(`${BACKEND_URL}/help-requests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ help_type: 'text_chat', description: text }),
        });
      }
    } catch { }
    setSending(false);
  };

  const toggleVoice = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!listening) {
        const r = new SR();
        r.lang = 'hi-IN';
        r.continuous = false;
        r.onresult = (e) => { setInput(prev => prev + ' ' + e.results[0][0].transcript); };
        r.onend = () => setListening(false);
        r.start();
        recognitionRef.current = r;
        setListening(true);
      } else {
        recognitionRef.current?.stop();
        setListening(false);
      }
    }
  };

  const companionName = companion?.name || companion?.full_name || 'Your Companion';

  return (
    <div className="chat-page page-enter">
      {/* Header */}
      <div className="chat-header">
        <div className="avatar" style={{ background: 'var(--color-primary-main)', color: 'white' }}>
          {companionName[0]?.toUpperCase()}
        </div>
        <div>
          <h3>{companionName}</h3>
          <span className="badge badge-success">Online</span>
        </div>
        <button className="btn btn-danger" style={{ marginLeft: 'auto', minHeight: 44 }} onClick={() => navigate('/elderly/home')} id="end-chat-btn">
          <PhoneOff size={18} /> End
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="chat-prompts">
            <p style={{ color: 'var(--color-dark-gray)', textAlign: 'center', marginBottom: 'var(--sp-lg)', fontSize: 'var(--font-sm)' }}>
              Start the conversation! Try one of these:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
              {PROMPTS.map(p => (
                <button key={p.id} className="prompt-btn" onClick={() => setInput(p.text)} id={`prompt-${p.id}`}>
                  {p.icon} {p.text}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`chat-bubble-wrap ${msg.sender === 'user' ? 'outgoing' : 'incoming'}`}>
            <div className={`chat-bubble ${msg.sender}`}>
              {msg.text}
              <div className="msg-time">{msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input-row">
        <button
          id="voice-input-btn"
          className={`voice-toggle ${listening ? 'active' : ''}`}
          onClick={toggleVoice}
          title="Voice input"
        >
          {listening ? <MicOff size={22} /> : <Mic size={22} />}
        </button>
        <input
          id="chat-input"
          className="input chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg()}
        />
        <button id="send-btn" className="btn btn-primary send-btn" onClick={sendMsg} disabled={sending || !input.trim()}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
export default ChatPage;
