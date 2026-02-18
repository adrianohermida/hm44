import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PerformanceMetrics from './PerformanceMetrics';
import KeywordsRanking from './KeywordsRanking';
import EngagementChart from './EngagementChart';
import PerformanceFilters from './PerformanceFilters';

export default React.memo(function BlogPerformanceDashboard({ escritorioId }) {
  const [filtros, setFiltros] = useState({ periodo: '30d', categoria: 'todas' });

  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['blog-real-analytics', escritorioId],
    queryFn: async () => {
      const { data } = await base44.functions.invoke('getBlogRealAnalytics', { 
        escritorioId 
      });
      return data.data;
    },
    enabled: !!escritorioId,
    retry: 3,
    staleTime: 5 * 60 * 1000
  });

  const { data: artigos = [] } = useQuery({
    queryKey: ['blog-artigos', escritorioId, filtros],
    queryFn: async () => {
      if (!escritorioId) return [];
      const query = { escritorio_id: escritorioId, publicado: true };
      if (filtros.categoria !== 'todas') query.categoria = filtros.categoria;
      return base44.entities.Blog.filter(query, '-created_date');
    },
    enabled: !!escritorioId,
    staleTime: 5 * 60 * 1000
  });

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-700">Erro ao carregar performance: {error.message}</p>
      </div>
    );
  }

  if (isLoading || !analyticsData) {
    return <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />;
  }

  const metricas = {
    totalVisitas: analyticsData.totalVisitas,
    scoreSEOMedio: analyticsData.scoreSEOMedio,
    taxaEngajamento: analyticsData.taxaEngajamento,
    totalComentarios: analyticsData.totalComentarios
  };

  // Keywords dos top artigos
  const keywords = analyticsData.topArtigos
    .slice(0, 5)
    .flatMap((art) => {
      const artigoFull = artigos.find(a => a.id === art.id);
      return artigoFull?.keywords?.slice(0, 2).map((kw) => ({
        palavra: kw,
        artigo_titulo: art.titulo,
        posicao: artigoFull.score_seo_atual || 0,
        tendencia: 'estavel',
        volume: art.visualizacoes || 0
      })) || [];
    });

  // Engajamento calculado
  const engajamento = analyticsData.topArtigos.slice(0, 8).map(art => ({
    artigo: art.titulo.substring(0, 20) + '...',
    compartilhamentos: 0,
    comentarios: Math.floor(art.visualizacoes * 0.05) // Estimativa
  }));

  return (
    <div className="space-y-6">
      <PerformanceFilters filtros={filtros} onChange={setFiltros} />
      <PerformanceMetrics metricas={metricas} />
      <div className="grid lg:grid-cols-2 gap-6">
        <KeywordsRanking keywords={keywords} />
        <EngagementChart dados={engajamento} />
      </div>
    </div>
  );
}