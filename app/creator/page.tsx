'use client';

import { useState, useEffect } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther, zeroAddress } from 'viem';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import StatCard from '@/components/StatCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { DashboardSkeleton } from '@/components/SkeletonLoader';
import { TINYSUBS_ABI, CONTRACT_ADDRESS } from '@/lib/contract';
import { Icons } from '@/lib/icons';
import { useAuth } from '@/lib/useAuth';

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

export default function CreatorPage() {
  const { address, isConnected } = useAuth();
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({
    planName: '',
    description: '',
    pricePerMonth: '',
  });

  // Check if user is a creator with caching
  const { data: isCreator, isLoading: checkingCreator } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TINYSUBS_ABI,
    functionName: 'isCreator',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
      staleTime: 60000,
      gcTime: 300000,
      retry: false, // Don't retry failed requests
      retryDelay: 0,
    },
  });

  // Get creator plan data with caching
  const { data: creatorPlan, refetch: refetchPlan } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TINYSUBS_ABI,
    functionName: 'getCreatorPlan',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address && isCreator === true, // Only fetch if user is creator
      staleTime: 30000,
      gcTime: 300000,
      retry: false,
    },
  });

  // Get subscribers with caching
  const { data: subscribers } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TINYSUBS_ABI,
    functionName: 'getCreatorSubscribers',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address && isCreator === true,
      staleTime: 30000,
      gcTime: 300000,
      retry: false,
    },
  });

  // Contract write functions
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Transaction complete');
      refetchPlan();
      setShowRegisterForm(false);
      setFormData({ planName: '', description: '', pricePerMonth: '' });
    }
  }, [isSuccess]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!formData.planName || !formData.description || !formData.pricePerMonth) {
      toast.error('All fields are required');
      return;
    }

    try {
      const price = parseEther(formData.pricePerMonth);
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: TINYSUBS_ABI,
        functionName: 'registerCreator',
        args: [formData.planName, formData.description, price, zeroAddress],
      });
      toast.loading('Processing transaction...');
    } catch (error) {
      toast.error('Transaction failed. Check your wallet and try again.');
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: TINYSUBS_ABI,
        functionName: 'withdrawFunds',
      });
      toast.loading('Processing withdrawal...');
    } catch (error) {
      toast.error('Withdrawal failed. Please try again.');
    }
  };

  const handleToggleStatus = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: TINYSUBS_ABI,
        functionName: 'togglePlanStatus',
      });
      toast.loading('Updating plan status...');
    } catch (error) {
      toast.error('Failed to toggle plan status');
    }
  };

  // Determine what to show - NO blocking returns!
  const showWalletPrompt = !isConnected;
  const showLoading = isConnected && checkingCreator;
  const showRegistration = isConnected && !checkingCreator && !isCreator;
  const showDashboard = isConnected && !checkingCreator && isCreator;

  const plan = creatorPlan as CreatorPlan | undefined;
  const subscriberList = (subscribers as string[]) || [];

  // Wallet prompt
  if (showWalletPrompt) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-background">
        <EmptyState
          icon={<div className="text-primary"><Icons.Lock /></div>}
          title="Connect Your Wallet"
          description="Connect your wallet to access the creator dashboard and start earning."
        />
      </div>
    );
  }

  // Loading state
  if (showLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] py-12 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  // Registration form
  if (showRegistration) {
    return (
      <div className="min-h-[calc(100vh-64px)] py-12 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
              Become a <span className="gradient-text">Creator</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Register your subscription plan and start earning from your content.
            </p>
          </motion.div>

          {!showRegisterForm ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 text-primary">
                  <Icons.Palette />
                </div>
                <h2 className="text-2xl font-bold text-secondary mb-2">Ready to Start?</h2>
                <p className="text-gray-600">
                  Register your subscription plan and start building your community
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="w-8 h-8 mb-3 text-green-600">
                    <Icons.Dollar />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary mb-2">Flexible Pricing</h3>
                  <p className="text-gray-600 text-sm">
                    Set any price from $0.01 upwards per month
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="w-8 h-8 mb-3 text-yellow-600">
                    <Icons.Zap />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary mb-2">Instant Payouts</h3>
                  <p className="text-gray-600 text-sm">
                    Withdraw your earnings anytime, instantly
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="w-8 h-8 mb-3 text-blue-600">
                    <Icons.Activity />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary mb-2">Live Analytics</h3>
                  <p className="text-gray-600 text-sm">
                    Track subscribers and earnings in real-time
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="w-8 h-8 mb-3 text-primary">
                    <Icons.Lock />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary mb-2">Fully Onchain</h3>
                  <p className="text-gray-600 text-sm">
                    Transparent, secure, and censorship-resistant
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowRegisterForm(true)}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Register as Creator
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onSubmit={handleRegister}
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-secondary mb-6">Create Your Plan</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    value={formData.planName}
                    onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                    placeholder="Premium Content"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-secondary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what subscribers will receive"
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-secondary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Month (ETH) *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.pricePerMonth}
                    onChange={(e) => setFormData({ ...formData, pricePerMonth: e.target.value })}
                    placeholder="0.01"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-secondary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Recommended: 0.01 - 0.05 ETH per month
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowRegisterForm(false)}
                  className="flex-1 py-3 bg-gray-200 text-secondary rounded-lg font-semibold hover:bg-gray-300 transition-all duration-250"
                  disabled={isPending || isConfirming}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || isConfirming}
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primaryDark transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {isPending || isConfirming ? 'Processing...' : 'Create Plan'}
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    );
  }

  // Creator dashboard (showDashboard === true)
  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary">
              Creator <span className="gradient-text">Dashboard</span>
            </h1>
            <div className="flex gap-3">
              <button
                onClick={handleToggleStatus}
                disabled={isPending || isConfirming}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  plan?.isActive
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } text-white disabled:opacity-50`}
              >
                {plan?.isActive ? 'Active' : 'Inactive'}
              </button>
              <button
                onClick={handleWithdraw}
                disabled={isPending || isConfirming || !plan?.totalEarned || plan.totalEarned === 0n}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Withdraw Funds
              </button>
            </div>
          </div>
          <p className="text-xl text-gray-600">
            Manage your subscription plan and track earnings.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Subscribers"
            value={plan?.subscriberCount?.toString() || '0'}
            icon={<div className="w-6 h-6"><Icons.Users /></div>}
            color="purple"
          />
          <StatCard
            title="Monthly Revenue"
            value={`${plan ? formatEther(plan.pricePerMonth * plan.subscriberCount) : '0'} ETH`}
            icon={<div className="w-6 h-6"><Icons.Dollar /></div>}
            color="blue"
          />
          <StatCard
            title="Available to Withdraw"
            value={`${plan ? formatEther(plan.totalEarned) : '0'} ETH`}
            icon={<div className="w-6 h-6"><Icons.Dollar /></div>}
            color="green"
          />
          <StatCard
            title="Plan Status"
            value={plan?.isActive ? 'Active' : 'Inactive'}
            icon={<div className="w-6 h-6"><Icons.Activity /></div>}
            color="pink"
          />
        </div>

        {/* Plan Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md"
          >
            <h2 className="text-2xl font-bold text-secondary mb-6">Plan Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Plan Name</p>
                <p className="text-xl font-semibold text-secondary">{plan?.planName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-700">{plan?.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Price per Month</p>
                <p className="text-xl font-semibold gradient-text">
                  {plan ? formatEther(plan.pricePerMonth) : '0'} ETH
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md"
          >
            <h2 className="text-2xl font-bold text-secondary mb-6">
              Subscribers ({subscriberList.length})
            </h2>
            {subscriberList.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Icons.Users />
                </div>
                <p className="text-gray-600">No subscribers yet</p>
                <p className="text-sm text-gray-500 mt-1">Share your plan to get started</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {subscriberList.map((subscriber, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {subscriber.slice(0, 6)}...{subscriber.slice(-4)}
                        </p>
                        <p className="text-xs text-gray-400">Active Subscriber</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
