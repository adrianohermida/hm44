import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { formatarCNJ } from '@/components/utils/cnjUtils';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';

export default function ApensoTreeNode({ processo, tipo, processoAtualId }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDesconectar = async (e) => {
    e.stopPropagation();
    
    try {
      await base44.entities.Processo.update(processo.id, {
        processo_pai_id: null,
        relation_type: null
      });
      
      queryClient.invalidateQueries(['processos-relacionados']);
      queryClient.invalidateQueries(['processo', processoAtualId]);
      queryClient.invalidateQueries(['processo', processo.id]);
      toast.success('Processo desconectado');
    } catch (error) {
      toast.error('Erro ao desconectar processo');
    }
  };
  
  return (
    <div 
      onClick={() => navigate(`${createPageUrl('ProcessoDetails')}?id=${processo.id}`)}
      className="p-3 bg-[var(--bg-secondary)] rounded-lg cursor-pointer hover:bg-[var(--brand-primary-50)] transition-colors group"
    >
      <div className="flex items-start gap-2">
        {tipo === 'pai' ? <ArrowUp className="w-4 h-4 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" /> : 
         <ArrowDown className="w-4 h-4 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" />}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate font-mono">
            {formatarCNJ(processo.numero_cnj)}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {tipo === 'pai' ? 'Processo Principal' : processo.relation_type || 'Apenso'}
            </Badge>
            {processo.classe && (
              <Badge variant="secondary" className="text-xs">
                {processo.classe}
              </Badge>
            )}
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          onClick={handleDesconectar}
          title="Desconectar processo"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}