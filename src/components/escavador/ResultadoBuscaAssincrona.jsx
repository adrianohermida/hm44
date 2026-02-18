import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function ResultadoBuscaAssincrona({ resultado }) {
  const statusConfig = {
    PENDENTE: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Pendente' },
    SUCESSO: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Sucesso' },
    ERRO: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Erro' }
  };

  const config = statusConfig[resultado.status] || statusConfig.PENDENTE;
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-lg ${config.bg}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 ${config.color} ${resultado.status === 'PENDENTE' ? 'animate-spin' : ''}`} />
        <Badge className={config.color}>{config.label}</Badge>
      </div>
      <p className="text-sm text-[var(--brand-text-primary)]">
        <strong>{resultado.tipo}:</strong> {resultado.valor}
      </p>
      {resultado.tribunal && (
        <p className="text-xs text-[var(--brand-text-secondary)] mt-1">
          {resultado.tribunal.nome}
        </p>
      )}
      {resultado.motivo_erro && (
        <p className="text-xs text-red-600 mt-2">{resultado.motivo_erro}</p>
      )}
    </div>
  );
}