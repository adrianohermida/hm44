import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GitBranch, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ApensoTreeNode from './ApensoTreeNode';
import TooltipJuridico from '@/components/common/TooltipJuridico';

export default function ProcessoApensoTree({ processoId, onApensar }) {
  const { data: relacionados = [] } = useQuery({
    queryKey: ['processos-relacionados', processoId],
    queryFn: async () => {
      // Buscar pai e filhos diretos
      const [filhos, processoAtual] = await Promise.all([
        base44.entities.Processo.filter({ processo_pai_id: processoId }),
        base44.entities.Processo.filter({ id: processoId })
      ]);

      let pai = null;
      let irmaos = [];

      // Se tem pai, buscar irmãos (outros filhos do mesmo pai)
      if (processoAtual[0]?.processo_pai_id) {
        const [paiData, irmaosData] = await Promise.all([
          base44.entities.Processo.filter({ id: processoAtual[0].processo_pai_id }),
          base44.entities.Processo.filter({ processo_pai_id: processoAtual[0].processo_pai_id })
        ]);
        pai = paiData[0];
        // Filtrar para não incluir o processo atual nos irmãos
        irmaos = irmaosData.filter(p => p.id !== processoId);
      }

      return { filhos, pai, irmaos };
    },
    enabled: !!processoId
  });

  const temRelacionados = relacionados.pai || relacionados.filhos?.length > 0 || relacionados.irmaos?.length > 0;
  
  if (!temRelacionados) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          <TooltipJuridico termo="Apenso">Processos Relacionados</TooltipJuridico>
          <span className="text-xs text-[var(--text-tertiary)]">
            ({(relacionados.filhos?.length || 0) + (relacionados.irmaos?.length || 0) + (relacionados.pai ? 1 : 0)})
          </span>
        </CardTitle>
        <Button size="sm" variant="ghost" onClick={onApensar}>
          <Plus className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {relacionados.pai && (
          <ApensoTreeNode 
            processo={relacionados.pai} 
            tipo="pai" 
            processoAtualId={processoId}
          />
        )}
        
        {relacionados.irmaos?.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-[var(--text-tertiary)] font-medium ml-1">Processos Irmãos:</p>
            {relacionados.irmaos.map(p => (
              <ApensoTreeNode 
                key={p.id} 
                processo={p} 
                tipo="irmao" 
                processoAtualId={processoId}
              />
            ))}
          </div>
        )}

        {relacionados.filhos?.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-[var(--text-tertiary)] font-medium ml-1">Processos Apensados:</p>
            {relacionados.filhos.map(p => (
              <ApensoTreeNode 
                key={p.id} 
                processo={p} 
                tipo="filho" 
                processoAtualId={processoId}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}