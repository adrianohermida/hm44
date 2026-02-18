import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LegalDisclaimerCollapsible() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg p-4 mt-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[var(--brand-warning)]" />
          <span className="font-semibold text-sm text-[var(--text-primary)]">
            Aviso Legal
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-3">
              As informações disponibilizadas neste site têm caráter exclusivamente educacional e não constituem consultoria gratuita. Para atendimento jurídico, é necessário agendar consulta e solicitar proposta de honorários. Este site não possui qualquer vínculo, afiliação ou endosso por parte do Google ou do Facebook. A Hermida Maia Advocacia é uma sociedade unipessoal de advocacia independente, que não presta serviços públicos, de débito ou relacionados a documentos governamentais. Todos os serviços advocatícios são realizados em estrita conformidade com a legislação vigente e com o Código de Ética e Disciplina da OAB.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}