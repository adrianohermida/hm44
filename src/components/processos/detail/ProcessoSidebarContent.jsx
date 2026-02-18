import React from 'react';
import ProcessoQuickStats from './ProcessoQuickStats';
import ProcessoClientesCard from './ProcessoClientesCard';
import ProcessoAdvogadosCard from './ProcessoAdvogadosCard';
import ProcessoPrazosCard from './ProcessoPrazosCard';
import ProcessoAudienciasCard from './ProcessoAudienciasCard';
import ProcessoHonorariosCard from './ProcessoHonorariosCard';
import ProcessoDocumentosTab from './ProcessoDocumentosTab';
import ProcessoTarefasCard from './ProcessoTarefasCard';
import ProcessoResumoIACard from './ProcessoResumoIACard';
import ProcessoClienteEnriquecidoCard from './ProcessoClienteEnriquecidoCard';
import ProcessoApensoTree from './ProcessoApensoTree';

export default function ProcessoSidebarContent({ 
  processo,
  cliente,
  partes = [],
  clientes = [],
  resumoIA,
  modo,
  onUploadDocumento,
  onViewDocumento,
  onOpenTicket,
  onOpenChat,
  onApensar
}) {
  if (!processo) return null;
  
  return (
    <div className="space-y-3 lg:space-y-4" role="complementary" aria-label="Informações auxiliares do processo">
      <div className="space-y-3">
        <ProcessoQuickStats 
          processoId={processo.id} 
          fase={processo.fase_processual}
          modoCliente={modo === 'cliente'} 
        />
        <ProcessoClientesCard processo={processo} partes={partes} clientes={clientes} />
        <ProcessoClienteEnriquecidoCard processoId={processo.id} />
        <ProcessoAdvogadosCard partes={partes} />
        <ProcessoPrazosCard processoId={processo.id} modo={modo} />
        <ProcessoAudienciasCard processoId={processo.id} modo={modo} />
        <ProcessoTarefasCard processoId={processo.id} modo={modo} />
        <ProcessoHonorariosCard processoId={processo.id} clienteId={processo.cliente_id} modo={modo} />
        <ProcessoDocumentosTab processoId={processo.id} processo={processo} />
        {resumoIA && <ProcessoResumoIACard resumo={resumoIA} />}
      </div>
    </div>
  );
}