import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { TrendingUp, Eye, Clock, Users } from "lucide-react";

export default React.memo(function BlogAnalytics({ escritorioId }) {
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-700">Erro ao carregar analytics: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData || analyticsData.totalArtigos === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">Nenhum artigo publicado ainda</p>
      </div>
    );
  }

  const { 
    totalVisitas, 
    artigosRecentes, 
    mediaVisualizacoes, 
    totalArtigos,
    topArtigos 
  } = analyticsData;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <Eye className="w-8 h-8 mb-2 text-blue-600" />
          <div className="text-2xl font-bold">{totalVisitas.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total de Views</div>
        </Card>

        <Card className="p-4">
          <TrendingUp className="w-8 h-8 mb-2 text-green-600" />
          <div className="text-2xl font-bold">{artigosRecentes}</div>
          <div className="text-sm text-gray-600">Publicados (30d)</div>
        </Card>

        <Card className="p-4">
          <Clock className="w-8 h-8 mb-2 text-orange-600" />
          <div className="text-2xl font-bold">{mediaVisualizacoes}</div>
          <div className="text-sm text-gray-600">Média Views/Artigo</div>
        </Card>

        <Card className="p-4">
          <Users className="w-8 h-8 mb-2 text-purple-600" />
          <div className="text-2xl font-bold">{totalArtigos}</div>
          <div className="text-sm text-gray-600">Total Artigos</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Top 5 Mais Lidos</h3>
        {topArtigos && topArtigos.length > 0 ? (
          <div className="space-y-3">
            {topArtigos.map((art, i) => (
              <div key={art.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--brand-primary-100)] flex items-center justify-center font-bold text-[var(--brand-primary)]">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{art.titulo}</p>
                  <p className="text-xs text-gray-500">{art.categoria}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{art.visualizacoes || 0}</p>
                  <p className="text-xs text-gray-500">views</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Nenhum artigo publicado ainda.</p>
        )}
      </Card>
    </div>
  );
});