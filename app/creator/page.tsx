'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther, zeroAddress } from 'viem';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import StatCard from '@/components/StatCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { TINYSUBS_ABI, CONTRACT_ADDRESS } from '@/lib/contract';
import { Icons } from '@/lib/icons';

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
  const { address, isConnected } = useAccount();
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({
    planName: '',
    description: '',
    pricePerMonth: '',
  });

  // Check if user is a creator
  const { data: isCreator, isLoading: checkingCreator } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TINYSUBS_ABI,
    functionName: 'isCreator',
    args: address ? [address] : undefined,
  });

  // Get creator plan data
  const { data: creatorPlan, refetch: refetchPlan } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TINYSUBS_ABI,
    functionName: 'getCreatorPlan',
    args: address ? [address] : undefined,
  });

  // Get subscribers
  const { data: subscribers } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TINYSUBS_ABI,
    functionName: 'getCreatorSubscribers',
    args: address ? [address] : undefined,
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
      console.error('Registration error:', error);
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
      console.error('Withdrawal error:', error);
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
      console.error('Toggle error:', error);
      toast.error('Failed to toggle plan status');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <EmptyState
          icon={<div className="text-primary"><Icons.Lock /></div>}
          title="Connect Your Wallet"
          description="Connect your wallet to access the creator dashboard and start earning."
        />
      </div>
    );
  }

  if (checkingCreator) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading creator data..." />
      </div>
    );
  }

  const plan = creatorPlan as CreatorPlan | undefined;
  const subscriberList = (subscribers as string[]) || [];

  // If not a creator, show registration form
  if (!isCreator) {
    return (
      <div className="min-h-[calc(100vh-64px)] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Become a <span className="text-primary">Creator</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Register your subscription plan and start earning from your content.
            </p>
          </motion.div>

          {!showRegisterForm ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                  <Icons.Palette className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Ready to Start?</h2>
                <p className="text-gray-400">
                  Register your subscription plan and start building your community
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <div className="w-10 h-10 mb-3 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                    <Icons.Dollar className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Flexible Pricing</h3>
                  <p className="text-gray-400 text-sm">
                    Set any price from ₹1 to ₹1000 per month
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <div className="w-10 h-10 mb-3 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                    <Icons.Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Instant Payouts</h3>
                  <p className="text-gray-400 text-sm">
                    Withdraw your earnings anytime, instantly
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <div className="w-10 h-10 mb-3 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                    <Icons.TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Track Everything</h3>
                  <p className="text-gray-400 text-sm">
                    Track subscribers and earnings in real-time
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <div className="w-10 h-10 mb-3 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                    <Icons.Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Fully Onchain</h3>
                  <p className="text-gray-400 text-sm">
                    Transparent, secure, and censorship-resistant
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowRegisterForm(true)}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
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

  // Creator dashboard
  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Creator <span className="text-primary">Dashboard</span>
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
          <p className="text-xl text-white/70">
            Manage your subscription plan and track earnings.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Subscribers"
            value={plan?.subscriberCount?.toString() || '0'}
            icon={<Icons.Users className="w-6 h-6" />}
            color="purple"
          />
          <StatCard
            title="Monthly Revenue"
            value={`${plan ? formatEther(plan.pricePerMonth * plan.subscriberCount) : '0'} ETH`}
            icon={<Icons.TrendingUp className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Available to Withdraw"
            value={`${plan ? formatEther(plan.totalEarned) : '0'} ETH`}
            icon={<Icons.Dollar className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Plan Status"
            value={plan?.isActive ? 'Active' : 'Inactive'}
            icon={<Icons.Activity className="w-6 h-6" />}
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
