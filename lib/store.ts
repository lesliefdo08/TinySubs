// Global auth and wallet state management using Zustand
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  // Wallet state
  walletAddress: string | null;
  isWalletConnected: boolean;
  
  // Auth state
  isAuthenticated: boolean;
  
  // Session data
  sessionToken: string | null;
  lastConnected: number | null;
  
  // User data
  isCreator: boolean;
  subscriptions: string[];
  
  // Actions
  setWalletAddress: (address: string | null) => void;
  setWalletConnected: (connected: boolean) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setSessionToken: (token: string | null) => void;
  setIsCreator: (isCreator: boolean) => void;
  addSubscription: (subscription: string) => void;
  removeSubscription: (subscription: string) => void;
  clearAuth: () => void;
  hydrateAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      walletAddress: null,
      isWalletConnected: false,
      isAuthenticated: false,
      sessionToken: null,
      lastConnected: null,
      isCreator: false,
      subscriptions: [],

      // Actions
      setWalletAddress: (address) => {
        set({ 
          walletAddress: address,
          isWalletConnected: !!address,
          isAuthenticated: !!address,
          lastConnected: address ? Date.now() : null,
        });
      },

      setWalletConnected: (connected) => {
        set({ isWalletConnected: connected });
        // Don't clear auth on disconnect - let user reconnect
      },

      setAuthenticated: (authenticated) => {
        set({ isAuthenticated: authenticated });
      },

      setSessionToken: (token) => {
        set({ sessionToken: token });
      },

      setIsCreator: (isCreator) => {
        set({ isCreator });
      },

      addSubscription: (subscription) => {
        const subscriptions = get().subscriptions;
        if (!subscriptions.includes(subscription)) {
          set({ subscriptions: [...subscriptions, subscription] });
        }
      },

      removeSubscription: (subscription) => {
        set({
          subscriptions: get().subscriptions.filter((s) => s !== subscription),
        });
      },

      clearAuth: () => {
        set({
          walletAddress: null,
          isWalletConnected: false,
          isAuthenticated: false,
          sessionToken: null,
          lastConnected: null,
          isCreator: false,
          subscriptions: [],
        });
      },

      hydrateAuth: () => {
        const state = get();
        const now = Date.now();
        const sevenDays = 7 * 24 * 60 * 60 * 1000; // Extended to 7 days

        // Check if session is still valid
        if (state.lastConnected && now - state.lastConnected > sevenDays) {
          // Session expired after 7 days, clear auth
          get().clearAuth();
        } else if (state.walletAddress) {
          // Session valid, restore auth and connection
          set({
            isAuthenticated: true,
            isWalletConnected: true,
          });
        }
      },
    }),
    {
      name: 'tinysubs-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
