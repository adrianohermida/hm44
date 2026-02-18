import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tooltip } from '@/components/ui/tooltip';
import { format, subDays, eachDayOfInterval } from 'date-fns';

export default function AvailabilityHeatmap({ historico = [], provedores = [] }) {
  const hoje = new Date();
  const ultimos7Dias = eachDayOfInterval({
    start: subDays(hoje, 6),
    end: hoje
  });

  const heatmapData = provedores.map(provedor => {
    const dias = ultimos7Dias.map(dia => {
      const diaStr = format(dia, 'yyyy-MM-dd');
      const testes = historico.filter(h => 
        h.provedor_id === provedor.id && 
        format(new Date(h.created_date), 'yyyy-MM-dd') === diaStr
      );
      
      const saudavel = testes.filter(t => t.saude === 'Saudável').length;
      const total = testes.length;
      const taxa = total > 0 ? (saudavel / total) * 100 : null;
      
      return { dia: diaStr, taxa, total };
    });
    
    return { provedor, dias };
  });

  const getColor = (taxa) => {
    if (taxa === null) return '#f3f4f6';
    if (taxa >= 95) return '#10b981';
    if (taxa >= 80) return '#fbbf24';
    return '#ef4444';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[var(--text-primary)]">Disponibilidade (últimos 7 dias)</CardTitle>
      </CardHeader>
      <CardContent>
        {heatmapData.length > 0 ? (
          <div className="space-y-3">
            <div className="flex gap-2 text-xs text-[var(--text-secondary)] mb-2">
              <div className="w-32"></div>
              {ultimos7Dias.map(dia => (
                <div key={dia.toISOString()} className="flex-1 text-center">
                  {format(dia, 'EEE dd')}
                </div>
              ))}
            </div>
            
            {heatmapData.map(({ provedor, dias }) => (
              <div key={provedor.id} className="flex gap-2 items-center">
                <div className="w-32 truncate text-xs font-medium text-[var(--text-primary)]">
                  {provedor.nome}
                </div>
                {dias.map(({ dia, taxa, total }) => (
                  <div 
                    key={dia}
                    className="flex-1 aspect-square rounded cursor-pointer hover:ring-2 ring-[var(--brand-primary)] transition-all"
                    style={{ backgroundColor: getColor(taxa) }}
                    title={taxa !== null ? `${taxa.toFixed(0)}% (${total} testes)` : 'Sem dados'}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[var(--text-secondary)] py-8">
            Nenhum provedor cadastrado
          </p>
        )}
        
        <div className="flex items-center justify-end gap-4 mt-4 text-xs">
          <span className="text-[var(--text-secondary)]">Disponibilidade:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }} />
            <span>≥95%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fbbf24' }} />
            <span>80-94%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }} />
            <span>&lt;80%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f3f4f6' }} />
            <span>Sem dados</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}