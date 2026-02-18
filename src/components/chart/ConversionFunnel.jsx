import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Conversion funnel visual component
 * Mostra fluxo Lead → Qualified → Proposal → Won
 */
export default function ConversionFunnel({ 
  stages = [
    { label: 'Leads', value: 100, color: 'bg-blue-100' },
    { label: 'Qualificados', value: 65, color: 'bg-blue-200' },
    { label: 'Propostas', value: 45, color: 'bg-blue-300' },
    { label: 'Ganhos', value: 28, color: 'bg-blue-400' },
  ] 
}) {
  const maxValue = Math.max(...stages.map(s => s.value));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Funil de Conversão</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stages.map((stage, idx) => {
          const percentage = (stage.value / maxValue) * 100;
          const conversionRate = idx === 0 
            ? 100 
            : Math.round((stage.value / stages[idx - 1].value) * 100);

          return (
            <div key={stage.label}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {stage.label}
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">
                  {stage.value} ({conversionRate}%)
                </span>
              </div>
              <div className="h-8 rounded-lg overflow-hidden bg-[var(--bg-tertiary)]">
                <div
                  className={`${stage.color} h-full flex items-center justify-center text-xs font-semibold transition-all`}
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 15 && <span className="text-gray-800">{percentage.toFixed(0)}%</span>}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}