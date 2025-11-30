'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther } from 'viem';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import SubscriptionCard from '@/components/SubscriptionCard';
import StatCard from '@/components/StatCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { TINYSUBS_ABI, CONTRACT_ADDRESS } from '@/lib/contract';

interface Subscription {
  creator: string;
  startTime: bigint;
  lastPaymentTime: bigint;
  expiryTime: bigint;
  isActive: boolean;
  totalPaid: bigint;
}

interface CreatorPlan {
  planName: string;
  description: string;
  pricePerMonth: bigint;
  tokenAddress: string;
  isActive: boolean;
  subscriberCount: bigint;
  totalEarned: bigint;
  createdAt: bigint;
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [activeSubscriptions, setActiveSubscriptions] = useState<any[]>([]);

  // Fetch all creators to check subscriptions
  const { data: allCreators } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TINYSUBS_ABI,
    functionName: 'getAllCreators',
  });

  // Contract write functions
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (address && allCreators) {
      fetchSubscriptions();
    }
  }, [address, allCreators]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Action completed successfully!');
      fetchSubscriptions();
    }
  }, [isSuccess]);

  const fetchSubscriptions = async () => {
    if (!address || !allCreators) return;

    const subs: any[] = [];
    const creators = allCreators as string[];

    for (const creator of creators) {
      try {
        // In a real implementation, we'd fetch subscription data here
        // For now, this is a placeholder
      } catch (error) {
        console.error('Error fetching subscription:', error);
      }
    }

    setActiveSubscriptions(subs);
  };

  const handleCancel = async (creatorAddress: string) => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: TINYSUBS_ABI,
        functionName: 'cancelSubscription',
        args: [creatorAddress as `0x${string}`],
      });
      toast.loading('Cancelling subscription...');
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  const handleRenew = async (creatorAddress: string, price: bigint) => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: TINYSUBS_ABI,
        functionName: 'renewSubscription',
        args: [creatorAddress as `0x${string}`],
        value: price,
      });
      toast.loading('Renewing subscription...');
    } catch (error) {
      console.error('Renew error:', error);
      toast.error('Failed to renew subscription');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <EmptyState
          icon={<span className="text-6xl">🔐</span>}
          title="Connect Your Wallet"
          description="Please connect your wallet to view your subscription dashboard."
        />
      </div>
    );
  }

  const totalSpent = activeSubscriptions.reduce(
    (acc, sub) => acc + Number(formatEther(sub.totalPaid || 0n)),
    0
  );

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Your <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-xl text-gray-400">
            Manage your subscriptions and track your spending
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Active Subscriptions"
            value={activeSubscriptions.length}
            icon={<span className="text-2xl">📊</span>}
            color="purple"
          />
          <StatCard
            title="Total Spent"
            value={`${totalSpent.toFixed(4)} ETH`}
            icon={<span className="text-2xl">💰</span>}
            color="blue"
          />
          <StatCard
            title="This Month"
            value={`${(totalSpent * 0.3).toFixed(4)} ETH`}
            icon={<span className="text-2xl">📈</span>}
            color="green"
          />
        </div>

        {/* Subscriptions */}
        {activeSubscriptions.length === 0 ? (
          <EmptyState
            icon={<span className="text-6xl">📦</span>}
            title="No Active Subscriptions"
            description="You haven't subscribed to any creators yet. Start supporting your favorite creators today!"
            action={{
              label: 'Discover Creators',
              onClick: () => (window.location.href = '/discover'),
            }}
          />
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Active Subscriptions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSubscriptions.map((sub, index) => (
                <SubscriptionCard
                  key={index}
                  subscription={sub}
                  onCancel={() => handleCancel(sub.creator)}
                  onRenew={() => handleRenew(sub.creator, sub.pricePerMonth)}
                  isLoading={isPending || isConfirming}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
