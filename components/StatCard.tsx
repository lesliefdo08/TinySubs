'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'purple' | 'blue' | 'green' | 'pink';
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  color = 'purple',
}: StatCardProps) {
  const colorClasses = {
    purple: 'from-purple-600 to-purple-800',
    blue: 'from-blue-600 to-blue-800',
    green: 'from-green-600 to-green-800',
    pink: 'from-pink-600 to-pink-800',
  };

  const iconColorClasses = {
    purple: 'bg-purple-500/20 text-purple-400',
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    pink: 'bg-pink-500/20 text-pink-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 shadow-xl border border-slate-700/50`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${iconColorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="flex items-center gap-1">
          <span
            className={`text-xs font-semibold ${
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-xs text-white/60">vs last month</span>
        </div>
      )}
    </motion.div>
  );
}
