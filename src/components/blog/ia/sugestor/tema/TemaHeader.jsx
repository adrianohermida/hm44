import React from "react";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function TemaHeader({ tema }) {
  const getDificuldadeColor = (dif) => {
    if (dif >= 70) return 'bg-red-100 text-red-800 border-red-200';
    if (dif >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getTendenciaIcon = (tend) => {
    if (tend === 'crescente') return <TrendingUp className="w-3 h-3 text-green-600" aria-hidden="true" />;
    if (tend === 'declinante') return <TrendingDown className="w-3 h-3 text-red-600" aria-hidden="true" />;
    return <Minus className="w-3 h-3 text-gray-600" aria-hidden="true" />;
  };

  const getPotencialColor = (pot) => {
    if (pot === 'alto') return 'bg-emerald-100 text-emerald-800';
    if (pot === 'medio') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex-1">
      <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 line-clamp-2">
        {tema.titulo}
      </h4>
      <div className="flex flex-wrap gap-2 text-xs">
        <Badge variant="outline" className="flex items-center gap-1">
          {getTendenciaIcon(tema.tendencia)}
          {tema.tendencia}
        </Badge>
        <Badge className={getDificuldadeColor(tema.dificuldade_ranqueamento || 0)}>
          Dif. {tema.dificuldade_ranqueamento || 0}/100
        </Badge>
        <Badge className={getPotencialColor(tema.potencial_conversao || 'baixo')}>
          Conversão: {tema.potencial_conversao || 'baixo'}
        </Badge>
      </div>
    </div>
  );
}