import React from 'react';
import ProcessoMainContent from './ProcessoMainContent';
import ProcessoSidebarResponsive from './ProcessoSidebarResponsive';

export default function ProcessoLayout({ 
  activeTab, 
  onTabChange, 
  processo, 
  clientes = [],
  partes, 
  resumoIA, 
  isLoading, 
  modo, 
  isMobile,
  handlers = {},
  modals = {},
  actions = {}
}) {
  const sidebarProps = {
    processo,
    cliente: clientes[0] || null,
    partes,
    clientes,
    resumoIA,
    modo,
    onUploadDocumento: modals?.uploadModal?.show,
    onViewDocumento: handlers?.onViewDocumento,
    onOpenTicket: () => handlers?.onOpenTicket?.(processo, clientes[0]),
    onApensar: modals?.apensarModal?.show
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2">
          <ProcessoMainContent
            processo={processo}
            clientes={clientes}
            partes={partes}
            isLoading={isLoading}
            modo={modo}
            onAddParte={() => modals?.parteModal?.show?.()}
            onEditParte={(parte) => modals?.parteModal?.show?.(parte)}
            onDeleteParte={(id) => actions?.deleteParte?.mutate?.(id)}
            onChangePolo={handlers?.handleChangePolo}
            onAddPublicacao={handlers?.onAddPublicacao}
            modals={modals}
          />
        </div>

        <div className="lg:col-span-1 lg:self-start">
          <ProcessoSidebarResponsive isMobile={isMobile} {...sidebarProps} />
        </div>
      </div>
    </div>
  );
}