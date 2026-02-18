import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Brain, Loader2 } from 'lucide-react';

export default function AIAnalysisProgress({ etapa, progresso }) {
  const etapas = [
    'Carregando documentação',
    'Analisando estrutura',
    'Extraindo endpoints',
    'Gerando schemas',
    'Finalizando'
  ];

  return (
    <div className="space-y-3 p-4 bg-[var(--bg-secondary)] rounded-lg">
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-500" />
        <span className="font-medium">Análise IA em andamento</span>
        <Loader2 className="w-4 h-4 animate-spin ml-auto" />
      </div>
      <Progress value={progresso} />
      <p className="text-xs text-[var(--text-secondary)]">{etapas[etapa] || 'Processando...'}</p>
    </div>
  );
}