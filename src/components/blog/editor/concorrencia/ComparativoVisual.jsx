import React from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function ComparativoVisual({ concorrentes }) {
  if (!concorrentes || concorrentes.length === 0) return null;

  const dadosChart = concorrentes.map(c => ({
    nome: `#${c.ranking}`,
    'Score SEO': c.score_seo || 0,
    'DA': c.domain_authority || 0,
    'Palavras': Math.round((c.palavra_count || 0) / 100)
  }));

  const mediaScoreSEO = Math.round(
    concorrentes.reduce((acc, c) => acc + (c.score_seo || 0), 0) / concorrentes.length
  );

  const mediaDA = Math.round(
    concorrentes.reduce((acc, c) => acc + (c.domain_authority || 0), 0) / concorrentes.length
  );

  const mediaTrafego = Math.round(
    concorrentes.reduce((acc, c) => acc + (c.trafego_organico_estimado || 0), 0) / concorrentes.length
  );

  return (
    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <h4 className="font-bold text-sm mb-3">📊 Comparativo Visual</h4>
      
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={dadosChart}>
          <XAxis dataKey="nome" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="Score SEO" fill="#3b82f6" />
          <Bar dataKey="DA" fill="#f59e0b" />
          <Bar dataKey="Palavras" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="bg-white p-2 rounded border text-center">
          <p className="text-xs text-gray-600">Média Score</p>
          <p className="text-lg font-bold text-blue-600">{mediaScoreSEO}</p>
        </div>
        <div className="bg-white p-2 rounded border text-center">
          <p className="text-xs text-gray-600">Média DA</p>
          <p className="text-lg font-bold text-orange-600">{mediaDA}</p>
        </div>
        <div className="bg-white p-2 rounded border text-center">
          <p className="text-xs text-gray-600">Média Tráfego</p>
          <p className="text-xs font-bold text-green-600">
            {mediaTrafego.toLocaleString()}/mês
          </p>
        </div>
      </div>
    </Card>
  );
}