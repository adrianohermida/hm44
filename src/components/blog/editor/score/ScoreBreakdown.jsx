import React from "react";
import ScoreDetailBadge from "./ScoreDetailBadge";

export default function ScoreBreakdown({ breakdown }) {
  if (!breakdown) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-gray-700 mb-2">Detalhamento do Score:</p>
      <ScoreDetailBadge label="Título SEO" score={breakdown.titulo || 0} max={20} />
      <ScoreDetailBadge label="Meta Description" score={breakdown.meta_description || 0} max={20} />
      <ScoreDetailBadge label="Tamanho" score={breakdown.tamanho || 0} max={20} />
      <ScoreDetailBadge label="Estrutura" score={breakdown.estrutura || 0} max={20} />
      <ScoreDetailBadge label="Keywords" score={breakdown.keywords || 0} max={10} />
      <ScoreDetailBadge label="Imagem" score={breakdown.imagem || 0} max={10} />
    </div>
  );
}