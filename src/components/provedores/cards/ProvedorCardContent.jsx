import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import IDCopyButton from '@/components/common/IDCopyButton';

export default function ProvedorCardContent({ provedor }) {
  return (
    <div className="space-y-3">
      <IDCopyButton id={provedor.id} label="Provedor ID" />
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-[var(--text-tertiary)]">V1:</span>
          <p className="font-mono text-xs truncate">{provedor.base_url_v1 || 'N/A'}</p>
        </div>
        <div>
          <span className="text-[var(--text-tertiary)]">V2:</span>
          <p className="font-mono text-xs truncate">{provedor.base_url_v2 || 'N/A'}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline">Secret: {provedor.secret_name}</Badge>
        {provedor.documentacao_url && (
          <a 
            href={provedor.documentacao_url} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Ver documentação"
          >
            <ExternalLink className="w-4 h-4 text-[var(--brand-primary)]" />
          </a>
        )}
      </div>
    </div>
  );
}