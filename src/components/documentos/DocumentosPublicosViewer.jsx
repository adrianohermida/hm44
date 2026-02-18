import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function DocumentosPublicosViewer({ documentos }) {
  const handleDownload = async (doc) => {
    try {
      await base44.functions.invoke('downloadDocumentoPublico', { documento_id: doc.id });
      toast.success('Download iniciado');
    } catch {
      toast.error('Erro ao baixar documento');
    }
  };

  if (!documentos?.length) {
    return <p className="text-center py-8 text-[var(--text-secondary)]">Nenhum documento disponível</p>;
  }

  return (
    <div className="space-y-2">
      {documentos.map((doc) => (
        <Card key={doc.id} className="p-3 border-[var(--border-primary)]">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[var(--text-primary)] truncate">{doc.titulo}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{doc.extensao_arquivo}</Badge>
                {doc.quantidade_paginas && (
                  <span className="text-xs text-[var(--text-tertiary)]">{doc.quantidade_paginas} pág.</span>
                )}
              </div>
            </div>
            <Button size="sm" onClick={() => handleDownload(doc)} className="flex-shrink-0">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}