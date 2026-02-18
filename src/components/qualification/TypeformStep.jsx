import React from 'react';
import { motion } from 'framer-motion';

export default function TypeformStep({ question, description, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto px-4"
    >
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">
          {question}
        </h2>
        {description && (
          <p className="text-lg text-[var(--text-secondary)]">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}