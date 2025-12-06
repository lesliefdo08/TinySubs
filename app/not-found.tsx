'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icons } from '@/lib/icons';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-24 h-24 mx-auto mb-6 text-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </div>
        
        <h1 className="text-6xl font-bold text-secondary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-secondary mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 inline-flex items-center justify-center gap-2"
          >
            <Icons.ArrowLeft />
            Back to Home
          </Link>
          <Link
            href="/discover"
            className="px-6 py-3 bg-white text-secondary border border-gray-200 rounded-lg font-semibold hover:border-primary hover:text-primary transition-all duration-200"
          >
            Browse Creators
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
