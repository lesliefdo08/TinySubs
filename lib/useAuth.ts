'use client';

import { useAccount } from 'wagmi';
import { useAuthStore } from './store';
import { useMemo } from 'react';

/**
 * Unified auth hook that combines wagmi and store state
 * Use this instead of directly checking wagmi's isConnected or store's isWalletConnected
 * to avoid race conditions during hydration
 */
export function useAuth() {
  const { address, isConnected: wagmiConnected } = useAccount();
  const { isWalletConnected: storeConnected, isAuthenticated, walletAddress } = useAuthStore();

  // Consider connected if EITHER wagmi OR store reports connection
  // This prevents flash of "not connected" during hydration
  const isConnected = useMemo(() => {
    // Priority: wagmi connection OR stored wallet address
    return wagmiConnected || (storeConnected && !!walletAddress);
  }, [wagmiConnected, storeConnected, walletAddress]);

  // Use stored address if available, fallback to wagmi address
  const effectiveAddress = useMemo(() => {
    return address || walletAddress;
  }, [address, walletAddress]);

  // NEVER block page rendering with isLoading
  // Pages should render immediately and show appropriate state

  return {
    address: effectiveAddress,
    isConnected,
    isAuthenticated,
  };
}
