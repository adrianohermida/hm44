import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function HeadingStructureMetric({ h2Count, h3Count }) {
  return (
    <div className="bg-white p-3 rounded border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold">Estrutura H2/H3</span>
        {h2Count >= 3 && h3Count >= 2 ? (
          <CheckCircle className="w-4 h-4 text-green-600" />
        ) : h2Count >= 2 ? (
          <AlertCircle className="w-4 h-4 text-yellow-600" />
        ) : (
          <AlertCircle className="w-4 h-4 text-red-600" />
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center justify-between bg-blue-50 px-2 py-1 rounded">
          <span>H2:</span>
          <span className="font-bold">{h2Count}</span>
        </div>
        <div className="flex items-center justify-between bg-purple-50 px-2 py-1 rounded">
          <span>H3:</span>
          <span className="font-bold">{h3Count}</span>
        </div>
      </div>
      <p className="text-xs text-gray-600 mt-2">
        {h2Count >= 3 && h3Count >= 2 ? '✓ Estrutura bem organizada' :
         h2Count >= 2 ? '⚠️ Adicione mais H2 e H3' :
         '❌ Estrutura insuficiente. Min: 3 H2 + 2 H3'}
      </p>
    </div>
  );
}