import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Grid3x3, List } from 'lucide-react';
import DocumentoThumbnail from '@/components/documentos/DocumentoThumbnail';
import DocumentoItem from './DocumentoItem';
import LoadingState from '@/components/common/LoadingState';

export default function ProcessoDocumentosView({ processoId, compact = false, onUpload, onView, onDelete }) {
  const [viewMode, setViewMode] = useState(compact ? 'list' : 'grid');

  const { data: documentos = [], isLoading } = useQuery({
    queryKey: ['documentos', processoId],
    queryFn: () => base44.entities.DocumentoAnexado.filter({ processo_id: processoId }),
    enabled: !!processoId
  });

  if (isLoading) return <LoadingState message="Carregando documentos..." />;

  const Header = () => (
    <div className="flex items-center justify-between">
      <CardTitle className="text-base">Documentos ({documentos.length})</CardTitle>
      <div className="flex items-center gap-2">
        {!compact && (
          <>
            <Button size="sm" variant="ghost" onClick={() => setViewMode('grid')} aria-label="Visualização em grade">
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setViewMode('list')} aria-label="Visualização em lista">
              <List className="w-4 h-4" />
            </Button>
          </>
        )}
        {onUpload && (
          <Button size="sm" onClick={onUpload}>
            <Upload className="w-4 h-4 mr-1" />Upload
          </Button>
        )}
      </div>
    </div>
  );

  const content = documentos.length === 0 ? (
    <p className="text-sm text-[var(--text-secondary)] text-center py-8">
      Nenhum documento anexado
    </p>
  ) : viewMode === 'grid' ? (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {documentos.map(doc => (
        <DocumentoThumbnail key={doc.id} documento={doc} onClick={() => onView?.(doc)} />
      ))}
    </div>
  ) : (
    <div className="space-y-2">
      {documentos.map(doc => (
        <DocumentoItem key={doc.id} documento={doc} onView={() => onView?.(doc)} onDelete={() => onDelete?.(doc.id)} />
      ))}
    </div>
  );

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3"><Header /></CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Header />
      {content}
    </div>
  );
}