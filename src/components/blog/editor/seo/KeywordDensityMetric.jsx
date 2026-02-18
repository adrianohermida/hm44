import React from "react";
import { Info } from "lucide-react";

export default function KeywordDensityMetric({ keywords, keywordDensity }) {
  if (!keywords || keywords.length === 0) return null;

  return (
    <div className="bg-white p-3 rounded border">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold">Densidade de Palavras-chave</span>
        <Info className="w-3 h-3 text-gray-400" />
      </div>
      <div className="space-y-2">
        {keywords.slice(0, 5).map((kw, i) => {
          const density = parseFloat(keywordDensity[kw] || 0);
          const isOptimal = density >= 0.5 && density <= 2.5;
          return (
            <div key={i} className="text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium truncate">{kw}</span>
                <span className={`font-bold ${
                  isOptimal ? 'text-green-600' : 
                  density > 2.5 ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {density}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${
                    isOptimal ? 'bg-green-600' : 
                    density > 2.5 ? 'bg-red-600' : 'bg-yellow-600'
                  }`}
                  style={{ width: `${Math.min(density * 20, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-600 mt-2">
        💡 Ideal: 0.5-2.5% por palavra-chave
      </p>
    </div>
  );
}