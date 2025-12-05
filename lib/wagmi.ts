import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia, hardhat } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'TinySubs',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [hardhat, baseSepolia],
  ssr: true,
});
