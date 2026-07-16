import { create } from 'zustand';
import { storage } from '../utils/storage';

interface AuthState {
  isAuthenticated: boolean;
  level: string | null;
  language: string | null;
  loadAuthStatus: () => Promise<void>;
  login: (level: string, language: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  level: null,
  language: null,
  loadAuthStatus: async () => {
    const authStatus = storage.getBoolean('isAuthenticated');
    const level = storage.getString('level') || null;
    const language = storage.getString('language') || null;
    set({ isAuthenticated: !!authStatus, level, language });
  },
  login: (level: string, language: string) => {
    storage.set('isAuthenticated', true);
    storage.set('level', level);
    storage.set('language', language);
    set({ isAuthenticated: true, level, language });
  },
  logout: () => {
    storage.set('isAuthenticated', false);
    storage.delete('level');
    storage.delete('language');
    set({ isAuthenticated: false, level: null, language: null });
  },
}));

export default useAuthStore;
