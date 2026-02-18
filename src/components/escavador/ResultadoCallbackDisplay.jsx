import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Webhook } from 'lucide-react';

export default function ResultadoCallbackDisplay({ callback }) {
  const eventoLabels = {
    diario_movimentacao_nova: 'Nova Movimentação no Diário',
    movimentacao_nova: 'Novo Andamento',
    envolvido_novo: 'Novo Envolvido',
    processo_arquivado: 'Processo Arquivado',
    update_segredo: 'Alteração de Segredo',
    nova_instancia: 'Nova Instância'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Webhook className="w-4 h-4" />
          {eventoLabels[callback.evento] || callback.evento}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-xs bg-[var(--brand-bg-secondary)] p-3 rounded overflow-auto max-h-60">
          {JSON.stringify(callback.payload, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}