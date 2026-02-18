import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function JobRecoveryActions({ 
  job, 
  onReimport, 
  onDelete,
  reimporting 
}) {
  const handleDownloadCSV = () => {
    if (!job?.dados || job.dados.length === 0) {
      toast.error('Sem dados para exportar');
      return;
    }

    try {
      // Criar CSV dos dados
      const headers = Object.keys(job.dados[0]);
      const csvRows = [
        headers.join(','),
        ...job.dados.map(row => 
          headers.map(h => {
            const val = row[h];
            if (val === null || val === undefined) return '';
            if (typeof val === 'object') return JSON.stringify(val);
            return `"${String(val).replace(/"/g, '""')}"`;
          }).join(',')
        )
      ];
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup_job_${job.id}_${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('CSV exportado');
    } catch (error) {
      toast.error('Erro ao exportar CSV');
    }
  };

  const handleDownloadOriginal = async () => {
    if (!job?.opcoes?.arquivo_original) {
      toast.error('Arquivo original não disponível');
      return;
    }

    try {
      window.open(job.opcoes.arquivo_original, '_blank');
      toast.success('Download iniciado');
    } catch (error) {
      toast.error('Erro ao baixar arquivo');
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadCSV}
        className="flex-1"
      >
        <Download className="w-4 h-4 mr-2" />
        Baixar CSV
      </Button>

      {job?.opcoes?.arquivo_original && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadOriginal}
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          Original
        </Button>
      )}

      {job?.dados && job.dados.length > 0 && (
        <Button
          onClick={onReimport}
          disabled={reimporting}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          size="sm"
        >
          {reimporting ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Reimportando...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reimportar
            </>
          )}
        </Button>
      )}
    </div>
  );
}