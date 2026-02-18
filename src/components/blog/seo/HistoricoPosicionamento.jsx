import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import HistoricoHeader from "./historico/HistoricoHeader";
import HistoricoChart from "./historico/HistoricoChart";
import HistoricoEmpty from "./historico/HistoricoEmpty";

export default function HistoricoPosicionamento({ artigoId }) {
  const [periodo, setPeriodo] = useState('30d');

  const { data: historico, isLoading } = useQuery({
    queryKey: ['historico-posicionamento', artigoId, periodo],
    queryFn: async () => {
      const artigo = await base44.entities.Blog.filter({ id: artigoId });
      if (!artigo[0]) return [];

      const otimizacoes = artigo[0].historico_otimizacoes || [];
      return otimizacoes
        .map(opt => ({
          data: opt.data || new Date().toISOString(),
          score_seo: opt.score_seo_novo || opt.score_seo || 0,
          posicao_estimada: calcularPosicaoEstimada(opt.score_seo_novo || 0)
        }))
        .slice(-10);
    },
    enabled: !!artigoId
  });

  const calcularPosicaoEstimada = (score) => {
    if (score >= 90) return Math.floor(Math.random() * 3) + 1;
    if (score >= 70) return Math.floor(Math.random() * 7) + 4;
    if (score >= 50) return Math.floor(Math.random() * 10) + 11;
    return Math.floor(Math.random() * 20) + 21;
  };

  if (isLoading) {
    return (
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <p className="text-sm text-gray-600 text-center">Carregando histórico...</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
      <HistoricoHeader periodo={periodo} onPeriodoChange={setPeriodo} />
      {!historico || historico.length === 0 ? (
        <HistoricoEmpty />
      ) : (
        <HistoricoChart dados={historico} />
      )}
    </Card>
  );
}