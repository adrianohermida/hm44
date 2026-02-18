import React from 'react';
import ProcessoClienteItem from './ProcessoClienteItem';

export default function ProcessoClientesList({ 
  clientes, 
  processoId, 
  onRemove, 
  actions 
}) {
  return (
    <div className="space-y-3">
      {clientes.map((cliente) => (
        <ProcessoClienteItem
          key={cliente.id}
          cliente={cliente}
          processoId={processoId}
          onRemove={onRemove}
          onLigar={actions.handleLigar}
          onEmail={actions.handleEmail}
          onMensagem={actions.handleMensagem}
          onAgendar={actions.handleAgendar}
        />
      ))}
    </div>
  );
}