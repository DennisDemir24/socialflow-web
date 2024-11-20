import { create } from 'zustand';
import { account } from '@/lib/appwrite/config';
import { Models } from 'appwrite';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,

  checkAuth: async () => {
    try {
      const user = await account.getSession("current");
      set({ isAuthenticated: true, user, loading: false });
    } catch (error: any) {
      set({ isAuthenticated: false, user: null, loading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      set({isAuthenticated: true, loading: true, error: null });
      const user = await account.get();
      set({ user, loading: false });
    } catch (error: any) {
      set({ isAuthenticated: false, error: error.message, loading: false });
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      set({ loading: true, error: null });
      await account.create('unique()', email, password, name);
      await useAuthStore.getState().login(email, password);
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  logout: async () => {
    try {
      await account.deleteSession('current');
      set({ isAuthenticated: false, user: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
}));