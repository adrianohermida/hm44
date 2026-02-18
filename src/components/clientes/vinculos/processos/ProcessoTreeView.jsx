import React from 'react';
import ProcessoTreeBranch from './ProcessoTreeBranch';

export default function ProcessoTreeView({ processosPrincipais, todosProcessos, clienteId }) {
  const getApensos = (processoId) => {
    return todosProcessos.filter(p => p.processo_pai_id === processoId);
  };

  return (
    <div className="space-y-4">
      {processosPrincipais.map((proc) => (
        <ProcessoTreeBranch
          key={proc.id}
          processo={proc}
          apensos={getApensos(proc.id)}
          clienteId={clienteId}
        />
      ))}
    </div>
  );
}