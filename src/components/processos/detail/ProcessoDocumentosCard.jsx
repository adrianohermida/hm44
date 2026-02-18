import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Download } from 'lucide-react';
import useClientePermissions from '@/components/hooks/useClientePermissions';
import useAuditLog from '@/components/hooks/useAuditLog';

export default function ProcessoDocumentosCard({ processoId, onUpload, onView, modo }) {
  const permissions = useClientePermissions(modo);
  const { logView, logDownload } = useAuditLog();

  const { data: documentos = [] } = useQuery({
    queryKey: ['documentos-processo', processoId],
    queryFn: async () => {
      const user = await base44.auth.me();
      const query = { 
        processo_id: processoId,
        escritorio_id: user.escritorio_id
      };
      
      if (!permissions.canSeeAllDocs) {
        query.compartilhado_cliente = true;
      }
      
      return base44.entities.DocumentoAnexado.filter(query);
    }
  });

  const handleView = (doc) => {
    logView('Documento', doc.id);
    onView(doc);
  };

  const handleDownload = (doc) => {
    logDownload('Documento', doc.id);
  };

  const recentes = documentos.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="w-4 h-4" />Documentos ({documentos.length})
        </CardTitle>
        <Button size="sm" variant="ghost" onClick={onUpload}><Plus className="w-4 h-4" /></Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {recentes.map(doc => (
          <div 
            key={doc.id} 
            className="flex items-center gap-2 p-2 rounded hover:bg-[var(--bg-secondary)] cursor-pointer"
            onClick={() => handleView(doc)}
          >
            <FileText className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
            <p className="text-xs flex-1 truncate">{doc.nome_arquivo}</p>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(doc);
              }}
            >
              <Download className="w-3 h-3" />
            </Button>
          </div>
        ))}
        {documentos.length === 0 && (
          <p className="text-xs text-[var(--text-tertiary)] text-center py-2">Nenhum documento anexado</p>
        )}
      </CardContent>
    </Card>
  );
}