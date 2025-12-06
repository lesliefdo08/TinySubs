// RPC health check and fallback utilities
'use client';

import { config } from './wagmi';

interface HealthCheckResult {
  isHealthy: boolean;
  latency: number;
  provider: string;
}

// Check RPC health
export async function checkRPCHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    // Try to get the current block number as a health check
    const response = await fetch('http://127.0.0.1:8545', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      }),
    });

    if (!response.ok) {
      return { isHealthy: false, latency: Date.now() - startTime, provider: 'hardhat' };
    }

    const latency = Date.now() - startTime;
    return { isHealthy: true, latency, provider: 'hardhat' };
  } catch (error) {
    console.warn('RPC health check failed:', error);
    return { isHealthy: false, latency: Date.now() - startTime, provider: 'hardhat' };
  }
}

// Retry logic for failed requests
export async function retryRequest<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 1.5);
  }
}

// Check if we should use mock data
let useMockData = false;
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

export async function shouldUseMockData(): Promise<boolean> {
  const now = Date.now();
  
  // Only check health every 30 seconds
  if (now - lastHealthCheck < HEALTH_CHECK_INTERVAL) {
    return useMockData;
  }

  lastHealthCheck = now;
  const health = await checkRPCHealth();
  
  // Use mock data if RPC is unhealthy or latency is too high
  useMockData = !health.isHealthy || health.latency > 5000;
  
  if (useMockData) {
    console.warn('Using mock data due to RPC issues');
  }

  return useMockData;
}

// Cache management for wallet data
const walletCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute

export function getCachedWalletData<T>(key: string): T | null {
  const cached = walletCache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    walletCache.delete(key);
    return null;
  }

  return cached.data as T;
}

export function setCachedWalletData(key: string, data: any): void {
  walletCache.set(key, { data, timestamp: Date.now() });
}

export function clearWalletCache(): void {
  walletCache.clear();
}
