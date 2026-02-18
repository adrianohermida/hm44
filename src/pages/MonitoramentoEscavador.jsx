import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, DollarSign, Activity, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { createPageUrl } from '@/utils';
import LoadingState from '@/components/common/LoadingState';
import { useEscritorio } from '@/components/hooks/useEscritorio';

export default function MonitoramentoEscavador() {
  const { data: escritorio } = useEscritorio();

  const { data: provedor } = useQuery({
    queryKey: ['provedor-escavador'],
    queryFn: async () => {
      if (!escritorio?.id) return null;
      const [p] = await base44.entities.ProvedorAPI.filter({ 
        escritorio_id: escritorio.id,
        nome: 'Escavador'
      });
      return p;
    },
    enabled: !!escritorio?.id
  });

  const { data: saldo, refetch: refetchSaldo } = useQuery({
    queryKey: ['saldo-escavador'],
    queryFn: async () => {
      const { data } = await base44.functions.invoke('consultarSaldoEscavador');
      return data;
    },
    enabled: !!provedor,
    refetchInterval: 60000
  });

  const { data: consumos = [], isLoading } = useQuery({
    queryKey: ['consumo-escavador', escritorio?.id],
    queryFn: async () => {
      if (!escritorio?.id || !provedor?.id) return [];
      return await base44.entities.ConsumoAPIExterna.filter({ 
        escritorio_id: escritorio.id,
        provedor_id: provedor.id
      });
    },
    enabled: !!escritorio?.id && !!provedor?.id
  });

  if (isLoading) return <LoadingState />;

  const hoje = new Date().toISOString().split('T')[0];
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  const consumoHoje = consumos.filter(c => c.created_date?.startsWith(hoje));
  const consumoMes = consumos.filter(c => c.created_date >= inicioMes);

  const creditosHoje = consumoHoje.reduce((sum, c) => sum + (c.creditos_consumidos || 0), 0);
  const creditosMes = consumoMes.reduce((sum, c) => sum + (c.creditos_consumidos || 0), 0);

  const limiteDiario = provedor?.quota_config?.limite_diario || 1000;
  const limiteMensal = provedor?.quota_config?.limite_mensal || 30000;

  const percentDia = (creditosHoje / limiteDiario) * 100;
  const percentMes = (creditosMes / limiteMensal) * 100;

  // Por usuário
  const porUsuario = consumos.reduce((acc, c) => {
    const email = c.executado_por || 'Sistema';
    if (!acc[email]) acc[email] = { email, creditos: 0, requisicoes: 0 };
    acc[email].creditos += c.creditos_consumidos || 0;
    acc[email].requisicoes += 1;
    return acc;
  }, {});

  const rankingUsuarios = Object.values(porUsuario).sort((a, b) => b.creditos - a.creditos);

  // Por dia (últimos 7 dias)
  const ultimos7dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const consumoPorDia = ultimos7dias.map(dia => ({
    data: dia,
    creditos: consumos.filter(c => c.created_date?.startsWith(dia)).reduce((s, c) => s + (c.creditos_consumidos || 0), 0),
    requisicoes: consumos.filter(c => c.created_date?.startsWith(dia)).length
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[
        { label: 'Conectores', url: createPageUrl('AdminProvedores') },
        { label: 'Monitoramento Escavador' }
      ]} />

      <h1 className="text-3xl font-bold mb-6">Monitoramento API Escavador</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Saldo Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {saldo?.sucesso ? saldo.quantidade_creditos : '...'}
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              {saldo?.sucesso ? saldo.saldo_descricao : 'Carregando...'}
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => refetchSaldo()}
              className="mt-2 h-6 text-xs"
            >
              Atualizar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creditosHoje}</div>
            <Progress value={percentDia} className="mt-2" />
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              {percentDia.toFixed(1)}% de {limiteDiario}
            </p>
            {percentDia >= 80 && (
              <Badge variant="destructive" className="mt-2">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {percentDia >= 100 ? 'Limite atingido' : 'Alerta 80%'}
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Este Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creditosMes}</div>
            <Progress value={percentMes} className="mt-2" />
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              {percentMes.toFixed(1)}% de {limiteMensal}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Requisições
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consumoHoje.length}</div>
            <p className="text-xs text-[var(--text-tertiary)]">Hoje</p>
            <p className="text-sm mt-2">{consumoMes.length} no mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Taxa Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {consumoMes.length > 0 ? ((consumoMes.filter(c => c.sucesso).length / consumoMes.length) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-[var(--text-tertiary)]">
              {consumoMes.filter(c => c.sucesso).length} de {consumoMes.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Consumo Últimos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={consumoPorDia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="creditos" fill="var(--brand-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Ranking por Usuário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rankingUsuarios.slice(0, 5).map((u, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{i + 1}º</Badge>
                    <span className="text-sm">{u.email}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{u.creditos} créditos</div>
                    <div className="text-xs text-[var(--text-tertiary)]">{u.requisicoes} req</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}