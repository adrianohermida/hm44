import React from "react";
import { Lightbulb, CheckCircle } from "lucide-react";

export default function InsightsPanel({ insights }) {
  if (!insights || !insights.recomendacoes) return null;

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-5 h-5 text-yellow-600" />
        <h4 className="font-bold text-sm">Insights Competitivos</h4>
      </div>

      <div className="space-y-3 text-xs">
        {insights.recomendacoes?.map((rec, i) => (
          <div key={i} className="flex gap-2 bg-white p-2 rounded">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-gray-700">{rec}</p>
          </div>
        ))}
      </div>

      {insights.gap_oportunidade && (
        <div className="mt-3 p-2 bg-white rounded border-l-4 border-blue-500">
          <p className="text-xs font-semibold text-blue-900 mb-1">🎯 Oportunidade de Gap</p>
          <p className="text-xs text-gray-700">{insights.gap_oportunidade}</p>
        </div>
      )}
    </div>
  );
}