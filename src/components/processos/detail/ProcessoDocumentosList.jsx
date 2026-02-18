import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import DocumentoItem from './DocumentoItem';
import DocumentosPublicosSyncButton from './DocumentosPublicosSyncButton';

export default function ProcessoDocumentosList({ processoId, processo, onUpload, onView, onDelete }) {
  const { data: documentos = [], refetch } = useQuery({
    queryKey: ['documentos', processoId],
    queryFn: () => base44.entities.DocumentoAnexado.filter({ processo_id: processoId }),
    enabled: !!processoId
  });

  const { data: documentosPublicos = [], refetch: refetchPublicos } = useQuery({
    queryKey: ['documentos-publicos', processoId],
    queryFn: () => base44.entities.DocumentoPublico.filter({ processo_id: processoId }),
    enabled: !!processoId
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documentos ({documentos.length + documentosPublicos.length})
          </CardTitle>
          <div className="flex gap-2">
            <DocumentosPublicosSyncButton 
              processo={processo}
              onSyncComplete={() => {
                refetch();
                refetchPublicos();
              }}
            />
            <Button size="sm" variant="outline" onClick={onUpload}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {documentosPublicos.length === 0 && documentos.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">Nenhum documento anexado</p>
        ) : (
          <>
            {documentosPublicos.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-[var(--text-secondary)] mb-2">
                  Autos do Processo ({documentosPublicos.length})
                </h3>
                <div className="space-y-2">
                  {documentosPublicos.map((doc) => (
                    <div 
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{doc.titulo}</div>
                          {doc.descricao && (
                            <div className="text-xs text-[var(--text-secondary)] truncate">{doc.descricao}</div>
                          )}
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {doc.extensao_arquivo && (
                              <Badge variant="outline" className="text-xs">{doc.extensao_arquivo.toUpperCase()}</Badge>
                            )}
                            {doc.quantidade_paginas && (
                              <Badge variant="outline" className="text-xs">{doc.quantidade_paginas} págs</Badge>
                            )}
                            {doc.data && (
                              <Badge variant="outline" className="text-xs">
                                {new Date(doc.data).toLocaleDateString('pt-BR')}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {doc.url_api && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(doc.url_api, '_blank')}
                          className="flex-shrink-0"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {documentos.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-[var(--text-secondary)] mb-2">
                  Anexos Internos ({documentos.length})
                </h3>
                <div className="space-y-2">
                  {documentos.map(doc => (
                    <DocumentoItem 
                      key={doc.id} 
                      documento={doc} 
                      onView={onView}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}