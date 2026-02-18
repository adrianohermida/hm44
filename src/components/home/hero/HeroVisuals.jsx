import React from 'react';
import { motion } from 'framer-motion';

export default function HeroVisuals() {
  return (
    <div className="relative h-96 hidden lg:block">
      <motion.div
        className="absolute top-0 right-0 w-64 h-80 bg-white rounded-xl shadow-2xl p-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-12 h-12 bg-[var(--brand-primary)] rounded-full mb-4" />
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 right-20 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </div>
  );
}