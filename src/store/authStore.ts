import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'u1',
    name: 'Sarah Connor',
    email: 'sarah@routeiq.com',
    role: 'operator',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  isAuthenticated: true, // Default to logged in for direct startup, but mockable
  login: async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (email && password) {
      set({
        user: {
          id: 'u1',
          name: 'Sarah Connor',
          email: email,
          role: 'operator',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
        },
        isAuthenticated: true
      });
      return true;
    }
    return false;
  },
  logout: () => set({ user: null, isAuthenticated: false })
}));
