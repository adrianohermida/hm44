import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingResume2D() {
  return (
    <motion.div
      className="relative w-full h-96"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="absolute top-10 left-10 w-64 h-80 bg-white rounded-lg shadow-2xl p-6"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="w-12 h-12 bg-[var(--brand-primary)] rounded-full mb-4" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-20 right-10 w-64 h-80 bg-white rounded-lg shadow-2xl p-6"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      >
        <div className="w-12 h-12 bg-emerald-500 rounded-full mb-4" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </motion.div>
    </motion.div>
  );
}