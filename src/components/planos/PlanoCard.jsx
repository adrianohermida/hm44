import React from 'react';
import { Badge } from '@/components/ui/badge';

const statusColors = {
  proposta: 'bg-blue-100 text-blue-800',
  negociacao: 'bg-yellow-100 text-yellow-800',
  aprovado: 'bg-green-100 text-green-800',
  em_execucao: 'bg-indigo-100 text-indigo-800',
  concluido: 'bg-gray-100 text-gray-800',
  cancelado: 'bg-red-100 text-red-800'
};

const statusLabels = {
  proposta: 'Proposta',
  negociacao: 'Negociação',
  aprovado: 'Aprovado',
  em_execucao: 'Em Execução',
  concluido: 'Concluído',
  cancelado: 'Cancelado'
};

export default function PlanoCard({ plano, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg cursor-pointer transition-all ${
        selected
          ? 'bg-[var(--brand-primary-50)] border-2 border-[var(--brand-primary)]'
          : 'bg-[var(--bg-primary)] border border-[var(--border-primary)] hover:border-[var(--brand-primary)]'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="font-semibold text-sm text-[var(--text-primary)] truncate flex-1">
          {plano.cliente_nome || 'Cliente'}
        </p>
        <Badge className={`text-xs ${statusColors[plano.status_plano]}`}>
          {statusLabels[plano.status_plano]}
        </Badge>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-[var(--text-secondary)]">
          Parcela: R$ {(plano.valor_parcela_proposta || 0).toFixed(2)}
        </p>
        <p className="text-xs text-[var(--text-tertiary)]">
          {plano.prazo_meses || 0}x • {new Date(plano.created_date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}