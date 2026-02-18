import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function TicketFilters({ 
  statusFilter, 
  onStatusChange, 
  prioridadeFilter, 
  onPrioridadeChange,
  responsavelFilter,
  onResponsavelChange,
  spamFilter,
  onSpamChange
}) {
  return (
    <div className="space-y-2">
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os Status</SelectItem>
          <SelectItem value="aberto">Aberto</SelectItem>
          <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
          <SelectItem value="aguardando_cliente">Aguardando Cliente</SelectItem>
          <SelectItem value="resolvido">Resolvido</SelectItem>
          <SelectItem value="fechado">Fechado</SelectItem>
        </SelectContent>
      </Select>

      <Select value={prioridadeFilter} onValueChange={onPrioridadeChange}>
        <SelectTrigger className="text-sm">
          <SelectValue placeholder="Prioridade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todas Prioridades</SelectItem>
          <SelectItem value="urgente">🔴 Urgente</SelectItem>
          <SelectItem value="alta">🟠 Alta</SelectItem>
          <SelectItem value="media">🟡 Média</SelectItem>
          <SelectItem value="baixa">🟢 Baixa</SelectItem>
        </SelectContent>
      </Select>

      <Select value={responsavelFilter} onValueChange={onResponsavelChange}>
        <SelectTrigger className="text-sm">
          <SelectValue placeholder="Responsável" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="meus">Meus Tickets</SelectItem>
          <SelectItem value="ia">🤖 IA</SelectItem>
          <SelectItem value="sem_atribuir">Não Atribuídos</SelectItem>
        </SelectContent>
      </Select>

      <Select value={spamFilter} onValueChange={onSpamChange}>
        <SelectTrigger className="text-sm">
          <SelectValue placeholder="Spam" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Inbox + Spam</SelectItem>
          <SelectItem value="inbox">📥 Inbox</SelectItem>
          <SelectItem value="spam">🗑️ Spam</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}