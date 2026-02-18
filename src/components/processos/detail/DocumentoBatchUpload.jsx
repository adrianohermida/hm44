import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import DocumentoDropZone from './DocumentoDropZone';

export default function DocumentoBatchUpload({ open, onClose, onSuccess, processoId, escritorioId }) {
  const [files, setFiles] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        await base44.entities.DocumentoAnexado.create({
          escritorio_id: escritorioId,
          processo_id: processoId,
          nome_arquivo: file.name,
          url_arquivo: file_url,
          tipo_documento: 'outro',
          tamanho_bytes: file.size,
          mime_type: file.type
        });
        setProgress(((i + 1) / files.length) * 100);
      }
      toast.success(`${files.length} documento(s) anexado(s)`);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Erro ao anexar documentos');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Upload em Lote</DialogTitle></DialogHeader>
        <DocumentoDropZone onDrop={setFiles} uploading={uploading} />
        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-[var(--text-secondary)]">{files.length} arquivo(s) selecionado(s)</p>
            {uploading && <Progress value={progress} />}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={uploading}>Cancelar</Button>
          <Button onClick={handleUpload} disabled={uploading || files.length === 0}>Upload</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}