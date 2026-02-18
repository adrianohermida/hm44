import React from 'react';
import { Clock, Star } from 'lucide-react';

export default function AnalyticsMetricsCards({ kpis }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-[var(--bg-elevated)] p-6 rounded-lg border border-[var(--border-primary)]">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-[var(--brand-primary)]" />
          <h3 className="font-semibold">Tempo Médio de Resolução</h3>
        </div>
        <p className="text-4xl font-bold">{kpis.tempoMedioResolucao}h</p>
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          Do momento da abertura até resolução completa
        </p>
      </div>

      <div className="bg-[var(--bg-elevated)] p-6 rounded-lg border border-[var(--border-primary)]">
        <div className="flex items-center gap-3 mb-4">
          <Star className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold">Satisfação Média</h3>
        </div>
        <p className="text-4xl font-bold">{kpis.satisfacaoMedia}</p>
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          Baseado em avaliações dos clientes (0-5)
        </p>
      </div>
    </div>
  );
}