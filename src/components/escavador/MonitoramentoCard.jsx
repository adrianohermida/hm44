import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MonitoramentoCard({ monitoramento, onRemove, onToggleStatus }) {
  const tipoLabels = {
    PROCESSO: 'Processo',
    TERMO: 'Termo',
    OAB: 'OAB',
    DOCUMENTO: 'Documento'
  };

  return (
    <Card className={!monitoramento.ativo ? 'opacity-60' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{tipoLabels[monitoramento.tipo]}</Badge>
              {!monitoramento.ativo && <Badge variant="secondary">Inativo</Badge>}
              {monitoramento.aparicoes_nao_visualizadas > 0 && (
                <Badge className="bg-[var(--brand-error)]">
                  {monitoramento.aparicoes_nao_visualizadas} novas
                </Badge>
              )}
            </div>
            <p className="font-medium text-sm text-[var(--brand-text-primary)] mb-1">
              {monitoramento.descricao || monitoramento.termo}
            </p>
            <p className="text-xs text-[var(--brand-text-secondary)]">
              {monitoramento.numero_diarios_monitorados} diários • {monitoramento.quantidade_aparicoes_mes} aparições/mês
            </p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onToggleStatus(monitoramento.id)}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onRemove(monitoramento.id)}>
              <Trash2 className="w-4 h-4 text-[var(--brand-error)]" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}