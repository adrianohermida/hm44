import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar, Star, Landmark, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CNJCopyButton from '@/components/common/CNJCopyButton';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export default function ProcessoListItem({ processo, selected, onToggle, onClick, onUpdate, isSelected }) {
  const statusColor = {
    ativo: 'bg-green-100 text-green-800',
    suspenso: 'bg-yellow-100 text-yellow-800',
    arquivado: 'bg-gray-100 text-gray-800'
  }[processo.status || 'ativo'];

  const titulo = processo.titulo || `${processo.polo_ativo || 'Autor'} x ${processo.polo_passivo || 'Réu'}`;

  const handleFavorito = async (e) => {
    e.stopPropagation();
    try {
      await base44.entities.Processo.update(processo.id, { favorito: !processo.favorito });
      onUpdate?.();
    } catch (error) {
      toast.error('Erro ao atualizar favorito');
    }
  };

  const syncStatusConfig = {
    synced: { icon: CheckCircle2, color: 'text-green-600', label: 'Sincronizado' },
    pending: { icon: Clock, color: 'text-yellow-600', label: 'Pendente' },
    error: { icon: AlertCircle, color: 'text-red-600', label: 'Erro' },
    not_found: { icon: AlertCircle, color: 'text-gray-400', label: 'Não encontrado' }
  };

  const syncConfig = syncStatusConfig[processo.sync_status] || syncStatusConfig.pending;
  const SyncIcon = syncConfig.icon;

  return (
    <div 
      className={cn(
        "flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer",
        isSelected 
          ? "border-[var(--brand-primary)] bg-[var(--brand-primary-50)]" 
          : "bg-[var(--bg-primary)] border-[var(--border-primary)]"
      )}
      onClick={(e) => {
        if (e.target.type !== 'checkbox') onClick(processo.id);
      }}
    >
      {onToggle && (
        <Checkbox 
          checked={selected} 
          onCheckedChange={() => onToggle(processo.id)}
          onClick={(e) => e.stopPropagation()}
        />
      )}
      
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <CNJCopyButton numeroCNJ={processo.numero_cnj} className="h-7 px-2 text-sm font-semibold" />
          <Star 
            className={`w-4 h-4 cursor-pointer flex-shrink-0 ${processo.favorito ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            onClick={handleFavorito}
          />
          <Badge className={statusColor}>{processo.status || 'ativo'}</Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SyncIcon className={`w-4 h-4 flex-shrink-0 ${syncConfig.color}`} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{syncConfig.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="text-sm text-[var(--text-secondary)] truncate font-medium">
          {titulo}
        </div>

        <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
          {processo.tribunal && (
            <div className="flex items-center gap-1">
              <Landmark className="w-3 h-3" />
              <span>{processo.tribunal}</span>
            </div>
          )}
          {processo.data_distribuicao && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(processo.data_distribuicao).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}