import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Star } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AparicaoCard({ aparicao, onToggleVisualizado, onToggleImportante }) {
  return (
    <Card className={aparicao.visualizado ? 'opacity-70' : 'border-l-4 border-l-[var(--brand-primary)]'}>
      <CardContent className="p-4">
        <div className="flex justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--brand-text-tertiary)]" />
            <span className="text-xs font-semibold text-[var(--brand-primary)]">
              {format(new Date(aparicao.data_diario), 'dd/MM/yyyy', { locale: ptBR })}
            </span>
            <Badge variant="outline" className="text-xs">{aparicao.diario_sigla}</Badge>
          </div>
          <div className="flex gap-1">
            <button onClick={() => onToggleImportante(aparicao.id)} className="hover:opacity-70">
              <Star className={`w-4 h-4 ${aparicao.importante ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
            </button>
            <button onClick={() => onToggleVisualizado(aparicao.id)} className="hover:opacity-70">
              <Eye className={`w-4 h-4 ${aparicao.visualizado ? 'text-[var(--brand-success)]' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>
        {aparicao.numero_processo && (
          <p className="font-mono text-xs text-[var(--brand-text-secondary)] mb-2">
            {aparicao.numero_processo}
          </p>
        )}
        <p className="text-sm text-[var(--brand-text-primary)] line-clamp-3">
          {aparicao.conteudo_snippet}
        </p>
        {aparicao.link_pdf && (
          <a href={aparicao.link_pdf} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--brand-primary)] hover:underline mt-2 inline-block">
            Ver diário completo
          </a>
        )}
      </CardContent>
    </Card>
  );
}