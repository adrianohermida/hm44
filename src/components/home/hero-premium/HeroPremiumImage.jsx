import React from 'react';
import { CheckCircle, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroPremiumImage() {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary-400)] to-[var(--brand-primary-600)] rounded-3xl transform rotate-3 scale-105 opacity-20 blur-xl" />
        
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69457177ae7e61f63fb38329/3b78c0579__TLM961311.jpg"
          alt="Dr. Adriano Hermida Maia - Advogado Especialista"
          className="relative rounded-3xl shadow-2xl w-full max-w-md mx-auto object-cover aspect-[3/4] border-4 border-white/20"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute -bottom-4 -right-4 sm:bottom-4 sm:right-4 bg-[var(--bg-elevated)] rounded-2xl shadow-2xl p-4 border border-[var(--border-primary)]"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--brand-primary-100)] flex items-center justify-center">
              <Award className="w-6 h-6 text-[var(--brand-primary)]" />
            </div>
            <div>
              <p className="font-bold text-[var(--text-primary)] text-sm">OAB/SP 476.963</p>
              <p className="text-xs text-[var(--text-secondary)]">Especialista certificado</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute top-4 -left-4 sm:top-8 sm:left-8 bg-[var(--bg-elevated)] rounded-xl shadow-xl p-3 border border-[var(--border-primary)] hidden sm:block"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[var(--brand-success)]" />
            <span className="text-xs font-semibold text-[var(--text-primary)]">98% Sucesso</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}