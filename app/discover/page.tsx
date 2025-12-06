'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import CreatorCard from '@/components/CreatorCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { TINYSUBS_ABI, CONTRACT_ADDRESS } from '@/lib/contract';
import { Icons } from '@/lib/icons';
import { useNavigation } from '@/lib/navigation';

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

export default function DiscoverPage() {
  const { address, isConnected } = useAccount();
  const { navigateToCreator } = useNavigation();
  const [creators, setCreators] = useState<string[]>([]);
  const [userSubscriptions, setUserSubscriptions] = useState<Set<string>>(new Set());

  // Fetch all creators
  const { data: allCreators, isLoading: isLoadingCreators } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TINYSUBS_ABI,
    functionName: 'getAllCreators',
  });

  // Subscribe function
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (allCreators) {
      setCreators(allCreators as string[]);
    }
  }, [allCreators]);

  // Check user subscriptions
  useEffect(() => {
    if (address && creators.length > 0) {
      const checkSubscriptions = async () => {
        const subs = new Set<string>();
        for (const creator of creators) {
          // Would fetch subscription status here
          // For now, we'll update this after subscription
        }
        setUserSubscriptions(subs);
      };
      checkSubscriptions();
    }
  }, [address, creators]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Subscription activated');
    }
  }, [isSuccess]);

  const handleSubscribe = async (creatorAddress: string, price: bigint) => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: TINYSUBS_ABI,
        functionName: 'subscribe',
        args: [creatorAddress as `0x${string}`],
        value: price,
      });
      toast.loading('Processing transaction...');
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Transaction failed. Please try again.');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-background">
        <EmptyState
          icon={<div className="text-primary w-16 h-16"><Icons.Lock /></div>}
          title="Connect Your Wallet"
          description="Connect your wallet to discover and subscribe to creators."
        />
      </div>
    );
  }

  if (isLoadingCreators) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading creators..." />
      </div>
    );
  }

  if (!creators || creators.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-background">
        <EmptyState
          icon={<div className="text-primary w-16 h-16"><Icons.Palette /></div>}
          title="No Creators Yet"
          description="Be the first to create a subscription plan and start earning."
          action={{
            label: 'Become a Creator',
            onClick: navigateToCreator,
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Discover <span className="gradient-text">Creators</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Support your favorite creators with tiny recurring subscriptions
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <span className="text-purple-400 font-semibold">{creators.length} Active Creators</span>
          </div>
        </motion.div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creatorAddress, index) => (
            <CreatorCardWithData
              key={creatorAddress}
              creatorAddress={creatorAddress}
              onSubscribe={handleSubscribe}
              isSubscribed={userSubscriptions.has(creatorAddress)}
              isLoading={isPending || isConfirming}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper component to fetch and display creator data
function CreatorCardWithData({
  creatorAddress,
  onSubscribe,
  isSubscribed,
  isLoading,
  index,
}: {
  creatorAddress: string;
  onSubscribe: (address: string, price: bigint) => void;
  isSubscribed: boolean;
  isLoading: boolean;
  index: number;
}) {
  const { data: planData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TINYSUBS_ABI,
    functionName: 'getCreatorPlan',
    args: [creatorAddress as `0x${string}`],
  });

  if (!planData) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 animate-shimmer">
        <div className="h-40" />
      </div>
    );
  }

  const plan = planData as CreatorPlan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <CreatorCard
        plan={{
          ...plan,
          creatorAddress,
        }}
        onSubscribe={() => onSubscribe(creatorAddress, plan.pricePerMonth)}
        isSubscribed={isSubscribed}
        isLoading={isLoading}
      />
    </motion.div>
  );
}
