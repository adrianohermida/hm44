import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function PropriedadesSidebar({ ticket }) {
  const queryClient = useQueryClient();

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list()
  });

  const { data: departamentos = [] } = useQuery({
    queryKey: ['departamentos-sidebar', escritorio?.[0]?.id],
    queryFn: () => base44.entities.Departamento.filter({ 
      escritorio_id: escritorio[0].id,
      ativo: true 
    }),
    enabled: !!escritorio?.[0]?.id
  });

  const { data: agentes = [] } = useQuery({
    queryKey: ['agentes-sidebar'],
    queryFn: () => base44.entities.User.filter({ role: 'admin' })
  });

  const updateMutation = useMutation({
    mutationFn: ({ campo, valor }) => 
      base44.entities.Ticket.update(ticket.id, { 
        [campo]: valor,
        ultima_atualizacao: new Date().toISOString()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['helpdesk-tickets']);
      toast.success('Atualizado');
    }
  });

  if (!ticket) return null;

  return (
    <div className="p-4 space-y-3">
      <div className="space-y-2">
        <Label className="text-xs text-gray-500">Status</Label>
        <Select
          value={ticket.status}
          onValueChange={(valor) => updateMutation.mutate({ campo: 'status', valor })}
          disabled={updateMutation.isPending}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="triagem">Triagem</SelectItem>
            <SelectItem value="aberto">Aberto</SelectItem>
            <SelectItem value="em_atendimento">Em atendimento</SelectItem>
            <SelectItem value="aguardando_cliente">Aguardando cliente</SelectItem>
            <SelectItem value="resolvido">Resolvido</SelectItem>
            <SelectItem value="fechado">Fechado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-gray-500">Tipo</Label>
        <Select
          value={ticket.categoria}
          onValueChange={(valor) => updateMutation.mutate({ campo: 'categoria', valor })}
          disabled={updateMutation.isPending}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="duvida">Dúvida</SelectItem>
            <SelectItem value="problema">Problema</SelectItem>
            <SelectItem value="solicitacao">Solicitação</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-gray-500">Grupo</Label>
        <Select
          value={ticket.departamento_id || 'nenhum'}
          onValueChange={(valor) => updateMutation.mutate({ 
            campo: 'departamento_id', 
            valor: valor === 'nenhum' ? null : valor 
          })}
          disabled={updateMutation.isPending}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Não atribuído" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nenhum">Não atribuído</SelectItem>
            {departamentos.map(dept => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-gray-500">Agente</Label>
        <Select
          value={ticket.responsavel_email || 'nenhum'}
          onValueChange={(valor) => updateMutation.mutate({ 
            campo: 'responsavel_email', 
            valor: valor === 'nenhum' ? null : valor 
          })}
          disabled={updateMutation.isPending}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Não atribuído" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nenhum">Não atribuído</SelectItem>
            {agentes.map(agent => (
              <SelectItem key={agent.email} value={agent.email}>
                {agent.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-gray-500">Prioridade</Label>
        <Select
          value={ticket.prioridade}
          onValueChange={(valor) => updateMutation.mutate({ campo: 'prioridade', valor })}
          disabled={updateMutation.isPending}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="baixa">Baixa</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="urgente">Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {updateMutation.isPending && (
        <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
          <Loader2 className="w-3 h-3 animate-spin" />
          Atualizando...
        </div>
      )}
    </div>
  );
}