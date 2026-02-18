import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function useThreadActions() {
  const queryClient = useQueryClient();

  const marcarLida = useMutation({
    mutationFn: async (thread) => {
      const entity = thread.tipo === 'ticket' ? 'Ticket' : 'Conversa';
      return base44.entities[entity].update(thread.id, {
        status: thread.tipo === 'ticket' ? 'em_atendimento' : 'respondida'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['unified-threads']);
      toast.success('Marcado como lido');
    },
    onError: (error) => {
      toast.error('Erro ao marcar como lido: ' + error.message);
    }
  });

  const escalar = useMutation({
    mutationFn: async (thread) => {
      if (thread.tipo === 'ticket') {
        toast.info('Este item já é um ticket');
        return;
      }
      
      const user = await base44.auth.me();
      if (!user.escritorio_id) {
        throw new Error('Usuário sem escritório associado');
      }

      const ticket = await base44.entities.Ticket.create({
        titulo: `Escalado: ${thread.clienteNome}`,
        descricao: thread.ultimaMensagem,
        cliente_email: thread.clienteEmail,
        cliente_nome: thread.clienteNome,
        origem_conversa_id: thread.id,
        status: 'aberto',
        prioridade: thread.prioridade || 'media',
        categoria: 'chat_escalado',
        escritorio_id: user.escritorio_id
      });

      await base44.entities.Conversa.update(thread.id, { 
        status: 'escalada', 
        ticket_id: ticket.id 
      });

      return ticket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['unified-threads']);
      toast.success('Escalado para ticket com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao escalar: ' + error.message);
    }
  });

  const arquivar = useMutation({
    mutationFn: async (thread) => {
      const entity = thread.tipo === 'ticket' ? 'Ticket' : 'Conversa';
      return base44.entities[entity].update(thread.id, {
        status: thread.tipo === 'ticket' ? 'fechado' : 'fechada'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['unified-threads']);
      toast.success('Arquivado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao arquivar: ' + error.message);
    }
  });

  const bulkMarcarLida = useMutation({
    mutationFn: async (threads) => {
      const updates = threads.map(thread => {
        const entity = thread.tipo === 'ticket' ? 'Ticket' : 'Conversa';
        return base44.entities[entity].update(thread.id, {
          status: thread.tipo === 'ticket' ? 'em_atendimento' : 'respondida'
        });
      });
      return Promise.all(updates);
    },
    onSuccess: (_, threads) => {
      queryClient.invalidateQueries(['unified-threads']);
      toast.success(`${threads.length} itens marcados como lidos`);
    },
    onError: (error) => {
      toast.error('Erro ao marcar como lidos: ' + error.message);
    }
  });

  const bulkEscalar = useMutation({
    mutationFn: async (threads) => {
      const user = await base44.auth.me();
      if (!user.escritorio_id) {
        throw new Error('Usuário sem escritório associado');
      }

      const conversas = threads.filter(t => t.tipo !== 'ticket');
      
      const tickets = await Promise.all(conversas.map(thread => 
        base44.entities.Ticket.create({
          titulo: `Escalado: ${thread.clienteNome}`,
          descricao: thread.ultimaMensagem,
          cliente_email: thread.clienteEmail,
          cliente_nome: thread.clienteNome,
          origem_conversa_id: thread.id,
          status: 'aberto',
          prioridade: thread.prioridade || 'media',
          categoria: 'chat_escalado',
          escritorio_id: user.escritorio_id
        })
      ));

      await Promise.all(conversas.map((thread, idx) =>
        base44.entities.Conversa.update(thread.id, {
          status: 'escalada',
          ticket_id: tickets[idx].id
        })
      ));

      return tickets;
    },
    onSuccess: (_, threads) => {
      queryClient.invalidateQueries(['unified-threads']);
      toast.success(`${threads.filter(t => t.tipo !== 'ticket').length} itens escalados`);
    },
    onError: (error) => {
      toast.error('Erro ao escalar: ' + error.message);
    }
  });

  const bulkArquivar = useMutation({
    mutationFn: async (threads) => {
      const updates = threads.map(thread => {
        const entity = thread.tipo === 'ticket' ? 'Ticket' : 'Conversa';
        return base44.entities[entity].update(thread.id, {
          status: thread.tipo === 'ticket' ? 'fechado' : 'fechada'
        });
      });
      return Promise.all(updates);
    },
    onSuccess: (_, threads) => {
      queryClient.invalidateQueries(['unified-threads']);
      toast.success(`${threads.length} itens arquivados`);
    },
    onError: (error) => {
      toast.error('Erro ao arquivar: ' + error.message);
    }
  });

  return { marcarLida, escalar, arquivar, bulkMarcarLida, bulkEscalar, bulkArquivar };
}