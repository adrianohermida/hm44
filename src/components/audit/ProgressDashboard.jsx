import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, Activity, CheckCircle2, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function ProgressDashboard({ escritorioId }) {
  const { data: violations = [] } = useQuery({
    queryKey: ['auditoria-violacoes', escritorioId],
    queryFn: async () => {
      if (!escritorioId) return [];
      return await base44.entities.AuditoriaViolacao.filter({
        escritorio_id: escritorioId
      });
    },
    enabled: !!escritorioId
  });

  // Métricas
  const totalViolations = violations.length;
  const resolvedCount = violations.filter(v => v.status === 'resolved').length;
  const pendingCount = violations.filter(v => v.status === 'pending').length;
  const reintroducedCount = violations.filter(v => v.status === 'reintroduced').length;
  const resolutionRate = totalViolations > 0 ? ((resolvedCount / totalViolations) * 100).toFixed(1) : 0;

  // Progresso por severidade
  const criticalResolved = violations.filter(v => v.severity === 'critical' && v.status === 'resolved').length;
  const criticalTotal = violations.filter(v => v.severity === 'critical').length;
  const highResolved = violations.filter(v => v.severity === 'high' && v.status === 'resolved').length;
  const highTotal = violations.filter(v => v.severity === 'high').length;

  // Histórico semanal (últimos 7 dias)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const resolvedByDay = last7Days.map(day => {
    return violations.filter(v => 
      v.last_verified_date && 
      v.last_verified_date.startsWith(day) && 
      v.status === 'resolved'
    ).length;
  });

  const totalResolvedThisWeek = resolvedByDay.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
              Total de Violações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-3xl font-bold">{totalViolations}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
              Resolvidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-3xl font-bold text-green-600">{resolvedCount}</span>
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              {resolutionRate}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-3xl font-bold text-orange-600">{pendingCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
              Reintroduzidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <span className="text-3xl font-bold text-red-600">{reintroducedCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Progresso por Severidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Críticas</span>
                <Badge className="bg-red-600">
                  {criticalResolved}/{criticalTotal}
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all"
                  style={{ width: `${criticalTotal > 0 ? (criticalResolved / criticalTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Altas</span>
                <Badge className="bg-orange-600">
                  {highResolved}/{highTotal}
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all"
                  style={{ width: `${highTotal > 0 ? (highResolved / highTotal) * 100 : 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Semanal</CardTitle>
            <p className="text-sm text-[var(--text-secondary)]">
              Violações resolvidas nos últimos 7 dias
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-32">
              {resolvedByDay.map((count, i) => {
                const maxCount = Math.max(...resolvedByDay.filter(c => c > 0), 1);
                const heightPercent = count > 0 ? Math.max(20, (count / maxCount) * 100) : 0;
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-green-600 rounded-t transition-all"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-xs text-[var(--text-tertiary)]">
                      {last7Days[i].split('-')[2]}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-semibold text-green-700">
                {totalResolvedThisWeek} violações resolvidas esta semana
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Violações Resolvidas</CardTitle>
          <p className="text-sm text-[var(--text-secondary)]">
            Arquivos com maior redução de linhas
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {violations
              .filter(v => v.status === 'resolved')
              .sort((a, b) => (b.original_lines - b.current_lines) - (a.original_lines - a.current_lines))
              .slice(0, 5)
              .map((v, i) => (
                <div key={v.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-600">{i + 1}</Badge>
                    <div>
                      <p className="font-medium text-sm">{v.file_name}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{v.file_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-green-600" />
                    <span className="font-mono font-bold text-green-600">
                      -{v.original_lines - v.current_lines}L
                    </span>
                  </div>
                </div>
              ))}
            {violations.filter(v => v.status === 'resolved').length === 0 && (
              <p className="text-center text-[var(--text-tertiary)] py-4">
                Nenhuma violação resolvida ainda
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}