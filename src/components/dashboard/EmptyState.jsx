import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

export default function EmptyState({ onCreateResume }) {
  return (
    <div className="text-center py-12 md:py-16">
      <div className="w-20 h-20 md:w-24 md:h-24 bg-[var(--bg-secondary)] rounded-full mx-auto mb-6 flex items-center justify-center">
        <FileText className="w-10 h-10 md:w-12 md:h-12 text-[var(--text-tertiary)]" />
      </div>
      <h3 className="text-xl md:text-2xl font-semibold text-[var(--text-primary)] mb-4">
        Nenhum documento ainda
      </h3>
      <p className="text-sm md:text-base text-[var(--text-secondary)] mb-8 max-w-md mx-auto px-4">
        Comece criando seu primeiro documento. Leva apenas alguns minutos!
      </p>
      <Button
        onClick={onCreateResume}
        size="lg"
        className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
      >
        <Plus className="w-5 h-5 mr-2" />
        Criar Primeiro Documento
      </Button>
    </div>
  );
}