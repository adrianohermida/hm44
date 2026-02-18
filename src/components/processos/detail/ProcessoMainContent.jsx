import React from 'react';
import ProcessoInfoGrid from './ProcessoInfoGrid';
import ProcessoPartesCard from './ProcessoPartesCard';
import ProcessoMovimentacoesTimeline from './ProcessoMovimentacoesTimeline';
import ProcessoPublicacoesList from './ProcessoPublicacoesList';
import ProcessoHistoricoConsolidado from './ProcessoHistoricoConsolidado';
import ProcessoApensoTree from './ProcessoApensoTree';
import ProcessoSkeleton from './ProcessoSkeleton';

export default function ProcessoMainContent({ 
  processo,
  clientes = [],
  partes = [],
  isLoading,
  modo,
  onAddParte,
  onEditParte,
  onDeleteParte,
  onChangePolo,
  onAddPublicacao,
  modals = {}
}) {
  if (!processo) return null;
  const processoId = processo.id;

  return (
    <>
      {isLoading ? <ProcessoSkeleton /> : (
        <div className="space-y-4 lg:space-y-6">
          <ProcessoInfoGrid processo={processo} />
          <ProcessoPartesCard processo={processo} />
          <ProcessoPublicacoesList processoId={processoId} onAdd={onAddPublicacao} />
          <ProcessoApensoTree processoId={processo.id} onApensar={modals?.apensarModal?.show} />
          <ProcessoHistoricoConsolidado processoId={processoId} processo={processo} />
          <ProcessoMovimentacoesTimeline movimentacoes={processo.movimentacoes || []} />
        </div>
      )}
    </>
  );
}