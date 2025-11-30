'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAccount } from 'wagmi';

export default function Home() {
  const { isConnected } = useAccount();

  const features = [
    {
      icon: '🔐',
      title: 'Fully Onchain',
      description: 'All subscription logic handled by smart contracts. No intermediaries.',
    },
    {
      icon: '💸',
      title: 'Micro Payments',
      description: 'Support for tiny recurring payments starting from ₹1 / $0.01 per month.',
    },
    {
      icon: '🎨',
      title: 'Creator First',
      description: 'Easy setup for creators. Get started in minutes with just a wallet.',
    },
    {
      icon: '🔄',
      title: 'Cancel Anytime',
      description: 'Subscribers have full control. No lock-in periods or hidden fees.',
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Track subscribers, earnings, and growth with live dashboards.',
    },
    {
      icon: '⚡',
      title: 'Instant Withdrawals',
      description: 'Access your earnings immediately. No waiting periods.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-pink-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-8"
            >
              <span className="text-purple-400 text-sm font-semibold">🚀 Built on Base Testnet</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Frictionless Onchain
              <br />
              <span className="gradient-text">Micro-Subscriptions</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Let creators charge extremely small recurring payments using smart-contract-based streaming.
              No middlemen. No fees. Just pure creator economy.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isConnected ? (
                <>
                  <Link href="/discover">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-purple-500/50 transition-all duration-200"
                    >
                      Discover Creators
                    </motion.button>
                  </Link>
                  <Link href="/creator">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-slate-800 text-white rounded-xl font-semibold text-lg border border-slate-700 hover:bg-slate-700 transition-all duration-200"
                    >
                      Become a Creator
                    </motion.button>
                  </Link>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-400"
                >
                  👆 Connect your wallet to get started
                </motion.div>
              )}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <p className="text-4xl font-bold gradient-text mb-2">$0.01+</p>
                <p className="text-gray-400">Minimum subscription</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <p className="text-4xl font-bold gradient-text mb-2">2.5%</p>
                <p className="text-gray-400">Platform fee only</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <p className="text-4xl font-bold gradient-text mb-2">0s</p>
                <p className="text-gray-400">Withdrawal delay</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose TinySubs?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The most creator-friendly subscription platform in Web3
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Wallet',
                description: 'Connect your Web3 wallet using MetaMask or any compatible wallet.',
              },
              {
                step: '02',
                title: 'Create or Subscribe',
                description: 'Creators register plans. Subscribers discover and subscribe to creators.',
              },
              {
                step: '03',
                title: 'Earn or Enjoy',
                description: 'Creators withdraw earnings anytime. Subscribers access exclusive content.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl p-8">
                  <div className="text-6xl font-bold opacity-20 mb-4">{item.step}</div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-purple-100">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-4xl text-purple-500">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join the future of creator subscriptions on the blockchain
          </p>
          <Link href={isConnected ? '/discover' : '/'}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200"
            >
              {isConnected ? 'Explore Now' : 'Connect Wallet to Start'}
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="text-xl font-bold gradient-text">TinySubs</span>
          </div>
          <p className="text-gray-400 mb-4">
            Frictionless Onchain Micro-Subscriptions for Everything
          </p>
          <p className="text-gray-500 text-sm">
            Built with ❤️ for BuildOnchain
          </p>
        </div>
      </footer>
    </div>
  );
}
