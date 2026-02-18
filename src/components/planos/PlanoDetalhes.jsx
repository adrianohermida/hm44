import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PlanoDetalhes({ plano }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Plano</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[var(--text-secondary)]">Cliente</p>
                <p className="font-semibold">{plano.cliente_nome}</p>
              </div>
              <div>
                <p className="text-[var(--text-secondary)]">Status</p>
                <Badge>{plano.status_plano}</Badge>
              </div>
              <div>
                <p className="text-[var(--text-secondary)]">Renda Total</p>
                <p className="font-semibold">R$ {(plano.renda_mensal_total || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[var(--text-secondary)]">Total Dívidas</p>
                <p className="font-semibold">R$ {(plano.total_dividas || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[var(--text-secondary)]">Parcela Proposta</p>
                <p className="font-semibold">R$ {(plano.valor_parcela_proposta || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[var(--text-secondary)]">Prazo</p>
                <p className="font-semibold">{plano.prazo_meses || 0} meses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}