import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ComprovanteUpload({ faturaId, onUpload }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await onUpload(file_url);
      toast.success('Comprovante enviado!');
    } catch {
      toast.error('Erro ao enviar comprovante');
    }
    setUploading(false);
  };

  return (
    <label>
      <input type="file" accept="image/*,application/pdf" onChange={handleUpload} className="hidden" />
      <Button variant="outline" size="sm" disabled={uploading} asChild>
        <span>
          <Upload className="w-4 h-4 mr-1" />
          {uploading ? 'Enviando...' : 'Anexar'}
        </span>
      </Button>
    </label>
  );
}