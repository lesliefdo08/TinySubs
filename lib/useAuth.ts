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
  const { isWalletConnected: storeConnected, isAuthenticated } = useAuthStore();

  // Consider connected if EITHER wagmi OR store reports connection
  // This prevents flash of "not connected" during hydration
  const isConnected = useMemo(() => {
    return wagmiConnected || (storeConnected && !!address);
  }, [wagmiConnected, storeConnected, address]);

  // For pages that need to wait for full sync
  const isFullySynced = useMemo(() => {
    return wagmiConnected === storeConnected;
  }, [wagmiConnected, storeConnected]);

  return {
    address,
    isConnected,
    isAuthenticated,
    isFullySynced,
    isLoading: !isFullySynced,
  };
}
