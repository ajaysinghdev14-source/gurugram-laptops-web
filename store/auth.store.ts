import { create } from 'zustand';
import { AuthService } from '@/services/auth.service';
import { useCartStore } from './cart.store';

interface AuthState {
  user: { 
    userId: string;
    fullName: string;
    email: string;
    role: 'USER' | 'ADMIN';
    status: 'ACTIVE' | 'BANNED';
  } | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  
  // Actions
  initializeAuth: () => Promise<void>;
  setUser: (user: { userId: string; fullName: string; email: string; role: 'USER' | 'ADMIN'; status: 'ACTIVE' | 'BANNED' } | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isInitialized: false,
  isAuthenticated: false,

  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      const userData = await AuthService.getMe();
      
      // If the user was banned by an admin, kick them out immediately!
      if (userData.status === 'BANNED') {
        await AuthService.logout();
        set({ user: null, isInitialized: true, isLoading: false, isAuthenticated: false });
        return;
      }

      set({ user: userData, isInitialized: true, isLoading: false, isAuthenticated: true });

      // Trigger cart sync IMMEDIATELY after auth initializes successfully
      const { items, syncLocalCart, fetchCart } = useCartStore.getState();
      const hasLocalItems = items.some(i => !i.id || i.id.startsWith('local_'));
      if (hasLocalItems) {
        await syncLocalCart();
      } else {
        await fetchCart();
      }
    } catch (error) {
      // If getMe fails (401), the user is not logged in.
      set({ user: null, isInitialized: true, isLoading: false, isAuthenticated: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  logout: async () => {
    try {
      await AuthService.logout();
    } finally {
      useCartStore.getState().clearCart();
      set({ user: null, isAuthenticated: false });
    }
  }
}));
