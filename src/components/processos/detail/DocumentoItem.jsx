import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DocumentoItem({ documento, onView, onDelete }) {
  const tipoLabels = {
    peticao: 'Petição',
    contestacao: 'Contestação',
    recurso: 'Recurso',
    contrato: 'Contrato',
    procuracao: 'Procuração',
    documento_pessoal: 'Doc. Pessoal',
    certidao: 'Certidão',
    comprovante: 'Comprovante',
    laudo: 'Laudo',
    outro: 'Outro'
  };

  return (
    <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <FileText className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate">{documento.nome_arquivo}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">{tipoLabels[documento.tipo_documento]}</Badge>
            {documento.assinado_digitalmente && (
              <Badge variant="success" className="text-xs">Assinado</Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onView(documento)}>
          <Eye className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
          <a href={documento.url_arquivo} download={documento.nome_arquivo} target="_blank" rel="noopener noreferrer">
            <Download className="w-4 h-4" />
          </a>
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onDelete(documento.id)}>
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </div>
    </div>
  );
}