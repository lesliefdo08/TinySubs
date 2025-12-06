'use client';

import { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useAuthStore } from '@/lib/store';

export function WalletSync() {
  const { address, isConnected } = useAccount();
  const {
    setWalletAddress,
    setWalletConnected,
    hydrateAuth,
    walletAddress: storedAddress,
  } = useAuthStore();
  const hasHydrated = useRef(false);

  // Hydrate auth ONCE on mount and persist it
  useEffect(() => {
    if (!hasHydrated.current) {
      hydrateAuth();
      hasHydrated.current = true;
    }
  }, [hydrateAuth]);

  // Sync wallet state with global store - keep auth alive
  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
      setWalletConnected(true);
    } else if (!isConnected && !storedAddress) {
      // Only disconnect if there's no stored address (fresh user)
      setWalletConnected(false);
    }
    // If wallet disconnects but we have stored address, keep auth alive (user will reconnect)
  }, [isConnected, address, setWalletAddress, setWalletConnected, storedAddress]);

  // Handle wallet change - only clear if different wallet connected
  useEffect(() => {
    if (storedAddress && address && storedAddress.toLowerCase() !== address.toLowerCase()) {
      // Different wallet connected, clear old data
      useAuthStore.getState().clearAuth();
      setWalletAddress(address);
    }
  }, [address, storedAddress, setWalletAddress]);

  return null;
}
