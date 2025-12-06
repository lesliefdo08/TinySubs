'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import { useNavigation } from '@/lib/navigation';
import { useAuthStore } from '@/lib/store';
import { Icons } from '@/lib/icons';

export default function Navbar() {
  const pathname = usePathname();
  const { navigateToHome, navigateToDiscover, navigateToDashboard, navigateToCreator } = useNavigation();
  const { isWalletConnected } = useAuthStore();

  const links = [
    { href: '/', label: 'Home', onClick: navigateToHome },
    { href: '/discover', label: 'Discover', onClick: navigateToDiscover, requireAuth: false },
    { href: '/dashboard', label: 'Dashboard', onClick: navigateToDashboard, requireAuth: true },
    { href: '/creator', label: 'Creator', onClick: navigateToCreator, requireAuth: true },
  ];

  const handleNavClick = (link: typeof links[0]) => {
    if (link.requireAuth && !isWalletConnected) {
      return; // Navigation hook will show toast
    }
    link.onClick();
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={navigateToHome} className="flex items-center space-x-2 cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <Image
                src="/logo.png"
                alt="TinySubs Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-white">TinySubs</span>
            </motion.div>
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link)}
                disabled={link.requireAuth && !isWalletConnected}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'bg-primary text-white'
                    : link.requireAuth && !isWalletConnected
                    ? 'text-white/40 cursor-not-allowed'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Connect Wallet */}
          <div className="flex items-center">
            <ConnectButton
              chainStatus="icon"
              showBalance={false}
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-around pb-3 gap-2">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link)}
              disabled={link.requireAuth && !isWalletConnected}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? 'bg-primary text-white'
                  : link.requireAuth && !isWalletConnected
                  ? 'text-white/40'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
