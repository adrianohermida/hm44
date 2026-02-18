import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function ScoreComparison({ scoreAtual, mediaTop3 }) {
  if (!mediaTop3) return null;

  const diferenca = scoreAtual - mediaTop3;
  const Icon = diferenca > 0 ? TrendingUp : diferenca < 0 ? TrendingDown : Minus;
  const color = diferenca > 0 ? 'text-green-600' : diferenca < 0 ? 'text-red-600' : 'text-gray-600';

  return (
    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
      <p className="text-xs font-semibold text-blue-900 mb-2">vs. Top 3 Google</p>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs sm:text-sm text-gray-700">Média concorrentes:</span>
        <span className="text-base sm:text-lg font-bold text-gray-900">{mediaTop3}/100</span>
      </div>
      <div className={`flex items-center gap-1 mt-1 ${color}`} role="status">
        <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span className="text-xs sm:text-sm font-bold">
          {diferenca > 0 ? '+' : ''}{diferenca} pontos
        </span>
      </div>
    </div>
  );
}