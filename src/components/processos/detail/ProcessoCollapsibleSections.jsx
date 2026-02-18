import React from 'react';
import ProcessoSidebarSection from './ProcessoSidebarSection';
import ProcessoResumoIACard from './ProcessoResumoIACard';
import ProcessoApensoTree from './ProcessoApensoTree';
import ProcessoTarefasList from './ProcessoTarefasList';
import ProcessoAtendimentosList from './ProcessoAtendimentosList';
import { getTexto } from './ProcessoTextoAdaptado';

export default function ProcessoCollapsibleSections({ 
  processoId, 
  clienteId,
  resumoIA, 
  modo, 
  isMobile,
  onApensar,
  onAddTarefa,
  onAddAtendimento,
  onEditAtendimento,
  onDeleteAtendimento
}) {
  return (
    <>
      {resumoIA && (
        <ProcessoSidebarSection title="Resumo IA" collapsible defaultOpen={!isMobile}>
          <ProcessoResumoIACard resumo={resumoIA} processoId={processoId} />
        </ProcessoSidebarSection>
      )}

      <ProcessoSidebarSection title={getTexto(modo, 'monitoring')} collapsible defaultOpen={!isMobile}>
        <ProcessoApensoTree processoId={processoId} onApensar={onApensar} />
      </ProcessoSidebarSection>

      <ProcessoSidebarSection title={getTexto(modo, 'actions')} collapsible defaultOpen={!isMobile}>
        <ProcessoTarefasList processoId={processoId} onAdd={onAddTarefa} />
        <ProcessoAtendimentosList 
          processoId={processoId} 
          clienteId={clienteId}
          onAdd={onAddAtendimento}
          onEdit={onEditAtendimento}
          onDelete={onDeleteAtendimento}
        />
      </ProcessoSidebarSection>
    </>
  );
}