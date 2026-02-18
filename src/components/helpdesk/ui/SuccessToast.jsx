import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessToast({ message }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="flex items-center gap-3 bg-white rounded-lg shadow-lg border border-green-200 p-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
      >
        <CheckCircle2 className="w-5 h-5 text-green-600" />
      </motion.div>
      <span className="text-sm font-medium text-gray-900">{message}</span>
    </motion.div>
  );
}