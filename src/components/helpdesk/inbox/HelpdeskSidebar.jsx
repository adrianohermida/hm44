import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SidebarSearch from '../sidebar/SidebarSearch';
import SidebarFilters from '../sidebar/SidebarFilters';
import SidebarDepartamentos from '../sidebar/SidebarDepartamentos';
import FiltrosSalvos from '../sidebar/FiltrosSalvos';
import { useSidebarFilters } from '../sidebar/useSidebarFilters';

export default function HelpdeskSidebar({ filtros, onFiltrosChange, escritorioId, isCollapsed = false }) {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: departamentos = [] } = useQuery({
    queryKey: ['departamentos', escritorioId],
    queryFn: () => base44.entities.Departamento.filter({ 
      escritorio_id: escritorioId,
      ativo: true 
    }),
    enabled: !!escritorioId
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ['helpdesk-tickets', escritorioId],
    queryFn: () => base44.entities.Ticket.filter({ escritorio_id: escritorioId }),
    enabled: !!escritorioId,
    refetchInterval: 5000
  });

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const filtrosViewAll = useSidebarFilters(tickets, user, onFiltrosChange);
  
  const filtrosView = searchTerm 
    ? filtrosViewAll.filter(f => f.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : filtrosViewAll;

  const isFilterActive = (filtroId) => {
    if (filtroId === 'meus_abertos') {
      return filtros.responsavel === 'meus' && filtros.status === 'aberto,em_atendimento';
    }
    if (filtroId === 'criados') {
      return filtros.created_by === user?.email;
    }
    if (filtroId === 'todos') {
      return filtros.status === 'todos' && !filtros.created_by && !filtros.is_spam && !filtros.arquivado;
    }
    if (filtroId === 'nao_resolvidos') {
      return filtros.status === 'aberto,em_atendimento,aguardando_cliente';
    }
    if (filtroId === 'fechados') {
      return filtros.status === 'fechado';
    }
    if (filtroId === 'arquivados') {
      return filtros.arquivado === true;
    }
    if (filtroId === 'spam') {
      return filtros.is_spam === true;
    }
    return false;
  };

  return (
    <div className="h-full overflow-y-auto bg-[var(--bg-elevated)] border-r border-[var(--border-primary)]">
      <SidebarSearch value={searchTerm} onChange={setSearchTerm} />

      <SidebarFilters 
        filtros={filtrosView}
        isActive={isFilterActive}
        onFilterClick={onFiltrosChange}
      />

      <SidebarDepartamentos
        departamentos={departamentos}
        tickets={tickets}
        filtros={filtros}
        onDepartamentoClick={(deptId) => onFiltrosChange({ ...filtros, departamento: deptId, status: 'todos' })}
      />

      <div className="p-2">
        <FiltrosSalvos 
          filtrosAtuais={filtros}
          onAplicarFiltro={(novosFiltros) => onFiltrosChange(novosFiltros)}
        />
      </div>
    </div>
  );
}