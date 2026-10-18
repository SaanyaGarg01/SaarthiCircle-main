import React, { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [activeSession, setActiveSession] = useState(null);
  const [callStatus, setCallStatus] = useState(null);
  const [activeChats, setActiveChats] = useState({});

  const addActiveChat = useCallback((conversationId, companion) => {
    setActiveChats(prev => ({ ...prev, [conversationId]: { companion, messages: [] } }));
  }, []);

  const updateActiveChatMessage = useCallback((conversationId, message) => {
    setActiveChats(prev => {
      const chat = prev[conversationId];
      if (!chat) return prev;
      return { ...prev, [conversationId]: { ...chat, messages: [...chat.messages, message] } };
    });
  }, []);

  const removeActiveChat = useCallback((conversationId) => {
    setActiveChats(prev => {
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });
  }, []);

  return (
    <ChatContext.Provider value={{
      activeSession, setActiveSession,
      callStatus, setCallStatus,
      activeChats, addActiveChat, updateActiveChatMessage, removeActiveChat,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};
