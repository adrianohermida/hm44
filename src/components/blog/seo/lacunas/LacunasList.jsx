import React from "react";
import { Badge } from "@/components/ui/badge";
import { Target, MessageCircle, TrendingUp } from "lucide-react";

export default function LacunasList({ lacunas }) {
  if (!lacunas) return null;

  const getDificuldadeColor = (dif) => {
    if (dif >= 70) return 'bg-red-100 text-red-800';
    if (dif >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-3">
      {lacunas.topicos_faltando && lacunas.topicos_faltando.length > 0 && (
        <div className="bg-white p-3 rounded-lg border">
          <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
            <Target className="w-3 h-3" aria-hidden="true" />
            Tópicos Faltando
          </p>
          <ul className="space-y-1">
            {lacunas.topicos_faltando.slice(0, 5).map((topico, i) => (
              <li key={i} className="text-xs text-gray-600 flex gap-2">
                <span className="text-orange-600 flex-shrink-0">•</span>
                <span>{topico}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {lacunas.perguntas_frequentes && lacunas.perguntas_frequentes.length > 0 && (
        <div className="bg-white p-3 rounded-lg border">
          <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
            <MessageCircle className="w-3 h-3" aria-hidden="true" />
            Perguntas Frequentes
          </p>
          <ul className="space-y-1">
            {lacunas.perguntas_frequentes.slice(0, 5).map((pergunta, i) => (
              <li key={i} className="text-xs text-gray-600 flex gap-2">
                <span className="text-orange-600 flex-shrink-0">?</span>
                <span>{pergunta}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {lacunas.oportunidades && lacunas.oportunidades.length > 0 && (
        <div className="bg-white p-3 rounded-lg border">
          <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" aria-hidden="true" />
            Oportunidades
          </p>
          <div className="space-y-2">
            {lacunas.oportunidades.slice(0, 5).map((opp, i) => (
              <div key={i} className="p-2 bg-orange-50 rounded border border-orange-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-2">{opp.titulo}</p>
                  <Badge className={getDificuldadeColor(opp.dificuldade_ranqueamento || 0)} variant="outline">
                    {opp.dificuldade_ranqueamento || 0}/100
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="secondary" className="text-xs">
                    {(opp.volume_busca_estimado || 0).toLocaleString('pt-BR')}/mês
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {opp.tipo_conteudo || 'artigo'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}