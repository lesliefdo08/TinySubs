'use client';

import { motion } from 'framer-motion';
import { formatEther } from 'viem';

interface SubscriptionPlan {
  planName: string;
  description: string;
  pricePerMonth: bigint;
  subscriberCount: bigint;
  isActive: boolean;
  creatorAddress: string;
}

interface CreatorCardProps {
  plan: SubscriptionPlan;
  onSubscribe: () => void;
  isSubscribed?: boolean;
  isLoading?: boolean;
}

export default function CreatorCard({
  plan,
  onSubscribe,
  isSubscribed = false,
  isLoading = false,
}: CreatorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl card-hover"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">{plan.planName}</h3>
          <p className="text-sm text-gray-400 truncate">
            {plan.creatorAddress.slice(0, 6)}...{plan.creatorAddress.slice(-4)}
          </p>
        </div>
        {!plan.isActive && (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
            Inactive
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{plan.description}</p>

      {/* Stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-2xl font-bold text-white">
            {formatEther(plan.pricePerMonth)} ETH
          </p>
          <p className="text-xs text-gray-400">per month</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-purple-400">
            {plan.subscriberCount.toString()}
          </p>
          <p className="text-xs text-gray-400">subscribers</p>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onSubscribe}
        disabled={!plan.isActive || isSubscribed || isLoading}
        className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
          isSubscribed
            ? 'bg-green-600/20 text-green-400 cursor-not-allowed'
            : !plan.isActive
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:shadow-purple-500/50'
        }`}
      >
        {isLoading
          ? 'Processing...'
          : isSubscribed
          ? '✓ Subscribed'
          : !plan.isActive
          ? 'Plan Inactive'
          : 'Subscribe Now'}
      </button>
    </motion.div>
  );
}
