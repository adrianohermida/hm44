import React from "react";
import { Target, TrendingUp, Clock, Award } from "lucide-react";

export default function AutoridadeMetricas({ metricas }) {
  if (!metricas) return null;

  const getDificuldadeColor = (dificuldade) => {
    if (dificuldade >= 70) return 'text-red-600';
    if (dificuldade >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-white p-3 rounded-lg border">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-4 h-4 text-purple-600" aria-hidden="true" />
          <span className="text-xs text-gray-600">Dificuldade</span>
        </div>
        <p className={`text-xl font-bold ${getDificuldadeColor(metricas.dificuldade_ranqueamento || 0)}`}>
          {metricas.dificuldade_ranqueamento || 0}/100
        </p>
      </div>

      <div className="bg-white p-3 rounded-lg border">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-blue-600" aria-hidden="true" />
          <span className="text-xs text-gray-600">Tráfego/mês</span>
        </div>
        <p className="text-xl font-bold text-blue-600">
          {(metricas.projecao_trafego_mensal || 0).toLocaleString('pt-BR')}
        </p>
      </div>

      <div className="bg-white p-3 rounded-lg border">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-orange-600" aria-hidden="true" />
          <span className="text-xs text-gray-600">Tempo</span>
        </div>
        <p className="text-xl font-bold text-orange-600">
          {metricas.tempo_ranqueamento || 0} meses
        </p>
      </div>

      <div className="bg-white p-3 rounded-lg border">
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <span className="text-xs text-gray-600">DA Necessário</span>
        </div>
        <p className="text-xl font-bold text-emerald-600">
          {metricas.autoridade_necessaria || 0}/100
        </p>
      </div>
    </div>
  );
}