import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessMessage({ onBack }) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="w-24 h-24 bg-[var(--brand-primary-100)] rounded-full mx-auto mb-6 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-[var(--brand-primary)]" />
        </div>
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Mensagem Enviada!</h2>
        <p className="text-[var(--text-secondary)] mb-6">
          Obrigado por entrar em contato. Retornaremos em até 24 horas.
        </p>
        <Button onClick={onBack} variant="outline" className="border-[var(--border-primary)]">
          Enviar Outra Mensagem
        </Button>
      </motion.div>
    </div>
  );
}