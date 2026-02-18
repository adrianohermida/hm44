import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AtendimentoItem from './AtendimentoItem';
import AtendimentoChatLink from './AtendimentoChatLink';

export default function ProcessoAtendimentosList({ processoId, clienteId, onAdd, onEdit, onDelete }) {
  const { data: atendimentos = [] } = useQuery({
    queryKey: ['atendimentos', processoId],
    queryFn: () => base44.entities.Atendimento.filter({ processo_id: processoId }),
    enabled: !!processoId
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />Atendimentos ({atendimentos.length})
          </CardTitle>
          <Button size="sm" variant="outline" onClick={onAdd}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <AtendimentoChatLink clienteId={clienteId} processoId={processoId} />
        {atendimentos.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)] mt-2">Nenhum atendimento registrado</p>
        ) : (
          atendimentos.slice(0, 3).map(atend => (
            <AtendimentoItem 
              key={atend.id} 
              atendimento={atend} 
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}