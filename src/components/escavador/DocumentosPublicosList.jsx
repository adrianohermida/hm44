import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

export default function DocumentosPublicosList({ documentos, onDownload }) {
  return (
    <div className="space-y-3">
      {documentos.map((doc) => (
        <Card key={doc.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[var(--brand-primary)]" />
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{doc.titulo}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {new Date(doc.data_documento).toLocaleDateString()} • {doc.extensao_arquivo}
                  </p>
                </div>
              </div>
              <Button size="sm" onClick={() => onDownload(doc)}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}