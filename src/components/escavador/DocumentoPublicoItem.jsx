import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DocumentoPublicoItem({ documento, onDownload }) {
  return (
    <div className="flex items-center justify-between p-3 bg-[var(--brand-bg-secondary)] rounded-lg">
      <div className="flex items-center gap-3 flex-1">
        <FileText className="w-5 h-5 text-[var(--brand-primary)]" />
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--brand-text-primary)]">{documento.titulo}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-[var(--brand-text-secondary)]">
              {format(new Date(documento.data_documento), 'dd/MM/yyyy', { locale: ptBR })}
            </span>
            <Badge variant="outline" className="text-xs">{documento.extensao_arquivo}</Badge>
            {documento.quantidade_paginas && (
              <span className="text-xs text-[var(--brand-text-tertiary)]">
                {documento.quantidade_paginas} pág.
              </span>
            )}
          </div>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={() => onDownload(documento)}>
        <Download className="w-4 h-4" />
      </Button>
    </div>
  );
}