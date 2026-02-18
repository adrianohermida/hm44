import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function SuccessRateChart({ historico = [] }) {
  const provedorStats = historico.reduce((acc, h) => {
    if (!acc[h.provedor_id]) {
      acc[h.provedor_id] = { total: 0, saudavel: 0, degradado: 0, indisponivel: 0 };
    }
    acc[h.provedor_id].total++;
    if (h.saude === 'Saudável') acc[h.provedor_id].saudavel++;
    else if (h.saude === 'Degradado') acc[h.provedor_id].degradado++;
    else acc[h.provedor_id].indisponivel++;
    return acc;
  }, {});

  const chartData = Object.entries(provedorStats).map(([id, stats]) => ({
    provedor: id.substring(0, 8),
    sucesso: Math.round((stats.saudavel / stats.total) * 100),
    degradado: Math.round((stats.degradado / stats.total) * 100),
    falha: Math.round((stats.indisponivel / stats.total) * 100)
  }));

  const getColor = (value) => {
    if (value >= 95) return '#10b981';
    if (value >= 80) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[var(--text-primary)]">Taxa de Sucesso por Provedor</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="provedor" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} label={{ value: 'Sucesso (%)', angle: -90, position: 'insideLeft', fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="sucesso" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.sucesso)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-[var(--text-secondary)] py-12">
            Execute testes de saúde para visualizar taxa de sucesso
          </p>
        )}
        
        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-[var(--text-secondary)]">≥ 95%</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="text-[var(--text-secondary)]">80-94%</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-[var(--text-secondary)]">&lt; 80%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}