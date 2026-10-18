// localStorage wrapper with the same API as AsyncStorage

export const storage = {
  getItem: (key) => {
    try {
      return Promise.resolve(localStorage.getItem(key));
    } catch {
      return Promise.resolve(null);
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  },
  clear: () => {
    try {
      localStorage.clear();
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  },
};

export default storage;
