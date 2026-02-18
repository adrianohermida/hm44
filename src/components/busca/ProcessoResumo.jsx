import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function ProcessoResumo({ processo }) {
  return (
    <div className="space-y-2">
      <div>
        <span className="text-xs text-[var(--text-tertiary)]">Polo Ativo:</span>
        <p className="text-sm font-medium text-[var(--text-primary)]">
          {processo.titulo_polo_ativo || 'Não informado'}
        </p>
      </div>
      <div>
        <span className="text-xs text-[var(--text-tertiary)]">Polo Passivo:</span>
        <p className="text-sm font-medium text-[var(--text-primary)]">
          {processo.titulo_polo_passivo || 'Não informado'}
        </p>
      </div>
      {processo.fontes?.[0]?.capa && (
        <>
          <div>
            <span className="text-xs text-[var(--text-tertiary)]">Classe:</span>
            <Badge variant="outline" className="ml-2">{processo.fontes[0].capa.classe}</Badge>
          </div>
          {processo.fontes[0].capa.assunto_principal_normalizado && (
            <div>
              <span className="text-xs text-[var(--text-tertiary)]">Assunto:</span>
              <p className="text-sm">{processo.fontes[0].capa.assunto_principal_normalizado.nome}</p>
            </div>
          )}
        </>
      )}
      <div>
        <span className="text-xs text-[var(--text-tertiary)]">Última movimentação:</span>
        <p className="text-sm">{new Date(processo.data_ultima_movimentacao).toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  );
}