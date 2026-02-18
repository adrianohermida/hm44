import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export default function TimelineHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <div className="inline-flex items-center gap-2 bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] px-4 py-2 rounded-full text-sm font-semibold mb-4">
        Currículo Completo
      </div>
      <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
        Trajetória Profissional
      </h2>
      <p className="text-xl text-[var(--text-secondary)] mb-4">
        Mais de 20 anos de formação e dedicação ao Direito
      </p>
      <a 
        href="http://lattes.cnpq.br/0876441700206296" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-[var(--brand-primary)] hover:text-[var(--brand-primary-700)] font-semibold text-sm transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
        Ver Currículo Lattes Completo
      </a>
    </motion.div>
  );
}