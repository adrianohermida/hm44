import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import CSVImportProgress from './CSVImportProgress';

export default function OptimizedCSVImporter({ entityName, title, description }) {
  const [file, setFile] = useState(null);
  const queryClient = useQueryClient();

  const { data: job } = useQuery({
    queryKey: ['import-job', entityName],
    queryFn: async () => {
      const jobs = await base44.entities.JobImportacao.filter({
        tipo: `IMPORTACAO_${entityName.toUpperCase()}`,
        status: { $in: ['pendente', 'processando'] }
      }, '-created_date', 1);
      return jobs[0];
    },
    refetchInterval: (data) => data?.status === 'processando' ? 2000 : false
  });

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entity_name', entityName);
      
      const result = await base44.functions.invoke('importarCSVOtimizado', formData);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['import-job']);
      toast.success('Importação iniciada em segundo plano');
      setFile(null);
    },
    onError: (err) => toast.error(err.message || 'Erro ao importar')
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileSpreadsheet className="w-5 h-5" />
          {title}
        </CardTitle>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm"
        />
        <Button
          onClick={() => uploadMutation.mutate(file)}
          disabled={!file || uploadMutation.isPending || job?.status === 'processando'}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Importar CSV
        </Button>
        {job && <CSVImportProgress job={job} />}
      </CardContent>
    </Card>
  );
}