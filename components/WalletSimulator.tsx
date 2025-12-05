'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function WalletSimulator() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [gaslessEnabled, setGaslessEnabled] = useState(true);

  const simulatePayment = async () => {
    setIsProcessing(true);
    toast.loading('Processing payment...', { id: 'payment' });

    // Simulate blockchain transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    toast.success(
      gaslessEnabled
        ? 'Payment successful! (Gas fees sponsored)'
        : 'Payment successful! Gas fee: $0.002',
      { id: 'payment', duration: 4000 }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md mx-auto"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-secondary mb-2">Test Wallet</h3>
          <p className="text-gray-500 text-sm">Try a micro-payment simulation</p>
        </div>

        {/* Balance Display */}
        <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl p-6 border border-primary/10">
          <p className="text-sm text-gray-600 mb-1">Test Balance</p>
          <p className="text-3xl font-bold text-secondary">10.00 ETH</p>
          <p className="text-xs text-gray-500 mt-2">≈ $25,000 USD</p>
        </div>

        {/* Payment Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Payment Amount</span>
            <span className="font-semibold text-secondary">$0.05</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Recipient</span>
            <span className="font-mono text-xs text-gray-500">0x742d...3a8f</span>
          </div>

          {/* Gasless Toggle */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-gray-700">Gasless Mode</p>
                <p className="text-xs text-gray-500">Sponsored by TinySubs</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setGaslessEnabled(!gaslessEnabled)}
              className={`w-12 h-6 rounded-full transition-all duration-300 ${
                gaslessEnabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: gaslessEnabled ? 24 : 0 }}
                className="w-6 h-6 bg-white rounded-full shadow-md"
              />
            </motion.button>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={simulatePayment}
          disabled={isProcessing}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
            isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              <span>Processing...</span>
            </div>
          ) : (
            'Send Micro-Payment'
          )}
        </motion.button>

        {/* Info */}
        <p className="text-xs text-center text-gray-500">
          This is a test transaction. No real funds will be used.
        </p>
      </div>
    </motion.div>
  );
}
