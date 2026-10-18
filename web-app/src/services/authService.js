// Auth service for web (mirrors src/services/authService.js)
import storage from '../utils/storage';

let authChangeListeners = [];

export const subscribeToAuthChanges = (listener) => {
  authChangeListeners.push(listener);
  return () => {
    authChangeListeners = authChangeListeners.filter(l => l !== listener);
  };
};

const notifyAuthChanges = (isAuthenticated, userRole) => {
  authChangeListeners.forEach(listener => {
    try { listener(isAuthenticated, userRole); } catch (e) { console.error(e); }
  });
};

export const login = async (token, role, profile) => {
  await storage.setItem('userToken', token);
  await storage.setItem('userRole', role);
  await storage.setItem('userProfile', JSON.stringify(profile));
  notifyAuthChanges(true, role);
};

export const logout = async () => {
  try {
    await storage.removeItem('userToken');
    await storage.removeItem('userRole');
    await storage.removeItem('userProfile');
    await storage.clear();
  } catch (e) {
    console.error('Error during logout:', e);
  } finally {
    notifyAuthChanges(false, null);
  }
};

export const checkAuth = async () => {
  const userToken = await storage.getItem('userToken');
  const userRole = await storage.getItem('userRole');
  return { isAuthenticated: !!userToken, userRole };
};
