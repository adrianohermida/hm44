import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

export default function CSVImportProgress({ job }) {
  if (!job) return null;

  const progress = job.total_registros > 0 
    ? Math.round((job.registros_processados / job.total_registros) * 100)
    : 0;

  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {job.status === 'processando' ? 'Importando...' : 
             job.status === 'concluido' ? 'Concluído' : 'Erro'}
          </span>
          {job.status === 'processando' && <Loader2 className="w-4 h-4 animate-spin" />}
          {job.status === 'concluido' && <CheckCircle className="w-4 h-4 text-green-600" />}
          {job.status === 'falhou' && <AlertCircle className="w-4 h-4 text-red-600" />}
        </div>
        <Progress value={progress} />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{job.registros_processados} / {job.total_registros}</span>
          <span>{progress}%</span>
        </div>
        {job.registros_falha > 0 && (
          <p className="text-xs text-red-600">{job.registros_falha} erros</p>
        )}
      </CardContent>
    </Card>
  );
}