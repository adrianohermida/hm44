import React from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageSquare className="w-8 h-8 text-[var(--brand-primary)]" />
            <h1 className="text-5xl font-bold text-[var(--text-primary)]">Entre em Contato</h1>
          </div>
          <p className="text-xl text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto">
            Tem dúvidas sobre suas dívidas ou precisa de orientação jurídica? 
            Nossa equipe está pronta para ajudar você a recuperar sua liberdade financeira.
          </p>
        </motion.div>
      </div>
    </section>
  );
}