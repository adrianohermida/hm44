import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function HistoricoChart({ dados }) {
  if (!dados || dados.length === 0) return null;

  const dadosFormatados = dados.map(d => ({
    ...d,
    dataFormatada: format(new Date(d.data), 'dd/MM', { locale: ptBR })
  }));

  return (
    <div className="space-y-3">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={dadosFormatados}>
          <XAxis dataKey="dataFormatada" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip 
            contentStyle={{ fontSize: 12 }}
            labelFormatter={(label) => `Data: ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="score_seo" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Score SEO"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white p-2 rounded border text-center">
          <p className="text-xs text-gray-600">Score Atual</p>
          <p className="text-base sm:text-lg font-bold text-blue-600">
            {dadosFormatados[dadosFormatados.length - 1]?.score_seo || 0}
          </p>
        </div>
        <div className="bg-white p-2 rounded border text-center">
          <p className="text-xs text-gray-600">Posição Est.</p>
          <p className="text-base sm:text-lg font-bold text-green-600">
            #{dadosFormatados[dadosFormatados.length - 1]?.posicao_estimada || '-'}
          </p>
        </div>
      </div>
    </div>
  );
}