import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function NovoProcessoEnvolvido({ processo, envolvido }) {
  return (
    <div className="p-4 bg-[var(--brand-primary-50)] rounded-lg border border-[var(--brand-primary-200)]">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-4 h-4 text-[var(--brand-primary)]" />
        <p className="font-mono text-sm font-semibold text-[var(--brand-text-primary)]">
          {processo.numero_unico}
        </p>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="text-xs">{processo.instancia}</Badge>
        <Badge variant="outline" className="text-xs">{processo.sistema}</Badge>
      </div>
      <p className="text-xs text-[var(--brand-text-secondary)] mb-2">
        Envolvido: {envolvido.nome || envolvido.documento}
      </p>
      {processo.url && (
        <a href={processo.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--brand-primary)] hover:underline flex items-center gap-1">
          <ExternalLink className="w-3 h-3" />
          Ver processo
        </a>
      )}
    </div>
  );
}