import React from 'react';
import { Award, BookOpen, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { icon: Award, value: 'OAB/SP 476.963', label: 'Certificado e Ativo' },
  { icon: BookOpen, value: 'Autor', label: 'Manual do Superendividado' },
  { icon: Users, value: '5.000+', label: 'Clientes Atendidos' },
  { icon: TrendingUp, value: 'R$ 35M+', label: 'Dívidas Renegociadas' },
];

export default function AuthorityPremiumStats() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white/90 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-[var(--border-primary)] dark:border-white/20 hover:shadow-lg transition-all"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--brand-primary)]/10 dark:bg-[var(--brand-primary)]/30 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--brand-primary)] dark:text-[var(--brand-primary-200)]" />
            </div>
            <p className="text-lg sm:text-xl font-bold text-[var(--text-primary)] dark:text-white mb-1">{stat.value}</p>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] dark:text-gray-300">{stat.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}