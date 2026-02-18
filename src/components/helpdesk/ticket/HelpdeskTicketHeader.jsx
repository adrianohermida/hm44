import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, User, Clock, ChevronDown, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import HelpdeskTicketActions from './HelpdeskTicketActions';
import MobileHelpdeskBottomSheet from '../MobileHelpdeskBottomSheet';
import TicketStatusDropdown from './TicketStatusDropdown';
import TicketHeaderInfo from './TicketHeaderInfo';
import TicketHeaderBadges from './TicketHeaderBadges';

export default function HelpdeskTicketHeader({ ticket, onClose }) {
  const queryClient = useQueryClient();
  
  const { data: cliente } = useQuery({
    queryKey: ['cliente-header', ticket?.cliente_id],
    queryFn: async () => {
      if (ticket?.cliente_vinculado_id) {
        const [c] = await base44.entities.Cliente.filter({ id: ticket.cliente_vinculado_id });
        return c;
      }
      if (ticket?.cliente_id) {
        const [c] = await base44.entities.Cliente.filter({ id: ticket.cliente_id });
        return c;
      }
      return null;
    },
    enabled: !!(ticket?.cliente_id || ticket?.cliente_vinculado_id)
  });

  const resolverMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.Ticket.update(ticket.id, {
        status: 'resolvido',
        tempo_resolucao: new Date().toISOString(),
        ultima_atualizacao: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['helpdesk-tickets']);
      toast.success('Ticket resolvido');
    },
    onError: (error) => toast.error('Erro ao resolver ticket: ' + error.message)
  });

  const nomeCliente = cliente?.nome_completo || cliente?.razao_social || ticket.cliente_nome;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="border-b border-[var(--border-primary)] p-4 bg-gradient-to-b from-[var(--bg-elevated)] to-transparent"
    >
      <div className="flex items-start justify-between mb-3">
        <TicketHeaderInfo ticket={ticket} clienteNome={nomeCliente} />
        <div className="flex items-center gap-2">
          <TicketStatusDropdown 
            ticket={ticket}
            onResolve={() => resolverMutation.mutate()}
            isPending={resolverMutation.isPending}
          />
          <MobileHelpdeskBottomSheet ticket={ticket} />
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="md:hidden">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <TicketHeaderBadges ticket={ticket} />

      <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
        <Clock className="w-3 h-3" />
        Atualizado {formatDistanceToNow(new Date(ticket.updated_date || ticket.created_date), { 
          addSuffix: true, 
          locale: ptBR 
        })}
      </div>

      <HelpdeskTicketActions ticket={ticket} />
    </motion.div>
  );
}