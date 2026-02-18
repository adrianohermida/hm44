import React from 'react';
import PageSpeedMonitor from '@/components/blog/performance/PageSpeedMonitor';
import FunilComGraficos from '@/components/blog/seo/FunilComGraficos';
import AnaliseFunilConteudo from '@/components/blog/seo/AnaliseFunilConteudo';
import IntencaoBuscaComTarefas from '@/components/blog/seo/IntencaoBuscaComTarefas';

export default function PerformanceSEO({ escritorioId, keywords }) {
  if (!escritorioId) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">SEO & Velocidade</h3>
      <PageSpeedMonitor url={`${window.location.origin}/Blog`} />
      <FunilComGraficos escritorioId={escritorioId} />
      <div className="grid lg:grid-cols-2 gap-6 auto-rows-fr">
        <AnaliseFunilConteudo escritorioId={escritorioId} />
        <IntencaoBuscaComTarefas 
          keywords={keywords.map(k => k.keyword)}
          escritorioId={escritorioId}
        />
      </div>
    </div>
  );
}