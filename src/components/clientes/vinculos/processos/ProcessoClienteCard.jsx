import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const STATUS_CONFIG = {
  ativo: { label: 'Ativo', color: 'bg-green-100 text-green-700' },
  suspenso: { label: 'Suspenso', color: 'bg-yellow-100 text-yellow-700' },
  arquivado: { label: 'Arquivado', color: 'bg-gray-100 text-gray-700' }
};

export default function ProcessoClienteCard({ processo, apensos, isApenso, clienteId }) {
  const status = STATUS_CONFIG[processo.status] || STATUS_CONFIG.ativo;
  const detailsUrl = `${createPageUrl('ProcessoDetails')}?id=${processo.id}${clienteId ? `&fromClient=${clienteId}` : ''}`;

  return (
    <Card className={`p-4 hover:shadow-md transition-shadow ${isApenso ? 'bg-[var(--bg-secondary)]' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <p className="font-semibold text-[var(--text-primary)] truncate">
              {processo.numero_cnj}
            </p>
            <Badge className={status.color}>{status.label}</Badge>
            {isApenso && (
              <Badge className="bg-purple-100 text-purple-700">
                {processo.relation_type || 'Apenso'}
              </Badge>
            )}
            {apensos > 0 && (
              <Badge className="bg-blue-100 text-blue-700">
                {apensos} apenso{apensos > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-1">
            {processo.tribunal} {processo.classe && `- ${processo.classe}`}
          </p>
          {processo.instancia && (
            <p className="text-xs text-[var(--text-tertiary)]">{processo.instancia}</p>
          )}
        </div>
        <Link to={detailsUrl}>
          <ExternalLink className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0" />
        </Link>
      </div>
    </Card>
  );
}