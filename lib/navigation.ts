// Centralized navigation utilities
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { useAuthStore } from './store';
import toast from 'react-hot-toast';

export function useNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isWalletConnected } = useAuthStore();

  const navigateTo = useCallback(
    (path: string, requireAuth = false) => {
      try {
        // Check if already on the target page
        if (pathname === path) {
          return;
        }

        // If auth is required but user is not authenticated
        if (requireAuth && !isAuthenticated) {
          toast.error('Please connect your wallet to continue');
          return;
        }

        // Navigate using Next.js router
        router.push(path);
      } catch (error) {
        toast.error('Navigation failed. Please try again.');
      }
    },
    [router, pathname, isAuthenticated]
  );

  const navigateToCreator = useCallback(() => {
    if (!isWalletConnected) {
      toast.error('Please connect your wallet to create subscriptions');
      return;
    }
    navigateTo('/creator', false);
  }, [isWalletConnected, navigateTo]);

  const navigateToDashboard = useCallback(() => {
    if (!isWalletConnected) {
      toast.error('Please connect your wallet to view your dashboard');
      return;
    }
    navigateTo('/dashboard', false);
  }, [isWalletConnected, navigateTo]);

  const navigateToDiscover = useCallback(() => {
    navigateTo('/discover', false);
  }, [navigateTo]);

  const navigateToHome = useCallback(() => {
    navigateTo('/', false);
  }, [navigateTo]);

  const safeNavigate = useCallback(
    (path: string) => {
      try {
        router.push(path);
      } catch (error) {
        // Fallback to window.location if router fails
        if (typeof window !== 'undefined') {
          window.location.href = path;
        }
      }
    },
    [router]
  );

  return {
    navigateTo,
    navigateToCreator,
    navigateToDashboard,
    navigateToDiscover,
    navigateToHome,
    safeNavigate,
    currentPath: pathname,
  };
}

// Utility function for non-hook contexts
export function navigateToPath(path: string) {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  }
}
