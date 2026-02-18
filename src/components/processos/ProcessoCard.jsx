import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Star, Landmark, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CNJCopyButton from '@/components/common/CNJCopyButton';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function ProcessoCard({ processo, onClick, onUpdate }) {
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
    synced: { icon: CheckCircle2, color: 'text-green-600', label: 'Sincronizado CNJ' },
    pending: { icon: Clock, color: 'text-yellow-600', label: 'Aguardando' },
    error: { icon: AlertCircle, color: 'text-red-600', label: 'Erro' },
    not_found: { icon: AlertCircle, color: 'text-gray-400', label: 'Não encontrado' }
  };

  const syncConfig = syncStatusConfig[processo.sync_status] || syncStatusConfig.pending;
  const SyncIcon = syncConfig.icon;

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow border-[var(--border-primary)]" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CNJCopyButton numeroCNJ={processo.numero_cnj} className="h-7 px-2 text-sm" />
              <Star 
                className={`w-4 h-4 cursor-pointer flex-shrink-0 ${processo.favorito ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                onClick={handleFavorito}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SyncIcon className={`w-4 h-4 flex-shrink-0 ${syncConfig.color}`} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{syncConfig.label}</p>
                    {processo.cnj_enriquecido && (
                      <p className="text-xs text-green-400">✓ Enriquecido</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <h3 className="font-medium text-sm text-[var(--text-secondary)] truncate">{titulo}</h3>
          </div>
          {processo.status && <Badge className="flex-shrink-0">{processo.status}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {processo.tribunal && (
          <div className="flex items-center gap-2 text-sm">
            <Landmark className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-[var(--text-secondary)] font-medium">{processo.tribunal}</span>
          </div>
        )}
        {processo.data_distribuicao && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-[var(--text-secondary)]">
              {new Date(processo.data_distribuicao).toLocaleDateString('pt-BR')}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}