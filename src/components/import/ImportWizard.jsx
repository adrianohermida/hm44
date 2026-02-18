import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import FileUploader from './FileUploader';
import FormatoDetector from './FormatoDetector';
import PreviewTable from './PreviewTable';
import ColumnMapper from './ColumnMapper';

export default function ImportWizard({ tipoEntidade, campos, onComplete }) {
  const [etapa, setEtapa] = useState(1);
  const [arquivo, setArquivo] = useState(null);
  const [formato, setFormato] = useState(null);
  const [preview, setPreview] = useState([]);
  const [mapeamento, setMapeamento] = useState({});
  const [processando, setProcessando] = useState(false);

  const handleArquivo = async (file) => {
    setProcessando(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const { data } = await base44.functions.invoke('detectarFormatoArquivo', { arquivo_url: file_url });
      
      setArquivo(file_url);
      setFormato(data);
      setPreview(data.preview);
      setEtapa(2);
    } catch (err) {
      toast.error('Erro ao processar arquivo');
    } finally {
      setProcessando(false);
    }
  };

  return (
    <Card className="p-4">
      {/* ... rest of wizard ... */}
    </Card>
  );
}