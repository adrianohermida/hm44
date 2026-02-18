import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

export default function AutoridadeProjecao({ metricas }) {
  if (!metricas) return null;

  const getPotencialColor = (potencial) => {
    if (potencial === 'alto') return 'bg-green-100 text-green-800';
    if (potencial === 'medio') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-2">
      <div className="bg-white p-3 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-700">Volume Busca Estimado</span>
          <Badge variant="outline" className="text-xs">
            {(metricas.volume_busca_estimado || 0).toLocaleString('pt-BR')}/mês
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700">Potencial Conversão</span>
          <Badge className={getPotencialColor(metricas.potencial_conversao || 'baixo')}>
            {metricas.potencial_conversao || 'baixo'}
          </Badge>
        </div>
      </div>

      {metricas.recomendacoes && metricas.recomendacoes.length > 0 && (
        <div className="bg-white p-3 rounded-lg border">
          <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
            Recomendações
          </p>
          <ul className="space-y-1">
            {metricas.recomendacoes.map((rec, i) => (
              <li key={i} className="text-xs text-gray-600 flex gap-2">
                <span className="text-purple-600 flex-shrink-0">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}