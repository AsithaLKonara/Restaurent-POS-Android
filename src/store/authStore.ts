import { create } from 'zustand';
import * as Keychain from 'react-native-keychain';

interface AuthState {
  isAuthenticated: boolean;
  hasPinSet: boolean;
  isChecking: boolean;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
  setPin: (pin: string) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  hasPinSet: false,
  isChecking: true,

  login: async (pin: string) => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials && credentials.password === pin) {
        set({ isAuthenticated: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Keychain couldn't be accessed!", error);
      return false;
    }
  },

  logout: () => set({ isAuthenticated: false }),

  setPin: async (pin: string) => {
    try {
      // For simplicity, we just store 'admin' as username
      await Keychain.setGenericPassword('admin', pin);
      set({ hasPinSet: true, isAuthenticated: true });
    } catch (error) {
      console.error("Could not save PIN", error);
    }
  },

  checkAuthStatus: async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        set({ hasPinSet: true, isChecking: false });
      } else {
        set({ hasPinSet: false, isChecking: false });
      }
    } catch (error) {
      set({ isChecking: false });
    }
  },
}));
