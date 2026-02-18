import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthorityPremiumCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="space-y-6 text-center lg:text-left"
    >
      <div>
        <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-on-dark)] mb-2">
          Dr. Adriano Hermida Maia
        </h3>
        <p className="text-[var(--brand-primary)] text-base sm:text-lg font-semibold">
          Especialista em Superendividamento
        </p>
      </div>

      <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
        Docente, Pós-Graduado em Processo Civil e Direito do Trabalho, MBA em Direito Tributário.
        Autor do livro <span className="text-[var(--brand-primary)] font-semibold">Manual do Superendividado</span>.
      </p>

      <Link to={createPageUrl("About")}>
        <Button 
          size="lg" 
          className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] text-white w-full sm:w-auto"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Conheça Minha História
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </Link>
    </motion.div>
  );
}