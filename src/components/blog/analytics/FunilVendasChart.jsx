import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FunnelChart, Funnel, Cell, LabelList, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingDown, TrendingUp } from 'lucide-react';

export default function FunilVendasChart({ dados }) {
  const cores = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];
  
  const calcularTaxaConversao = (atual, anterior) => {
    return anterior > 0 ? ((atual / anterior) * 100).toFixed(1) : 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Funil de Vendas - Blog</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <FunnelChart>
            <Tooltip />
            <Funnel dataKey="value" data={dados}>
              {dados.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={cores[index]} />
              ))}
              <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
        
        <div className="mt-4 space-y-2">
          {dados.map((item, i) => {
            const anterior = dados[i - 1];
            const taxa = anterior ? calcularTaxaConversao(item.value, anterior.value) : 100;
            const perda = 100 - parseFloat(taxa);
            
            return i > 0 && (
              <div key={i} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                <span>{anterior.name} → {item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-green-600">{taxa}%</span>
                  {perda > 30 && (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}