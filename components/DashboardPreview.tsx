'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<'overview' | 'subscribers'>('overview');

  const statsData = [
    { label: 'Total Subscribers', value: '1,247', change: '+12%', trend: 'up' },
    { label: 'Monthly Revenue', value: '$62.35', change: '+8%', trend: 'up' },
    { label: 'Active Plans', value: '3', change: '0%', trend: 'neutral' },
  ];

  const recentSubscribers = [
    { name: 'Alice Johnson', avatar: '👩', date: '2 hours ago', amount: '$0.05' },
    { name: 'Bob Smith', avatar: '👨', date: '5 hours ago', amount: '$0.03' },
    { name: 'Carol White', avatar: '👩', date: '1 day ago', amount: '$0.05' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-5xl mx-auto"
    >
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-primary to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-1">Creator Dashboard</h3>
            <p className="text-purple-100 text-sm">Track your subscription performance</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-primary px-4 py-2 rounded-lg font-semibold text-sm shadow-md"
          >
            Withdraw
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex gap-1 p-2">
          {['overview', 'subscribers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {statsData.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 shadow-sm"
                >
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-secondary">{stat.value}</p>
                    <span
                      className={`text-sm font-semibold ${
                        stat.trend === 'up' ? 'text-green-500' : stat.trend === 'down' ? 'text-red-500' : 'text-gray-400'
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chart Placeholder */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-secondary mb-4">Revenue Over Time</h4>
              <div className="h-48 flex items-end justify-between gap-2">
                {[40, 65, 55, 80, 70, 90, 85].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-primary to-purple-500 rounded-t-lg min-w-0"
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'subscribers' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <h4 className="font-semibold text-secondary mb-4">Recent Subscribers</h4>
            {recentSubscribers.map((subscriber, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-primary/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-xl">
                    {subscriber.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-secondary">{subscriber.name}</p>
                    <p className="text-sm text-gray-500">{subscriber.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{subscriber.amount}</p>
                  <p className="text-xs text-gray-500">per month</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
