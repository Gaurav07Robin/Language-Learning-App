import { create } from 'zustand';
import { storage } from '../utils/storage';

interface AuthState {
  isAuthenticated: boolean;
  level: string | null;
  loadAuthStatus: () => Promise<void>;
  login: (level: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  level: null,
  loadAuthStatus: async () => {
    const authStatus = storage.getBoolean('isAuthenticated');
    const level = storage.getString('level') || null;
    set({ isAuthenticated: !!authStatus, level });
  },
  login: (level: string) => {
    storage.set('isAuthenticated', true);
    storage.set('level', level);
    set({ isAuthenticated: true, level });
  },
  logout: () => {
    storage.set('isAuthenticated', false);
    storage.delete('level');
    set({ isAuthenticated: false, level: null });
  },
}));

export default useAuthStore;
