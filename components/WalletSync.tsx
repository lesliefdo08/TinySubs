'use client';

import { useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useAuthStore } from '@/lib/store';

export function WalletSync() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const {
    setWalletAddress,
    setWalletConnected,
    hydrateAuth,
    walletAddress: storedAddress,
  } = useAuthStore();

  // Hydrate auth on mount
  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  // Sync wallet state with global store
  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
      setWalletConnected(true);
    } else if (!isConnected) {
      setWalletConnected(false);
      // Don't clear address immediately to prevent flash
    }
  }, [isConnected, address, setWalletAddress, setWalletConnected]);

  // Handle wallet change
  useEffect(() => {
    if (storedAddress && address && storedAddress !== address) {
      // Wallet changed, clear old data
      useAuthStore.getState().clearAuth();
      setWalletAddress(address);
    }
  }, [address, storedAddress, setWalletAddress]);

  return null;
}
