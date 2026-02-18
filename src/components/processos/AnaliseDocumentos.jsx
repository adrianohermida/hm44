import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AnaliseDocumentos({ documentos, onDownload }) {
  if (!documentos || documentos.length === 0) {
    return <div className="text-[var(--text-secondary)] text-sm">Nenhum documento disponível</div>;
  }

  return (
    <Card className="border-[var(--border-primary)]">
      <CardHeader>
        <CardTitle className="text-[var(--text-primary)]">Documentos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {documentos.map((doc, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[var(--text-tertiary)]" />
              <span className="text-sm text-[var(--text-primary)]">{doc.nome}</span>
            </div>
            <Button size="sm" variant="ghost" onClick={() => onDownload(doc)}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}