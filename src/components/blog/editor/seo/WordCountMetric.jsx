import React from "react";

export default function WordCountMetric({ totalPalavras }) {
  return (
    <div className="bg-white p-3 rounded border">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold">Contagem de Palavras</span>
        <span className={`text-lg font-bold ${
          totalPalavras >= 1000 ? 'text-green-600' : 
          totalPalavras >= 600 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {totalPalavras}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all ${
            totalPalavras >= 1000 ? 'bg-green-600' : 
            totalPalavras >= 600 ? 'bg-yellow-600' : 'bg-red-600'
          }`}
          style={{ width: `${Math.min((totalPalavras / 1500) * 100, 100)}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-1">
        {totalPalavras < 600 ? '⚠️ Muito curto. Recomendado: 1000+ palavras' :
         totalPalavras < 1000 ? '✓ Bom. Ótimo seria 1000+ palavras' :
         '✓ Excelente! Conteúdo completo'}
      </p>
    </div>
  );
}