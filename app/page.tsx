'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import ProductMockup from '@/components/ProductMockup';
import HowItWorks from '@/components/HowItWorks';
import DashboardPreview from '@/components/DashboardPreview';
import WalletSimulator from '@/components/WalletSimulator';
import { Icons } from '@/lib/icons';
import { useNavigation } from '@/lib/navigation';
import { useAuthStore } from '@/lib/store';

export default function Home() {
  const { isConnected } = useAccount();
  const { navigateToCreator, navigateToDiscover } = useNavigation();
  const { isWalletConnected } = useAuthStore();

  const features = [
    {
      icon: 'Chain',
      title: 'Built Onchain',
      description: 'Smart contracts handle payments. Full transparency and control.',
    },
    {
      icon: 'Dollar',
      title: 'Start at $0.01',
      description: 'Set your own price. As low as one cent per month.',
    },
    {
      icon: 'Rocket',
      title: 'Launch in Minutes',
      description: 'Connect wallet, set price, share link. Done.',
    },
    {
      icon: 'Unlock',
      title: 'No Lock-ins',
      description: 'Subscribers can cancel anytime. You keep what you earned.',
    },
    {
      icon: 'TrendingUp',
      title: 'Track Everything',
      description: 'Monitor subscribers, earnings, and growth in real-time.',
    },
    {
      icon: 'Zap',
      title: 'Instant Withdrawals',
      description: 'Access your earnings anytime. No waiting periods.',
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
      <section className="relative pt-16 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full"
              >
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-primary text-sm font-semibold">Live on Base Network</span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Onchain Subscriptions
                <br />
                <span className="text-primary">Starting at $0.01</span>
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-xl">
                Enable micro-subscriptions for your content. Built for creators who want fair revenue without platform fees eating their earnings.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {isWalletConnected ? (
                  <>
                    <motion.button
                      onClick={navigateToCreator}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 bg-primary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300"
                    >
                      Start Creating
                    </motion.button>
                    <motion.button
                      onClick={navigateToDiscover}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-semibold hover:border-primary hover:bg-white/20 transition-all duration-300"
                    >
                      Browse Creators
                    </motion.button>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/30 rounded-xl text-primary"
                  >
                    <div className="text-primary">
                      <Icons.ArrowRight />
                    </div>
                    <span className="text-sm font-semibold">Connect your wallet above to get started</span>
                  </motion.div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-8 pt-6 text-sm">
                <div>
                  <p className="text-2xl font-bold text-white">1.2K+</p>
                  <p className="text-white/60">Active Creators</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">$15K+</p>
                  <p className="text-white/60">Paid Out</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">98%</p>
                  <p className="text-white/60">To Creators</p>
                </div>
              </div>
            </motion.div>

            {/* Right: Product Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ProductMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why TinySubs Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why TinySubs?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Fair pricing. True ownership. Built for the onchain economy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = Icons[feature.icon as keyof typeof Icons];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all duration-250"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 text-primary">
                    <IconComponent />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
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
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Three steps to start earning onchain
            </p>
          </motion.div>

          <HowItWorks />
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Creator Dashboard
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Track everything in real-time. No spreadsheets needed.
            </p>
          </motion.div>

          <DashboardPreview />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
              Simple, Fair Pricing
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              We only succeed when you succeed
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
              >
                <div className="text-5xl font-bold text-primary mb-2">2.5%</div>
                <div className="text-lg font-semibold text-secondary mb-3">Platform Fee</div>
                <p className="text-gray-600 text-sm">Industry-low fee. Most platforms charge 10-30%</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
              >
                <div className="text-5xl font-bold text-primary mb-2">$0.01</div>
                <div className="text-lg font-semibold text-secondary mb-3">Minimum Price</div>
                <p className="text-gray-600 text-sm">Set any price from one cent upwards</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
              >
                <div className="text-5xl font-bold text-primary mb-2">0s</div>
                <div className="text-lg font-semibold text-secondary mb-3">Withdrawal Time</div>
                <p className="text-gray-600 text-sm">Access your funds instantly, anytime</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Real Use Case Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full mb-6 text-sm font-semibold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                </svg>
                Case Study
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">
                "I charged $0.03/month for my newsletter. Got 2,000 subscribers."
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Traditional platforms require minimum pricing of $5-10/month. With TinySubs, 
                indie creators can charge micro-amounts and still build sustainable income.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-secondary">Lower barrier to entry</p>
                    <p className="text-gray-600 text-sm">More people subscribe at lower prices</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-secondary">Build real community</p>
                    <p className="text-gray-600 text-sm">Engaged subscribers, not just numbers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-secondary">Sustainable income</p>
                    <p className="text-gray-600 text-sm">2,000 × $0.03 = $60/month profit</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <WalletSimulator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-purple-600">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join 1,200+ creators already earning with micro-subscriptions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={isWalletConnected ? navigateToCreator : () => {}}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-white text-primary rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {isWalletConnected ? 'Launch Your Plan' : 'Connect Wallet'}
            </motion.button>
            <motion.button
              onClick={navigateToDiscover}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300"
            >
              Browse Creators
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-secondary border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/logo.png"
                  alt="TinySubs Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                />
                <span className="text-xl font-bold text-white">TinySubs</span>
              </div>
              <p className="text-gray-400 text-sm">
                Onchain micro-subscriptions for creators. Fair pricing, instant payouts.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/discover" className="hover:text-primary transition-colors">Browse Creators</Link></li>
                <li><Link href="/creator" className="hover:text-primary transition-colors">Become a Creator</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            {/* Credits */}
            <div>
              <h4 className="text-white font-semibold mb-4">Project</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a 
                    href="https://github.com/lesliefdo08/TinySubs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </a>
                </li>
                <li className="text-gray-500 text-xs pt-2">
                  Built with Next.js, Solidity & Base
                </li>
                <li className="text-gray-500 text-xs">
                  Created by <a href="https://github.com/lesliefdo08" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@lesliefdo08</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2025 TinySubs. Open source project for the onchain creator economy.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
