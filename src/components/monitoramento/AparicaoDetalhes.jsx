import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, ExternalLink } from 'lucide-react';

export default function AparicaoDetalhes({ aparicao }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Calendar className="w-4 h-4" />
        {new Date(aparicao.data_diario).toLocaleDateString('pt-BR')}
      </div>
      
      {aparicao.numero_processo && (
        <div>
          <span className="text-xs text-[var(--text-tertiary)]">Processo:</span>
          <p className="font-semibold text-[var(--text-primary)]">{aparicao.numero_processo}</p>
        </div>
      )}

      <div>
        <span className="text-xs text-[var(--text-tertiary)]">Diário:</span>
        <p className="text-sm">{aparicao.diario_nome}</p>
        <div className="flex gap-2 mt-1">
          {aparicao.caderno && <Badge variant="outline">{aparicao.caderno}</Badge>}
          {aparicao.pagina && <Badge variant="outline">Pág. {aparicao.pagina}</Badge>}
        </div>
      </div>

      {aparicao.conteudo_snippet && (
        <div>
          <span className="text-xs text-[var(--text-tertiary)]">Trecho:</span>
          <p className="text-sm mt-1 p-3 bg-[var(--bg-secondary)] rounded-lg">
            {aparicao.conteudo_snippet}
          </p>
        </div>
      )}

      {aparicao.link_pdf && (
        <a 
          href={aparicao.link_pdf} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[var(--brand-primary)] hover:underline text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          Ver PDF completo
        </a>
      )}
    </div>
  );
}