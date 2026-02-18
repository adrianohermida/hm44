import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertCircle } from 'lucide-react';

export default function MonitoramentoCard({ monitoramento, onClick }) {
  const temNovas = (monitoramento.aparicoes_nao_visualizadas || 0) > 0;

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow border-[var(--border-primary)]"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <Bell className={`w-5 h-5 ${temNovas ? 'text-[var(--brand-warning)]' : 'text-[var(--text-tertiary)]'}`} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--text-primary)]">{monitoramento.termo}</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{monitoramento.descricao}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{monitoramento.tipo}</Badge>
                {temNovas && (
                  <Badge className="bg-[var(--brand-warning)] text-white">
                    {monitoramento.aparicoes_nao_visualizadas} novas
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {monitoramento.ativo ? (
            <Badge className="bg-[var(--brand-success)]">Ativo</Badge>
          ) : (
            <Badge variant="secondary">Inativo</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}