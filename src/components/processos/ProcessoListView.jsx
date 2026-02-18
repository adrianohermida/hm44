import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import ProcessoListItem from './ProcessoListItem';

export default function ProcessoListView({ processos, selectedIds, onToggle, onClick }) {
  const queryClient = useQueryClient();
  
  return (
    <div className="space-y-2 md:space-y-3">
      {processos.map((processo) => (
        <ProcessoListItem
          key={processo.id}
          processo={processo}
          selected={selectedIds.includes(processo.id)}
          onToggle={onToggle}
          onClick={onClick}
          onUpdate={() => queryClient.invalidateQueries(['processos'])}
        />
      ))}
    </div>
  );
}