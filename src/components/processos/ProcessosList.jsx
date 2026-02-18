import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import ProcessoCard from './ProcessoCard';

export default function ProcessosList({ processos = [], onSelect }) {
  const queryClient = useQueryClient();
  
  return (
    <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {processos.map((processo) => (
        <ProcessoCard
          key={processo.id}
          processo={processo}
          onClick={() => onSelect(processo.id)}
          onUpdate={() => queryClient.invalidateQueries(['processos'])}
        />
      ))}
    </div>
  );
}