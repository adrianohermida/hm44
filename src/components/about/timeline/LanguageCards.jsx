import React from 'react';
import { motion } from 'framer-motion';

const idiomas = [
  { idioma: "Inglês", nivel: "Compreende Bem, Fala Razoavelmente, Lê Bem, Escreve Razoavelmente" },
  { idioma: "Espanhol", nivel: "Compreende Razoavelmente, Fala Razoavelmente, Lê Razoavelmente, Escreve Razoavelmente" }
];

export default function LanguageCards() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {idiomas.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[var(--bg-elevated)] p-6 rounded-2xl border border-[var(--border-primary)] shadow-lg hover:shadow-xl transition-shadow"
        >
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            {item.idioma}
          </h3>
          <p className="text-[var(--text-secondary)] text-sm">{item.nivel}</p>
        </motion.div>
      ))}
    </div>
  );
}