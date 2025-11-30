'use client';

import { motion } from 'framer-motion';
import { formatEther } from 'viem';

interface SubscriptionData {
  creator: string;
  planName: string;
  pricePerMonth: bigint;
  startTime: bigint;
  expiryTime: bigint;
  totalPaid: bigint;
  isActive: boolean;
  remainingDays: number;
}

interface SubscriptionCardProps {
  subscription: SubscriptionData;
  onCancel: () => void;
  onRenew: () => void;
  isLoading?: boolean;
}

export default function SubscriptionCard({
  subscription,
  onCancel,
  onRenew,
  isLoading = false,
}: SubscriptionCardProps) {
  const isExpired = subscription.remainingDays <= 0 && subscription.isActive;
  const isExpiringSoon = subscription.remainingDays <= 5 && subscription.remainingDays > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{subscription.planName}</h3>
          <p className="text-sm text-gray-400">
            {subscription.creator.slice(0, 6)}...{subscription.creator.slice(-4)}
          </p>
        </div>
        <div className="flex gap-2">
          {isExpired && (
            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
              Expired
            </span>
          )}
          {isExpiringSoon && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
              Expiring Soon
            </span>
          )}
          {subscription.isActive && !isExpired && !isExpiringSoon && (
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
              Active
            </span>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Monthly Price</p>
          <p className="text-lg font-semibold text-white">
            {formatEther(subscription.pricePerMonth)} ETH
          </p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Days Remaining</p>
          <p className={`text-lg font-semibold ${
            isExpired ? 'text-red-400' : isExpiringSoon ? 'text-yellow-400' : 'text-white'
          }`}>
            {subscription.remainingDays} days
          </p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Total Paid</p>
          <p className="text-lg font-semibold text-purple-400">
            {formatEther(subscription.totalPaid)} ETH
          </p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Status</p>
          <p className="text-lg font-semibold text-white">
            {subscription.isActive ? 'Active' : 'Cancelled'}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {subscription.isActive && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Subscription Period</span>
            <span>{Math.max(0, subscription.remainingDays)} of 30 days</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isExpired
                  ? 'bg-red-500'
                  : isExpiringSoon
                  ? 'bg-yellow-500'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}
              style={{
                width: `${Math.max(0, Math.min(100, (subscription.remainingDays / 30) * 100))}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {subscription.isActive && (
        <div className="flex gap-3">
          <button
            onClick={onRenew}
            disabled={isLoading}
            className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Renew Now'}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2 bg-slate-700 text-gray-300 rounded-lg font-semibold hover:bg-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      )}
    </motion.div>
  );
}
