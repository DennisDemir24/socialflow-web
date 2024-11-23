import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
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
      const { data: { session } } = await supabase.auth.getSession();
      const { data: { user } } = await supabase.auth.getUser();
      set({ 
        isAuthenticated: !!session, 
        user: user, 
        loading: false 
      });
    } catch (error: any) {
      set({ isAuthenticated: false, user: null, loading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      set({ 
        isAuthenticated: true, 
        user: data.user, 
        loading: false 
      });
    } catch (error: any) {
      set({ 
        isAuthenticated: false, 
        error: error.message, 
        loading: false 
      });
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });
      
      if (error) throw error;
      
      set({ 
        isAuthenticated: true, 
        user: data.user, 
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ isAuthenticated: false, user: null });
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  },
}));