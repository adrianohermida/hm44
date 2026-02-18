import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import TarefasList from '@/components/tarefas/TarefasList';
import TarefasHeader from '@/components/tarefas/TarefasHeader';

export default function Tarefas() {
  const { data: tarefas = [], refetch } = useQuery({
    queryKey: ['tarefas'],
    queryFn: () => base44.entities.Tarefa.filter({ status: 'pendente' }, '-data_vencimento', 50)
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <TarefasHeader />
        <TarefasList tarefas={tarefas} onUpdate={refetch} />
      </div>
    </div>
  );
}