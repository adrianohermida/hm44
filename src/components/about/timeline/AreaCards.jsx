import React from 'react';
import { motion } from 'framer-motion';

const areasAtuacao = [
  "Direito Civil",
  "Direito Tributário",
  "Direito Processual Civil",
  "Direito Registral",
  "Direito Constitucional",
  "Direito Administrativo"
];

export default function AreaCards() {
  return (
    <>
      <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6 text-center">
        Áreas de Especialização
      </h3>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {areasAtuacao.map((area, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-[var(--brand-primary-50)] p-4 rounded-xl text-center border border-[var(--brand-primary-200)] hover:shadow-lg transition-shadow"
          >
            <span className="text-[var(--brand-primary-700)] font-semibold">{area}</span>
          </motion.div>
        ))}
      </div>
    </>
  );
}