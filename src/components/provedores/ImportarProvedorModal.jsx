import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import ImportarProvedorPreview from './ImportarProvedorPreview';

export default function ImportarProvedorModal({ onClose }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const text = await selectedFile.text();
    const lines = text.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',');
    const data = lines.slice(1, 6).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, h, i) => ({ ...obj, [h.trim()]: values[i]?.trim() }), {});
    });
    setPreview({ total: lines.length - 1, sample: data });
  };

  const handleImport = async () => {
    setLoading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.functions.invoke('importarProvedoresCSV', { file_url });
      toast.success('Provedores importados');
      queryClient.invalidateQueries(['provedores']);
      onClose();
    } catch (err) {
      toast.error('Erro: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Provedores CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input type="file" accept=".csv" onChange={handleFileSelect} />
          {preview && <ImportarProvedorPreview preview={preview} />}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}><X className="w-4 h-4 mr-1" />Cancelar</Button>
            <Button onClick={handleImport} disabled={!file || loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Upload className="w-4 h-4 mr-1" />}
              Importar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}