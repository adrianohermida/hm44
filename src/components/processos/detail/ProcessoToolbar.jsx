import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Edit, Link2, FileDown, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function ProcessoToolbar({ 
  processo, 
  monitorado = false,
  onEdit, 
  onApensar, 
  onToggleMonitor 
}) {
  const handleAtualizar = () => {
    toast.info('Atualizando andamento via API...');
  };

  const handleExportar = () => {
    toast.info('Exportando processo em PDF...');
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={handleAtualizar}
        aria-label="Atualizar andamento do processo"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Atualizar</span>
      </Button>
      
      <Button 
        size="sm" 
        variant="outline" 
        onClick={handleExportar}
        aria-label="Exportar processo em PDF"
      >
        <FileDown className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">PDF</span>
      </Button>
      
      <div className="ml-auto flex items-center gap-2">
        <span className="text-xs text-[var(--text-secondary)] hidden sm:inline">Monitor:</span>
        <Button
          size="sm"
          variant={monitorado ? 'default' : 'outline'}
          onClick={onToggleMonitor}
          aria-label={monitorado ? 'Desativar monitoramento' : 'Ativar monitoramento'}
          aria-pressed={monitorado}
        >
          {monitorado ? <Eye className="w-4 h-4 sm:mr-2" /> : <EyeOff className="w-4 h-4 sm:mr-2" />}
          <span className="hidden sm:inline">{monitorado ? 'ON' : 'OFF'}</span>
        </Button>
      </div>
    </div>
  );
}