import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText, MapPin } from 'lucide-react';

export default function ProcessoBasicInfo({ processo }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-[var(--brand-text-tertiary)]" />
        <span className="font-mono text-sm text-[var(--brand-text-primary)]">
          {processo.numero_unico}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">{processo.classe}</Badge>
        <Badge variant="outline">{processo.instancia}</Badge>
        {processo.segredo_justica && (
          <Badge className="bg-[var(--brand-error)]">Segredo</Badge>
        )}
        {processo.arquivado && (
          <Badge variant="secondary">Arquivado</Badge>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm text-[var(--brand-text-secondary)]">
        <MapPin className="w-3 h-3" />
        <span>{processo.orgao_julgador}</span>
      </div>
    </div>
  );
}