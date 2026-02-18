import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, DollarSign, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import ModuloNav from '@/components/conectores/ModuloNav';
import { createPageUrl } from '@/utils';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useResponsive from '@/components/hooks/useResponsive';
import { useEscritorio } from '@/components/hooks/useEscritorio';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsConsumo() {
  const { isMobile } = useResponsive();
  const [periodo, setPeriodo] = useState('7d');
  const [provedorFiltro, setProvedorFiltro] = useState('all');
  const { data: escritorio } = useEscritorio();
  const escritorioId = escritorio?.id;

  const { data: consumos = [], isLoading: loadingConsumos } = useQuery({
    queryKey: ['consumo-api', escritorioId, periodo],
    queryFn: async () => {
      const all = await base44.entities.ConsumoAPIExterna.filter({ 
        escritorio_id: escritorioId 
      }, '-created_date', 1000);
      
      const dias = periodo === '7d' ? 7 : periodo === '30d' ? 30 : 90;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - dias);
      
      return all.filter(c => new Date(c.created_date) >= cutoff);
    },
    enabled: !!escritorioId,
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  const { data: logs = [], isLoading: loadingLogs } = useQuery({
    queryKey: ['logs-api', escritorioId, periodo],
    queryFn: async () => {
      const all = await base44.entities.LogRequisicaoAPI.filter({ 
        escritorio_id: escritorioId 
      }, '-created_date', 1000);
      
      const dias = periodo === '7d' ? 7 : periodo === '30d' ? 30 : 90;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - dias);
      
      return all.filter(l => new Date(l.created_date) >= cutoff);
    },
    enabled: !!escritorioId,
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  const { data: provedores = [] } = useQuery({
    queryKey: ['provedores', escritorioId],
    queryFn: async () => {
      if (!escritorioId) return [];
      return await base44.entities.ProvedorAPI.filter({ escritorio_id: escritorioId });
    },
    enabled: !!escritorioId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  const { data: endpoints = [] } = useQuery({
    queryKey: ['endpoints', escritorioId],
    queryFn: async () => {
      if (!escritorioId) return [];
      return await base44.entities.EndpointAPI.filter({ escritorio_id: escritorioId });
    },
    enabled: !!escritorioId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  const analytics = useMemo(() => {
    if (!consumos.length) return null;

    const filtrado = provedorFiltro === 'all' 
      ? consumos 
      : consumos.filter(c => c.provedor_id === provedorFiltro);

    // Métricas gerais
    const totalConsumo = filtrado.reduce((sum, c) => sum + (c.creditos_consumidos || 0), 0);
    const totalCusto = filtrado.reduce((sum, c) => sum + (c.custo_estimado || 0), 0);
    const tempoMedio = filtrado.reduce((sum, c) => sum + (c.tempo_resposta_ms || 0), 0) / filtrado.length;
    const taxaSucesso = (filtrado.filter(c => c.sucesso).length / filtrado.length) * 100;

    // Consumo por provedor (com validação)
    const porProvedor = {};
    filtrado.forEach(c => {
      if (!c.provedor_id) return;
      const prov = provedores.find(p => p.id === c.provedor_id);
      const nome = prov?.nome || `Provedor ${c.provedor_id.substring(0, 8)}`;
      if (!porProvedor[nome]) {
        porProvedor[nome] = { creditos: 0, custo: 0, count: 0, provedor_id: c.provedor_id };
      }
      porProvedor[nome].creditos += c.creditos_consumidos || 0;
      porProvedor[nome].custo += c.custo_estimado || 0;
      porProvedor[nome].count += 1;
    });

    const dataProvedor = Object.entries(porProvedor).map(([nome, data]) => ({
      nome,
      creditos: data.creditos,
      custo: data.custo,
      chamadas: data.count
    }));

    // Consumo por endpoint (com validação)
    const porEndpoint = {};
    filtrado.forEach(c => {
      if (!c.endpoint_id) return;
      const ep = endpoints.find(e => e.id === c.endpoint_id);
      const nome = ep?.nome || `Endpoint ${c.endpoint_id.substring(0, 8)}`;
      if (!porEndpoint[nome]) {
        porEndpoint[nome] = { creditos: 0, chamadas: 0, tempo: 0, endpoint_id: c.endpoint_id };
      }
      porEndpoint[nome].creditos += c.creditos_consumidos || 0;
      porEndpoint[nome].chamadas += 1;
      porEndpoint[nome].tempo += c.tempo_resposta_ms || 0;
    });

    const dataEndpoint = Object.entries(porEndpoint)
      .map(([nome, data]) => ({
        nome,
        creditos: data.creditos,
        chamadas: data.chamadas,
        tempoMedio: Math.round(data.tempo / data.chamadas)
      }))
      .sort((a, b) => b.chamadas - a.chamadas)
      .slice(0, 10);

    // Timeline (últimos 7 dias)
    const hoje = new Date();
    const timeline = [];
    for (let i = 6; i >= 0; i--) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);
      const dataStr = data.toISOString().split('T')[0];
      
      const diaConsumos = filtrado.filter(c => {
        const cData = new Date(c.created_date).toISOString().split('T')[0];
        return cData === dataStr;
      });

      timeline.push({
        dia: data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        chamadas: diaConsumos.length,
        creditos: diaConsumos.reduce((s, c) => s + (c.creditos_consumidos || 0), 0),
        custo: diaConsumos.reduce((s, c) => s + (c.custo_estimado || 0), 0)
      });
    }

    // Distribuição de latência
    const distribuicaoLatencia = [
      { range: '< 100ms', count: 0 },
      { range: '100-500ms', count: 0 },
      { range: '500ms-1s', count: 0 },
      { range: '1-3s', count: 0 },
      { range: '> 3s', count: 0 }
    ];

    filtrado.forEach(c => {
      const tempo = c.tempo_resposta_ms || 0;
      if (tempo < 100) distribuicaoLatencia[0].count++;
      else if (tempo < 500) distribuicaoLatencia[1].count++;
      else if (tempo < 1000) distribuicaoLatencia[2].count++;
      else if (tempo < 3000) distribuicaoLatencia[3].count++;
      else distribuicaoLatencia[4].count++;
    });

    return {
      totalConsumo,
      totalCusto,
      tempoMedio,
      taxaSucesso,
      dataProvedor,
      dataEndpoint,
      timeline,
      distribuicaoLatencia
    };
  }, [consumos, provedorFiltro, provedores, endpoints]);

  if (loadingConsumos || loadingLogs) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <SkeletonLoader count={6} height="h-32" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[
        { label: 'Conectores & APIs', url: createPageUrl('AdminProvedores') },
        { label: 'Analytics de Consumo' }
      ]} />
      <ModuloNav />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Analytics de Consumo
        </h1>
        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          <Select value={provedorFiltro} onValueChange={setProvedorFiltro}>
            <SelectTrigger className="flex-1 sm:w-48">
              <SelectValue placeholder="Provedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Provedores</SelectItem>
              {provedores.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="flex-1 sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!analytics ? (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <p className="text-blue-800">Nenhum consumo registrado ainda</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
                  Total de Créditos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[var(--brand-primary)]" />
                  <span className="text-2xl font-bold">{analytics.totalConsumo.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
                  Custo Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold">
                    R$ {analytics.totalCusto.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
                  Latência Média
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl font-bold">
                    {Math.round(analytics.tempoMedio)}ms
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
                  Taxa de Sucesso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[var(--brand-primary)]" />
                  <span className="text-2xl font-bold">
                    {analytics.taxaSucesso.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Timeline de Consumo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                  <LineChart data={analytics.timeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" tick={{ fontSize: isMobile ? 10 : 12 }} />
                    <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: isMobile ? '11px' : '12px' }} />
                    <Line type="monotone" dataKey="chamadas" stroke="#10b981" name="Chamadas" />
                    <Line type="monotone" dataKey="creditos" stroke="#3b82f6" name="Créditos" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Consumo por Provedor</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                  <PieChart>
                    <Pie
                      data={analytics.dataProvedor}
                      dataKey="creditos"
                      nameKey="nome"
                      cx="50%"
                      cy="50%"
                      outerRadius={isMobile ? 70 : 100}
                      label={!isMobile}
                    >
                      {analytics.dataProvedor.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Top Endpoints por Chamadas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                  <BarChart data={analytics.dataEndpoint}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="nome" 
                      angle={-45} 
                      textAnchor="end" 
                      height={isMobile ? 80 : 100}
                      tick={{ fontSize: isMobile ? 9 : 11 }}
                    />
                    <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                    <Tooltip />
                    <Bar dataKey="chamadas" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Distribuição de Latência</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                  <BarChart data={analytics.distribuicaoLatencia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" tick={{ fontSize: isMobile ? 9 : 11 }} />
                    <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" name="Requisições" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}