// Socket service for web (mirrors src/services/socketService.js)
import { io } from 'socket.io-client';
import { BACKEND_URL } from '../config/backend';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socket.on('connect', () => console.log('[Socket] Connected:', socket.id));
    socket.on('disconnect', () => console.log('[Socket] Disconnected'));
    socket.on('connect_error', (err) => console.warn('[Socket] Error:', err.message));
  }
  return socket;
};

export const identify = ({ userId, role }) => {
  const s = getSocket();
  s.emit('identify', { userId, role });
};

export const joinSession = (sessionId) => {
  getSocket().emit('join_session', { sessionId });
};

export const sendMessage = (payload) => {
  getSocket().emit('send_message', payload);
};

export const registerPushToken = async () => {
  // Web push notifications – placeholder
  console.log('[PushToken] Web push not implemented');
};

export default { getSocket, identify, joinSession, sendMessage, registerPushToken };
