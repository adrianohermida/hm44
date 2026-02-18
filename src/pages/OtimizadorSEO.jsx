import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OtimizadorConteudo from "@/components/marketing/OtimizadorConteudo";
import Breadcrumb from "@/components/seo/Breadcrumb";
import { createPageUrl } from "@/utils";

export default function OtimizadorSEO() {
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("views");

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0];
    }
  });

  const { data: artigos = [], isLoading } = useQuery({
    queryKey: ['blog-otimizacao', escritorio?.id],
    queryFn: () => base44.entities.Blog.filter({
      publicado: true,
      escritorio_id: escritorio.id
    }),
    enabled: !!escritorio
  });

  const artigosFiltrados = artigos
    .filter(a => !busca || a.titulo?.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => {
      if (ordenacao === 'views') return (b.visualizacoes || 0) - (a.visualizacoes || 0);
      if (ordenacao === 'recent') return new Date(b.data_publicacao) - new Date(a.data_publicacao);
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Breadcrumb items={[
        { label: 'Marketing', url: createPageUrl('Marketing') },
        { label: 'Otimizador SEO' }
      ]} />
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          Otimizador SEO de Conteúdo
        </h1>
        <p className="text-gray-600">Análise e otimização contínua de artigos publicados</p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar artigos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={ordenacao} onValueChange={setOrdenacao}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="views">Mais Visualizados</SelectItem>
            <SelectItem value="recent">Mais Recentes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          {artigosFiltrados.map(artigo => (
            <div key={artigo.id} className="bg-white rounded-xl shadow p-6">
              <div className="mb-4">
                <h3 className="font-bold text-xl mb-2">{artigo.titulo}</h3>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>{artigo.visualizacoes || 0} visualizações</span>
                  <span>{new Date(artigo.data_publicacao).toLocaleDateString()}</span>
                  <span className="capitalize">{artigo.categoria?.replace('_', ' ')}</span>
                </div>
              </div>
              <OtimizadorConteudo artigo={artigo} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}