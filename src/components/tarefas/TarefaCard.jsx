import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TaskCompletionSync from '@/components/calendar/TaskCompletionSync';
import TarefaPriority from './TarefaPriority';

export default function TarefaCard({ tarefa, onUpdate }) {
  const [showSync, setShowSync] = useState(false);
  return (
    <Card className="bg-[var(--bg-elevated)] border-[var(--border-primary)]">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">
              {tarefa.titulo}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-2">
              {tarefa.descricao}
            </p>
            <TarefaPriority priority={tarefa.prioridade} />
          </div>
        </div>
        
        {tarefa.status === 'pendente' && (
          <div className="mt-4 pt-4 border-t border-[var(--border-primary)]">
            {showSync ? (
              <TaskCompletionSync 
                task={tarefa} 
                onComplete={() => {
                  setShowSync(false);
                  onUpdate?.();
                }} 
              />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSync(true)}
                className="w-full"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Marcar Concluída e Sincronizar
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}