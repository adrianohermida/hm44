import React from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { TrendingUp, Eye, Clock, MousePointer } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function PerformanceDashboard({ escritorioId }) {
  const { data: artigos = [] } = useQuery({
    queryKey: ['artigos-performance', escritorioId],
    queryFn: () => base44.entities.Blog.filter({ 
      escritorio_id: escritorioId,
      publicado: true 
    }, '-visualizacoes'),
    enabled: !!escritorioId
  });

  const topArtigos = artigos.slice(0, 10);
  
  const dadosVisualizacoes = topArtigos.map(a => ({
    titulo: a.titulo.substring(0, 30) + '...',
    visualizacoes: a.visualizacoes || 0
  }));

  const metricas = {
    totalVisualizacoes: artigos.reduce((acc, a) => acc + (a.visualizacoes || 0), 0),
    totalArtigos: artigos.length,
    mediaVisualizacoes: Math.round(artigos.reduce((acc, a) => acc + (a.visualizacoes || 0), 0) / artigos.length) || 0
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          icon={Eye}
          titulo="Visualizações Totais"
          valor={metricas.totalVisualizacoes.toLocaleString()}
          cor="blue"
        />
        <MetricCard
          icon={TrendingUp}
          titulo="Artigos Publicados"
          valor={metricas.totalArtigos}
          cor="green"
        />
        <MetricCard
          icon={MousePointer}
          titulo="Média/Artigo"
          valor={metricas.mediaVisualizacoes}
          cor="purple"
        />
        <MetricCard
          icon={Clock}
          titulo="Taxa Engajamento"
          valor="Em breve"
          cor="yellow"
        />
      </div>

      <Card className="p-6">
        <h3 className="font-bold mb-4">Top 10 Artigos por Visualizações</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dadosVisualizacoes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="titulo" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="visualizacoes" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function MetricCard({ icon: Icon, titulo, valor, cor }) {
  const cores = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  };

  return (
    <Card className="p-4">
      <div className={`w-10 h-10 rounded-lg ${cores[cor]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm text-gray-600">{titulo}</p>
      <p className="text-2xl font-bold">{valor}</p>
    </Card>
  );
}