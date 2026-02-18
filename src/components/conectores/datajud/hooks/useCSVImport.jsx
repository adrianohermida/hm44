import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function useCSVImport(entityName, schemaType) {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ processados: 0, sucesso: 0, falhas: 0, total: 0 });
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const queryClient = useQueryClient();

  const startImport = async (file) => {
    if (!file) return;

    setImporting(true);
    setProgress(0);
    setStats({ processados: 0, sucesso: 0, falhas: 0, total: 0 });
    setResult(null);
    setErrors([]);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });


      const response = await base44.functions.invoke('importCsvStream', {
        file_url,
        entity_name: entityName,
        schema_type: schemaType
      });

      if (response.data) {
        const data = response.data;
        setProgress(100);
        setStats({
          processados: data.total || 0,
          sucesso: data.sucesso || 0,
          falhas: data.falhas || 0,
          total: data.total || 0
        });
        setResult(data);
        setErrors(data.erros || []);
        toast.success(`✅ ${data.sucesso || 0} registros importados`);
        queryClient.invalidateQueries([entityName.toLowerCase()]);
      }
    } catch (error) {
      toast.error(`Erro: ${error.message}`);
      setResult({ error: error.message });
    } finally {
      setImporting(false);
    }
  };

  const cancelImport = () => {
    setImporting(false);
    toast.info('Importação cancelada');
  };

  return {
    importing,
    progress,
    stats,
    result,
    errors,
    startImport,
    cancelImport
  };
}