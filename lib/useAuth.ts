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

  // Don't show loading if we have stored data
  const isLoading = useMemo(() => {
    // Only show loading if no stored data and wagmi hasn't loaded yet
    return !walletAddress && wagmiConnected === undefined;
  }, [walletAddress, wagmiConnected]);

  return {
    address: effectiveAddress,
    isConnected,
    isAuthenticated,
    isLoading,
  };
}
