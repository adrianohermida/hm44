import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

export default function SolicitarAnaliseButton({ onClick, loading }) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className="bg-[var(--brand-primary)]"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Analisando...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 mr-2" />
          Gerar Análise IA
        </>
      )}
    </Button>
  );
}