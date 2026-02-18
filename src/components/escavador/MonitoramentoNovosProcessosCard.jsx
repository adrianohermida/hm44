import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

export default function MonitoramentoNovosProcessosCard({ monitor }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[var(--brand-primary)]" />
            <p className="font-semibold text-sm">{monitor.termo}</p>
          </div>
          <Badge variant="outline">{monitor.tipo}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {monitor.variacoes?.length > 0 && (
          <div className="text-xs">
            <span className="text-[var(--brand-text-tertiary)]">Variações:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {monitor.variacoes.map((v, i) => (
                <Badge key={i} variant="outline" className="text-xs">{v}</Badge>
              ))}
            </div>
          </div>
        )}
        {monitor.termos_auxiliares?.length > 0 && (
          <div className="text-xs flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>{monitor.termos_auxiliares.length} filtros ativos</span>
          </div>
        )}
        <p className="text-xs text-[var(--brand-text-secondary)]">
          {monitor.quantidade_resultados || 0} processos encontrados
        </p>
      </CardContent>
    </Card>
  );
}