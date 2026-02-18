import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

export default function TimelineItem({ year, title, description, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`flex items-center gap-8 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
    >
      <div className="flex-1">
        <Card className="group bg-[var(--bg-elevated)] backdrop-blur-sm hover:shadow-xl transition-all border-[var(--border-primary)] hover:border-t-4 hover:border-t-[var(--brand-primary)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-3xl font-bold text-[var(--brand-primary)]">{year}</span>
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h3>
            </div>
            <p className="text-[var(--text-secondary)]">{description}</p>
          </CardContent>
        </Card>
      </div>
      <div className="w-4 h-4 bg-[var(--brand-primary)] rounded-full flex-shrink-0 shadow-lg" />
      <div className="flex-1" />
    </motion.div>
  );
}