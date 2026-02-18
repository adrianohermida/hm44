import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function LatencyTrendChart({ historico = [] }) {
  const dataAgrupada = historico
    .slice(0, 50)
    .reverse()
    .map(h => ({
      data: format(new Date(h.created_date), 'dd/MM HH:mm'),
      latencia: h.latencia_ms,
      provedor: h.provedor_id
    }));

  const latenciaMedia = historico.reduce((acc, h) => acc + h.latencia_ms, 0) / (historico.length || 1);
  const latenciaAnterior = historico.slice(25, 50).reduce((acc, h) => acc + h.latencia_ms, 0) / 25;
  const tendencia = latenciaMedia < latenciaAnterior;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[var(--text-primary)]">Tendência de Latência</CardTitle>
          <div className="flex items-center gap-2">
            {tendencia ? (
              <TrendingDown className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingUp className="w-4 h-4 text-red-600" />
            )}
            <span className={`text-sm font-medium ${tendencia ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(latenciaMedia - latenciaAnterior).toFixed(0)}ms
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {dataAgrupada.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dataAgrupada}>
              <defs>
                <linearGradient id="colorLatencia" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="data" 
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 11 }}
                label={{ value: 'Latência (ms)', angle: -90, position: 'insideLeft', fontSize: 11 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="latencia" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorLatencia)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-[var(--text-secondary)] py-12">
            Execute testes de saúde para visualizar tendências
          </p>
        )}
      </CardContent>
    </Card>
  );
}