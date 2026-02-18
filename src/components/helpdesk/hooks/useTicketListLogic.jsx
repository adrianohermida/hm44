import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { helpdeskCacheConfig } from '../performance/HelpdeskCacheConfig';

const ITEMS_PER_PAGE = 50;

export function useTicketListLogic(filtros, escritorioId) {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [layoutMode, setLayoutMode] = useState('card');

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['helpdesk-tickets', escritorioId, JSON.stringify(filtros)],
    ...helpdeskCacheConfig.tickets,
    queryFn: async () => {
      if (!escritorioId) return [];
      let query = { escritorio_id: escritorioId };

      if (filtros.status && filtros.status !== 'todos') {
        const statusArray = filtros.status.split(',').map(s => s.trim());
        if (statusArray.length === 1) {
          query.status = statusArray[0];
        } else if (statusArray.length > 1) {
          query.status = { $in: statusArray };
        }
      }

      if (filtros.prioridade && filtros.prioridade !== 'todos') {
        query.prioridade = filtros.prioridade;
      }

      if (filtros.departamento && filtros.departamento !== 'todos') {
        query.departamento_id = filtros.departamento;
      }

      if (filtros.responsavel === 'meus') {
        const user = await base44.auth.me();
        query.responsavel_email = user.email;
      } else if (filtros.responsavel && filtros.responsavel !== 'todos') {
        query.responsavel_email = filtros.responsavel;
      }

      if (filtros.created_by) {
        query.created_by = filtros.created_by;
      }

      if (filtros.is_spam !== undefined) {
        query.is_spam = filtros.is_spam;
      }

      if (filtros.arquivado !== undefined) {
        query.arquivado = filtros.arquivado;
      }

      return base44.entities.Ticket.filter(query, '-ultima_atualizacao', 200);
    },
    enabled: !!escritorioId
  });

  const totalPages = Math.ceil(tickets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTickets = tickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return {
    tickets,
    paginatedTickets,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    layoutMode,
    setLayoutMode
  };
}