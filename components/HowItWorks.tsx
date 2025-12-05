'use client';

import { motion } from 'framer-motion';

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Connect Your Wallet',
      description: 'Link your Web3 wallet in seconds. Works with MetaMask, WalletConnect, and more.',
      icon: '🔗',
    },
    {
      number: '2',
      title: 'Set Your Price',
      description: 'Choose your monthly rate. Start as low as $0.01 per subscriber.',
      icon: '💰',
    },
    {
      number: '3',
      title: 'Start Earning',
      description: 'Share your link and get paid automatically. Withdraw anytime, no waiting.',
      icon: '🚀',
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 }}
          className="relative"
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full"
          >
            {/* Step Number Badge */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {step.number}
            </div>

            {/* Icon */}
            <div className="text-6xl mb-6 mt-4">{step.icon}</div>

            {/* Content */}
            <h3 className="text-xl font-bold text-secondary mb-3">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed">{step.description}</p>
          </motion.div>

          {/* Connector Arrow */}
          {index < steps.length - 1 && (
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
              <motion.svg
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.15 }}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-primary"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
