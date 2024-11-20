import { create } from 'zustand';
import { account } from '@/lib/appwrite/config';
import { Models } from 'appwrite';

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  checkAuth: async () => {
    try {
      const user = await account.get();
      set({ user, loading: false });
    } catch (error: any) {
      set({ user: null, loading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      set({ user, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
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
      set({ user: null });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));