import React from 'react';
import TarefaCard from './TarefaCard';

export default function TarefasList({ tarefas, onUpdate }) {
  if (!tarefas.length) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-secondary)]">Nenhuma tarefa pendente</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tarefas.map(tarefa => (
        <TarefaCard key={tarefa.id} tarefa={tarefa} onUpdate={onUpdate} />
      ))}
    </div>
  );
}