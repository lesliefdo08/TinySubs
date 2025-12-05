'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {icon && (
        <div className="mb-6 p-6 bg-primary/10 rounded-2xl">
          {icon}
        </div>
      )}
      <h3 className="text-2xl font-bold text-secondary mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primaryDark transition-all duration-250 shadow-md hover:shadow-lg"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
