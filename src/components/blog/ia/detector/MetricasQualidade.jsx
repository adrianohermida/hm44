import React from "react";
import { Progress } from "@/components/ui/progress";

export default function MetricasQualidade({ metricas }) {
  if (!metricas) return null;

  const metrics = [
    {
      label: 'Originalidade',
      value: 100 - (metricas.duplicacao_percentual || 0),
      color: 'bg-blue-600'
    },
    {
      label: 'Densidade de Informação',
      value: metricas.densidade_informacao || 0,
      color: 'bg-green-600'
    },
    {
      label: 'Profundidade Técnica',
      value: metricas.profundidade_tecnica || 0,
      color: 'bg-purple-600'
    }
  ];

  return (
    <div className="bg-gray-50 p-3 rounded-lg border space-y-3">
      <p className="text-xs font-bold text-gray-700">📊 Métricas Detalhadas</p>
      {metrics.map((metric, i) => (
        <div key={i}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">{metric.label}</span>
            <span className="font-bold">{Math.round(metric.value)}%</span>
          </div>
          <Progress value={metric.value} className="h-2" />
        </div>
      ))}
    </div>
  );
}