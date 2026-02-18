import React from 'react';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

export default function SEOKeywordTable({ keywords }) {
  const getDificuldadeColor = (dif) => {
    const colors = {
      baixa: 'bg-green-100 text-green-700',
      media: 'bg-yellow-100 text-yellow-700',
      alta: 'bg-red-100 text-red-700',
    };
    return colors[dif] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Palavras-Chave Ativas</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-sm text-[var(--text-secondary)]">Keyword</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-[var(--text-secondary)]">Volume/mês</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-[var(--text-secondary)]">Dificuldade</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-[var(--text-secondary)]">CPC</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-[var(--text-secondary)]">Posição</th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((kw) => (
              <tr key={kw.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <p className="font-medium text-[var(--text-primary)]">{kw.keyword}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{kw.pagina_alvo}</p>
                </td>
                <td className="py-3 px-4 text-[var(--text-secondary)]">
                  {kw.volume_mensal?.toLocaleString('pt-BR')}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDificuldadeColor(kw.dificuldade)}`}>
                    {kw.dificuldade}
                  </span>
                </td>
                <td className="py-3 px-4 text-[var(--text-secondary)]">R$ {kw.cpc_medio?.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[var(--brand-primary)]" />
                    <span className="font-semibold">{kw.posicao_atual}º</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}