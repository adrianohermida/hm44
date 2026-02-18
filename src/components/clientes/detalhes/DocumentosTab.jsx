import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File, Eye, Download, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const DocumentListItem = ({ documento, onView, onDelete }) => (
  <div className="flex items-center justify-between p-3 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-secondary)]">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <File className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{documento.titulo}</p>
        <p className="text-xs text-[var(--text-tertiary)]">{documento.formato}</p>
      </div>
    </div>
    <div className="flex gap-1">
      <Button size="sm" variant="ghost" onClick={() => onView(documento)}>
        <Eye className="w-4 h-4" />
      </Button>
      <Button size="sm" variant="ghost" onClick={() => onDelete(documento.id)}>
        <Trash2 className="w-4 h-4 text-red-500" />
      </Button>
    </div>
  </div>
);

export default function DocumentosTab({ clienteId, escritorioId }) {
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list().then(d => d[0]),
    enabled: !escritorioId
  });

  const eid = escritorioId || escritorio?.id;

  const { data: documentos = [], isLoading } = useQuery({
    queryKey: ['documentos-cliente', clienteId, eid],
    queryFn: async () => {
      const data = await base44.entities.Documento.filter({
        cliente_id: clienteId,
        escritorio_id: eid
      }, '-created_date');
      return data;
    },
    enabled: !!clienteId && !!eid
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Documento.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['documentos-cliente']);
      toast.success('Documento excluído');
    }
  });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      await base44.entities.Documento.create({
        titulo: file.name,
        arquivo_url: file_url,
        formato: file.type,
        tamanho_bytes: file.size,
        cliente_id: clienteId,
        escritorio_id: eid
      });
      
      queryClient.invalidateQueries(['documentos-cliente']);
      toast.success('Documento enviado');
    } catch (error) {
      toast.error('Erro ao enviar documento');
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-gray-100 rounded" />;
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white dark:bg-[var(--bg-elevated)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Documentos</CardTitle>
            <div>
              <input
                id="upload-doc"
                type="file"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
              <Button 
                size="sm" 
                onClick={() => document.getElementById('upload-doc').click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Enviando...' : 'Upload'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {documentos.length === 0 ? (
            <div className="text-center py-8">
              <File className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-[var(--text-secondary)]">
                Nenhum documento anexado
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {documentos.map(doc => (
                <DocumentListItem
                  key={doc.id}
                  documento={doc}
                  onView={(d) => window.open(d.arquivo_url, '_blank')}
                  onDelete={deleteMutation.mutate}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}